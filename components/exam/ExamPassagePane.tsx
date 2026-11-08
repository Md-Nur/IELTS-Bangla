import React from "react";
import { SectionDTO } from "@/lib/services/examAttemptService";

export interface ExamPassagePaneProps {
  section: SectionDTO;
  sectionIndex: number;
}

export function ExamPassagePane({ section, sectionIndex }: ExamPassagePaneProps) {
  // Split passage text into paragraphs
  const paragraphs = section.passageText.split(/\n\s*\n/).filter(Boolean);

  return (
    <article
      aria-label={`Reading Passage ${sectionIndex + 1}`}
      className="h-full overflow-y-auto px-6 py-6 md:px-8 md:py-8 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 select-text"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Reading Passage {sectionIndex + 1}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mt-1 leading-tight">
            {section.title}
          </h2>
        </header>

        {/* Paragraphs */}
        <div className="space-y-4 text-[15px] sm:text-base leading-relaxed sm:leading-7 text-slate-800 dark:text-slate-200 font-serif">
          {paragraphs.map((para, pIdx) => {
            // Check if paragraph starts with a letter like "A ", "B " etc.
            const letterMatch = para.match(/^([A-G])\s+([\s\S]+)$/);

            if (letterMatch) {
              const letter = letterMatch[1];
              const restText = letterMatch[2];
              return (
                <div key={pIdx} className="flex gap-3">
                  <span className="font-sans font-bold text-slate-950 dark:text-slate-100 shrink-0 text-base">
                    {letter}
                  </span>
                  <p className="flex-1">{restText}</p>
                </div>
              );
            }

            return <p key={pIdx}>{para}</p>;
          })}
        </div>
      </div>
    </article>
  );
}
