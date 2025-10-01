import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
    <Link to={`/jersey/${id}`} className="block group">
      <Card className="jersey-card group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={image_url || "/placeholder.svg"}
              alt={`${team} ${season} ${name}`}
              className="jersey-image w-full transition-transform duration-300 group-hover:scale-105"
            />
            {is_featured && (
              <Badge className="absolute top-3 left-3 bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg animate-pulse">
                ⭐ Featured
              </Badge>
            )}
            <div className="absolute top-3 right-3">
              {is_available ? (
                <div className="status-available backdrop-blur-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                  Available
                </div>
              ) : (
                <div className="status-out-of-stock backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  Out of Stock
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </CardContent>
        
        <CardFooter className="p-5">
          <div className="w-full space-y-2">
            <div className="text-team-name font-medium">{team}</div>
            <h3 className="text-jersey-title font-heading font-semibold group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {league} • {season}
            </p>
            <div className="flex items-center justify-between pt-2">
              <div className="text-price font-heading font-bold">${price.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                View Details →
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default JerseyCard;