"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Briefcase,
  ClipboardList,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CONSULTING_QUESTIONS, EIGHTY_TOPICS } from "@/config/Eighty";
import { useEightyChat } from "@/hooks/useEightyChat";
import { ConsultingWelcome } from "./eighty/ConsultingPanel";

// Starter menu shown when the chat has no messages yet.
const topicIcons = { client: Briefcase, registration: ClipboardList, store: ShoppingBag };
const TOPICS = [
  ...EIGHTY_TOPICS.map((topic) => ({ ...topic, icon: topicIcons[topic.id] })),
  {
    id: "consulting",
    label: "Consulting",
    description: "Case-solving, research & BCC preparation",
    icon: BookOpen,
    questions: CONSULTING_QUESTIONS,
  },
];

export default function EightyChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showTopics, setShowTopics] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);

  // Check excluded routes (but do NOT return early before hooks)
  const excludedRoutes = ["/login", "/form", "/oprec"];
  const isExcluded = excludedRoutes.some((route) => pathname?.startsWith(route));
  const chat = useEightyChat(!isExcluded);
  const { mode, messages, input, setInput, isLoading, isReady } = chat;

  useEffect(() => {
    if (!isOpen) {
      if (restoreFocusRef.current) launcherRef.current?.focus();
      restoreFocusRef.current = false;
      return;
    }
    if (isExcluded) return;
    restoreFocusRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key !== "Tab") return;
      const elements = panelRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled])"
      );
      if (!elements?.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isExcluded]);

  useEffect(() => {
    if (!isOpen) return;
    if (showTopics || messages.length === 0) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: isLoading ? "auto" : "smooth",
    });
  }, [messages, isOpen, isLoading, showTopics, mode, activeTopic]);

  // Now safe to do conditional return AFTER all hooks
  if (isExcluded) return null;

  const resetChat = () => {
    chat.resetChat();
    setActiveTopic(null);
    setShowTopics(false);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || isLoading || !isReady) return;
    setActiveTopic(null);
    setShowTopics(false);
    void chat.sendMessage(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={launcherRef}
            type="button"
            aria-label="Ask Eighty"
            aria-haspopup="dialog"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="hover:bg-black-300 group fixed right-6 bottom-6 z-50 flex items-center justify-center rounded-full bg-black p-4 text-gray-100 shadow-lg transition-colors focus:outline-none"
          >
            <MessageCircle className="mr-0 h-6 w-6 text-green-300 transition-all duration-300 group-hover:mr-2" />
            <span className="font-lato-bold max-w-0 overflow-hidden text-sm whitespace-nowrap text-green-300 transition-all duration-300 group-hover:max-w-[100px]">
              Ask Eighty
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar Chat */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop and focus containment keep the assistant usable with a keyboard. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:bg-black/20 md:backdrop-blur-none"
            />

            <motion.aside
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="eighty-title"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-[70] flex h-dvh w-full flex-col overflow-hidden border-l border-white/20 bg-black text-gray-100 shadow-2xl md:w-[480px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/20 bg-black px-6 py-5">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2
                      id="eighty-title"
                      className="font-avenir-black text-[22px] leading-tight text-green-300"
                    >
                      Eighty
                    </h2>
                    <p className="font-lato-regular text-sm text-gray-400">
                      {mode === "consulting"
                        ? "Your 180DC UGM consulting peer"
                        : "Your 180DC UGM assistant"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={resetChat}
                      aria-label="Start a new chat"
                      title="Start a new chat"
                      className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label="Close Eighty"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {(mode === "consulting" || messages.length > 0 || activeTopic) && (
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      chat.changeMode("general");
                      setActiveTopic(null);
                      setShowTopics(true);
                    }}
                    className="font-lato-regular flex items-center gap-1 text-xs text-gray-400 hover:text-green-300"
                  >
                    <ChevronLeft aria-hidden="true" className="size-4" /> All topics
                  </button>
                  <span className="font-lato-regular text-xs text-green-300">
                    {mode === "consulting" ? "Consulting · Preview" : "180DC UGM"}
                  </span>
                </div>
              )}

              {/* Chat Messages */}
              <div
                ref={scrollRef}
                className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain bg-black p-5"
                data-lenis-prevent
              >
                {mode === "consulting" && messages.length === 0 && (
                  <ConsultingWelcome onQuestion={sendMessage} />
                )}
                {mode === "general" && (messages.length === 0 || showTopics) && (
                  <div className="mt-2 space-y-6 text-gray-400">
                    <div className="space-y-5 text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                        <MessageCircle className="h-10 w-10 text-green-300 opacity-80" />
                      </div>
                      <p className="font-lato-light px-6 text-[16px] text-gray-300">
                        Hi, I&apos;m <span className="font-lato-bold text-white">Eighty</span>.
                        <br />
                        Find your way around 180DC UGM, or explore your next consulting case with
                        me.
                      </p>
                    </div>

                    {/* Starter menu: topics, then example questions */}
                    {showTopics && messages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTopic(null);
                          setShowTopics(false);
                        }}
                        className="font-lato-regular flex w-full items-center justify-between gap-2 rounded-xl border border-green-300/25 px-4 py-3 text-sm text-green-300 hover:bg-green-300/5"
                      >
                        Continue your conversation{" "}
                        <ChevronRight aria-hidden="true" className="size-4" />
                      </button>
                    )}
                    <AnimatePresence mode="wait">
                      {activeTopic === null ? (
                        <motion.div
                          key="topics"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-2.5"
                        >
                          {TOPICS.map((topic) => {
                            const Icon = topic.icon;
                            return (
                              <button
                                type="button"
                                key={topic.id}
                                disabled={!isReady}
                                onClick={() => {
                                  if (topic.id === "consulting") {
                                    chat.changeMode("consulting");
                                    setActiveTopic(null);
                                    setShowTopics(false);
                                  } else {
                                    setActiveTopic(topic.id);
                                  }
                                }}
                                className="bg-black-300 group flex w-full items-center gap-4 rounded-[16px] border border-white/10 px-4 py-3.5 text-left transition-colors hover:border-green-300/60 hover:bg-white/5"
                              >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-300/20 bg-green-300/10">
                                  <Icon className="h-5 w-5 text-green-300" />
                                </span>
                                <span className="min-w-0">
                                  <span className="font-lato-bold block text-[15px] text-white transition-colors group-hover:text-green-300">
                                    {topic.label}
                                  </span>
                                  <span className="font-lato-light block truncate text-[12px] text-gray-400">
                                    {topic.description}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </motion.div>
                      ) : (
                        <motion.div
                          key={activeTopic}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="space-y-2.5"
                        >
                          {TOPICS.find((topic) => topic.id === activeTopic)?.questions.map(
                            (question) => (
                              <button
                                type="button"
                                key={question}
                                onClick={() => sendMessage(question)}
                                disabled={isLoading || !isReady}
                                className="font-lato-regular bg-black-300 w-full rounded-[16px] border border-white/10 px-4 py-3 text-left text-[14px] leading-relaxed text-gray-200 transition-colors hover:border-green-300/60 hover:text-green-300 disabled:opacity-50"
                              >
                                {question}
                              </button>
                            )
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {!showTopics && (
                  <div
                    role="log"
                    aria-label="Conversation"
                    aria-live="polite"
                    className="space-y-6"
                  >
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-[20px] px-5 py-3.5 shadow-md ${
                            msg.role === "user"
                              ? "font-lato-regular rounded-br-sm bg-green-300 text-black"
                              : "bg-black-300 prose prose-invert prose-sm prose-p:leading-relaxed prose-p:font-lato-regular prose-strong:font-lato-bold prose-em:font-lato-light-italic prose-a:text-green-300 max-w-none rounded-bl-sm border border-white/10 text-gray-100"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <p className="font-lato-semibold m-0 text-[15px] leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          ) : msg.content ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                a: ({ href, children }) =>
                                  href?.startsWith("/") ? (
                                    <Link href={href} onClick={() => setIsOpen(false)}>
                                      {children}
                                    </Link>
                                  ) : (
                                    <a href={href} target="_blank" rel="noopener noreferrer">
                                      {children}
                                    </a>
                                  ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            <span role="status">
                              <Loader2
                                aria-hidden="true"
                                className="mt-1 h-5 w-5 animate-spin text-green-300"
                              />
                              <span className="sr-only">Eighty is responding…</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="z-10 border-t border-white/20 bg-black p-5">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    aria-label="Message Eighty"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      mode === "consulting"
                        ? "Ask about consulting or case-solving…"
                        : "Ask about 180DC UGM…"
                    }
                    disabled={isLoading || !isReady}
                    className="font-lato-regular bg-black-300 w-full rounded-full border border-white/20 py-3.5 pr-14 pl-6 text-[15px] text-white transition-shadow placeholder:text-gray-500 focus:border-green-300 focus:ring-2 focus:ring-green-300/50 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!input.trim() || isLoading || !isReady}
                    className="absolute right-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-green-300 p-0 text-black transition-colors hover:bg-green-400 disabled:opacity-30 disabled:hover:bg-green-300"
                  >
                    <Send className="mt-0.5 h-5 w-5" />
                  </button>
                </form>
                <div className="font-lato-light mt-3 space-y-1 text-center text-[11px] leading-relaxed text-gray-500">
                  <p className="flex items-center justify-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 rounded-full bg-green-300 drop-shadow-[0_0_3px_rgba(119,186,71,0.8)]"
                    />
                    Made for the 180DC UGM community.
                  </p>
                  <p>
                    Learn more through our{" "}
                    <Link
                      href="/store"
                      onClick={() => setIsOpen(false)}
                      className="text-green-300 underline underline-offset-2 hover:text-green-200"
                    >
                      resources
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
