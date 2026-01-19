import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Loader2,
  Users,
  Eye,
  Phone,
  MapPin,
  ShoppingCart,
} from "lucide-react";
import { format } from "date-fns";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  total_orders: number;
  created_at: string;
}

interface CustomerOrder {
  id: string;
  order_id: string;
  total: number;
  order_status: string;
  created_at: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("গ্রাহক লোড করতে সমস্যা হয়েছে");
    } else {
      setCustomers(data || []);
    }
    setIsLoading(false);
  };

  const fetchCustomerOrders = async (customerId: string) => {
    setIsLoadingOrders(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_id, total, order_status, created_at")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("অর্ডার লোড করতে সমস্যা হয়েছে");
    } else {
      setCustomerOrders(data || []);
    }
    setIsLoadingOrders(false);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerOrders(customer.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";
      case "processing":
        return "text-blue-400";
      case "shipped":
        return "text-purple-400";
      case "delivered":
        return "text-green-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-slate-400";
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

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">কাস্টমার</h1>
        <p className="text-slate-400 mt-1">সকল গ্রাহকের তালিকা</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">কোনো গ্রাহক নেই</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">নাম</TableHead>
                  <TableHead className="text-slate-400">ফোন</TableHead>
                  <TableHead className="text-slate-400">ঠিকানা</TableHead>
                  <TableHead className="text-slate-400">মোট অর্ডার</TableHead>
                  <TableHead className="text-slate-400">যোগদান</TableHead>
                  <TableHead className="text-slate-400 text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="border-slate-700/50 hover:bg-slate-700/30"
                  >
                    <TableCell className="text-white font-medium">{customer.name}</TableCell>
                    <TableCell className="text-slate-300">{customer.phone}</TableCell>
                    <TableCell className="text-slate-300 max-w-[200px] truncate">
                      {customer.address || "-"}
                    </TableCell>
                    <TableCell>
                      <span className="text-primary font-medium">{customer.total_orders}</span>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {format(new Date(customer.created_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>গ্রাহক বিস্তারিত</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-slate-400">নাম</p>
                    <p className="text-white font-medium">{selectedCustomer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-slate-400">ফোন</p>
                    <p className="text-white font-medium">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl sm:col-span-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-slate-400">ঠিকানা</p>
                    <p className="text-white font-medium">
                      {selectedCustomer.address || "ঠিকানা নেই"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  অর্ডার হিস্ট্রি ({customerOrders.length})
                </h3>
                {isLoadingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : customerOrders.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">কোনো অর্ডার নেই</p>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl"
                      >
                        <div>
                          <p className="text-primary font-medium">{order.order_id}</p>
                          <p className="text-sm text-slate-400">
                            {format(new Date(order.created_at), "dd MMM yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">
                            ৳{Number(order.total).toLocaleString()}
                          </p>
                          <p className={`text-sm ${getStatusColor(order.order_status)}`}>
                            {getStatusLabel(order.order_status)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
