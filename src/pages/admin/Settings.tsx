import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Settings as SettingsIcon,
  Truck,
  Store,
  Users,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "staff";
  created_at: string;
}

interface DeliveryCharges {
  dhaka: number;
  outside_dhaka: number;
}

interface StoreInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState<DeliveryCharges>({
    dhaka: 50,
    outside_dhaka: 100,
  });
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "UR Media",
    phone: "",
    email: "",
    address: "",
  });
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff" as "owner" | "admin" | "staff",
  });

  useEffect(() => {
    fetchSettings();
    fetchAdminUsers();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);

    // Fetch delivery charges
    const { data: deliveryData } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "delivery_charges")
      .maybeSingle();

    if (deliveryData?.value) {
      setDeliveryCharges(deliveryData.value as unknown as DeliveryCharges);
    }

    // Fetch store info
    const { data: storeData } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "store_info")
      .maybeSingle();

    if (storeData?.value) {
      setStoreInfo(storeData.value as unknown as StoreInfo);
    }

    setIsLoading(false);
  };

  const fetchAdminUsers = async () => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setAdminUsers(data || []);
    }
  };

  const saveDeliveryCharges = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from("settings")
      .update({ value: deliveryCharges as unknown as Record<string, unknown> })
      .eq("key", "delivery_charges");

    if (error) {
      toast.error("সেটিংস সেভ করতে সমস্যা হয়েছে");
    } else {
      toast.success("ডেলিভারি চার্জ আপডেট হয়েছে");
    }
    setIsSaving(false);
  };

  const saveStoreInfo = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from("settings")
      .update({ value: storeInfo as unknown as Record<string, unknown> })
      .eq("key", "store_info");

    if (error) {
      toast.error("সেটিংস সেভ করতে সমস্যা হয়েছে");
    } else {
      toast.success("স্টোর তথ্য আপডেট হয়েছে");
    }
    setIsSaving(false);
  };

  const handleAddUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    setIsSaving(true);

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userForm.email,
      password: userForm.password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (authError) {
      toast.error(authError.message);
      setIsSaving(false);
      return;
    }

    // Add to admin_users table
    const { error } = await supabase.from("admin_users").insert([
      {
        name: userForm.name,
        email: userForm.email,
        password_hash: "***", // We don't store actual password
        role: userForm.role,
      },
    ]);

    if (error) {
      toast.error("অ্যাডমিন যোগ করতে সমস্যা হয়েছে");
    } else {
      toast.success("অ্যাডমিন যোগ হয়েছে");
      fetchAdminUsers();
      setShowAddUser(false);
      setUserForm({ name: "", email: "", password: "", role: "staff" });
    }
    setIsSaving(false);
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !userForm.name) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("admin_users")
      .update({ name: userForm.name, role: userForm.role })
      .eq("id", editingUser.id);

    if (error) {
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    } else {
      toast.success("আপডেট হয়েছে");
      fetchAdminUsers();
      setEditingUser(null);
    }
    setIsSaving(false);
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;

    const { error } = await supabase.from("admin_users").delete().eq("id", deleteUser.id);

    if (error) {
      toast.error("মুছতে সমস্যা হয়েছে");
    } else {
      toast.success("অ্যাডমিন মুছে ফেলা হয়েছে");
      fetchAdminUsers();
    }
    setDeleteUser(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-purple-500/20 text-purple-400">Owner</Badge>;
      case "admin":
        return <Badge className="bg-blue-500/20 text-blue-400">Admin</Badge>;
      case "staff":
        return <Badge className="bg-green-500/20 text-green-400">Staff</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">সেটিংস</h1>
        <p className="text-slate-400 mt-1">অ্যাপ্লিকেশন সেটিংস ম্যানেজ করুন</p>
      </div>

      <Tabs defaultValue="delivery" className="space-y-6">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="delivery" className="data-[state=active]:bg-primary">
            <Truck className="w-4 h-4 mr-2" />
            ডেলিভারি
          </TabsTrigger>
          <TabsTrigger value="store" className="data-[state=active]:bg-primary">
            <Store className="w-4 h-4 mr-2" />
            স্টোর
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary">
            <Users className="w-4 h-4 mr-2" />
            অ্যাডমিন
          </TabsTrigger>
        </TabsList>

        {/* Delivery Settings */}
        <TabsContent value="delivery">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Truck className="w-5 h-5" />
                ডেলিভারি চার্জ
              </CardTitle>
              <CardDescription className="text-slate-400">
                ডেলিভারি চার্জ কনফিগার করুন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">ঢাকার ভিতরে (৳)</Label>
                  <Input
                    type="number"
                    value={deliveryCharges.dhaka}
                    onChange={(e) =>
                      setDeliveryCharges({
                        ...deliveryCharges,
                        dhaka: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">ঢাকার বাইরে (৳)</Label>
                  <Input
                    type="number"
                    value={deliveryCharges.outside_dhaka}
                    onChange={(e) =>
                      setDeliveryCharges({
                        ...deliveryCharges,
                        outside_dhaka: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Button
                onClick={saveDeliveryCharges}
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                সেভ করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Store className="w-5 h-5" />
                স্টোর তথ্য
              </CardTitle>
              <CardDescription className="text-slate-400">
                আপনার স্টোরের বেসিক তথ্য
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">স্টোর নাম</Label>
                  <Input
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">ফোন</Label>
                  <Input
                    value={storeInfo.phone}
                    onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">ইমেইল</Label>
                  <Input
                    type="email"
                    value={storeInfo.email}
                    onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">ঠিকানা</Label>
                  <Input
                    value={storeInfo.address}
                    onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Button
                onClick={saveStoreInfo}
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                সেভ করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Users */}
        <TabsContent value="users">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  অ্যাডমিন ইউজার
                </CardTitle>
                <CardDescription className="text-slate-400">
                  অ্যাডমিন প্যানেল অ্যাক্সেস ম্যানেজ করুন
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-primary/80"
                onClick={() => {
                  setUserForm({ name: "", email: "", password: "", role: "staff" });
                  setShowAddUser(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                নতুন অ্যাডমিন
              </Button>
            </CardHeader>
            <CardContent>
              {adminUsers.length === 0 ? (
                <p className="text-slate-400 text-center py-8">কোনো অ্যাডমিন নেই</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-400">নাম</TableHead>
                        <TableHead className="text-slate-400">ইমেইল</TableHead>
                        <TableHead className="text-slate-400">রোল</TableHead>
                        <TableHead className="text-slate-400 text-right">অ্যাকশন</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map((user) => (
                        <TableRow key={user.id} className="border-slate-700/50">
                          <TableCell className="text-white font-medium">{user.name}</TableCell>
                          <TableCell className="text-slate-300">{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-400 hover:text-white"
                                onClick={() => {
                                  setEditingUser(user);
                                  setUserForm({
                                    name: user.name,
                                    email: user.email,
                                    password: "",
                                    role: user.role,
                                  });
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => setDeleteUser(user)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>নতুন অ্যাডমিন যোগ করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>নাম *</Label>
              <Input
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>ইমেইল *</Label>
              <Input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>পাসওয়ার্ড *</Label>
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>রোল</Label>
              <Select
                value={userForm.role}
                onValueChange={(value: "owner" | "admin" | "staff") =>
                  setUserForm({ ...userForm, role: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-slate-600"
                onClick={() => setShowAddUser(false)}
              >
                বাতিল
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                onClick={handleAddUser}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "যোগ করুন"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>অ্যাডমিন এডিট করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>নাম</Label>
              <Input
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>রোল</Label>
              <Select
                value={userForm.role}
                onValueChange={(value: "owner" | "admin" | "staff") =>
                  setUserForm({ ...userForm, role: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-slate-600"
                onClick={() => setEditingUser(null)}
              >
                বাতিল
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                onClick={handleUpdateUser}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "আপডেট করুন"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>অ্যাডমিন মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              "{deleteUser?.name}" মুছে ফেললে আর ফেরত আনা যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 hover:bg-slate-700">
              বাতিল
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-500 hover:bg-red-600">
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
