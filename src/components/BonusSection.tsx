import { useEffect, useRef, useState } from "react";

const BonusSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const bonusItems = [
    {
      emoji: "🎁",
      title: "ফ্রি রেসিপি গাইড",
      description: "প্রতিটি অর্ডারের সাথে পাচ্ছেন বিশেষ রেসিপি বই — যেখানে আমাদের মসলা দিয়ে তৈরি ঐতিহ্যবাহী রান্নার গোপন কৌশল।"
    },
    {
      emoji: "⏰",
      title: "সীমিত সময়ের অফার",
      description: "এখনই অর্ডার করলে পাচ্ছেন বিশেষ কম্বো প্যাক — একাধিক মসলা একসাথে, সাশ্রয়ী মূল্যে।"
    },
    {
      emoji: "🏆",
      title: "কোয়ালিটি গ্যারান্টি",
      description: "আমাদের মসলায় সন্তুষ্ট না হলে সম্পূর্ণ টাকা ফেরত। কোনো প্রশ্ন নেই, কোনো ঝামেলা নেই।"
    }
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-background overflow-hidden">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`text-center space-y-4 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-sm font-medium text-primary animate-pulse-soft">
              বিশেষ সুবিধা
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              আপনার জন্য এক্সট্রা ভ্যালু
            </h2>
          </div>
          
          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {bonusItems.map((item, index) => (
              <div 
                key={index}
                className={`group p-6 rounded-2xl bg-card border border-border hover:border-gold hover:shadow-elevated transition-all duration-500 hover-lift cursor-default ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:bg-gold/30">
                  <span className="text-3xl group-hover:animate-wiggle">{item.emoji}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
                  {item.description}
                </p>
                
                {/* Hover indicator */}
                <div className="mt-4 h-0.5 bg-gold/0 group-hover:bg-gold/50 transition-all duration-500 rounded-full scale-x-0 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
          
          {/* Notice */}
          <div className={`mt-10 p-6 rounded-2xl bg-secondary/70 border border-border text-center hover:border-gold transition-all duration-500 hover-glow ${isVisible ? 'animate-fade-up delay-500' : 'opacity-0'}`}>
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
