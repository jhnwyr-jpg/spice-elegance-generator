import productsImage from "@/assets/products-collection.jpg";
import { useEffect, useRef, useState } from "react";

const ProductIntroSection = () => {
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
    { icon: "🌿", text: "সম্পূর্ণ প্রাকৃতিক" },
    { icon: "✨", text: "ভেজালমুক্ত" },
    { icon: "🔬", text: "ল্যাব টেস্টেড" },
    { icon: "📦", text: "সুরক্ষিত প্যাকেজিং" },
  ];

  return (
    <section ref={sectionRef} id="products" className="section-padding bg-secondary/50 overflow-hidden">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="rounded-3xl overflow-hidden shadow-card hover-lift group">
              <img 
                src={productsImage} 
                alt="প্রিমিয়াম মসলা সংগ্রহ"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
            </div>
            {/* Decorative element */}
            <div className={`absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-3xl bg-accent/50 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} />
            
            {/* Floating badge */}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-soft animate-float">
              <span className="text-sm font-medium text-primary">প্রিমিয়াম গ্রেড</span>
            </div>
          </div>
          
          {/* Content */}
          <div className={`space-y-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-sm font-medium text-primary hover:bg-gold/30 transition-colors duration-300 hover-scale cursor-default">
                আমাদের মসলা
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                প্রকৃতি থেকে সরাসরি আপনার রান্নাঘরে
              </h2>
            </div>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed stagger-children">
              <p className="hover:text-foreground transition-colors duration-300">
                <strong className="text-foreground">মসলার উৎস:</strong> আমাদের প্রতিটি মসলা বাংলাদেশের বিভিন্ন অঞ্চলের নির্বাচিত কৃষকদের কাছ থেকে সংগ্রহ করা হয়। প্রতিটি দানা যত্নের সাথে বাছাই করা।
              </p>
              
              <p className="hover:text-foreground transition-colors duration-300">
                <strong className="text-foreground">প্রাকৃতিক উপাদান:</strong> কোনো রাসায়নিক মিশ্রণ নেই, কোনো কৃত্রিম রং নেই। শুধুমাত্র প্রকৃতির বিশুদ্ধ উপহার — যা আপনার পরিবারের জন্য নিরাপদ।
              </p>
              
              <p className="hover:text-foreground transition-colors duration-300">
                <strong className="text-foreground">সাধারণ বাজার থেকে আলাদা:</strong> বাজারে প্রচলিত মসলায় প্রায়ই ভেজাল মেশানো থাকে। UR Media মসলা সম্পূর্ণ ভেজালমুক্ত এবং ল্যাব টেস্টেড — যা নিশ্চিত করে সর্বোচ্চ মান।
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-gold hover:shadow-soft transition-all duration-300 hover-lift cursor-default group ${isVisible ? 'animate-zoom-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <span className="text-2xl group-hover:animate-bounce-subtle">{item.icon}</span>
                  <span className="text-sm font-medium text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductIntroSection;
