import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/navigation";
import { Loader2, ShirtIcon } from "lucide-react";
import { z } from "zod";

const requestSchema = z.object({
  fullName: z.string().trim().min(1, { message: "Full name is required" }).max(100, { message: "Full name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  phoneNumber: z.string().trim().min(1, { message: "Phone number is required" }).max(20, { message: "Phone number must be less than 20 characters" }),
  jerseyName: z.string().trim().min(1, { message: "Jersey name is required" }).max(200, { message: "Jersey name must be less than 200 characters" }),
  team: z.string().trim().min(1, { message: "Team name is required" }).max(100, { message: "Team name must be less than 100 characters" }),
  league: z.string().trim().max(100, { message: "League name must be less than 100 characters" }).optional(),
  size: z.string().trim().min(1, { message: "Size is required" }).max(10, { message: "Size must be less than 10 characters" }),
  additionalNotes: z.string().trim().max(1000, { message: "Additional notes must be less than 1000 characters" }).optional()
});

const JerseyRequest = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    jerseyName: "",
    team: "",
    league: "",
    size: "",
    additionalNotes: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, contactViaWhatsApp = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = requestSchema.parse(formData);

      const { data, error } = await supabase
        .from('jersey_requests')
        .insert([
          {
            team: validatedData.team,
            league: validatedData.league,
            jersey_name: validatedData.jerseyName,
            size: validatedData.size,
            full_name: validatedData.fullName,
            email: validatedData.email,
            phone_number: validatedData.phoneNumber,
            additional_notes: validatedData.additionalNotes,
            whatsapp_contacted: contactViaWhatsApp,
            last_contacted_at: contactViaWhatsApp ? new Date().toISOString() : null,
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Request Submitted!",
        description: contactViaWhatsApp 
          ? "Opening WhatsApp to complete your request..."
          : "We'll get back to you soon via email or phone.",
      });

      // If WhatsApp option selected, open WhatsApp
      if (contactViaWhatsApp && data) {
        const { generateWhatsAppLink, generateCustomRequestMessage, isMobileDevice } = await import('@/lib/whatsapp');
        const { data: settings } = await supabase
          .from('admin_settings')
          .select('whatsapp_business_number')
          .single();

        const businessNumber = settings?.whatsapp_business_number || '2348012345678';
        const message = generateCustomRequestMessage(
          validatedData.team,
          validatedData.league || '',
          validatedData.jerseyName,
          validatedData.size,
          validatedData.fullName
        );

        const link = generateWhatsAppLink(businessNumber, message, isMobileDevice());
        window.open(link, '_blank');
      }

      setFormData({
        team: "",
        league: "",
        jerseyName: "",
        size: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        additionalNotes: "",
      });

      setTimeout(() => {
        navigate('/catalog');
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <ShirtIcon className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Request a Jersey</h1>
            <p className="text-xl text-muted-foreground">
              Can't find the jersey you're looking for? Let us know and we'll try to source it for you.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Jersey Request Form</CardTitle>
              <CardDescription>
                Fill out the details below and we'll get back to you with availability and pricing.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        maxLength={100}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={20}
                    />
                  </div>
                </div>

                {/* Jersey Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Jersey Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jerseyName">Jersey Name/Description *</Label>
                    <Input
                      id="jerseyName"
                      name="jerseyName"
                      type="text"
                      placeholder="e.g., Home Jersey, Away Jersey, Third Kit"
                      value={formData.jerseyName}
                      onChange={handleInputChange}
                      required
                      maxLength={200}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="team">Team Name *</Label>
                      <Input
                        id="team"
                        name="team"
                        type="text"
                        placeholder="e.g., Manchester United, Lakers"
                        value={formData.team}
                        onChange={handleInputChange}
                        required
                        maxLength={100}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="league">League/Competition</Label>
                      <Input
                        id="league"
                        name="league"
                        type="text"
                        placeholder="e.g., Premier League, NBA"
                        value={formData.league}
                        onChange={handleInputChange}
                        maxLength={100}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="size">Size *</Label>
                    <Input
                      id="size"
                      name="size"
                      type="text"
                      placeholder="e.g., S, M, L, XL, XXL"
                      value={formData.size}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      placeholder="Any specific requirements, season, or additional details..."
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows={4}
                      maxLength={1000}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• We'll review your request within 24 hours</li>
                <li>• If available, we'll contact you with pricing and delivery details</li>
                <li>• Payment and purchase will be handled via WhatsApp</li>
                <li>• We'll keep you updated throughout the process</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JerseyRequest;