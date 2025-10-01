import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/navigation";
import { Shield, Shirt as ShirtIcon, MessageSquare, Plus, Pencil, Trash2, Package } from "lucide-react";
import type { User, Session } from '@supabase/supabase-js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import JerseyForm from "@/components/admin/JerseyForm";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  is_admin: boolean;
}

interface Jersey {
  id: string;
  name: string;
  team: string;
  league: string;
  season: string;
  price: number;
  is_available: boolean;
  is_featured: boolean;
  stock_quantity: number;
}

interface JerseyRequest {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  jersey_name: string;
  team: string;
  league: string;
  size: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [requests, setRequests] = useState<JerseyRequest[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showJerseyDialog, setShowJerseyDialog] = useState(false);
  const [editingJersey, setEditingJersey] = useState<Jersey | null>(null);
  const [deletingJersey, setDeletingJersey] = useState<Jersey | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (profile?.is_admin) {
      fetchJerseys();
      fetchRequests();
      fetchOrders();
    }
  }, [profile]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setProfile(data);

      if (!data?.is_admin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
    } catch (error) {
      console.error('Error:', error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchJerseys = async () => {
    try {
      const { data, error } = await supabase
        .from('jerseys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jerseys:', error);
        return;
      }

      setJerseys(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('jersey_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        return;
      }

      setRequests(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleJerseyFormSuccess = () => {
    setShowJerseyDialog(false);
    setEditingJersey(null);
    fetchJerseys();
  };

  const handleEditJersey = (jersey: Jersey) => {
    setEditingJersey(jersey);
    setShowJerseyDialog(true);
  };

  const handleDeleteJersey = async () => {
    if (!deletingJersey) return;

    try {
      const { error } = await supabase
        .from('jerseys')
        .delete()
        .eq('id', deletingJersey.id);

      if (error) throw error;

      toast({
        title: "Jersey Deleted",
        description: "Jersey has been successfully deleted.",
      });

      fetchJerseys();
    } catch (error) {
      console.error('Error deleting jersey:', error);
      toast({
        title: "Error",
        description: "Failed to delete jersey.",
        variant: "destructive",
      });
    } finally {
      setDeletingJersey(null);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jersey_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating request:', error);
        toast({
          title: "Error",
          description: "Failed to update request status.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Request status updated successfully.",
      });

      fetchRequests();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'fulfilled': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-muted-foreground mb-6">
              Please log in to access the admin dashboard.
            </p>
            <Button onClick={() => navigate("/auth")}>
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have admin privileges to access this page.
            </p>
            <Button onClick={() => navigate("/")}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Manage jerseys and customer requests
          </p>
        </div>

        <Tabs defaultValue="jerseys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jerseys" className="flex items-center gap-2">
              <ShirtIcon className="h-4 w-4" />
              Jerseys ({jerseys.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders ({orders.length})
            </TabsTrigger>
          </TabsList>

          {/* Jerseys Tab */}
          <TabsContent value="jerseys" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Jersey Management</h2>
              <Button onClick={() => { setEditingJersey(null); setShowJerseyDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Jersey
              </Button>
            </div>

            {jerseys.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <ShirtIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No jerseys yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by adding your first jersey to the inventory.
                  </p>
                  <Button onClick={() => { setEditingJersey(null); setShowJerseyDialog(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Jersey
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {jerseys.map((jersey) => (
                  <Card key={jersey.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{jersey.name}</h3>
                            <Badge variant={jersey.is_available ? "default" : "secondary"}>
                              {jersey.is_available ? "Available" : "Out of Stock"}
                            </Badge>
                            {jersey.is_featured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-1">
                            {jersey.team} • {jersey.league} • {jersey.season}
                          </p>
                          <p className="font-semibold">${jersey.price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            Stock: {jersey.stock_quantity} units
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditJersey(jersey)}>
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setDeletingJersey(jersey)}>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <h2 className="text-2xl font-semibold">Jersey Requests</h2>

            {requests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No requests yet</h3>
                  <p className="text-muted-foreground">
                    Customer jersey requests will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {requests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{request.jersey_name}</CardTitle>
                          <CardDescription>
                            {request.team} {request.league && `• ${request.league}`} • Size: {request.size}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">{request.full_name}</p>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                          <p className="text-sm text-muted-foreground">{request.phone_number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Requested: {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => updateRequestStatus(request.id, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateRequestStatus(request.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateRequestStatus(request.id, 'fulfilled')}
                            >
                              Mark as Fulfilled
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-semibold">Order Management</h2>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Customer orders will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                          <CardDescription>
                            Customer: {order.profiles?.full_name || 'Unknown'}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-semibold">Total: ${order.total_amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          Ordered: {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showJerseyDialog} onOpenChange={setShowJerseyDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJersey ? 'Edit Jersey' : 'Add New Jersey'}</DialogTitle>
            <DialogDescription>
              {editingJersey ? 'Update jersey details' : 'Add a new jersey to your inventory'}
            </DialogDescription>
          </DialogHeader>
          <JerseyForm
            onSuccess={handleJerseyFormSuccess}
            onCancel={() => { setShowJerseyDialog(false); setEditingJersey(null); }}
            editingJersey={editingJersey}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingJersey} onOpenChange={() => setDeletingJersey(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the jersey "{deletingJersey?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJersey}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;