"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatMode } from "@/config/Eighty";

const STORAGE_KEY = "eighty_chat_history";
const HISTORY_TTL = 30 * 60 * 1000;
type Threads = Record<ChatMode, ChatMessage[]>;

function readMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (message): message is ChatMessage =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        Boolean(message.content.trim())
    )
    .slice(-100);
}

export function useEightyChat(enabled: boolean) {
  const [mode, setMode] = useState<ChatMode>("general");
  const [threads, setThreads] = useState<Threads>({ general: [], consulting: [] });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const requestRef = useRef(0);
  const busyRef = useRef(false);

  useEffect(() => {
    if (!enabled || isReady) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        const age = Date.now() - data.timestamp;
        if (age >= 0 && age < HISTORY_TTL) {
          // Preserve the original general-chat storage format as well.
          setThreads({
            general: readMessages(data.messages),
            consulting: readMessages(data.consultingMessages),
          });
          setMode(data.mode === "consulting" ? "consulting" : "general");
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // Storage may be blocked or contain older/invalid data; chat still works in memory.
    }
    setIsReady(true);
  }, [enabled, isReady]);

  useEffect(() => {
    if (!enabled || !isReady || isLoading) return;
    try {
      if (threads.general.length === 0 && threads.consulting.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            messages: threads.general,
            consultingMessages: threads.consulting,
            mode,
            timestamp: Date.now(),
          })
        );
      }
    } catch {
      // Keep the session usable if the browser cannot persist history.
    }
  }, [threads, mode, isReady, isLoading, enabled]);

  useEffect(
    () => () => {
      requestRef.current++;
      abortRef.current?.abort();
    },
    []
  );

  const cancelPending = () => {
    requestRef.current++;
    abortRef.current?.abort();
    abortRef.current = null;
    busyRef.current = false;
    setIsLoading(false);
    setThreads((previous) => ({
      general: previous.general.filter((message) => message.content.trim()),
      consulting: previous.consulting.filter((message) => message.content.trim()),
    }));
  };

  const changeMode = (nextMode: ChatMode) => {
    if (busyRef.current) cancelPending();
    setInput("");
    setMode(nextMode);
  };

  const resetChat = () => {
    cancelPending();
    setThreads((previous) => ({ ...previous, [mode]: [] }));
    setInput("");
  };

  const sendMessage = async (text: string) => {
    const message = text.trim();
    if (!message || busyRef.current || !isReady) return;
    busyRef.current = true;
    const requestID = ++requestRef.current;
    const targetMode = mode;
    const history = threads[targetMode].filter((item) => item.content.trim()).slice(-6);
    const assistantIndex = threads[targetMode].length + 1;
    const controller = new AbortController();
    abortRef.current = controller;
    setInput("");
    setIsLoading(true);
    setThreads((previous) => ({
      ...previous,
      [targetMode]: [
        ...previous[targetMode],
        { role: "user", content: message },
        { role: "assistant", content: "" },
      ],
    }));

    const updateReply = (content: string) => {
      if (requestRef.current !== requestID) return;
      setThreads((previous) => ({
        ...previous,
        [targetMode]: previous[targetMode].map((item, index) =>
          index === assistantIndex ? { ...item, content } : item
        ),
      }));
    };

    try {
      const response = await fetch("/api/eighty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, topic: targetMode }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) throw new Error("Chat request failed");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          updateReply(reply);
        }
        reply += decoder.decode();
        if (!reply.trim()) throw new Error("The chat response was empty");
        updateReply(reply);
      } finally {
        reader.releaseLock();
      }
    } catch {
      if (!controller.signal.aborted) {
        updateReply("Sorry, I couldn’t connect just now. Please try again in a moment.");
      }
    } finally {
      if (requestRef.current === requestID) {
        busyRef.current = false;
        abortRef.current = null;
        setIsLoading(false);
      }
    }
  };

  return {
    mode,
    messages: threads[mode],
    input,
    setInput,
    isLoading,
    isReady,
    changeMode,
    resetChat,
    sendMessage,
  };
}
