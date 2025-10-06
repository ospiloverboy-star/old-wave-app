import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateWhatsAppLink, isMobileDevice, getEstimatedResponseTime } from '@/lib/whatsapp';

export const WhatsAppFloatingButton = () => {
  const [businessNumber, setBusinessNumber] = useState('2348012345678');
  const [businessHours, setBusinessHours] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('admin_settings')
      .select('whatsapp_business_number, business_hours')
      .single();

    if (data) {
      setBusinessNumber(data.whatsapp_business_number);
      setBusinessHours(data.business_hours);
    }
  };

  const handleClick = () => {
    const message = "Hi! I'd like to inquire about your jerseys.";
    const link = generateWhatsAppLink(businessNumber, message, isMobileDevice());
    window.open(link, '_blank');
  };

  const estimatedTime = businessHours ? getEstimatedResponseTime(businessHours) : 'Within 24 hours';

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <div className="absolute bottom-16 right-0 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        <p className="text-sm font-medium">Need help? Chat with us!</p>
        <p className="text-xs text-muted-foreground">Response time: {estimatedTime}</p>
      </div>
      <button
        onClick={handleClick}
        className="bg-[#25D366] hover:bg-[#20BD5A] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none flex items-center justify-center"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};
