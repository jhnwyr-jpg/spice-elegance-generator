import { useState } from "react";
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

  return (
    <section id="order-section" className="section-padding bg-secondary/50">
      <div className="container-premium">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12 animate-fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-sm font-medium text-primary">
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
            <div className="space-y-6 animate-fade-up delay-100">
              <div className="rounded-2xl overflow-hidden bg-card border border-border p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={singleProduct} 
                      alt="প্রিমিয়াম মসলা"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">প্রিমিয়াম মসলা কম্বো প্যাক</h3>
                    <p className="text-sm text-muted-foreground mb-2">হলুদ, জিরা, ধনিয়া, মরিচ</p>
                    <p className="text-xl font-bold text-primary">৳ ৪৫০</p>
                  </div>
                </div>
              </div>
              
              {/* Trust Points */}
              <div className="space-y-3">
                {[
                  { icon: "🚚", text: "দ্রুত ডেলিভারি — ২-৩ দিনের মধ্যে" },
                  { icon: "💵", text: "ক্যাশ অন ডেলিভারি সুবিধা" },
                  { icon: "🔒", text: "সুরক্ষিত প্যাকেজিং" },
                  { icon: "📞", text: "যেকোনো সমস্যায় সহায়তা" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-muted-foreground">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up delay-200">
              <div className="rounded-2xl bg-card border border-border p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">নাম</Label>
                  <Input
                    id="name"
                    placeholder="আপনার পূর্ণ নাম"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">মোবাইল নাম্বার</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-foreground">ঠিকানা</Label>
                  <Input
                    id="address"
                    placeholder="সম্পূর্ণ ঠিকানা"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-background"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-foreground">ডেলিভারি এলাকা</Label>
                  <RadioGroup
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dhaka" id="dhaka" />
                      <Label htmlFor="dhaka" className="font-normal text-muted-foreground">
                        ঢাকার ভিতরে (৳৫০)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="outside" id="outside" />
                      <Label htmlFor="outside" className="font-normal text-muted-foreground">
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
                    <span>৳ {deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
                    <span>মোট</span>
                    <span>৳ {450 + deliveryCharge}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="premium" 
                size="lg" 
                className="w-full text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "প্রসেসিং..." : "অর্ডার কনফার্ম করুন"}
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
