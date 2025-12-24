import productsImage from "@/assets/products-collection.jpg";

const ProductIntroSection = () => {
  return (
    <section id="products" className="section-padding bg-secondary/50">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative animate-fade-up">
            <div className="rounded-3xl overflow-hidden shadow-card">
              <img 
                src={productsImage} 
                alt="প্রিমিয়াম মসলা সংগ্রহ"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-3xl bg-accent/50" />
          </div>
          
          {/* Content */}
          <div className="space-y-8 animate-fade-up delay-200">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-sm font-medium text-primary">
                আমাদের মসলা
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                প্রকৃতি থেকে সরাসরি আপনার রান্নাঘরে
              </h2>
            </div>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">মসলার উৎস:</strong> আমাদের প্রতিটি মসলা বাংলাদেশের বিভিন্ন অঞ্চলের নির্বাচিত কৃষকদের কাছ থেকে সংগ্রহ করা হয়। প্রতিটি দানা যত্নের সাথে বাছাই করা।
              </p>
              
              <p>
                <strong className="text-foreground">প্রাকৃতিক উপাদান:</strong> কোনো রাসায়নিক মিশ্রণ নেই, কোনো কৃত্রিম রং নেই। শুধুমাত্র প্রকৃতির বিশুদ্ধ উপহার — যা আপনার পরিবারের জন্য নিরাপদ।
              </p>
              
              <p>
                <strong className="text-foreground">সাধারণ বাজার থেকে আলাদা:</strong> বাজারে প্রচলিত মসলায় প্রায়ই ভেজাল মেশানো থাকে। UR Media মসলা সম্পূর্ণ ভেজালমুক্ত এবং ল্যাব টেস্টেড — যা নিশ্চিত করে সর্বোচ্চ মান।
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🌿", text: "সম্পূর্ণ প্রাকৃতিক" },
                { icon: "✨", text: "ভেজালমুক্ত" },
                { icon: "🔬", text: "ল্যাব টেস্টেড" },
                { icon: "📦", text: "সুরক্ষিত প্যাকেজিং" },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                >
                  <span className="text-2xl">{item.icon}</span>
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
