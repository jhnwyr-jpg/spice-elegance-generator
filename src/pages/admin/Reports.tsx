import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Download,
  Loader2,
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { format, subDays, subMonths } from "date-fns";

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

const Reports = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    newCustomers: 0,
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const getDateRange = () => {
    switch (dateRange) {
      case "7days":
        return { days: 7, startDate: subDays(new Date(), 7) };
      case "30days":
        return { days: 30, startDate: subDays(new Date(), 30) };
      case "6months":
        return { days: 180, startDate: subMonths(new Date(), 6) };
      case "1year":
        return { days: 365, startDate: subMonths(new Date(), 12) };
      default:
        return { days: 30, startDate: subDays(new Date(), 30) };
    }
  };

  const fetchReportData = async () => {
    setIsLoading(true);
    const { startDate, days } = getDateRange();
    const startDateStr = startDate.toISOString();

    // Fetch delivered orders for sales
    const { data: orders } = await supabase
      .from("orders")
      .select("total, items, created_at")
      .eq("order_status", "delivered")
      .gte("created_at", startDateStr)
      .order("created_at", { ascending: true });

    // Fetch all orders for count
    const { count: totalOrderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDateStr);

    // Fetch new customers
    const { count: newCustomerCount } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDateStr);

    // Calculate totals
    const totalSales = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
    const avgOrderValue = orders?.length ? totalSales / orders.length : 0;

    setSummary({
      totalSales,
      totalOrders: totalOrderCount || 0,
      avgOrderValue,
      newCustomers: newCustomerCount || 0,
    });

    // Group by date for chart
    const grouped: Record<string, { sales: number; orders: number }> = {};
    orders?.forEach((order) => {
      const date = format(new Date(order.created_at), "yyyy-MM-dd");
      if (!grouped[date]) {
        grouped[date] = { sales: 0, orders: 0 };
      }
      grouped[date].sales += Number(order.total);
      grouped[date].orders += 1;
    });

    // Fill in dates
    const chartData: SalesData[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      const displayDate = format(subDays(new Date(), i), "dd MMM");
      chartData.push({
        date: displayDate,
        sales: grouped[date]?.sales || 0,
        orders: grouped[date]?.orders || 0,
      });
    }
    setSalesData(chartData);

    // Calculate top products
    const productSales: Record<string, { quantity: number; revenue: number }> = {};
    orders?.forEach((order) => {
      const items = Array.isArray(order.items) ? order.items : [];
      items.forEach((item: any) => {
        if (item.name) {
          if (!productSales[item.name]) {
            productSales[item.name] = { quantity: 0, revenue: 0 };
          }
          productSales[item.name].quantity += item.qty || 0;
          productSales[item.name].revenue += (item.qty || 0) * (item.unitPrice || 0);
        }
      });
    });

    const topProductsList = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    setTopProducts(topProductsList);
    setIsLoading(false);
  };

  const exportCSV = () => {
    const headers = ["তারিখ", "বিক্রি (৳)", "অর্ডার সংখ্যা"];
    const rows = salesData.map((d) => [d.date, d.sales, d.orders]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `sales-report-${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("রিপোর্ট ডাউনলোড হয়েছে");
  };

  const summaryCards = [
    {
      title: "মোট বিক্রি",
      value: `৳${summary.totalSales.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "মোট অর্ডার",
      value: summary.totalOrders,
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "গড় অর্ডার মূল্য",
      value: `৳${Math.round(summary.avgOrderValue).toLocaleString()}`,
      icon: Package,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "নতুন গ্রাহক",
      value: summary.newCustomers,
      icon: Users,
      color: "from-orange-500 to-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">রিপোর্ট</h1>
          <p className="text-slate-400 mt-1">বিক্রি ও পারফরম্যান্স রিপোর্ট</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="7days">গত ৭ দিন</SelectItem>
              <SelectItem value="30days">গত ৩০ দিন</SelectItem>
              <SelectItem value="6months">গত ৬ মাস</SelectItem>
              <SelectItem value="1year">গত ১ বছর</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-700"
            onClick={exportCSV}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">{card.title}</p>
                        <h3 className="text-2xl font-bold text-white mt-2">{card.value}</h3>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sales Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                বিক্রি গ্রাফ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
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
                      formatter={(value: number, name: string) => [
                        name === "sales" ? `৳${value.toLocaleString()}` : value,
                        name === "sales" ? "বিক্রি" : "অর্ডার",
                      ]}
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

          {/* Orders Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                অর্ডার গ্রাফ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
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
                      formatter={(value: number) => [value, "অর্ডার"]}
                    />
                    <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                টপ প্রোডাক্ট
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-slate-400 text-center py-8">কোনো ডাটা নেই</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-400">#</TableHead>
                        <TableHead className="text-slate-400">প্রোডাক্ট</TableHead>
                        <TableHead className="text-slate-400 text-right">বিক্রি সংখ্যা</TableHead>
                        <TableHead className="text-slate-400 text-right">রেভিনিউ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.map((product, index) => (
                        <TableRow key={product.name} className="border-slate-700/50">
                          <TableCell className="text-slate-400">{index + 1}</TableCell>
                          <TableCell className="text-white font-medium">{product.name}</TableCell>
                          <TableCell className="text-right text-slate-300">
                            {product.quantity}
                          </TableCell>
                          <TableCell className="text-right text-primary font-medium">
                            ৳{product.revenue.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Reports;
