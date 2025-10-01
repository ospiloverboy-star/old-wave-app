import { Link } from "react-router-dom";
import Logo from "./logo";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <Logo variant="light" size="md" />
              <div>
                <div className="font-heading font-bold text-base text-foreground">OLD WAVE</div>
                <div className="text-xs text-foreground/60">SINCE 2024</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-foreground/60" />
                <span className="text-foreground/80">info@oldwavejersey.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-foreground/60" />
                <span className="text-foreground/80">+118 801 125-4467</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="text-foreground/70 hover:text-secondary transition-colors">All Jerseys</Link></li>
              <li><Link to="/catalog" className="text-foreground/70 hover:text-secondary transition-colors">Featured</Link></li>
              <li><Link to="/catalog" className="text-foreground/70 hover:text-secondary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-foreground/70 hover:text-secondary transition-colors">Get in Touch</Link></li>
              <li><Link to="/request" className="text-foreground/70 hover:text-secondary transition-colors">Request Jersey</Link></li>
            </ul>
          </div>

          {/* Request Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Request</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/request" className="text-foreground/70 hover:text-secondary transition-colors">Custom Order</Link></li>
              <li><Link to="/request" className="text-foreground/70 hover:text-secondary transition-colors">Special Request</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex justify-between items-center">
          <p className="text-sm text-foreground/60">
            © 2024 Old Wave Jersey. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-foreground/60 hover:text-secondary transition-colors">
              <MapPin className="h-5 w-5" />
            </a>
            <a href="#" className="text-foreground/60 hover:text-secondary transition-colors">
              <Phone className="h-5 w-5" />
            </a>
            <a href="#" className="text-foreground/60 hover:text-secondary transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;