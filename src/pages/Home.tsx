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
import { ArrowRight, Star, Shield, Truck, Sparkles, Award, Users, TrendingUp } from "lucide-react";
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

      <section className="relative overflow-hidden min-h-[95vh] flex items-center">
        <div className="absolute inset-0 gradient-mesh opacity-60"></div>

        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary-light/30 backdrop-blur-sm border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Premium Jersey Collection 2024</span>
              </div>

              <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                Discover
                <span className="block mt-2 bg-gradient-to-r from-primary via-primary-dark to-secondary bg-clip-text text-transparent">
                  Authentic
                </span>
                <span className="block">Jerseys</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-xl">
                Curated collection of premium sports jerseys. From timeless classics to modern designs, every piece tells a story.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/catalog">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto btn-primary-elegant font-medium px-8 py-6 text-base rounded-[var(--radius-lg)] group"
                  >
                    Explore Collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/request">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto btn-ghost-elegant font-medium px-8 py-6 text-base rounded-[var(--radius-lg)]"
                  >
                    Request Jersey
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary-light border-2 border-background"></div>
                    <div className="w-8 h-8 rounded-full bg-accent border-2 border-background"></div>
                    <div className="w-8 h-8 rounded-full bg-secondary-light border-2 border-background"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">1000+ Happy Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative lg:ml-8 animate-fade-in-up stagger-2">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-[var(--radius-2xl)] blur-2xl opacity-60"></div>
              <div className="relative rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-2xl)] group">
                <img
                  src={heroImage}
                  alt="Premium Sports Jerseys Collection"
                  className="relative w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="absolute -bottom-6 -right-6 glass-effect rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-lg)] animate-scale-in stagger-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">100% Authentic</p>
                    <p className="text-xs text-muted-foreground">Verified Quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 mb-6">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Why Choose Us</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Premium Experience, Every Time
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're committed to providing authentic jerseys with exceptional service and attention to detail
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group relative overflow-hidden border-border/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-all duration-500 hover:-translate-y-2 rounded-[var(--radius-lg)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative pt-12 pb-10 px-8 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="relative w-20 h-20 mx-auto rounded-[var(--radius-lg)] bg-gradient-to-br from-primary-light/50 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Star className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  Authentic Jerseys
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  100% authentic jerseys from official suppliers with verified authenticity guarantees and certifications
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-border/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-all duration-500 hover:-translate-y-2 rounded-[var(--radius-lg)]">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative pt-12 pb-10 px-8 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-secondary/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="relative w-20 h-20 mx-auto rounded-[var(--radius-lg)] bg-gradient-to-br from-secondary-light/50 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Shield className="h-10 w-10 text-secondary" />
                  </div>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-4 group-hover:text-secondary transition-colors">
                  Quality Guarantee
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Premium materials and superior craftsmanship with lifetime quality assurance on every purchase
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-border/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-all duration-500 hover:-translate-y-2 rounded-[var(--radius-lg)]">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative pt-12 pb-10 px-8 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="relative w-20 h-20 mx-auto rounded-[var(--radius-lg)] bg-gradient-to-br from-accent/50 to-accent-dark/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Truck className="h-10 w-10 text-accent-foreground" />
                  </div>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-4 group-hover:text-accent-foreground transition-colors">
                  Fast Delivery
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Quick and secure delivery to your doorstep with real-time tracking and updates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Curated Selection</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Featured Jerseys
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Handpicked collection of the most popular and sought-after jerseys
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-border/60 rounded-[var(--radius-lg)]">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-7 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredJerseys.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {featuredJerseys.map((jersey) => (
                  <JerseyCard key={jersey.id} {...jersey} />
                ))}
              </div>
              <div className="text-center">
                <Link to="/catalog">
                  <Button
                    size="lg"
                    className="btn-primary-elegant px-8 py-6 rounded-[var(--radius-lg)] group"
                  >
                    View All Jerseys
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-[var(--radius-lg)] bg-muted flex items-center justify-center">
                  <Logo size="lg" className="opacity-50" />
                </div>
                <h3 className="font-heading text-2xl font-semibold mb-4">No Featured Jerseys Yet</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  We're currently updating our featured collection. Check out our full catalog for amazing jerseys!
                </p>
                <Link to="/catalog">
                  <Button size="lg" className="btn-primary-elegant px-8 rounded-[var(--radius-lg)] group">
                    Browse All Jerseys
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 mb-8">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Custom Requests</span>
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Can't Find Your Jersey?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Request any jersey and we'll help you find it. Our team specializes in sourcing rare and custom jerseys.
          </p>
          <Link to="/request">
            <Button
              size="lg"
              className="btn-primary-elegant px-10 py-6 text-base rounded-[var(--radius-lg)] group"
            >
              Request Custom Jersey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
