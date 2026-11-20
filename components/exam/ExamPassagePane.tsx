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
      className="h-full overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 bg-white text-[#20395F] select-text"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <header className="border-b border-[#20395F]/15 pb-4">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7F5EF] text-[#087653] border border-[#087653]/20 mb-2">
            Reading Passage {sectionIndex + 1}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#20395F] leading-tight">
            {section.title}
          </h2>
        </header>

        {/* Paragraphs with academic typography */}
        <div className="space-y-5 text-[15.5px] sm:text-[16px] leading-relaxed sm:leading-[1.8] text-[#20395F]/90 font-serif">
          {paragraphs.map((para, pIdx) => {
            // Check if paragraph starts with a letter like "A ", "B " etc.
            const letterMatch = para.match(/^([A-G])\s+([\s\S]+)$/);

            if (letterMatch) {
              const letter = letterMatch[1];
              const restText = letterMatch[2];
              return (
                <div key={pIdx} className="flex items-start gap-3.5">
                  <span className="font-sans font-bold text-sm text-[#087653] bg-[#E7F5EF] border border-[#087653]/25 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
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
