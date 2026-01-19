import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Loader2,
  ImageIcon,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  stock_qty: number;
  sku: string | null;
  image_url: string | null;
  description: string | null;
  status: "active" | "inactive";
  created_at: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount_price: "",
    stock_qty: "",
    sku: "",
    image_url: "",
    description: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("প্রোডাক্ট লোড করতে সমস্যা হয়েছে");
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      stock_qty: parseInt(formData.stock_qty),
      sku: formData.sku || null,
      image_url: formData.image_url || null,
      description: formData.description || null,
      status: formData.status,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("প্রোডাক্ট আপডেট করতে সমস্যা হয়েছে");
      } else {
        toast.success("প্রোডাক্ট আপডেট হয়েছে");
        fetchProducts();
        closeDialog();
      }
    } else {
      const { error } = await supabase.from("products").insert([productData]);

      if (error) {
        toast.error("প্রোডাক্ট যোগ করতে সমস্যা হয়েছে");
      } else {
        toast.success("প্রোডাক্ট যোগ হয়েছে");
        fetchProducts();
        closeDialog();
      }
    }

    setIsSubmitting(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || "",
      stock_qty: product.stock_qty.toString(),
      sku: product.sku || "",
      image_url: product.image_url || "",
      description: product.description || "",
      status: product.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    const { error } = await supabase.from("products").delete().eq("id", deleteProduct.id);

    if (error) {
      toast.error("প্রোডাক্ট মুছতে সমস্যা হয়েছে");
    } else {
      toast.success("প্রোডাক্ট মুছে ফেলা হয়েছে");
      fetchProducts();
    }
    setDeleteProduct(null);
  };

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";
    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", product.id);

    if (error) {
      toast.error("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    } else {
      toast.success(`প্রোডাক্ট ${newStatus === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে`);
      fetchProducts();
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      discount_price: "",
      stock_qty: "",
      sku: "",
      image_url: "",
      description: "",
      status: "active",
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">প্রোডাক্ট</h1>
          <p className="text-slate-400 mt-1">সকল প্রোডাক্ট ম্যানেজ করুন</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-primary to-primary/80"
              onClick={() => closeDialog()}
            >
              <Plus className="w-4 h-4 mr-2" />
              নতুন প্রোডাক্ট
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "প্রোডাক্ট এডিট করুন" : "নতুন প্রোডাক্ট যোগ করুন"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>নাম *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>দাম (৳) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>ডিসকাউন্ট দাম (৳)</Label>
                  <Input
                    type="number"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>স্টক সংখ্যা *</Label>
                  <Input
                    type="number"
                    value={formData.stock_qty}
                    onChange={(e) => setFormData({ ...formData, stock_qty: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>ছবির URL</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>বিবরণ</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>সক্রিয় প্রোডাক্ট</Label>
                <Switch
                  checked={formData.status === "active"}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked ? "active" : "inactive" })
                  }
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  className="flex-1 border-slate-600"
                >
                  বাতিল
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingProduct ? (
                    "আপডেট করুন"
                  ) : (
                    "যোগ করুন"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="নাম বা SKU দিয়ে খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">কোনো প্রোডাক্ট নেই</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-slate-800/50 border-slate-700 overflow-hidden group hover:border-slate-600 transition-all"
            >
              <div className="aspect-square bg-slate-700/50 relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-slate-500" />
                  </div>
                )}
                <Badge
                  className={`absolute top-2 right-2 ${
                    product.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {product.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {product.discount_price ? (
                    <>
                      <span className="text-lg font-bold text-primary">
                        ৳{product.discount_price}
                      </span>
                      <span className="text-sm text-slate-500 line-through">
                        ৳{product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-primary">৳{product.price}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-slate-400">
                    স্টক: <span className={product.stock_qty < 10 ? "text-red-400" : "text-green-400"}>{product.stock_qty}</span>
                  </span>
                  {product.sku && (
                    <span className="text-xs text-slate-500">{product.sku}</span>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-600 hover:bg-slate-700"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    এডিট
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                    onClick={() => setDeleteProduct(product)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>প্রোডাক্ট মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              "{deleteProduct?.name}" মুছে ফেললে আর ফেরত আনা যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 hover:bg-slate-700">বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
