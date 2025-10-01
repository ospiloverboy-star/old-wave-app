import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Sparkles, Eye } from "lucide-react";

interface JerseyCardProps {
  id: string;
  name: string;
  team: string;
  league: string;
  season: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_featured?: boolean;
}

const JerseyCard = ({
  id,
  name,
  team,
  league,
  season,
  price,
  image_url,
  is_available,
  is_featured = false
}: JerseyCardProps) => {
  return (
    <Link to={`/jersey-details/${id}`} className="block group">
      <Card className="jersey-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <CardContent className="p-0 relative overflow-hidden">
          <div className="relative overflow-hidden rounded-t-[var(--radius-lg)]">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

            <img
              src={image_url || "/placeholder.svg"}
              alt={`${team} ${season} ${name}`}
              className="jersey-image w-full"
            />

            {is_featured && (
              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-accent to-accent-dark/90 text-accent-foreground shadow-[var(--shadow-md)] border-0 animate-scale-in z-20">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}

            <div className="absolute top-4 right-4 z-20">
              {is_available ? (
                <div className="status-available">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                  Available
                </div>
              ) : (
                <div className="status-out-of-stock">
                  <div className="w-1.5 h-1.5 bg-destructive rounded-full"></div>
                  Out of Stock
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="glass-effect px-5 py-2.5 rounded-full flex items-center gap-2 shadow-[var(--shadow-lg)]">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">View Details</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 relative">
          <div className="w-full space-y-3">
            <div className="text-team-name text-sm tracking-wide uppercase">{team}</div>

            <h3 className="text-jersey-title min-h-[3.5rem] group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {name}
            </h3>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2.5 py-1 bg-muted/50 rounded-md">{league}</span>
              <span>•</span>
              <span>{season}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="text-price">${price.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Shop Now</span>
                <svg
                  className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default JerseyCard;
