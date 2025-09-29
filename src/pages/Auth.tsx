import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/navigation";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import type { User, Session } from '@supabase/supabase-js';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100, { message: "Password must be less than 100 characters" }),
  fullName: z.string().trim().min(1, { message: "Full name is required" }).max(100, { message: "Full name must be less than 100 characters" }).optional()
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Redirect authenticated users to home
          setTimeout(() => {
            navigate("/");
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const validatedData = authSchema.omit({ fullName: true }).parse({
          email: formData.email,
          password: formData.password
        });

        const { error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Please check your credentials.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login Failed",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        const validatedData = authSchema.parse({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName
        });

        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: validatedData.fullName
            }
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast({
              title: "Account Exists",
              description: "An account with this email already exists. Please try logging in.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Signup Failed",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
            <p className="text-muted-foreground mb-6">Redirecting you to the homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Sign in to your Old Wave Jersey account"
                  : "Join Old Wave Jersey to start shopping"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      maxLength={100}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    maxLength={255}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    maxLength={100}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;