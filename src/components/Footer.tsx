const Footer = () => {
  return (
    <footer className="bg-deep-brown text-primary-foreground py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gold/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-primary-foreground/5 rounded-full blur-2xl animate-pulse-soft delay-300" />
      
      <div className="container-premium section-padding py-0 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 group cursor-default hover-scale">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors duration-300 group-hover:rotate-12">
              <span className="font-bold text-lg">UR</span>
            </div>
            <span className="text-xl font-semibold group-hover:text-gold-soft transition-colors">UR Media</span>
          </div>
          
          <p className="text-primary-foreground/60 text-sm text-center md:text-right">
            © {new Date().getFullYear()} UR Media। সর্বস্বত্ব সংরক্ষিত।
            <br />
            <span className="text-xs hover:text-gold-soft transition-colors cursor-default">প্রিমিয়াম মসলা | প্রকৃতির বিশুদ্ধতা</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
