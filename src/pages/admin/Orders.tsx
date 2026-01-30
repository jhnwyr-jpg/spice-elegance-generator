import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Filter,
  Loader2,
  ShoppingCart,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  phone: string;
  total: number;
  payment_status: "unpaid" | "paid";
  order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  useEffect(() => {
    fetchOrders();

    // Subscribe to order changes
    const channel = supabase
      .channel("orders-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("অর্ডার লোড করতে সমস্যা হয়েছে");
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const updates: any = { order_status: newStatus };

    // If delivered and COD, set payment as paid
    const order = orders.find((o) => o.id === orderId);
    if (newStatus === "delivered" && order?.payment_status === "unpaid") {
      updates.payment_status = "paid";
    }

    const { error } = await supabase.from("orders").update(updates).eq("id", orderId);

    if (error) {
      toast.error("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    } else {
      toast.success("স্ট্যাটাস আপডেট হয়েছে");
      fetchOrders();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
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

  const getPaymentStatusColor = (status: string) => {
    return status === "paid"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-orange-100 text-orange-700 border-orange-200";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search);
    const matchesStatus = statusFilter === "all" || order.order_status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">অর্ডার</h1>
        <p className="text-slate-500 mt-1">সকল অর্ডার ম্যানেজ করুন</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="অর্ডার আইডি, নাম বা ফোন দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-slate-200 text-slate-800"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 text-slate-800">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="স্ট্যাটাস" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200">
            <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
            <SelectItem value="pending">পেন্ডিং</SelectItem>
            <SelectItem value="processing">প্রসেসিং</SelectItem>
            <SelectItem value="shipped">শিপড</SelectItem>
            <SelectItem value="delivered">ডেলিভারড</SelectItem>
            <SelectItem value="cancelled">বাতিল</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 text-slate-800">
            <SelectValue placeholder="পেমেন্ট" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200">
            <SelectItem value="all">সব পেমেন্ট</SelectItem>
            <SelectItem value="paid">পেইড</SelectItem>
            <SelectItem value="unpaid">আনপেইড</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <ShoppingCart className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">কোনো অর্ডার নেই</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">অর্ডার আইডি</TableHead>
                  <TableHead className="text-slate-400">গ্রাহক</TableHead>
                  <TableHead className="text-slate-400">ফোন</TableHead>
                  <TableHead className="text-slate-400">মোট</TableHead>
                  <TableHead className="text-slate-400">পেমেন্ট</TableHead>
                  <TableHead className="text-slate-400">স্ট্যাটাস</TableHead>
                  <TableHead className="text-slate-400">তারিখ</TableHead>
                  <TableHead className="text-slate-400 text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-slate-700/50 hover:bg-slate-700/30">
                    <TableCell>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {order.order_id}
                      </Link>
                    </TableCell>
                    <TableCell className="text-white">{order.customer_name}</TableCell>
                    <TableCell className="text-slate-300">{order.phone}</TableCell>
                    <TableCell className="text-white font-medium">
                      ৳{Number(order.total).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        {order.payment_status === "paid" ? "পেইড" : "আনপেইড"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.order_status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className={`w-32 h-8 text-xs border ${getStatusColor(order.order_status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="pending">পেন্ডিং</SelectItem>
                          <SelectItem value="processing">প্রসেসিং</SelectItem>
                          <SelectItem value="shipped">শিপড</SelectItem>
                          <SelectItem value="delivered">ডেলিভারড</SelectItem>
                          <SelectItem value="cancelled">বাতিল</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {format(new Date(order.created_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/orders/${order.id}`}>
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Orders;
