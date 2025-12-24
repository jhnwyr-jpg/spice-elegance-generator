import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToOrder = () => {
    document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-soft' : 'bg-background/80 backdrop-blur-md'} border-b border-border/50`}>
      <div className="container-premium section-padding py-4">
        <div className={`flex items-center justify-between transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-2 group cursor-default">
            <div className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${isScrolled ? 'shadow-soft' : ''}`}>
              <span className="text-primary-foreground font-bold text-lg">UR</span>
            </div>
            <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">UR Media</span>
          </div>
          
          <Button 
            onClick={scrollToOrder}
            variant="premium"
            size="sm"
            className="hover-lift group"
          >
            <span className="group-hover:animate-bounce-subtle">Order Now</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
