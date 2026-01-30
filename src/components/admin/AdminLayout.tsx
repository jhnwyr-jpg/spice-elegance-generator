import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface AdminUser {
  userId: string;
  email: string;
  role: "owner" | "admin" | "staff" | null;
  isAdmin: boolean;
}

const navItems = [
  { path: "/admin/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { path: "/admin/products", label: "প্রোডাক্ট", icon: Package },
  { path: "/admin/orders", label: "অর্ডার", icon: ShoppingCart },
  { path: "/admin/customers", label: "কাস্টমার", icon: Users },
  { path: "/admin/tracking", label: "ট্র্যাকিং", icon: Truck },
  { path: "/admin/reports", label: "রিপোর্ট", icon: BarChart3 },
  { path: "/admin/settings", label: "সেটিংস", icon: Settings, ownerOnly: true },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
        return;
      }

      try {
        const response = await supabase.functions.invoke("verify-admin", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.error || !response.data?.isAdmin) {
          toast.error("অ্যাডমিন অ্যাক্সেস নেই");
          await supabase.auth.signOut();
          navigate("/admin/login");
          return;
        }

        setAdminUser({
          userId: response.data.userId,
          email: response.data.email,
          role: response.data.role,
          isAdmin: true,
        });
      } catch (error) {
        console.error("Verification error:", error);
        await supabase.auth.signOut();
        navigate("/admin/login");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!adminUser) return;

    const fetchPendingOrders = async () => {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("order_status", "pending");
      setPendingCount(count || 0);
    };
    fetchPendingOrders();

    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          setPendingCount((prev) => prev + 1);
          toast.success("নতুন অর্ডার এসেছে!", {
            description: `অর্ডার আইডি: ${payload.new.order_id}`,
          });
          const audio = new Audio("/notification.mp3");
          audio.play().catch(() => {});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [adminUser]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("লগআউট সফল হয়েছে");
    navigate("/admin/login");
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-amber-100 text-amber-700 text-xs border-amber-200">Owner</Badge>;
      case "admin":
        return <Badge className="bg-blue-100 text-blue-700 text-xs border-blue-200">Admin</Badge>;
      case "staff":
        return <Badge className="bg-green-100 text-green-700 text-xs border-green-200">Staff</Badge>;
      default:
        return null;
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-500 mt-4">অ্যাডমিন যাচাই হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  const filteredNavItems = navItems.filter(item => {
    if (item.ownerOnly && adminUser.role !== "owner") {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4 shadow-sm">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg text-slate-800">Admin Panel</span>
        </div>
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
          <Bell className="w-5 h-5" />
          {pendingCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {pendingCount}
            </Badge>
          )}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-40 transition-all duration-300 shadow-sm",
          sidebarOpen ? "w-64" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                UR Media
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20"
                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
                {item.path === "/admin/orders" && pendingCount > 0 && sidebarOpen && (
                  <Badge className="ml-auto bg-red-500 text-white">{pendingCount}</Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-amber-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {adminUser.email?.charAt(0).toUpperCase()}
                </div>
                {sidebarOpen && (
                  <>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-slate-800 truncate">{adminUser.email}</p>
                      {getRoleBadge(adminUser.role)}
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-slate-200">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                লগআউট
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen pt-16 lg:pt-0 transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <div className="p-4 lg:p-8">
          <Outlet context={{ adminUser }} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
