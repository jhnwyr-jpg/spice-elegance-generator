import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-masala.jpg";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToOrder = () => {
    document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      {/* Animated Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gold-soft/20 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-accent/30 rounded-full blur-3xl animate-pulse-soft delay-500" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-terracotta/10 rounded-full blur-2xl animate-float delay-300" />
      
      {/* Floating spice particles */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gold/40 rounded-full animate-float" />
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-terracotta/30 rounded-full animate-float delay-200" />
      <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-gold-soft/50 rounded-full animate-float delay-400" />
      
      <div className="container-premium section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className={`space-y-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border hover:border-gold transition-colors duration-300 hover-glow cursor-default">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-sm text-muted-foreground">প্রিমিয়াম কোয়ালিটি</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                <span className="inline-block animate-slide-up">প্রকৃতির বিশুদ্ধতা,</span>
                <br />
                <span className="inline-block animate-slide-up delay-200 text-primary hover:text-shine transition-all duration-300">রান্নায় আসল স্বাদ</span>
              </h1>
              
              <p className={`text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                খাঁটি মসলা, প্রাকৃতিক সুগন্ধ — প্রতিটি রান্নায় নিয়ে আসুন ঘরোয়া স্বাদের অনুভূতি। 
                UR Media প্রিমিয়াম মসলা সংগ্রহ।
              </p>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Button 
                onClick={scrollToOrder}
                variant="premium"
                size="lg"
                className="text-lg px-8 animate-glow hover-lift group"
              >
                <span className="group-hover:animate-bounce-subtle">এখনই অর্ডার করুন</span>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="text-lg px-8 hover-lift hover:border-gold transition-all duration-300"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                আরও জানুন
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className={`flex items-center gap-6 pt-4 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center gap-2 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300 group-hover:scale-110 transform">
                  <svg className="w-5 h-5 text-primary group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">১০০% খাঁটি</span>
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300 group-hover:scale-110 transform">
                  <svg className="w-5 h-5 text-primary group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">দ্রুত ডেলিভারি</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-95'}`}>
            <div className="relative rounded-3xl overflow-hidden shadow-elevated hover-lift group">
              <img 
                src={heroImage} 
                alt="UR Media প্রিমিয়াম মসলা সংগ্রহ"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/20 to-transparent group-hover:from-deep-brown/30 transition-all duration-300" />
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-card border border-border animate-float hover-glow hover:scale-105 transition-transform duration-300 cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center animate-bounce-subtle">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">৫০০০+</p>
                  <p className="text-xs text-muted-foreground">সন্তুষ্ট গ্রাহক</p>
                </div>
              </div>
            </div>
            
            {/* Second floating element */}
            <div className="absolute -top-4 -right-4 bg-card rounded-xl p-3 shadow-card border border-border animate-float delay-300 hidden md:block">
              <div className="flex items-center gap-2">
                <span className="text-xl animate-wiggle">🌿</span>
                <span className="text-xs font-medium text-foreground">প্রাকৃতিক</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;
