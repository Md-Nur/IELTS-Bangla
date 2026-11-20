import React from "react";

interface IllustrationProps {
  className?: string;
  size?: number | string;
}

/**
 * Academic Study Book Illustration
 * Reused from HTML reference: book & document motif
 */
export function StudyBookIllustration({ className = "w-full h-full" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {/* Soft background glow */}
      <circle cx="60" cy="60" r="50" fill="#E7F5EF" />
      {/* Book cover shadow */}
      <path
        d="M20 78 C35 72 55 72 60 76 C65 72 85 72 100 78 L96 42 C82 36 65 36 60 40 C55 36 38 36 24 42 Z"
        fill="#087653"
        opacity="0.15"
      />
      {/* Open book spine & base */}
      <path
        d="M24 74 L60 84 L96 74 V36 L60 46 L24 36 Z"
        fill="#20395F"
      />
      {/* Left and right pages */}
      <path
        d="M28 70 L60 78 L60 42 L28 34 Z"
        fill="#FFFFFF"
      />
      <path
        d="M60 78 L92 70 L92 34 L60 42 Z"
        fill="#F8F8F9"
      />
      {/* Book center spine line */}
      <path d="M60 42 V78" stroke="#087653" strokeWidth="2.5" strokeLinecap="round" />
      {/* Page text lines - Left */}
      <path d="M34 44 H54" stroke="#20395F" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M34 52 H52" stroke="#20395F" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M34 60 H48" stroke="#20395F" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Page text lines - Right */}
      <path d="M66 44 H86" stroke="#20395F" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M66 52 H82" stroke="#20395F" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M66 60 H76" stroke="#20395F" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Bookmark ribbon */}
      <path d="M60 42 L66 32 L72 40 L66 58 Z" fill="#D93A45" />
      {/* Academic sparkle */}
      <path
        d="M92 24 C93 28 95 29 99 30 C95 31 93 32 92 36 C91 32 89 31 85 30 C89 29 91 28 92 24 Z"
        fill="#FFD66B"
      />
    </svg>
  );
}

/**
 * Exam Clipboard & Test Paper Illustration
 * Reused from HTML reference: clip & checklist motif
 */
export function ExamClipboardIllustration({ className = "w-full h-full" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {/* Background circle */}
      <circle cx="60" cy="60" r="50" fill="#E7F5EF" />
      {/* Clipboard board */}
      <rect x="32" y="24" width="56" height="74" rx="8" fill="#20395F" />
      {/* Clipboard top metal clip */}
      <rect x="46" y="18" width="28" height="12" rx="4" fill="#087653" />
      <circle cx="60" cy="24" r="3" fill="#FFFFFF" />
      {/* Paper sheet */}
      <rect x="38" y="32" width="44" height="60" rx="4" fill="#FFFFFF" />
      {/* Question check items */}
      <path d="M44 46 L48 50 L56 42" stroke="#087653" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 46 H76" stroke="#20395F" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <path d="M44 60 L48 64 L56 56" stroke="#087653" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 60 H76" stroke="#20395F" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <path d="M44 74 L48 78 L56 70" stroke="#087653" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 74 H72" stroke="#20395F" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      {/* Pencil drafting at bottom right */}
      <g transform="translate(76, 70) rotate(-35)">
        <rect x="-4" y="-20" width="8" height="28" rx="2" fill="#D93A45" />
        <path d="M-4 8 H4 L0 16 Z" fill="#F2C4A0" />
        <path d="M-1 14 H1 L0 16 Z" fill="#20395F" />
      </g>
    </svg>
  );
}

/**
 * Timed Exam & Countdown Clock Illustration
 * Reused from HTML reference: clock & calendar motif
 */
export function TimedExamIllustration({ className = "w-full h-full" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {/* Background circle */}
      <circle cx="60" cy="60" r="50" fill="#E7F5EF" />
      {/* Clock Outer Rim */}
      <circle cx="56" cy="58" r="34" fill="#FFFFFF" stroke="#20395F" strokeWidth="6" />
      {/* Clock 12-3-6-9 hour pips */}
      <circle cx="56" cy="30" r="2.5" fill="#20395F" />
      <circle cx="84" cy="58" r="2.5" fill="#20395F" />
      <circle cx="56" cy="86" r="2.5" fill="#20395F" />
      <circle cx="28" cy="58" r="2.5" fill="#20395F" />
      {/* Clock Hands indicating 60-min timing */}
      <path d="M56 58 V38" stroke="#087653" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M56 58 L72 50" stroke="#D93A45" strokeWidth="3" strokeLinecap="round" />
      <circle cx="56" cy="58" r="4.5" fill="#20395F" />
      {/* Timer badge */}
      <g transform="translate(76, 26)">
        <rect x="0" y="0" width="34" height="20" rx="10" fill="#087653" />
        <text x="17" y="14" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
          60m
        </text>
      </g>
      {/* Milestone check dots */}
      <circle cx="88" cy="78" r="5" fill="#FFD66B" />
      <path d="M86 78 L87.5 79.5 L90.5 76.5" stroke="#20395F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Score Analytics & Academic Progress Illustration
 * Reused from HTML reference: chart & target motif
 */
export function ScoreAnalyticsIllustration({ className = "w-full h-full" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {/* Background soft circle */}
      <circle cx="60" cy="60" r="50" fill="#E7F5EF" />
      {/* Card canvas */}
      <rect x="22" y="26" width="76" height="68" rx="8" fill="#FFFFFF" stroke="#20395F" strokeWidth="3" />
      {/* Baseline */}
      <path d="M30 78 H90" stroke="#20395F" strokeWidth="3" strokeLinecap="round" />
      {/* Bars showing steady progress */}
      <rect x="34" y="60" width="10" height="18" rx="3" fill="#9CC9F5" />
      <rect x="48" y="50" width="10" height="28" rx="3" fill="#087653" opacity="0.6" />
      <rect x="62" y="40" width="10" height="38" rx="3" fill="#087653" opacity="0.8" />
      <rect x="76" y="32" width="10" height="46" rx="3" fill="#087653" />
      {/* Trend line overlay */}
      <path
        d="M39 56 L53 46 L67 36 L81 26"
        stroke="#D93A45"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Target star at apex */}
      <g transform="translate(81, 26)">
        <circle cx="0" cy="0" r="7" fill="#FFD66B" />
        <circle cx="0" cy="0" r="3" fill="#D93A45" />
      </g>
    </svg>
  );
}

/**
 * Mistake Checker & Scholar's Lens Illustration
 * Reused from HTML reference: lens & checkmark motif
 */
export function MistakeCheckerIllustration({ className = "w-full h-full" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="50" fill="#E7F5EF" />
      {/* Magnifying Glass Lens */}
      <circle cx="52" cy="50" r="26" fill="#FFFFFF" stroke="#20395F" strokeWidth="6" />
      {/* Lens reflection curve */}
      <path d="M38 38 A 20 20 0 0 1 66 38" stroke="#9CC9F5" strokeWidth="3" strokeLinecap="round" />
      {/* Checkmark inside the lens */}
      <path
        d="M40 50 L48 58 L64 42"
        stroke="#087653"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle */}
      <path
        d="M72 70 L94 92"
        stroke="#20395F"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M74 72 L90 88"
        stroke="#D93A45"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Sparkle */}
      <path
        d="M26 26 C27 29 28 30 31 31 C28 32 27 33 26 36 C25 33 24 32 21 31 C24 30 25 29 26 26 Z"
        fill="#FFD66B"
      />
    </svg>
  );
}

/**
 * Listening Module Headphones Illustration
 * Reused from HTML reference: phones & wave motif
 */
export function ListeningAudioIllustration({ className = "w-full h-full" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="50" fill="#E7F5EF" />
      {/* Headband */}
      <path
        d="M34 62 C34 40 44 26 60 26 C76 26 86 40 86 62"
        stroke="#20395F"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Ear cups */}
      <rect x="26" y="56" width="16" height="28" rx="8" fill="#087653" />
      <rect x="78" y="56" width="16" height="28" rx="8" fill="#087653" />
      {/* Sound waves inside */}
      <path d="M48 64 V76" stroke="#087653" strokeWidth="3" strokeLinecap="round" />
      <path d="M54 58 V82" stroke="#20395F" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 52 V88" stroke="#D93A45" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M66 58 V82" stroke="#20395F" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 64 V76" stroke="#087653" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Speaking Partner Illustration
 * Reused from HTML reference: mic & bubble motif
 */
export function SpeakingPartnerIllustration({ className = "w-full h-full" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="50" fill="#E7F5EF" />
      {/* Primary speech bubble */}
      <rect x="24" y="24" width="56" height="40" rx="12" fill="#20395F" />
      <path d="M38 64 L30 76 L48 64 Z" fill="#20395F" />
      {/* Speech dots */}
      <circle cx="42" cy="44" r="3.5" fill="#FFFFFF" />
      <circle cx="52" cy="44" r="3.5" fill="#FFFFFF" />
      <circle cx="62" cy="44" r="3.5" fill="#FFFFFF" />
      {/* Microphone overlay */}
      <g transform="translate(68, 50)">
        <rect x="0" y="0" width="22" height="34" rx="11" fill="#087653" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M-6 16 C-6 28 6 36 11 36 C16 36 28 28 28 16" stroke="#20395F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M11 36 V46" stroke="#20395F" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M2 46 H20" stroke="#20395F" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * Writing Module Illustration
 * Reused from HTML reference: pencil & writing paper motif
 */
export function WritingPencilIllustration({ className = "w-full h-full" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="50" fill="#E7F5EF" />
      {/* Paper document */}
      <rect x="28" y="28" width="52" height="68" rx="6" fill="#FFFFFF" stroke="#20395F" strokeWidth="3" />
      {/* Ruled lines */}
      <path d="M38 42 H70" stroke="#20395F" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M38 52 H68" stroke="#20395F" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M38 62 H62" stroke="#20395F" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M38 72 H56" stroke="#20395F" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      {/* Prominent diagonal pencil */}
      <g transform="translate(74, 58) rotate(-35)">
        <rect x="-6" y="-36" width="12" height="46" rx="3" fill="#087653" />
        <path d="M-6 -22 H6" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
        <path d="M-6 10 H6 L0 22 Z" fill="#F2C4A0" />
        <path d="M-2 18 H2 L0 22 Z" fill="#20395F" />
      </g>
      {/* Sparkle */}
      <path
        d="M84 22 C85 25 86 26 89 27 C86 28 85 29 84 32 C83 29 82 28 79 27 C82 26 83 25 84 22 Z"
        fill="#FFD66B"
      />
    </svg>
  );
}
