import { cn } from "@/lib/utils";
import logoLight from "@/assets/logo-light.jpeg";
import logoDark from "@/assets/logo-dark.jpeg";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ variant = "dark", size = "md", className }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10", 
    lg: "h-16"
  };

  const logoSrc = variant === "light" ? logoLight : logoDark;

  return (
    <img
      src={logoSrc}
      alt="Old Wave Jersey"
      className={cn(
        "object-contain transition-all duration-300 hover:scale-105",
        sizeClasses[size],
        className
      )}
    />
  );
};

export default Logo;