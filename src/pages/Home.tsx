import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import JerseyCard from "@/components/JerseyCard";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import Logo from "@/components/ui/logo";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Truck, Heart, Award, Users } from "lucide-react";
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
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white space-y-8">
              <div className="flex items-center space-x-4 mb-6">
                <Logo variant="light" size="lg" className="animate-fade-in" />
                <div className="h-12 w-px bg-white/30"></div>
                <span className="text-white/80 font-medium tracking-wider">EST. 2024</span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight">
                Premium Sports
                <span className="block text-accent bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                  Jerseys
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                Discover authentic jerseys from your favorite teams. From classic designs to the latest releases, we bring you the finest quality sportswear.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/catalog">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto font-medium px-8 py-4 text-lg hover:scale-105 transition-transform">
                    Shop Jerseys
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/request">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white hover:text-primary backdrop-blur-sm font-medium px-8 py-4 text-lg hover:scale-105 transition-all">
                    Request Jersey
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-8 pt-8 text-white/70">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">1000+ Happy Customers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-medium">100% Authentic</span>
                </div>
              </div>
            </div>
            
            <div className="relative lg:ml-8">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent rounded-3xl blur-3xl"></div>
              <img
                src={heroImage}
                alt="Premium Sports Jerseys Collection"
                className="relative rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 transform hover:scale-[1.02] transition-transform"
              />
              <div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-2 text-white">
                  <Heart className="h-5 w-5 text-red-400" />
                  <span className="font-medium">Loved by Athletes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Why Choose Old Wave Jersey?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Experience the difference with our premium services and authentic products</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="pt-10 pb-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Star className="relative h-14 w-14 text-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Authentic Jerseys</h3>
                <p className="text-muted-foreground leading-relaxed">
                  100% authentic jerseys from official suppliers with verified authenticity guarantees
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="pt-10 pb-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Shield className="relative h-14 w-14 text-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Quality Guarantee</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Premium materials and superior craftsmanship with lifetime quality assurance
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
              <CardContent className="pt-10 pb-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Truck className="relative h-14 w-14 text-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Fast Delivery</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Quick and secure delivery to your doorstep with real-time tracking
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
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
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
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <Logo size="lg" className="mx-auto mb-6 opacity-50" />
                <h3 className="font-heading text-xl font-semibold mb-4">No Featured Jerseys Yet</h3>
                <p className="text-muted-foreground text-lg mb-8">
                  We're currently updating our featured collection. Check out our full catalog for amazing jerseys!
                </p>
                <Link to="/catalog">
                  <Button size="lg" className="font-medium">
                    Browse All Jerseys
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
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

      <Footer />
    </div>
  );
};

export default Home;