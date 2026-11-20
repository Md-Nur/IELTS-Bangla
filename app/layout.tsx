import type { Metadata } from "next";
import { Hind_Siliguri, Anek_Bangla } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const anekBangla = Anek_Bangla({
  weight: ["500", "600", "700", "800"],
  subsets: ["bengali", "latin"],
  variable: "--font-anek-bangla",
  display: "swap",
});

export const instant = false;

export const metadata: Metadata = {
  title: "IELTS বাংলা | কম্পিউটার-ডেলিভার্ড মক টেস্ট ও বিশ্বস্ত প্রস্তুতি প্ল্যাটফর্ম",
  description: "বাংলাদেশের শিক্ষার্থীদের জন্য বাস্তবসম্মত কম্পিউটার-ডেলিভার্ড IELTS Mock Test, অটোমেটেড স্কোরিং ও ব্যান্ড স্কোর পর্যালোচনার নির্ভরযোগ্য প্ল্যাটফর্ম।",
  keywords: [
    "IELTS Bangla",
    "আইইএলটিএস বাংলা",
    "IELTS Mock Test Bangladesh",
    "IELTS Academic Reading",
    "Computer Delivered IELTS Practice",
    "IELTS preparation Dhaka",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${hindSiliguri.variable} ${anekBangla.variable} h-full scroll-smooth antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#F8F8F9] text-[#20395F]"
      >
        {children}
      </body>
    </html>
  );
}
