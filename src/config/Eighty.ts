export type ChatMode = "general" | "consulting";
export type ChatMessage = { role: "user" | "assistant"; content: string };

export const EIGHTY_TOPICS = [
  {
    id: "client",
    label: "Client",
    description: "Our services & partnerships",
    questions: [
      "What consulting services does 180DC UGM offer?",
      "How can my organization become a client of 180DC UGM?",
      "Who are the previous clients of 180DC UGM?",
    ],
  },
  {
    id: "registration",
    label: "Registration",
    description: "Recruitment, bootcamp & competitions",
    questions: [
      "How can I join 180DC UGM as a member?",
      "What are the requirements and timeline for the recruitment?",
      "Which events of 180DC UGM are open for registration?",
    ],
  },
  {
    id: "store",
    label: "Store",
    description: "Merchandise & Framework Bank",
    questions: [
      "What is available in the 180DC UGM store?",
      "What is the Framework Bank?",
      "How do I order and pay for the merchandise?",
    ],
  },
] as const;

export const CONSULTING_QUESTIONS = [
  "How do I create a MECE issue tree?",
  "What are the steps to join a business case competition (BCC)?",
  "What are the different types of research?",
  "How do I conduct market research?",
  "How do I structure a case presentation?",
] as const;

// This is a UI preview until the Knowledge Team's consulting material is supplied.
// Keep these requests out of the general organization FAQ retrieval in the meantime.
export const CONSULTING_PREVIEW_REPLIES = {
  English:
    "I’m getting ready to help with consulting and BCC preparation using 180DC UGM’s Knowledge Team materials. Sourced answers aren’t available just yet. In the meantime, explore our [Casebook](/store?product=5) for case practice or [Framework Bank](/store?product=6) for consulting frameworks.",
  Indonesian:
    "Aku sedang dipersiapkan untuk membantu belajar consulting dan persiapan BCC dengan materi dari Knowledge Team 180DC UGM. Jawaban yang bersumber dari materi tersebut belum tersedia. Sambil menunggu, kamu bisa melihat [Casebook](/store?product=5) untuk latihan kasus atau [Framework Bank](/store?product=6) untuk kumpulan kerangka consulting.",
};
