const WhyPremiumSection = () => {
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
    <section className="section-padding bg-secondary/30">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12 animate-fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-sm font-medium text-primary">
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
                className="flex gap-4 p-5 rounded-xl bg-card border border-border hover:shadow-soft transition-shadow animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyPremiumSection;
