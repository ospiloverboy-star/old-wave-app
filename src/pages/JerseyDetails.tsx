import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { ShoppingCart, ArrowLeft, Loader2, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Jersey {
  id: string;
  name: string;
  team: string;
  league: string;
  season: string;
  price: number;
  description: string | null;
  image_url: string;
  sizes: string[];
  available_sizes: string[];
  is_available: boolean;
  stock_quantity: number;
}

const JerseyDetails = () => {
  const { id } = useParams();
  const [jersey, setJersey] = useState<Jersey | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    if (id) {
      fetchJersey(id);
    }
  }, [id]);

  const fetchJersey = async (jerseyId: string) => {
    try {
      const { data, error } = await supabase
        .from('jerseys')
        .select('*')
        .eq('id', jerseyId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/catalog');
        return;
      }

      setJersey(data);
      if (data.available_sizes && data.available_sizes.length > 0) {
        setSelectedSize(data.available_sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching jersey:', error);
      toast({
        title: "Error",
        description: "Failed to load jersey details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    try {
      const { data: existing, error: checkError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('jersey_id', jersey!.id)
        .eq('size', selectedSize)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            jersey_id: jersey!.id,
            quantity: quantity,
            size: selectedSize
          });

        if (error) throw error;
      }

      toast({
        title: "Added to Cart",
        description: `${jersey!.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading jersey...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!jersey) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <Link to="/catalog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="relative">
            <img
              src={jersey.image_url || '/placeholder.svg'}
              alt={jersey.name}
              className="w-full rounded-2xl shadow-lg"
            />
            {jersey.is_available ? (
              <Badge className="absolute top-4 right-4 bg-green-500">
                <Check className="mr-1 h-3 w-3" />
                Available
              </Badge>
            ) : (
              <Badge className="absolute top-4 right-4" variant="destructive">
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{jersey.league}</p>
              <h1 className="text-4xl font-bold mb-2">{jersey.name}</h1>
              <p className="text-2xl text-muted-foreground">{jersey.team}</p>
            </div>

            <div className="flex items-baseline gap-4">
              <p className="text-4xl font-bold">${jersey.price.toFixed(2)}</p>
              <Badge variant="outline">{jersey.season}</Badge>
            </div>

            {jersey.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{jersey.description}</p>
              </div>
            )}

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {jersey.available_sizes && jersey.available_sizes.length > 0 ? (
                        jersey.available_sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="unavailable" disabled>
                          No sizes available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!jersey.is_available || adding || !selectedSize}
                >
                  {adding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>

                {!jersey.is_available && (
                  <p className="text-sm text-destructive text-center">
                    This item is currently out of stock
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">Product Details</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Authentic team jersey</li>
                <li>• Premium quality materials</li>
                <li>• Official team colors and design</li>
                <li>• Perfect for fans and collectors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JerseyDetails;
