import { getCurrentServerUser } from "@/lib/auth/serverSession";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HighlightsSection } from "@/components/landing/HighlightsSection";
import { ModulesSection } from "@/components/landing/ModulesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { WhyUsSection } from "@/components/landing/WhyUsSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";

export const instant = false;

export const metadata = {
  title: "IELTS বাংলা | Professional IELTS Preparation & Mock Testing Platform",
  description: "Prepare smarter and practice better with authentic computer-delivered IELTS mock tests, realistic exam experiences, and detailed performance insights for Bangladeshi students.",
};

export default async function HomePage() {
  const user = await getCurrentServerUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F9] text-[#20395F] selection:bg-[#E7F5EF] selection:text-[#087653]">
      <Navbar user={user} />
      <main className="flex-1">
        <HeroSection user={user} />
        <HighlightsSection />
        <ModulesSection user={user} />
        <HowItWorksSection user={user} />
        <WhyUsSection />
        <FinalCtaSection user={user} />
      </main>
      <Footer />
    </div>
  );
}
