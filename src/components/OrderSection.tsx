import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import singleProduct from "@/assets/single-product.jpg";

const OrderSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    location: "dhaka"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("অনুগ্রহ করে সকল তথ্য পূরণ করুন");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate order submission
    setTimeout(() => {
      toast.success("আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে! শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।");
      setFormData({ name: "", phone: "", address: "", location: "dhaka" });
      setIsSubmitting(false);
    }, 1500);
  };

  const deliveryCharge = formData.location === "dhaka" ? 50 : 100;

  const trustPoints = [
    { icon: "🚚", text: "দ্রুত ডেলিভারি — ২-৩ দিনের মধ্যে" },
    { icon: "💵", text: "ক্যাশ অন ডেলিভারি সুবিধা" },
    { icon: "🔒", text: "সুরক্ষিত প্যাকেজিং" },
    { icon: "📞", text: "যেকোনো সমস্যায় সহায়তা" },
  ];

  return (
    <section ref={sectionRef} id="order-section" className="section-padding bg-secondary/50 overflow-hidden">
      <div className="container-premium">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className={`text-center space-y-4 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-sm font-medium text-primary animate-glow">
              অর্ডার করুন
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              সহজ অর্ডার প্রক্রিয়া
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              নিচের ফর্মটি পূরণ করুন। ক্যাশ অন ডেলিভারি সুবিধা রয়েছে — পণ্য হাতে পেয়ে টাকা দিন।
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Product Summary */}
            <div className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
              <div className="rounded-2xl overflow-hidden bg-card border border-border p-6 hover:border-gold hover:shadow-card transition-all duration-500 hover-lift group">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={singleProduct} 
                      alt="প্রিমিয়াম মসলা"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">প্রিমিয়াম মসলা কম্বো প্যাক</h3>
                    <p className="text-sm text-muted-foreground mb-2">হলুদ, জিরা, ধনিয়া, মরিচ</p>
                    <p className="text-xl font-bold text-primary group-hover:scale-105 transition-transform origin-left">৳ ৪৫০</p>
                  </div>
                </div>
              </div>
              
              {/* Trust Points */}
              <div className="space-y-3">
                {trustPoints.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 text-muted-foreground p-2 rounded-lg hover:bg-card hover:text-foreground transition-all duration-300 cursor-default group ${isVisible ? 'animate-slide-right' : 'opacity-0'}`}
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <span className="text-lg group-hover:animate-bounce-subtle">{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Form */}
            <form 
              onSubmit={handleSubmit} 
              className={`space-y-6 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
            >
              <div className="rounded-2xl bg-card border border-border p-6 space-y-5 hover:border-gold/50 transition-colors duration-500">
                <div className="space-y-2 group">
                  <Label htmlFor="name" className="text-foreground group-focus-within:text-primary transition-colors">নাম</Label>
                  <Input
                    id="name"
                    placeholder="আপনার পূর্ণ নাম"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background transition-all duration-300 focus:scale-[1.02] focus:shadow-soft"
                  />
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="phone" className="text-foreground group-focus-within:text-primary transition-colors">মোবাইল নাম্বার</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background transition-all duration-300 focus:scale-[1.02] focus:shadow-soft"
                  />
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="address" className="text-foreground group-focus-within:text-primary transition-colors">ঠিকানা</Label>
                  <Input
                    id="address"
                    placeholder="সম্পূর্ণ ঠিকানা"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-background transition-all duration-300 focus:scale-[1.02] focus:shadow-soft"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-foreground">ডেলিভারি এলাকা</Label>
                  <RadioGroup
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 group cursor-pointer">
                      <RadioGroupItem value="dhaka" id="dhaka" className="group-hover:border-gold transition-colors" />
                      <Label htmlFor="dhaka" className="font-normal text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer">
                        ঢাকার ভিতরে (৳৫০)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 group cursor-pointer">
                      <RadioGroupItem value="outside" id="outside" className="group-hover:border-gold transition-colors" />
                      <Label htmlFor="outside" className="font-normal text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer">
                        ঢাকার বাইরে (৳১০০)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Order Summary */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>পণ্য মূল্য</span>
                    <span>৳ ৪৫০</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="transition-all duration-300">৳ {deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
                    <span>মোট</span>
                    <span className="text-primary text-lg transition-all duration-300">৳ {450 + deliveryCharge}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="premium" 
                size="lg" 
                className="w-full text-lg relative overflow-hidden group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    প্রসেসিং...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">অর্ডার কনফার্ম করুন</span>
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </>
                )}
              </Button>
              
              <p className="text-center text-xs text-muted-foreground">
                অর্ডার কনফার্ম করলে আমাদের শর্তাবলী মেনে নিয়েছেন বলে ধরে নেওয়া হবে।
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
