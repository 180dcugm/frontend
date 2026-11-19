"use client";

import { CONSULTING_QUESTIONS } from "@/config/Eighty";

export function ConsultingWelcome({ onQuestion }: { onQuestion: (question: string) => void }) {
  return (
    <div className="space-y-6">
      <p className="font-lato-light px-6 text-center text-[16px] text-gray-300">
        Hi, I’m Eighty. This space is being prepared with 180DC UGM’s Knowledge Team guidebook and
        casebook materials, for consulting and BCC preparation.
      </p>
      <div>
        <h4 className="font-avenir-heavy mb-3 text-sm text-white">
          Where would you like to start?
        </h4>
        <div className="space-y-2.5">
          {CONSULTING_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onQuestion(question)}
              className="font-lato-regular bg-black-300 w-full rounded-[16px] border border-white/10 px-4 py-3 text-left text-[14px] leading-relaxed text-gray-200 transition-colors hover:border-green-300/60 hover:text-green-300 disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
