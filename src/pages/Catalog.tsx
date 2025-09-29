import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import JerseyCard from "@/components/JerseyCard";
import Navigation from "@/components/ui/navigation";
import { Search, Filter } from "lucide-react";

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
    let filtered = jerseys;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(jersey =>
        jersey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jersey.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jersey.league.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // League filter
    if (selectedLeague !== "all") {
      filtered = filtered.filter(jersey => jersey.league === selectedLeague);
    }

    // Team filter
    if (selectedTeam !== "all") {
      filtered = filtered.filter(jersey => jersey.team === selectedTeam);
    }

    // Availability filter
    if (availabilityFilter === "available") {
      filtered = filtered.filter(jersey => jersey.is_available);
    } else if (availabilityFilter === "out-of-stock") {
      filtered = filtered.filter(jersey => !jersey.is_available);
    }

    setFilteredJerseys(filtered);
  }, [jerseys, searchTerm, selectedLeague, selectedTeam, availabilityFilter]);

  // Get unique leagues and teams for filters
  const leagues = [...new Set(jerseys.map(jersey => jersey.league))];
  const teams = [...new Set(jerseys.map(jersey => jersey.team))];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Jersey Catalog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive collection of authentic sports jerseys
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jerseys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* League Filter */}
            <Select value={selectedLeague} onValueChange={setSelectedLeague}>
              <SelectTrigger>
                <SelectValue placeholder="All Leagues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leagues</SelectItem>
                {leagues.map(league => (
                  <SelectItem key={league} value={league}>{league}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Team Filter */}
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Availability Filter */}
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
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

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {loading ? "Loading..." : `${filteredJerseys.length} jersey${filteredJerseys.length !== 1 ? 's' : ''} found`}
          </p>
          {(searchTerm || selectedLeague !== "all" || selectedTeam !== "all" || availabilityFilter !== "all") && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedLeague("all");
                setSelectedTeam("all");
                setAvailabilityFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Jersey Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : filteredJerseys.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJerseys.map((jersey) => (
              <JerseyCard key={jersey.id} {...jersey} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No jerseys found</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedLeague("all");
                setSelectedTeam("all");
                setAvailabilityFilter("all");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;