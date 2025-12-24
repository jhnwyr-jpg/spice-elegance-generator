const TrustSection = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="space-y-4 mb-12 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold">
              কোয়ালিটি নিশ্চিত, বিশ্বাস অটুট
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              প্রতিটি পদক্ষেপে আমরা মান বজায় রাখতে প্রতিশ্রুতিবদ্ধ
            </p>
          </div>
          
          {/* Trust Points */}
          <div className="grid md:grid-cols-3 gap-8 animate-fade-up delay-200">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">স্বাস্থ্যসম্মত প্রস্তুত প্রক্রিয়া</h3>
              <p className="text-primary-foreground/70 text-sm">
                আধুনিক ও পরিষ্কার পরিবেশে প্রতিটি মসলা প্রস্তুত করা হয়, নিশ্চিত করা হয় সর্বোচ্চ স্বাস্থ্যবিধি।
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">কোয়ালিটি পরীক্ষা</h3>
              <p className="text-primary-foreground/70 text-sm">
                প্রতিটি ব্যাচ প্যাকেজিংয়ের আগে কঠোর মান পরীক্ষায় উত্তীর্ণ হয়, নিশ্চিত হয় বিশুদ্ধতা।
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">পরিবার-বান্ধব ও নিরাপদ</h3>
              <p className="text-primary-foreground/70 text-sm">
                ছোট থেকে বড় সবার জন্য নিরাপদ। কোনো ক্ষতিকর রাসায়নিক নেই, শুধু প্রকৃতির উপাদান।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
