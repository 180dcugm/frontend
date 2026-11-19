import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk"
import { createClient } from "@/integrations/supabase/server";
import { CONSULTING_PREVIEW_REPLIES } from "@/config/Eighty";

// Instantiated lazily: a missing key should surface as a handled error inside
// POST, not crash the whole route at import time.
let aiClient: GoogleGenAI | null = null;
let groqClient: Groq | null = null;

function getAI(): GoogleGenAI {
    if (!aiClient) aiClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    return aiClient;
}

function getGroq(): Groq {
    if (!groqClient) groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    return groqClient;
}

// Fallback model list — if one model hits a rate limit or has been retired,
// try the next. Verified against Groq's /models endpoint; the previous list
// still named qwen/qwen3-32b and moonshotai/kimi-k2-instruct, both of which
// have since been removed.
const MODELS = [
    "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "openai/gpt-oss-20b",
    "llama-3.1-8b-instant",
];

// Small and fast — this only rewrites a search query, never user-facing text.
const TRANSLATION_MODEL = "llama-3.1-8b-instant";

const CONTACT_FALLBACK ="We apologize, but that information is not yet available in our database. Please contact us at ugm@180dc.org or via Instagram @180dcugm";

// Retrieval is tried at a strict threshold first, then a looser one, so that
// slightly-off phrasings still find an answer instead of hitting the fallback.
const MATCH_THRESHOLDS = [0.65, 0.5];

// A single marginal hit is usually the wrong document — the right one often
// sits just under the cutoff. Widen until we have a few to choose from; the
// prompt already tells the model to ignore whatever does not fit.
const MIN_CONTEXT_DOCS = 3;

// One question often spans several records — "how do I join" is answered by
// both the Functional Analyst and the Project Analyst entries, and the second
// one ranks 4 places below the first. Too few slots and the answer silently
// covers only one of the roles.
const MATCH_COUNT = 8;

function isRateLimitError(err: any): boolean {
    return (
        err?.status === 429 ||
        err?.statusCode === 429 ||
        err?.error?.code === 'rate_limit_exceeded' ||
        err?.message?.includes('rate_limit') ||
        err?.message?.includes('Rate limit')
    );
}

/**
 * Providers retire models without notice. Treating that as fatal meant one
 * dead entry in MODELS broke the entire fallback chain: the primary model hit
 * its rate limit, the next one 404'd, and the request failed instead of
 * falling through to a model that was still available.
 */
function isModelUnavailableError(err: any): boolean {
    return (
        err?.status === 404 ||
        err?.statusCode === 404 ||
        err?.error?.code === 'model_not_found' ||
        err?.message?.includes('model_not_found') ||
        err?.message?.includes('does not exist')
    );
}

async function createCompletionWithFallback(messages: any[], temperature: number) {
    let lastError: any = null;

    for (const model of MODELS) {
        try {
            console.log(`[Eighty] Trying model: ${model}`);
            const stream = await getGroq().chat.completions.create({
                messages,
                model,
                temperature,
                stream: true,
            });
            console.log(`[Eighty] Success with model: ${model}`);
            return stream;
        } catch (err: any) {
            lastError = err;
            if (isRateLimitError(err)) {
                console.warn(`[Eighty] Rate limit hit for ${model}, trying next model...`);
                continue;
            }
            if (isModelUnavailableError(err)) {
                console.warn(`[Eighty] Model ${model} is unavailable (retired?), trying next model...`);
                continue;
            }
            // Anything else (bad request, auth) would fail on every model too.
            throw err;
        }
    }

    // All models exhausted
    console.error("[Eighty] Every model failed — rate limited or unavailable.");
    throw lastError;
}

/**
 * Messages that are pure conversation — greetings, thanks, farewells, or
 * questions about Eighty itself. These never need the knowledge base, so we
 * skip embedding + retrieval entirely and answer with a chat-only prompt.
 *
 * The patterns are fully anchored on purpose: "hi, what services do you
 * offer?" is a real question and must still go through retrieval.
 */
const SMALL_TALK_PATTERNS: RegExp[] = [
    /^(hi+|hello+|helo+|hey+|halo+|hai+|yo|sup|hola|salam|assalamualaikum( warahmatullahi wabarakatuh)?)( there| eighty| bro| sis| kak| min| guys)?$/,
    /^(good|selamat) (morning|afternoon|evening|night|day|pagi|siang|sore|malam)( eighty)?$/,
    /^(how are you|how r u|how are you doing|how s it going|hows it going|how do you do|what s up|whats up|wassup|apa kabar|gimana kabar(nya)?)( today| eighty)?$/,
    /^(thank you|thanks|thank u|thx|ty|makasih|terima kasih|matur nuwun)( eighty| a lot| so much| very much| for the help| for your help)?$/,
    /^(bye|good bye|goodbye|see you( later)?|see ya|cya|dadah|sampai jumpa|later|gtg)( eighty)?$/,
    /^(ok|okay|oke|okey|sip|siap|nice|cool|great|good|awesome|perfect|mantap|alright|all right|got it|i see|noted|understood)$/,
    /^(who are you|what are you|what s your name|who is eighty|what is eighty|siapa kamu|kamu siapa|namamu siapa)$/,
    /^(what can you do|what do you do|how can you help( me)?|can you help( me)?|help|bisa bantu apa|bisa apa)$/,
    /^(lol|lmao|ha(ha)+|he(he)+|(wk)+|hmm+|nice one)$/,
];

function isSmallTalk(message: string): boolean {
    const normalized = message
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s']/gu, ' ')
        .replace(/'/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!normalized) return true;
    // Anything long enough to carry a real request goes through retrieval.
    if (normalized.split(' ').length > 8) return false;

    return SMALL_TALK_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * Short follow-ups ("what about the fee?", "tell me more") carry almost no
 * signal on their own, so we prepend the previous user message before
 * embedding to keep retrieval on topic.
 */
function buildRetrievalQuery(message: string, history: any[]): string {
    if (message.trim().split(/\s+/).length > 5) return message;

    const previousUserMessage = [...(history || [])]
        .reverse()
        .find((msg: any) => msg?.role === 'user' && typeof msg.content === 'string' && msg.content.trim());

    return previousUserMessage ? `${previousUserMessage.content}\n${message}` : message;
}

const QUERY_REWRITE_PROMPT = `You turn a website visitor's chat message into a search query for a knowledge base about 180 Degrees Consulting UGM (180DC UGM), a student consulting organization.

Rules:
- Always write the query in English, translating from Indonesian when needed.
- Replace casual or vague wording with the explicit terms the knowledge base would use. "I wanna join" becomes "join 180DC UGM as a member: recruitment requirements for analyst roles".
- Keep every name, role, event, and product the user mentioned.
- One line, at most 25 words.
- Output ONLY the query — no quotes, no explanation, no preamble.`;

/**
 * Retrieval quality is decided almost entirely by how the query is phrased.
 * Two failure modes made answers wrong rather than merely worse:
 *
 * - The knowledge base is written in English, so an Indonesian question scored
 *   ~0.12 lower against the very same document and fell below the threshold.
 * - Casual phrasing embeds poorly. "Hey i wanna register as a member" peaked at
 *   0.626 and surfaced no Project Analyst record at all, so the answer silently
 *   covered only one of the roles. Rewritten, the same question scores 0.810
 *   and returns every analyst role.
 *
 * Retrieval-only — the reply language is still set by buildLanguageRule.
 */
async function rewriteQueryForRetrieval(message: string): Promise<string> {
    try {
        const completion = await getGroq().chat.completions.create({
            model: TRANSLATION_MODEL,
            temperature: 0,
            max_tokens: 120,
            messages: [
                { role: 'system', content: QUERY_REWRITE_PROMPT },
                { role: 'user', content: message },
            ],
        });

        const rewritten = completion.choices[0]?.message?.content?.trim();
        if (!rewritten) return message;

        console.log(`[Eighty] Rewrote for retrieval: "${message}" -> "${rewritten}"`);
        // Keep the original too, so proper nouns survive a bad rewrite.
        return `${rewritten}\n${message}`;
    } catch (err) {
        console.warn("[Eighty] Query rewrite failed, using original message.", err);
        return message;
    }
}

async function retrieveContext(query: string): Promise<string[]> {
    const embeddingResult = await getAI().models.embedContent({
        model: 'gemini-embedding-001',
        contents: query,
        config: {
            taskType: "RETRIEVAL_QUERY",
            outputDimensionality: 3072
        }
    });

    const queryVector = embeddingResult.embeddings?.[0]?.values;
    if (!queryVector) {
        console.error("[Eighty] Embedding returned no vector.");
        return [];
    }

    const supabase = createClient();
    let best: string[] = [];

    for (const threshold of MATCH_THRESHOLDS) {
        const { error, data: documents } = await supabase.rpc(
            'match_knowledge',
            {
                query_embedding: queryVector,
                match_threshold: threshold,
                match_count: MATCH_COUNT,
            }
        );

        if (error) {
            console.error("Supabase RPC Error:", error);
            throw error;
        }

        // Each pass lowers the threshold, so its results are a superset.
        if (documents?.length) {
            // The knowledge base contains duplicated entries; without this they
            // occupy slots that a genuinely different record should get.
            best = Array.from(new Set(documents.map((doc: any) => String(doc.content))));
            if (best.length >= MIN_CONTEXT_DOCS) {
                console.log(`[Eighty] ${best.length} document(s) matched at threshold ${threshold}.`);
                return best;
            }
        }
    }

    if (best.length === 0) {
        console.log("[Eighty] No documents matched at any threshold.");
    } else {
        console.log(`[Eighty] Only ${best.length} document(s) matched, even at the loosest threshold.`);
    }
    return best;
}

const PERSONA = `You are Eighty, the friendly AI assistant of 180 Degrees Consulting UGM (180DC UGM) — a student-run consulting organization at Universitas Gadjah Mada that helps social enterprises and non-profits.`;

/**
 * Knowledge entries carry registration periods but no notion of "now", so the
 * model happily announces a window that closed months ago as currently open.
 * Jakarta time, since that is where every deadline is set.
 */
function todayInJakarta(): string {
    return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());
}

function buildDateRule(): string {
    return `TODAY'S DATE: ${todayInJakarta()} (Asia/Jakarta).

DATES (check before you answer):
- Compare every date and registration period you are given against today's date above.
- A period whose end date is BEFORE today is CLOSED. Say it has closed. Never describe it as open, ongoing, or "runs from".
- A period whose start date is AFTER today has not opened yet. Say when it opens.
- Only call something open when today falls inside its period.
- If the user asks what is open right now and nothing you were given is currently within its period, say plainly that there are no events open for registration at the moment, and suggest following @180dcugm on Instagram for announcements. Do NOT list closed events as if they were available.
- When you mention a past event for context, state the year so it is obviously historical.`;
}

const STYLE = `STYLE:
- Be warm, professional, and conversational. Keep replies short — 1 to 3 sentences unless a list is genuinely needed.
- Never mention "the database", "the context", "documents", or how you were built. Speak as a member of the team would.
- FORMATTING: Use Markdown. Bullet points for lists, **bold** for emphasis, and Markdown link format for URLs.`;

// Common Indonesian function words. Short chat messages are reliably
// classified by these, and no English question contains them.
const INDONESIAN_MARKERS = /\b(yang|dan|atau|dengan|untuk|dari|ke|di|pada|adalah|apa|apakah|bagaimana|gimana|kenapa|mengapa|kapan|siapa|berapa|dimana|mana|saya|aku|kamu|kita|kami|anda|bisa|boleh|tidak|nggak|gak|ada|cara|mau|ingin|butuh|harus|sudah|belum|juga|saja|aja|itu|ini|nya|akan|kalau|jika|tentang|lebih|banyak|daftar|mendaftar|pendaftaran|biaya|harga)\b/;

function detectLanguage(message: string): 'Indonesian' | 'English' {
    return INDONESIAN_MARKERS.test(message.toLowerCase()) ? 'Indonesian' : 'English';
}

/**
 * Stored knowledge is a mix of English and Indonesian, and the models answer
 * in the language of the retrieved text unless told otherwise. Telling them to
 * "match the user's language" is not enough — naming the target language
 * outright is what actually holds. Goes last in every prompt, since the
 * closing instruction is the one that sticks.
 */
function buildLanguageRule(language: 'Indonesian' | 'English'): string {
    const other = language === 'Indonesian' ? 'English' : 'Indonesian';
    return `LANGUAGE (most important rule):
- The user is writing in ${language}. Write your ENTIRE reply in ${language}.
- Any information you were given may be written in ${other}. Translate it into ${language}. Do NOT reply in ${other}.
- Never mix the two languages in one reply.`;
}

function buildSmallTalkPrompt(language: 'Indonesian' | 'English'): string {
    return `${PERSONA}

The user is making conversation — greeting you, thanking you, saying goodbye, or asking who you are. This needs no factual lookup.

INSTRUCTIONS:
1. Respond naturally and warmly to what they actually said, in 1 to 2 short sentences. Then stop.
2. Do NOT list the topics you can help with, and do NOT name "Client", "Registration", or "Store". The user can already see those options on screen, so repeating them in every message sounds robotic.
3. Do NOT end every reply with the same offer of help. If you have already offered help earlier in this conversation, simply answer and stop. A plain "How can I help?" is fine only when you have not said anything like it yet.
4. Do NOT apologize, do NOT say information is unavailable, and do NOT refer them to email or Instagram — this is just friendly conversation.
5. Never invent facts about 180DC UGM. If they follow up with a real question, you will look it up then.

${STYLE}

${buildLanguageRule(language)}`;
}

function buildKnowledgePrompt(context: string[], language: 'Indonesian' | 'English'): string {
    if (context.length === 0) {
        return `${PERSONA}

The user asked a factual question and no matching information was found in the 180DC UGM knowledge base.

INSTRUCTIONS:
1. Reply with exactly this sentence, and nothing else: "${CONTACT_FALLBACK}"
2. Do NOT attempt to answer the question, guess, or use outside knowledge.
3. Do NOT list the topics you can help with — the user can already see those options on screen.

${STYLE}

${buildLanguageRule(language)}`;
    }

    return `${PERSONA}

Answer the user's question using ONLY the verified information below.

VERIFIED INFORMATION:
${context.map((chunk, i) => `[${i + 1}] ${chunk}`).join('\n\n')}

INSTRUCTIONS:
1. Answer using ONLY the facts above. Do NOT make up facts, guess names, dates, prices, or application steps, and do NOT use outside knowledge.
2. Cover EVERY option above that answers the question, not just the first one. If several roles, positions, programs, or events apply, list all of them — for example, a question about joining as a member concerns every analyst role described above, not only one of them.
3. Never confuse these two separate things:
   - Becoming a CLIENT — an organization hiring 180DC UGM for a consulting project, via the application form at 180dcugm.com/apply.
   - Becoming a MEMBER — a UGM student joining the organization through the annual analyst recruitment (CV screening, interview, announcement).
   A student asking how to join is asking about MEMBERSHIP. Never send them to the client application form, and never describe client intake as the way to become a member.
4. If the question asks for a specific detail that is missing (e.g. the names of past clients) but the information above is related (e.g. that we have served 20+ clients), say plainly that you don't have that specific detail, then share what you do know.
5. If the information above does not address the question at all, say so briefly and point them to ugm@180dc.org or Instagram @180dcugm.
6. The information above may be written in a different language than the question. That does not matter — follow the LANGUAGE rule below.

${buildDateRule()}

${STYLE}

${buildLanguageRule(language)}`;
}

export async function POST(req: NextRequest) {
    try {
        const { message, history, topic } = await req.json();

        if (typeof message !== 'string' || !message.trim()) {
            return NextResponse.json({ text: "Please type a message first." }, { status: 400 });
        }

        // Consulting has its own UI, but the Knowledge Team material is not
        // available yet. Never answer these requests with organization FAQ
        // retrieval or imply that a guidebook/casebook has already been read.
        if (topic === "consulting") {
            return new NextResponse(CONSULTING_PREVIEW_REPLIES[detectLanguage(message)], {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "no-store",
                },
            });
        }

        const smallTalk = isSmallTalk(message);
        const language = detectLanguage(message);
        console.log(`[Eighty] Intent: ${smallTalk ? 'small talk' : 'knowledge'} (${language}) — "${message}"`);

        // Small talk never touches the translation, embedding, or Supabase calls.
        let context: string[] = [];
        if (!smallTalk) {
            const retrievalQuery = await rewriteQueryForRetrieval(buildRetrievalQuery(message, history));
            context = await retrieveContext(retrievalQuery);
        }

        const messages: any[] = [{
            role: "system",
            content: smallTalk ? buildSmallTalkPrompt(language) : buildKnowledgePrompt(context, language),
        }];

        // Recent turns, so follow-up questions keep their thread.
        if (Array.isArray(history)) {
            history.forEach((msg: any) => {
                if (msg?.content) {
                    messages.push({
                        role: msg.role === 'assistant' ? 'assistant' : 'user',
                        content: msg.content
                    });
                }
            });
        }

        messages.push({ role: 'user', content: message });

        // Low temperature for grounded answers, a little more room for chat.
        const chatCompletionStream = await createCompletionWithFallback(messages, smallTalk ? 0.7 : 0.3);

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    let insideThink = false;
                    let buffer = '';

                    for await (const chunk of chatCompletionStream) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (!content) continue;

                        buffer += content;

                        // Process buffer to filter out <think>...</think> blocks
                        while (buffer.length > 0) {
                            if (insideThink) {
                                const closeIdx = buffer.indexOf('</think>');
                                if (closeIdx !== -1) {
                                    buffer = buffer.slice(closeIdx + 8);
                                    insideThink = false;
                                } else {
                                    buffer = buffer.length > 7 ? buffer.slice(-7) : buffer;
                                    break;
                                }
                            } else {
                                const openIdx = buffer.indexOf('<think>');
                                if (openIdx !== -1) {
                                    const before = buffer.slice(0, openIdx);
                                    if (before) {
                                        controller.enqueue(new TextEncoder().encode(before));
                                    }
                                    buffer = buffer.slice(openIdx + 7);
                                    insideThink = true;
                                } else {
                                    if (buffer.length > 6) {
                                        const safe = buffer.slice(0, -6);
                                        controller.enqueue(new TextEncoder().encode(safe));
                                        buffer = buffer.slice(-6);
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    // Flush remaining buffer (only if not inside a think block)
                    if (!insideThink && buffer.length > 0) {
                        controller.enqueue(new TextEncoder().encode(buffer));
                    }

                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            }
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            },
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { text: "Sorry, it seems there is a problem. Please try again in a few seconds." },
            { status: 500 }
        );
    }
}
