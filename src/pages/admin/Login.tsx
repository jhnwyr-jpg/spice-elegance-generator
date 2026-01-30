import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ShieldCheck, Crown } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOwner, setIsCheckingOwner] = useState(true);
  const [hasOwner, setHasOwner] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    checkExistingOwner();
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Verify if user is admin
      const isAdmin = await verifyAdminRole(session.access_token);
      if (isAdmin) {
        navigate("/admin/dashboard");
      }
    }
  };

  const checkExistingOwner = async () => {
    try {
      // Check if any owner exists by trying to call setup-owner with GET (it will tell us)
      const { data, error } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "owner")
        .limit(1);
      
      // If we can't query (RLS), check via edge function
      if (error) {
        // Assume owner exists for security
        setHasOwner(true);
      } else {
        setHasOwner(data && data.length > 0);
      }
    } catch {
      setHasOwner(true);
    } finally {
      setIsCheckingOwner(false);
    }
  };

  const verifyAdminRole = async (token: string): Promise<boolean> => {
    try {
      const response = await supabase.functions.invoke("verify-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.error) {
        return false;
      }
      
      return response.data?.isAdmin === true;
    } catch {
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.session) {
        // Verify admin role server-side
        const isAdmin = await verifyAdminRole(data.session.access_token);
        
        if (!isAdmin) {
          await supabase.auth.signOut();
          toast.error("এই অ্যাকাউন্টে অ্যাডমিন অ্যাক্সেস নেই");
          return;
        }

        toast.success("লগইন সফল হয়েছে!");
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      toast.error("লগইন করতে সমস্যা হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke("setup-owner", {
        body: { email, password, name },
      });

      if (response.error) {
        toast.error(response.error.message || "Owner তৈরি করতে সমস্যা হয়েছে");
        return;
      }

      if (response.data?.error) {
        toast.error(response.data.error);
        return;
      }

      toast.success("Owner অ্যাকাউন্ট তৈরি হয়েছে! এখন লগইন করুন।");
      setHasOwner(true);
      setShowSetup(false);
      setName("");
      setPassword("");
    } catch (error: any) {
      toast.error("Owner তৈরি করতে সমস্যা হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show owner setup if no owner exists
  if (!hasOwner || showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-lg shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Owner Setup</CardTitle>
                <CardDescription className="text-slate-400">
                  প্রথম Owner অ্যাকাউন্ট তৈরি করুন
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetupOwner} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">নাম</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="আপনার নাম"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">ইমেইল</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="owner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2.5"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        অপেক্ষা করুন...
                      </>
                    ) : (
                      "Owner অ্যাকাউন্ট তৈরি করুন"
                    )}
                  </Button>
                  {hasOwner && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSetup(false)}
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      লগইনে ফিরে যান
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-lg shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Admin Panel</CardTitle>
              <CardDescription className="text-slate-400">
                UR Media - এডমিন প্যানেলে স্বাগতম
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">ইমেইল</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">পাসওয়ার্ড</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      অপেক্ষা করুন...
                    </>
                  ) : (
                    "লগইন করুন"
                  )}
                </Button>
              </div>
            </form>
            <p className="text-center text-slate-500 text-sm mt-6">
              শুধুমাত্র অনুমোদিত অ্যাডমিনরা লগইন করতে পারবেন
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
