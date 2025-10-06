/**
 * WhatsApp Utility Functions for Jersey E-Commerce
 * Handles phone formatting, link generation, and business hours
 */

export interface BusinessHours {
  [key: string]: {
    open?: string;
    close?: string;
    closed?: boolean;
  };
}

/**
 * Format phone number for WhatsApp (international format)
 * Assumes Nigerian numbers if no country code provided
 */
export const formatWhatsAppNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.startsWith('234') ? cleaned : `234${cleaned}`;
};

/**
 * Generate WhatsApp deep link with pre-filled message
 * @param businessNumber - Business WhatsApp number
 * @param message - Pre-filled message text
 * @param isMobile - Whether user is on mobile device
 */
export const generateWhatsAppLink = (
  businessNumber: string,
  message: string,
  isMobile: boolean = false
): string => {
  const formattedNumber = formatWhatsAppNumber(businessNumber);
  const encodedMessage = encodeURIComponent(message);
  const baseUrl = isMobile ? 'whatsapp://send' : 'https://wa.me';
  return `${baseUrl}?phone=${formattedNumber}&text=${encodedMessage}`;
};

/**
 * Generate message for jersey inquiry
 */
export const generateJerseyInquiryMessage = (
  jerseyName: string,
  team: string,
  size: string,
  quantity: number,
  customerName?: string
): string => {
  const greeting = customerName ? `Hi, I'm ${customerName}. ` : 'Hi, ';
  return `${greeting}I'm interested in purchasing:\n\n*Jersey:* ${jerseyName}\n*Team:* ${team}\n*Size:* ${size}\n*Quantity:* ${quantity}\n\nCould you please provide more details about availability and total price including delivery?`;
};

/**
 * Generate message for bulk order inquiry
 */
export const generateBulkInquiryMessage = (itemCount: number): string => {
  return `Hi, I'd like to inquire about a bulk order of ${itemCount} jerseys. Could you provide pricing and delivery information?`;
};

/**
 * Generate message for custom jersey request
 */
export const generateCustomRequestMessage = (
  team: string,
  league: string,
  jerseyName: string,
  size: string,
  customerName?: string
): string => {
  const greeting = customerName ? `Hi, I'm ${customerName}. ` : 'Hi, ';
  return `${greeting}I'm looking for a custom jersey:\n\n*Team:* ${team}\n*League:* ${league}\n*Jersey:* ${jerseyName}\n*Size:* ${size}\n\nIs this available? If so, what's the price and delivery time?`;
};

/**
 * Check if business is currently open
 */
export const isBusinessOpen = (businessHours: BusinessHours): boolean => {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = dayNames[now.getDay()];
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayHours = businessHours[day];
  if (!todayHours || todayHours.closed) return false;
  
  return currentTime >= (todayHours.open || '') && currentTime <= (todayHours.close || '');
};

/**
 * Calculate estimated response time based on business hours
 */
export const getEstimatedResponseTime = (businessHours: BusinessHours): string => {
  const isOpen = isBusinessOpen(businessHours);
  return isOpen ? 'Within 30 minutes' : 'Within 24 hours';
};

/**
 * Detect if user is on mobile device
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
