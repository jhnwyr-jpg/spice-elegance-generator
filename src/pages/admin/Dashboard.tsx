import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format, subDays, startOfMonth } from "date-fns";

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  newCustomers: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

interface RecentOrder {
  id: string;
  order_id: string;
  customer_name: string;
  total: number;
  order_status: string;
  created_at: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    newCustomers: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("7days");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchSalesData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    // Get total sales (only delivered orders)
    const { data: deliveredOrders } = await supabase
      .from("orders")
      .select("total")
      .eq("order_status", "delivered");
    const totalSales = deliveredOrders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

    // Get order counts by status
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("order_status", "pending");

    const { count: processingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("order_status", "processing");

    const { count: deliveredCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("order_status", "delivered");

    const { count: cancelledOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("order_status", "cancelled");

    // Get new customers this month
    const monthStart = startOfMonth(new Date()).toISOString();
    const { count: newCustomers } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthStart);

    // Get recent orders
    const { data: recent } = await supabase
      .from("orders")
      .select("id, order_id, customer_name, total, order_status, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    setStats({
      totalSales,
      totalOrders: totalOrders || 0,
      newCustomers: newCustomers || 0,
      pendingOrders: pendingOrders || 0,
      processingOrders: processingOrders || 0,
      deliveredOrders: deliveredCount || 0,
      cancelledOrders: cancelledOrders || 0,
    });

    setRecentOrders(recent || []);
    setIsLoading(false);
  };

  const fetchSalesData = async () => {
    const days = dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : dateRange === "6months" ? 180 : 365;
    const startDate = subDays(new Date(), days).toISOString();

    const { data } = await supabase
      .from("orders")
      .select("total, created_at")
      .eq("order_status", "delivered")
      .gte("created_at", startDate)
      .order("created_at", { ascending: true });

    // Group by date
    const grouped: Record<string, number> = {};
    data?.forEach((order) => {
      const date = format(new Date(order.created_at), "yyyy-MM-dd");
      grouped[date] = (grouped[date] || 0) + Number(order.total);
    });

    // Fill in missing dates
    const chartData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      chartData.push({
        date: format(subDays(new Date(), i), "dd MMM"),
        sales: grouped[date] || 0,
      });
    }

    setSalesData(chartData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "processing":
        return "bg-blue-500/20 text-blue-400";
      case "shipped":
        return "bg-purple-500/20 text-purple-400";
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "পেন্ডিং";
      case "processing":
        return "প্রসেসিং";
      case "shipped":
        return "শিপড";
      case "delivered":
        return "ডেলিভারড";
      case "cancelled":
        return "বাতিল";
      default:
        return status;
    }
  };

  const statCards = [
    {
      title: "মোট বিক্রি",
      value: `৳${stats.totalSales.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
      subtitle: "শুধুমাত্র ডেলিভারড অর্ডার",
    },
    {
      title: "মোট অর্ডার",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-600",
      subtitle: "সকল অর্ডার",
    },
    {
      title: "নতুন গ্রাহক",
      value: stats.newCustomers,
      icon: Users,
      color: "from-purple-500 to-pink-600",
      subtitle: "এই মাসে",
    },
    {
      title: "পেন্ডিং অর্ডার",
      value: stats.pendingOrders,
      icon: Clock,
      color: "from-yellow-500 to-orange-600",
      subtitle: "প্রক্রিয়াধীন",
    },
  ];

  const orderStatusCards = [
    { label: "পেন্ডিং", count: stats.pendingOrders, icon: Clock, color: "text-yellow-400" },
    { label: "প্রসেসিং", count: stats.processingOrders, icon: Package, color: "text-blue-400" },
    { label: "ডেলিভারড", count: stats.deliveredOrders, icon: CheckCircle2, color: "text-green-400" },
    { label: "বাতিল", count: stats.cancelledOrders, icon: XCircle, color: "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">ড্যাশবোর্ড</h1>
          <p className="text-slate-400 mt-1">আপনার ব্যবসার সারসংক্ষেপ</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="সময়কাল" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="7days">গত ৭ দিন</SelectItem>
            <SelectItem value="30days">গত ৩০ দিন</SelectItem>
            <SelectItem value="6months">গত ৬ মাস</SelectItem>
            <SelectItem value="1year">গত ১ বছর</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700 overflow-hidden group hover:border-slate-600 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mt-2">{stat.value}</h3>
                    <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Status Summary */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">অর্ডার স্ট্যাটাস</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {orderStatusCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                >
                  <Icon className={`w-8 h-8 ${item.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-white">{item.count}</p>
                    <p className="text-sm text-slate-400">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sales Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">বিক্রি রিপোর্ট</CardTitle>
          <Link to="/admin/reports">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              বিস্তারিত দেখুন
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: number) => [`৳${value.toLocaleString()}`, "বিক্রি"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">সাম্প্রতিক অর্ডার</CardTitle>
          <Link to="/admin/orders">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              সব দেখুন
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">অর্ডার আইডি</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">গ্রাহক</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">মোট</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">স্ট্যাটাস</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">তারিখ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {order.order_id}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-white">{order.customer_name}</td>
                    <td className="py-3 px-4 text-white font-medium">৳{Number(order.total).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(order.order_status)}>
                        {getStatusLabel(order.order_status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {format(new Date(order.created_at), "dd MMM yyyy")}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      কোনো অর্ডার নেই
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
