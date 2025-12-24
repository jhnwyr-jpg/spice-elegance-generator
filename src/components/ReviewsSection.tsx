const ReviewsSection = () => {
  const reviews = [
    {
      name: "ফারহানা বেগম",
      location: "ঢাকা",
      rating: 5,
      text: "এতদিন বাজার থেকে মসলা কিনতাম, কিন্তু UR Media এর মসলা ব্যবহার করে বুঝলাম আসল স্বাদ কাকে বলে! আমার পরিবার এখন প্রতিটি রান্নায় এই মসলার প্রশংসা করে।",
      verified: true
    },
    {
      name: "রাহাত হোসেন",
      location: "চট্টগ্রাম",
      rating: 5,
      text: "হলুদের রং এত সুন্দর এবং ঘ্রাণ এত তীব্র যে প্রথমে বিশ্বাসই হয়নি। এখন বুঝি খাঁটি মসলা আর ভেজাল মসলার পার্থক্য। পরিবারের জন্য নিশ্চিন্তে কিনতে পারছি।",
      verified: true
    },
    {
      name: "নাসরিন আক্তার",
      location: "সিলেট",
      rating: 5,
      text: "ক্যাশ অন ডেলিভারি সুবিধা আছে বলে প্রথমবার অর্ডার করেছিলাম। প্যাকেজিং দেখে মুগ্ধ, মসলার কোয়ালিটি অসাধারণ। এখন নিয়মিত গ্রাহক হয়ে গেছি!",
      verified: true
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 animate-fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-sm font-medium text-primary">
            গ্রাহক রিভিউ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            আমাদের গ্রাহকদের মতামত
          </h2>
        </div>
        
        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-shadow animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Review Text */}
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "{review.text}"
              </p>
              
              {/* Reviewer Info */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>ভেরিফাইড</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
