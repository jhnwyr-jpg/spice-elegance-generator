import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowLeft,
  Loader2,
  User,
  Phone,
  MapPin,
  Package,
  Truck,
  CreditCard,
  Calendar,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
}

interface Order {
  id: string;
  order_id: string;
  customer_id: string | null;
  customer_name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  delivery_charge: number;
  total: number;
  payment_method: "cod" | "online";
  payment_status: "unpaid" | "paid";
  order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  tracking_id: string | null;
  courier_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface TrackingEvent {
  id: string;
  status: string;
  message: string | null;
  timestamp: string;
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingId, setTrackingId] = useState("");
  const [courierName, setCourierName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder();
      fetchTrackingEvents();
    }
  }, [id]);

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      toast.error("অর্ডার পাওয়া যায়নি");
      navigate("/admin/orders");
      return;
    }

    // Parse items from JSONB
    const orderData = {
      ...data,
      items: Array.isArray(data.items) ? (data.items as unknown as OrderItem[]) : [],
    } as Order;

    setOrder(orderData);
    setTrackingId(data.tracking_id || "");
    setCourierName(data.courier_name || "");
    setIsLoading(false);
  };

  const fetchTrackingEvents = async () => {
    const { data } = await supabase
      .from("tracking_events")
      .select("*")
      .eq("order_id", id)
      .order("timestamp", { ascending: false });

    setTrackingEvents(data || []);
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    const updates: any = { order_status: newStatus };

    // If delivered and COD, set payment as paid
    if (newStatus === "delivered" && order.payment_status === "unpaid") {
      updates.payment_status = "paid";
    }

    const { error } = await supabase.from("orders").update(updates).eq("id", order.id);

    if (error) {
      toast.error("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    } else {
      toast.success("স্ট্যাটাস আপডেট হয়েছে");
      fetchOrder();
    }
  };

  const saveTrackingInfo = async () => {
    if (!order) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("orders")
      .update({ tracking_id: trackingId, courier_name: courierName })
      .eq("id", order.id);

    if (error) {
      toast.error("ট্র্যাকিং তথ্য সেভ করতে সমস্যা হয়েছে");
    } else {
      toast.success("ট্র্যাকিং তথ্য সেভ হয়েছে");
      fetchOrder();
    }
    setIsSaving(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
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

  const getTrackingStatusLabel = (status: string) => {
    switch (status) {
      case "picked":
        return "পিক করা হয়েছে";
      case "in_transit":
        return "পথে আছে";
      case "delivered":
        return "ডেলিভারড";
      case "returned":
        return "রিটার্ন";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/orders")}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">{order.order_id}</h1>
          <p className="text-slate-400 mt-1">
            {format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}
          </p>
        </div>
        <Badge className={`text-sm ${getStatusColor(order.order_status)}`}>
          {getStatusLabel(order.order_status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                গ্রাহক তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">নাম</p>
                    <p className="text-white">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">ফোন</p>
                    <p className="text-white">{order.phone}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-400">ঠিকানা</p>
                  <p className="text-white">{order.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                অর্ডার আইটেম
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0"
                  >
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-sm text-slate-400">
                        ৳{item.unitPrice} x {item.qty}
                      </p>
                    </div>
                    <p className="text-white font-medium">
                      ৳{(item.unitPrice * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>সাবটোটাল</span>
                  <span>৳{Number(order.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{Number(order.delivery_charge).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold pt-2">
                  <span>মোট</span>
                  <span>৳{Number(order.total).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Truck className="w-5 h-5" />
                ট্র্যাকিং তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">কুরিয়ার নাম</Label>
                  <Input
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="যেমন: Steadfast, Pathao..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">ট্র্যাকিং আইডি</Label>
                  <Input
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="ট্র্যাকিং আইডি লিখুন"
                  />
                </div>
              </div>
              <Button
                onClick={saveTrackingInfo}
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                সেভ করুন
              </Button>

              {/* Tracking Events */}
              {trackingEvents.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <h4 className="text-white font-medium mb-4">ট্র্যাকিং হিস্ট্রি</h4>
                  <div className="space-y-4">
                    {trackingEvents.map((event) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
                        <div>
                          <p className="text-white font-medium">
                            {getTrackingStatusLabel(event.status)}
                          </p>
                          {event.message && (
                            <p className="text-sm text-slate-400">{event.message}</p>
                          )}
                          <p className="text-xs text-slate-500">
                            {format(new Date(event.timestamp), "dd MMM yyyy, hh:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">অর্ডার স্ট্যাটাস</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={order.order_status}
                onValueChange={updateOrderStatus}
              >
                <SelectTrigger className={`w-full ${getStatusColor(order.order_status)}`}>
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
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                পেমেন্ট তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">পেমেন্ট মেথড</span>
                <span className="text-white">
                  {order.payment_method === "cod" ? "ক্যাশ অন ডেলিভারি" : "অনলাইন"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পেমেন্ট স্ট্যাটাস</span>
                <Badge
                  className={
                    order.payment_status === "paid"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-orange-500/20 text-orange-400"
                  }
                >
                  {order.payment_status === "paid" ? "পেইড" : "আনপেইড"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  নোট
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                সময়
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">তৈরি</span>
                <span className="text-white">
                  {format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">আপডেট</span>
                <span className="text-white">
                  {format(new Date(order.updated_at), "dd MMM yyyy, hh:mm a")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
