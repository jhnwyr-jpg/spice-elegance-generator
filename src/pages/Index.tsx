import HeroSection from "@/components/HeroSection";
import ProductIntroSection from "@/components/ProductIntroSection";
import BonusSection from "@/components/BonusSection";
import WhyPremiumSection from "@/components/WhyPremiumSection";
import ReviewsSection from "@/components/ReviewsSection";
import OrderSection from "@/components/OrderSection";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProductIntroSection />
      <BonusSection />
      <WhyPremiumSection />
      <ReviewsSection />
      <OrderSection />
      <TrustSection />
      <Footer />
    </main>
  );
};

export default Index;
