import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-masala.jpg";

const HeroSection = () => {
  const scrollToOrder = () => {
    document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gold-soft/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-accent/30 rounded-full blur-3xl" />
      
      <div className="container-premium section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-6 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-sm text-muted-foreground">প্রিমিয়াম কোয়ালিটি</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                প্রকৃতির বিশুদ্ধতা,
                <br />
                <span className="text-primary">রান্নায় আসল স্বাদ</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                খাঁটি মসলা, প্রাকৃতিক সুগন্ধ — প্রতিটি রান্নায় নিয়ে আসুন ঘরোয়া স্বাদের অনুভূতি। 
                UR Media প্রিমিয়াম মসলা সংগ্রহ।
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-200">
              <Button 
                onClick={scrollToOrder}
                variant="premium"
                size="lg"
                className="text-lg px-8"
              >
                এখনই অর্ডার করুন
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="text-lg px-8"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                আরও জানুন
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4 animate-fade-up delay-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">১০০% খাঁটি</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">দ্রুত ডেলিভারি</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative animate-fade-up delay-100">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img 
                src={heroImage} 
                alt="UR Media প্রিমিয়াম মসলা সংগ্রহ"
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/20 to-transparent" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-card border border-border animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">৫০০০+</p>
                  <p className="text-xs text-muted-foreground">সন্তুষ্ট গ্রাহক</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
