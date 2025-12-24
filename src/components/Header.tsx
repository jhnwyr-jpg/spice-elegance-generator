import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToOrder = () => {
    document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container-premium section-padding py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">UR</span>
            </div>
            <span className="text-xl font-semibold text-foreground">UR Media</span>
          </div>
          
          <Button 
            onClick={scrollToOrder}
            variant="premium"
            size="sm"
          >
            Order Now
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
