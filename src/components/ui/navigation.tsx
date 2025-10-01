import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "./button";
import Logo from "./logo";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/catalog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Request", path: "/request" },
    { name: "Login", path: "/auth" },
  ];

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/your-number", "_blank");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <Logo variant="light" size="md" className="transition-transform group-hover:scale-105" />
            <div className="hidden sm:block">
              <div className="font-heading font-bold text-base text-foreground leading-tight">OLD WAVE JERSEY</div>
              <div className="text-[10px] text-foreground/60 tracking-wider">AUTHENTIC</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-secondary ${
                  location.pathname === link.path
                    ? "text-secondary"
                    : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* WhatsApp Button */}
          <div className="hidden md:block">
            <Button 
              onClick={handleWhatsAppClick}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              size="sm"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat on Whatsapp
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium px-2 py-2 rounded transition-colors ${
                    location.pathname === link.path
                      ? "text-secondary bg-secondary/10"
                      : "text-foreground hover:text-secondary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button 
                onClick={handleWhatsAppClick}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full"
                size="sm"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat on Whatsapp
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;