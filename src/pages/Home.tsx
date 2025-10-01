import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import JerseyCard from "@/components/JerseyCard";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { Link } from "react-router-dom";
import { MessageCircle, FileText, ShoppingBag } from "lucide-react";

interface Jersey {
  id: string;
  name: string;
  team: string;
  league: string;
  season: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
}

const Home = () => {
  const [featuredJerseys, setFeaturedJerseys] = useState<Jersey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJerseys = async () => {
      try {
        const { data, error } = await supabase
          .from('jerseys')
          .select('*')
          .eq('is_featured', true)
          .limit(6);

        if (error) {
          console.error('Error fetching featured jerseys:', error);
          return;
        }

        setFeaturedJerseys(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJerseys();
  }, []);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/your-number", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden min-h-[70vh] flex items-center pt-16">
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight text-foreground mb-6">
              Authentic Jerseys,
              <br />
              Old Wave Style
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed mb-10 max-w-2xl">
              Discover a wide selection of classic and modern jerseys from your favorite teams.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleWhatsAppClick}
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium px-8"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat on Whatsapp
              </Button>
              <Link to="/catalog">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-foreground/20 text-foreground hover:bg-foreground/10 font-medium px-8"
                >
                  Browse Jerseys
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-card-foreground">How It Works</h2>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Jersey Cards Column */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-[3/4] w-full" />
                      <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-32" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : featuredJerseys.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredJerseys.slice(0, 6).map((jersey) => (
                    <JerseyCard key={jersey.id} {...jersey} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg mb-8">
                    No featured jerseys available at the moment.
                  </p>
                  <Link to="/catalog">
                    <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                      Browse All Jerseys
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Side Cards Column */}
            <div className="space-y-6">
              {/* Feature Cards */}
              <Card className="bg-primary border-border text-center">
                <CardContent className="pt-8 pb-8">
                  <div className="mb-4">
                    <ShoppingBag className="h-10 w-10 text-foreground mx-auto" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2 text-foreground">Browse</h3>
                  <p className="text-sm text-foreground/60 mb-1">Ronoroa E. Ofa</p>
                  <p className="text-xs text-foreground/50">U dgirxexoebe er</p>
                </CardContent>
              </Card>

              <Card className="bg-primary border-border text-center">
                <CardContent className="pt-8 pb-8">
                  <div className="mb-4">
                    <FileText className="h-10 w-10 text-foreground mx-auto" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2 text-foreground">Request</h3>
                  <p className="text-sm text-foreground/60 mb-1">Ronied Premadw</p>
                  <p className="text-xs text-foreground/50">Eia oio odemstoda</p>
                </CardContent>
              </Card>

              <Card className="bg-primary border-border text-center">
                <CardContent className="pt-8 pb-8">
                  <div className="mb-4">
                    <MessageCircle className="h-10 w-10 text-foreground mx-auto" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2 text-foreground">Chat & Order</h3>
                  <p className="text-sm text-foreground/60 mb-1">Sebres dro Up</p>
                  <p className="text-xs text-foreground/50">Warsops texs</p>
                </CardContent>
              </Card>

              {/* WhatsApp CTA Card */}
              <Card className="bg-primary border-border text-center">
                <CardContent className="pt-8 pb-8">
                  <h3 className="font-heading text-2xl font-bold mb-4 text-foreground">Chat With Us on Whatsapp</h3>
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat on Whatsapp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
