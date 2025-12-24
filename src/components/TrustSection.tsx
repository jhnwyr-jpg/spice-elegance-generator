import { useEffect, useRef, useState } from "react";

const TrustSection = () => {
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

  const trustItems = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "স্বাস্থ্যসম্মত প্রস্তুত প্রক্রিয়া",
      description: "আধুনিক ও পরিষ্কার পরিবেশে প্রতিটি মসলা প্রস্তুত করা হয়, নিশ্চিত করা হয় সর্বোচ্চ স্বাস্থ্যবিধি।"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: "কোয়ালিটি পরীক্ষা",
      description: "প্রতিটি ব্যাচ প্যাকেজিংয়ের আগে কঠোর মান পরীক্ষায় উত্তীর্ণ হয়, নিশ্চিত হয় বিশুদ্ধতা।"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "পরিবার-বান্ধব ও নিরাপদ",
      description: "ছোট থেকে বড় সবার জন্য নিরাপদ। কোনো ক্ষতিকর রাসায়নিক নেই, শুধু প্রকৃতির উপাদান।"
    }
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-primary text-primary-foreground overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-pulse-soft delay-500" />
      
      <div className="container-premium relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className={`space-y-4 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold">
              কোয়ালিটি নিশ্চিত, বিশ্বাস অটুট
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              প্রতিটি পদক্ষেপে আমরা মান বজায় রাখতে প্রতিশ্রুতিবদ্ধ
            </p>
          </div>
          
          {/* Trust Points */}
          <div className="grid md:grid-cols-3 gap-8">
            {trustItems.map((item, index) => (
              <div 
                key={index}
                className={`group space-y-4 p-6 rounded-2xl bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-all duration-500 hover-lift cursor-default ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-foreground/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-foreground/20 transition-all duration-300 group-hover:rotate-6">
                  <div className="group-hover:animate-bounce-subtle">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold group-hover:text-gold-soft transition-colors">{item.title}</h3>
                <p className="text-primary-foreground/70 text-sm group-hover:text-primary-foreground/90 transition-colors">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
