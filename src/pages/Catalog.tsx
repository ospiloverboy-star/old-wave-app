import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import JerseyCard from "@/components/JerseyCard";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { Search, Filter, X, Grid3x3, List, Sparkles, SlidersHorizontal } from "lucide-react";

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

const Catalog = () => {
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [filteredJerseys, setFilteredJerseys] = useState<Jersey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeague, setSelectedLeague] = useState<string>("all");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
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
        setFilteredJerseys(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJerseys();
  }, []);

  useEffect(() => {
    let filtered = [...jerseys];

    if (searchTerm) {
      filtered = filtered.filter(jersey =>
        jersey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jersey.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jersey.league.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLeague !== "all") {
      filtered = filtered.filter(jersey => jersey.league === selectedLeague);
    }

    if (selectedTeam !== "all") {
      filtered = filtered.filter(jersey => jersey.team === selectedTeam);
    }

    if (availabilityFilter === "available") {
      filtered = filtered.filter(jersey => jersey.is_available);
    } else if (availabilityFilter === "out-of-stock") {
      filtered = filtered.filter(jersey => !jersey.is_available);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredJerseys(filtered);
  }, [jerseys, searchTerm, selectedLeague, selectedTeam, availabilityFilter, sortBy]);

  const leagues = [...new Set(jerseys.map(jersey => jersey.league))];
  const teams = [...new Set(jerseys.map(jersey => jersey.team))];

  const hasActiveFilters = searchTerm || selectedLeague !== "all" || selectedTeam !== "all" || availabilityFilter !== "all";

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedLeague("all");
    setSelectedTeam("all");
    setAvailabilityFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light/30 backdrop-blur-sm border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Collection</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Jersey Catalog
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Browse our extensive collection of authentic sports jerseys from around the world
          </p>
        </div>

        <div className="glass-dark rounded-[var(--radius-xl)] p-8 mb-10 shadow-[var(--shadow-lg)] animate-fade-in-up stagger-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[var(--radius)] bg-primary/10 flex items-center justify-center">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-heading text-lg font-semibold">Filters & Search</h2>
          </div>

          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search jerseys, teams, leagues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 rounded-[var(--radius)] border-border/60 bg-background/50 focus:bg-background transition-colors"
              />
            </div>

            <Select value={selectedLeague} onValueChange={setSelectedLeague}>
              <SelectTrigger className="h-12 rounded-[var(--radius)] border-border/60 bg-background/50 hover:bg-background transition-colors">
                <SelectValue placeholder="All Leagues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leagues</SelectItem>
                {leagues.map(league => (
                  <SelectItem key={league} value={league}>{league}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="h-12 rounded-[var(--radius)] border-border/60 bg-background/50 hover:bg-background transition-colors">
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="h-12 rounded-[var(--radius)] border-border/60 bg-background/50 hover:bg-background transition-colors">
                <SelectValue placeholder="All Items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground font-medium">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </span>
              ) : (
                <>
                  <span className="text-foreground font-semibold">{filteredJerseys.length}</span> jersey{filteredJerseys.length !== 1 ? 's' : ''} found
                </>
              )}
            </p>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="rounded-full border-primary/30 hover:bg-primary/10 transition-all group"
              >
                <X className="h-3 w-3 mr-1 group-hover:rotate-90 transition-transform" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 h-10 rounded-[var(--radius)] border-border/60">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-[var(--radius)] border border-border/60">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-[calc(var(--radius)-4px)] transition-all ${
                  viewMode === "grid"
                    ? "bg-background shadow-[var(--shadow-xs)] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-[calc(var(--radius)-4px)] transition-all ${
                  viewMode === "list"
                    ? "bg-background shadow-[var(--shadow-xs)] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={`grid gap-8 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-border/60 rounded-[var(--radius-lg)]">
                <Skeleton className="aspect-[4/5] w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-7 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredJerseys.length > 0 ? (
          <div className={`grid gap-8 animate-fade-in ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filteredJerseys.map((jersey) => (
              <JerseyCard key={jersey.id} {...jersey} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-[var(--radius-lg)] bg-muted/50 flex items-center justify-center">
                <Filter className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-4">No jerseys found</h3>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Try adjusting your filters or search terms to find what you're looking for
              </p>
              <Button
                onClick={clearAllFilters}
                className="btn-primary-elegant px-8 py-6 rounded-[var(--radius-lg)]"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
