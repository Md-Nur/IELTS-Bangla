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
  title: "IELTS Bangla | Professional IELTS Preparation & Mock Testing Platform",
  description: "Prepare smarter and practice better with authentic computer-delivered IELTS mock tests, realistic exam experiences, and detailed performance insights for Bangladeshi students.",
  keywords: [
    "IELTS Bangla",
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
      lang="en"
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
