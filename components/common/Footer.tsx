import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#0B4535] via-[#06291F] to-[#031A13] text-white pt-16 pb-12 overflow-hidden border-t border-[#087653]/30">
      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Cpath d='M0 .5H28M.5 0V28' stroke='%23fff' stroke-opacity='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block bg-white rounded-xl p-2.5 shadow-2xs">
              <Logo size="md" href="/" isDark={false} />
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              বাংলাদেশের শিক্ষার্থীদের জন্য নিবেদিত IELTS প্রস্তুতি ও কম্পিউটার-ডেলিভার্ড মক টেস্ট প্ল্যাটফর্ম। বাস্তব পরীক্ষার অভিজ্ঞতা এবং সঠিক মূল্যায়নের মাধ্যমে নিজের কাঙ্ক্ষিত ব্যান্ড স্কোর অর্জন করুন।
            </p>
            <div className="pt-2 text-xs text-white/60">
              টেকনিক্যাল লিড: নূর · প্রতিষ্ঠাতা: নূর ও মোজাম্মেল
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-[#8FD8C4] uppercase">
              নেভিগেশন
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-[#8FD8C4] transition-colors">
                  হোম
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-[#8FD8C4] transition-colors">
                  প্র্যাকটিস টেস্ট
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#8FD8C4] transition-colors">
                  কীভাবে কাজ করে
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#8FD8C4] transition-colors">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#8FD8C4] transition-colors">
                  স্টুডেন্ট ড্যাশবোর্ড
                </Link>
              </li>
            </ul>
          </div>

          {/* IELTS Modules */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-[#8FD8C4] uppercase">
              মডিউলসমূহ
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Link href="/practice" className="hover:text-[#8FD8C4] transition-colors">
                  Academic Reading
                </Link>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#087653] text-white">
                  উপলব্ধ
                </span>
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <span>Listening</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                  শীঘ্রই আসছে
                </span>
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <span>Writing</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                  শীঘ্রই আসছে
                </span>
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <span>Speaking</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                  শীঘ্রই আসছে
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-[#8FD8C4] uppercase">
              যোগাযোগ ও সাপোর্ট
            </h4>
            <div className="space-y-2 text-sm text-white/80">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8FD8C4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@ieltsbangla.com</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8FD8C4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>ঢাকা, বাংলাদেশ</span>
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded-md text-xs bg-white/10 text-[#8FD8C4] font-medium">
                  অফিসিয়াল CD-IELTS ফরম্যাট
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © 2026 IELTS বাংলা। সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#8FD8C4] transition-colors">
              গোপনীয়তা নীতি (Privacy Policy)
            </Link>
            <Link href="/terms" className="hover:text-[#8FD8C4] transition-colors">
              শর্তাবলি (Terms of Service)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
