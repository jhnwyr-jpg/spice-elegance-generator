const BonusSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12 animate-fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-sm font-medium text-primary">
              বিশেষ সুবিধা
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              আপনার জন্য এক্সট্রা ভ্যালু
            </h2>
          </div>
          
          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 animate-fade-up delay-200">
            <div className="group p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ফ্রি রেসিপি গাইড
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                প্রতিটি অর্ডারের সাথে পাচ্ছেন বিশেষ রেসিপি বই — যেখানে আমাদের মসলা দিয়ে তৈরি ঐতিহ্যবাহী রান্নার গোপন কৌশল।
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⏰</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                সীমিত সময়ের অফার
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                এখনই অর্ডার করলে পাচ্ছেন বিশেষ কম্বো প্যাক — একাধিক মসলা একসাথে, সাশ্রয়ী মূল্যে।
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                কোয়ালিটি গ্যারান্টি
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                আমাদের মসলায় সন্তুষ্ট না হলে সম্পূর্ণ টাকা ফেরত। কোনো প্রশ্ন নেই, কোনো ঝামেলা নেই।
              </p>
            </div>
          </div>
          
          {/* Notice */}
          <div className="mt-10 p-6 rounded-2xl bg-secondary/70 border border-border text-center animate-fade-up delay-300">
            <p className="text-muted-foreground">
              <span className="text-foreground font-medium">বিশেষ দ্রষ্টব্য:</span> আমরা ডিসকাউন্ট নয়, কোয়ালিটিতে বিশ্বাস করি। প্রতিটি পণ্য সর্বোচ্চ মান বজায় রেখে তৈরি।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BonusSection;
