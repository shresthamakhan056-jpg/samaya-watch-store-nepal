import { Sale, Warranty, WarrantyClaim } from '../types';

// Default Official Store WhatsApp Number (Kalpa Watch Store Nepal)
export const OFFICIAL_STORE_WHATSAPP = '9779823680863';
export const OFFICIAL_STORE_EMAIL = 'Kalpa9761@gmail.com';
export const OFFICIAL_STORE_PHONE_DISPLAY = '+977 9823680863';

/**
 * Normalizes phone number into international WhatsApp format (e.g. 9851234567 -> 9779851234567)
 */
export const formatWhatsAppNumber = (phone: string): string => {
  if (!phone) return '';
  // Strip non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';

  // If standard 10-digit Nepal mobile starting with 98 or 97
  if (cleaned.length === 10 && (cleaned.startsWith('98') || cleaned.startsWith('97'))) {
    return `977${cleaned}`;
  }

  // If already starts with 977 and 13 digits
  if (cleaned.startsWith('977') && cleaned.length === 13) {
    return cleaned;
  }

  return cleaned;
};

/**
 * Generates direct wa.me URL for Web & Mobile App dispatch
 */
export const generateWhatsAppUrl = (phone: string, text: string): string => {
  const formattedPhone = formatWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(text);
  if (formattedPhone) {
    return `https://wa.me/${formattedPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
};

/**
 * Opens WhatsApp message in a new window/tab
 */
export const openWhatsApp = (phone: string, text: string): void => {
  const url = generateWhatsAppUrl(phone, text);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * 1. SALES ESTIMATE BILL WHATSAPP TEMPLATE
 * Formats a luxury, professional Sales Estimate Bill message for the customer's registered mobile number.
 */
export const formatSalesEstimateBillMessage = (sale: Sale, baseUrl?: string): string => {
  const siteUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-elkztr5oggtrem57ql7bfr-12678260771.asia-east1.run.app');
  const verifyLink = `${siteUrl}/warranty?code=${sale.warrantyId || sale.invoiceNumber}`;

  return `*कल्प • KALPA LUXURY TIMEPIECES* 
*OFFICIAL SALES ESTIMATE BILL*
━━━━━━━━━━━━━━━━━━━━
Dear *${sale.customerName}*,
Thank you for acquiring your luxury timepiece from कल्प (The Watch Store Nepal). Here is your official sales estimate receipt:

🧾 *Bill Number:* ${sale.invoiceNumber}
📅 *Date of Issue:* ${sale.orderDate}
⌚ *Timepiece:* ${sale.watchModel || (sale.productBrand + ' ' + sale.productModel)}
🔢 *Serial Number:* ${sale.serialNumber}
${sale.imei ? `🏷️ *IMEI/UID:* ${sale.imei}\n` : ''}
💰 *Subtotal:* NPR ${(sale.sellingPrice || 0).toLocaleString()}
${sale.discount ? `🏷️ *Special Discount:* - NPR ${(sale.discount || 0).toLocaleString()}\n` : ''}
✨ *Total Payable Amount:* NPR ${(sale.finalTotal || 0).toLocaleString()}
💳 *Payment Mode:* ${sale.paymentMethod}
📦 *Order Channel:* ${sale.orderSource}

━━━━━━━━━━━━━━━━━━━━
🛡️ *12-MONTH DIGITAL WARRANTY CERTIFICATE*
*Warranty ID:* ${sale.warrantyId || 'Auto-Registered'}
Your timepiece is officially backed by our 100% genuine movement & water-resistance warranty guarantee.

🔗 *View & Verify Digital Guarantee Card:*
${verifyLink}

📍 *Address:* Kathmandu, Nepal
📞 *Customer Care / WhatsApp:* +977-9823680863
✉️ *Official Email:* Kalpa9761@gmail.com

_Please retain this digital message for your service records._`;
};

/**
 * 2. WARRANTY VERIFICATION REQUEST WHATSAPP TEMPLATE
 * Customer or staff requesting urgent warranty lookup / authenticity verification
 */
export const formatWarrantyVerificationRequestMessage = (
  warrantyIdOrQuery: string,
  customerName?: string,
  customerPhone?: string
): string => {
  return `*कल्प • WARRANTY VERIFICATION REQUEST*
━━━━━━━━━━━━━━━━━━━━
Namaste कल्प Horology Team,

I would like to request verification of digital warranty & timepiece authenticity:

🔍 *Warranty ID / Mobile:* ${warrantyIdOrQuery}
${customerName ? `👤 *Customer Name:* ${customerName}\n` : ''}${customerPhone ? `📱 *Customer Mobile:* ${customerPhone}\n` : ''}
Please confirm the active warranty period, authenticity certificate, and eligible service coverage for this timepiece.

Thank you!`;
};

/**
 * 3. WARRANTY VERIFIED CERTIFICATE SHARE TEMPLATE
 * Sent to the customer after successful lookup or activation
 */
export const formatWarrantyCertificateMessage = (warranty: Warranty, baseUrl?: string): string => {
  const siteUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-elkztr5oggtrem57ql7bfr-12678260771.asia-east1.run.app');
  const verifyLink = `${siteUrl}/warranty?code=${warranty.id}`;

  return `*कल्प • DIGITAL WARRANTY CERTIFICATE*
━━━━━━━━━━━━━━━━━━━━
Dear *${warranty.customerName}*,

Here is your verified official *कल्प Digital Guarantee Certificate*:

🛡️ *Warranty ID:* ${warranty.id}
🧾 *Invoice Number:* ${warranty.invoiceNumber}
⌚ *Timepiece:* ${warranty.productBrand} ${warranty.productModel} (${warranty.dialColor})
🔢 *Serial Number:* ${warranty.serialNumber}
📅 *Valid From:* ${warranty.warrantyStart}
⏳ *Expiry Date:* ${warranty.extendedEnd || warranty.warrantyEnd}
🟢 *Status:* ${warranty.status.toUpperCase()}
🏢 *Authorized Store:* ${warranty.dealerName}

🔗 *Live Verification & Claim Portal:*
${verifyLink}

_Covered: Mechanical Movement, Time Accuracy, Water Resistance Seals._
_Store Care: +977-9823680863 | Email: Kalpa9761@gmail.com_`;
};

/**
 * 4. WARRANTY CLAIM STATUS NOTIFICATION
 */
export const formatWarrantyClaimStatusMessage = (claim: WarrantyClaim, warranty?: Warranty): string => {
  return `*कल्प • SERVICE CLAIM UPDATE*
━━━━━━━━━━━━━━━━━━━━
Dear *${claim.customerName}*,

Update regarding your service claim for timepiece *${claim.productBrand} ${claim.productModel}*:

🔧 *Claim ID:* ${claim.id}
🛡️ *Warranty ID:* ${claim.warrantyId}
⚙️ *Issue Category:* ${claim.category}
📊 *Current Status:* *${claim.status.toUpperCase()}*

${claim.inspection?.notes ? `📋 *Inspection Report:* ${claim.inspection.notes}\n` : ''}${claim.repair?.actionTaken ? `🛠️ *Technician Action:* ${claim.repair.actionTaken}\n` : ''}${claim.status === 'Ready for Collection' ? `🔐 *Ready for Pickup:* Please visit our store counter with your claim ID to collect your timepiece.\n` : ''}
Thank you for choosing कल्प Luxury Horology.
📞 Store Support: +977-9823680863 | ✉️ Kalpa9761@gmail.com`;
};

