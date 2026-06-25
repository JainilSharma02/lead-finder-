// Renders a message template with lead-specific placeholders.
// Supported placeholders: {{businessName}}, {{address}}, {{category}}

export const renderTemplate = (template, lead) => {
  if (!template) return '';
  return template
    .replace(/\{\{\s*businessName\s*\}\}/gi, lead?.businessName || 'there')
    .replace(/\{\{\s*address\s*\}\}/gi, lead?.address || '')
    .replace(/\{\{\s*category\s*\}\}/gi, lead?.category || '');
};

// Builds a WhatsApp click-to-chat URL. Strips non-digit characters from the
// phone number except a leading + is dropped too, per wa.me requirements
// (country code + number, digits only).
export const buildWhatsAppUrl = (phone, message) => {
  let cleaned = '';
  if (phone) {
    let clean = phone.replace(/\D/g, '');
    // Case: 09427706910 (11 digits starting with 0) -> 9427706910 -> 919427706910
    if (clean.startsWith('0')) {
      clean = clean.substring(1);
    }
    // Case: already has 91 prefix
    if (clean.length === 12 && clean.startsWith('91')) {
      cleaned = clean;
    } else if (clean.length === 10) {
      // Standard 10 digit number -> add 91
      cleaned = '91' + clean;
    } else {
      cleaned = clean; // Fallback
    }
  }
  
  const encodedMessage = encodeURIComponent(message || '');
  return `https://wa.me/${cleaned}?text=${encodedMessage}`;
};

export const isValidWhatsAppPhone = (phone) => {
  const digitsOnly = (phone || '').replace(/[^\d]/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};
