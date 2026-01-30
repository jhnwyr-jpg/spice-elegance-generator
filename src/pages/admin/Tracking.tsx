import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Loader2,
  Truck,
  Plus,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  phone: string;
  address: string;
  order_status: string;
  tracking_id: string | null;
  courier_name: string | null;
}

interface TrackingEvent {
  id: string;
  order_id: string;
  status: string;
  message: string | null;
  timestamp: string;
}

const Tracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ status: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_id, customer_name, phone, address, order_status, tracking_id, courier_name")
      .in("order_status", ["processing", "shipped"])
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("অর্ডার লোড করতে সমস্যা হয়েছে");
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  const fetchTrackingEvents = async (orderId: string) => {
    setIsLoadingEvents(true);
    const { data, error } = await supabase
      .from("tracking_events")
      .select("*")
      .eq("order_id", orderId)
      .order("timestamp", { ascending: false });

    if (error) {
      toast.error("ট্র্যাকিং ইভেন্ট লোড করতে সমস্যা হয়েছে");
    } else {
      setTrackingEvents(data || []);
    }
    setIsLoadingEvents(false);
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    fetchTrackingEvents(order.id);
    setShowAddEvent(false);
  };

  const handleAddEvent = async () => {
    if (!selectedOrder || !newEvent.status) return;

    setIsSubmitting(true);
    const { error } = await supabase.from("tracking_events").insert([
      {
        order_id: selectedOrder.id,
        status: newEvent.status as "picked" | "in_transit" | "delivered" | "returned",
        message: newEvent.message || null,
      },
    ]);

    if (error) {
      toast.error("ট্র্যাকিং ইভেন্ট যোগ করতে সমস্যা হয়েছে");
    } else {
      toast.success("ট্র্যাকিং ইভেন্ট যোগ হয়েছে");
      fetchTrackingEvents(selectedOrder.id);
      setNewEvent({ status: "", message: "" });
      setShowAddEvent(false);
    }
    setIsSubmitting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "picked":
        return <Package className="w-4 h-4" />;
      case "in_transit":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle2 className="w-4 h-4" />;
      case "returned":
        return <RotateCcw className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "picked":
        return "bg-blue-100 text-blue-700";
      case "in_transit":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "returned":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.order_id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.tracking_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">ট্র্যাকিং</h1>
        <p className="text-slate-500 mt-1">অর্ডার ট্র্যাকিং ম্যানেজ করুন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="অর্ডার আইডি বা ট্র্যাকিং আইডি..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-slate-200 text-slate-800"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="py-8 text-center">
                <Truck className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">কোনো অর্ডার নেই</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedOrder?.id === order.id ? "border-primary" : ""
                  }`}
                  onClick={() => handleSelectOrder(order)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primary font-medium">{order.order_id}</span>
                      <Badge
                        className={
                          order.order_status === "shipped"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                        }
                      >
                        {order.order_status === "shipped" ? "শিপড" : "প্রসেসিং"}
                      </Badge>
                    </div>
                    <p className="text-white text-sm">{order.customer_name}</p>
                    {order.tracking_id && (
                      <p className="text-xs text-slate-400 mt-1">
                        ট্র্যাকিং: {order.tracking_id}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Tracking Details */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">{selectedOrder.order_id}</CardTitle>
                  <p className="text-slate-400 text-sm mt-1">{selectedOrder.customer_name}</p>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-primary/80"
                  onClick={() => setShowAddEvent(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  ইভেন্ট যোগ করুন
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-slate-400">ঠিকানা</p>
                      <p className="text-white text-sm">{selectedOrder.address}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">কুরিয়ার</p>
                    <p className="text-white">
                      {selectedOrder.courier_name || "নির্ধারিত নয়"}
                    </p>
                    {selectedOrder.tracking_id && (
                      <p className="text-xs text-primary">{selectedOrder.tracking_id}</p>
                    )}
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div>
                  <h4 className="text-white font-medium mb-4">ট্র্যাকিং টাইমলাইন</h4>
                  {isLoadingEvents ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : trackingEvents.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">
                      কোনো ট্র্যাকিং ইভেন্ট নেই
                    </p>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-slate-700" />
                      <div className="space-y-6">
                        {trackingEvents.map((event, index) => (
                          <div key={event.id} className="flex gap-4 relative">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center z-10 ${getStatusColor(
                                event.status
                              )}`}
                            >
                              {getStatusIcon(event.status)}
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-medium">
                                  {getStatusLabel(event.status)}
                                </p>
                              </div>
                              {event.message && (
                                <p className="text-sm text-slate-400 mt-1">{event.message}</p>
                              )}
                              <p className="text-xs text-slate-500 mt-1">
                                {format(new Date(event.timestamp), "dd MMM yyyy, hh:mm a")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 h-full min-h-[400px] flex items-center justify-center">
              <CardContent className="text-center">
                <Truck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  ট্র্যাকিং দেখতে একটি অর্ডার সিলেক্ট করুন
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>নতুন ট্র্যাকিং ইভেন্ট</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>স্ট্যাটাস *</Label>
              <Select
                value={newEvent.status}
                onValueChange={(value) => setNewEvent({ ...newEvent, status: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="স্ট্যাটাস সিলেক্ট করুন" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="picked">পিক করা হয়েছে</SelectItem>
                  <SelectItem value="in_transit">পথে আছে</SelectItem>
                  <SelectItem value="delivered">ডেলিভারড</SelectItem>
                  <SelectItem value="returned">রিটার্ন</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>মেসেজ (ঐচ্ছিক)</Label>
              <Textarea
                value={newEvent.message}
                onChange={(e) => setNewEvent({ ...newEvent, message: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="অতিরিক্ত তথ্য..."
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-slate-600"
                onClick={() => setShowAddEvent(false)}
              >
                বাতিল
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                onClick={handleAddEvent}
                disabled={!newEvent.status || isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "যোগ করুন"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tracking;
