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
    <Link to={`/jersey/${id}`}>
      <Card className="jersey-card group">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={image_url || "/placeholder.svg"}
              alt={`${team} ${season} ${name}`}
              className="jersey-image w-full"
            />
            {is_featured && (
              <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
            <div className="absolute top-2 right-2">
              {is_available ? (
                <div className="status-available">Available</div>
              ) : (
                <div className="status-out-of-stock">Out of Stock</div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4">
          <div className="w-full">
            <div className="text-team-name">{team}</div>
            <h3 className="text-jersey-title mb-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {league} • {season}
            </p>
            <div className="text-price">${price.toFixed(2)}</div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default JerseyCard;