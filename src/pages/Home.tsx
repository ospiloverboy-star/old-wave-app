import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import JerseyCard from "@/components/JerseyCard";
import Navigation from "@/components/ui/navigation";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Truck } from "lucide-react";
import heroImage from "@/assets/hero-jerseys.jpg";

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Premium Sports
                <span className="block text-accent">Jerseys</span>
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Discover authentic jerseys from your favorite teams. From classic designs to the latest releases.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalog">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Shop Jerseys
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/request">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                    Request Jersey
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Premium Sports Jerseys"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8">
                <Star className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Authentic Jerseys</h3>
                <p className="text-muted-foreground">
                  100% authentic jerseys from official suppliers
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-8">
                <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
                <p className="text-muted-foreground">
                  Premium materials and superior craftsmanship
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-8">
                <Truck className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Quick and secure delivery to your doorstep
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Jerseys Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Jerseys</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of the most popular jerseys
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-6 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredJerseys.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredJerseys.map((jersey) => (
                  <JerseyCard key={jersey.id} {...jersey} />
                ))}
              </div>
              <div className="text-center">
                <Link to="/catalog">
                  <Button size="lg">
                    View All Jerseys
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-6">
                No featured jerseys available at the moment.
              </p>
              <Link to="/catalog">
                <Button>Browse All Jerseys</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Can't Find Your Jersey?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Request any jersey and we'll help you find it
          </p>
          <Link to="/request">
            <Button size="lg" variant="secondary">
              Request Custom Jersey
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;