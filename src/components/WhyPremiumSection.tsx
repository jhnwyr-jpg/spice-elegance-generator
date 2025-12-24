import { useEffect, useRef, useState } from "react";

const WhyPremiumSection = () => {
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

  const features = [
    {
      icon: "✓",
      title: "খাঁটি ও বিশুদ্ধ উপাদান",
      description: "প্রতিটি মসলা সরাসরি কৃষক থেকে সংগ্রহ করা, কোনো মিশ্রণ নেই"
    },
    {
      icon: "✓",
      title: "প্রাকৃতিক সুগন্ধ",
      description: "মসলার আসল ঘ্রাণ যা রান্নায় এক অন্য মাত্রা যোগ করে"
    },
    {
      icon: "✓",
      title: "রঙ ও স্বাদ দীর্ঘদিন অটুট",
      description: "বিশেষ প্যাকেজিংয়ে মসলার গুণমান দীর্ঘদিন সংরক্ষিত থাকে"
    },
    {
      icon: "✓",
      title: "স্বাস্থ্যসম্মত প্রক্রিয়াজাতকরণ",
      description: "পরিষ্কার-পরিচ্ছন্ন পরিবেশে আধুনিক পদ্ধতিতে প্রস্তুত"
    },
    {
      icon: "✓",
      title: "ল্যাব টেস্টেড ও সার্টিফাইড",
      description: "প্রতিটি ব্যাচ মান নিয়ন্ত্রণ পরীক্ষায় উত্তীর্ণ"
    },
    {
      icon: "✓",
      title: "পরিবার-বান্ধব ও নিরাপদ",
      description: "শিশু থেকে বয়স্ক সবার জন্য সম্পূর্ণ নিরাপদ"
    }
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-secondary/30 overflow-hidden">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`text-center space-y-4 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-sm font-medium text-primary hover-scale cursor-default">
              কেন আমাদের মসলা?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              প্রিমিয়াম কোয়ালিটির কারণ
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              আমরা বিশ্বাস করি, ভালো রান্না শুরু হয় ভালো মসলা দিয়ে
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group flex gap-4 p-5 rounded-xl bg-card border border-border hover:border-gold hover:shadow-card transition-all duration-500 hover-lift cursor-default ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animationDelay: `${index * 100}ms` 
                }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 group-hover:shadow-gold">
                  <span className="text-primary-foreground font-bold">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">{feature.description}</p>
                </div>
                
                {/* Progress bar animation */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold/0 group-hover:bg-gold/50 transition-all duration-700 origin-left scale-x-0 group-hover:scale-x-100 rounded-b-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyPremiumSection;
