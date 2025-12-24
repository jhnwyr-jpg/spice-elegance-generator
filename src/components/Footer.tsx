const Footer = () => {
  return (
    <footer className="bg-deep-brown text-primary-foreground py-12">
      <div className="container-premium section-padding py-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="font-bold text-lg">UR</span>
            </div>
            <span className="text-xl font-semibold">UR Media</span>
          </div>
          
          <p className="text-primary-foreground/60 text-sm text-center md:text-right">
            © {new Date().getFullYear()} UR Media। সর্বস্বত্ব সংরক্ষিত।
            <br />
            <span className="text-xs">প্রিমিয়াম মসলা | প্রকৃতির বিশুদ্ধতা</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
