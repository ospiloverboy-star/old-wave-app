import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { ShoppingCart, ArrowLeft, Check, Package, Shield, Award, Heart, Share2 } from "lucide-react";
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
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading jersey details...</p>
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

      <div className="container mx-auto px-4 py-12">
        <Link to="/catalog">
          <Button variant="ghost" className="mb-8 group rounded-[var(--radius)] hover:bg-muted/50 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Catalog
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <div className="relative animate-fade-in-up">
            <div className="sticky top-24">
              <div className="relative rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-2xl)] bg-muted/30 backdrop-blur-sm">
                <img
                  src={jersey.image_url || '/placeholder.svg'}
                  alt={jersey.name}
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                  {jersey.is_available ? (
                    <Badge className="bg-success-light/90 text-success backdrop-blur-sm border border-success/20 shadow-[var(--shadow-md)]">
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="backdrop-blur-sm shadow-[var(--shadow-md)]">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <div className="absolute top-6 left-6 flex gap-2">
                  <button className="w-11 h-11 rounded-full glass-effect flex items-center justify-center hover:scale-110 transition-transform shadow-[var(--shadow-md)]">
                    <Heart className="h-5 w-5 text-foreground" />
                  </button>
                  <button className="w-11 h-11 rounded-full glass-effect flex items-center justify-center hover:scale-110 transition-transform shadow-[var(--shadow-md)]">
                    <Share2 className="h-5 w-5 text-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 animate-fade-in-up stagger-1">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="rounded-md">{jersey.league}</Badge>
                <Badge variant="outline" className="rounded-md">{jersey.season}</Badge>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3 tracking-tight">{jersey.name}</h1>
              <p className="text-2xl text-primary font-medium">{jersey.team}</p>
            </div>

            <div className="flex items-baseline gap-4">
              <p className="font-heading text-5xl font-bold">${jersey.price.toFixed(2)}</p>
            </div>

            {jersey.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed text-base">{jersey.description}</p>
              </div>
            )}

            <Card className="border-border/60 rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Select Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="h-12 rounded-[var(--radius)] border-border/60">
                      <SelectValue placeholder="Choose your size" />
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

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Quantity</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-[var(--radius)] border-border/60"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-[var(--radius)] border-border/60"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full h-14 text-base btn-primary-elegant rounded-[var(--radius-lg)] group"
                  onClick={handleAddToCart}
                  disabled={!jersey.is_available || adding || !selectedSize}
                >
                  {adding ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Add to Cart
                    </>
                  )}
                </Button>

                {!jersey.is_available && (
                  <p className="text-sm text-destructive text-center font-medium">
                    This item is currently out of stock
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="border-border/60 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground mt-1">On orders over $50</p>
                </CardContent>
              </Card>

              <Card className="border-border/60 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-secondary mx-auto mb-3" />
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground mt-1">100% protected</p>
                </CardContent>
              </Card>

              <Card className="border-border/60 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-accent-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Authentic</p>
                  <p className="text-xs text-muted-foreground mt-1">Verified quality</p>
                </CardContent>
              </Card>
            </div>

            <div className="glass-dark rounded-[var(--radius-lg)] p-6 space-y-3">
              <h4 className="font-semibold text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                Product Details
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2 ml-10">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Authentic team jersey</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Premium quality materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Official team colors and design</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Perfect for fans and collectors</span>
                </li>
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
