import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isMobileDevice, generateWhatsAppLink } from '@/lib/whatsapp';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const WhatsAppButton = ({
  phoneNumber,
  message,
  className = '',
  variant = 'default',
  size = 'default',
  fullWidth = false,
}: WhatsAppButtonProps) => {
  const handleClick = () => {
    const link = generateWhatsAppLink(phoneNumber, message, isMobileDevice());
    window.open(link, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <MessageCircle className="h-5 w-5" />
      Contact on WhatsApp
    </Button>
  );
};
