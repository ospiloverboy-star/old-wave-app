import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

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
  name, 
  team, 
  price, 
  image_url, 
  is_available,
}: JerseyCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/your-number", "_blank");
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow bg-card">
      <div className="relative overflow-hidden bg-muted/10">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 animate-pulse">
            <div className="text-muted-foreground text-sm">Loading...</div>
          </div>
        )}
        <img
          src={image_url || '/placeholder.svg'}
          alt={`${name} - ${team}`}
          className={`w-full aspect-[3/4] object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
            setImageLoaded(true);
          }}
        />
        
        {!is_available && (
          <Badge 
            variant="destructive"
            className="absolute top-3 right-3 font-medium shadow-lg backdrop-blur-sm bg-muted text-card-foreground text-xs px-2 py-1"
          >
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="font-heading font-semibold text-base text-card-foreground line-clamp-1">{team}</h3>
        <p className="text-xl font-bold text-card-foreground">${price.toFixed(2)}</p>
        
        <Button 
          onClick={handleWhatsAppClick}
          className={`w-full ${
            is_available 
              ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
          size="sm"
          disabled={!is_available}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {is_available ? "Chat on Whatsapp" : "Glutton Whatsaps"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default JerseyCard;
