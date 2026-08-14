import {
  User,
  Product,
  Customer,
  Supplier,
  Sale,
  Purchase,
  Warranty,
  Account,
  JournalEntry,
  CMSBanner,
  CMSVideo,
  AuditLog
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Super Admin',
    username: 'admin',
    password: 'admin123',
    email: 'admin@watchstorenepal.com',
    role: 'Super Admin',
    mobile: '9851012345',
    active: true,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-karobar-1',
    sku: 'MMA-CLS-01',
    barcode: '890100000001',
    brand: 'Mema',
    collection: 'Classic Series',
    model: 'Mema',
    movement: 'Quartz',
    dialColor: 'White',
    strap: 'Leather',
    caseMaterial: 'Stainless Steel',
    caseSize: '40mm',
    gender: 'Unisex',
    stock: 0,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 1100,
    sellingPrice: 1100,
    supplierId: 'sup-gongabu',
    supplierName: 'Gongabu Watch Store',
    warrantyMonths: 12,
    status: 'Out of Stock',
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop'],
    description: 'Mema Classic Watch - Official Stock Item',
    isFeatured: true
  },
  {
    id: 'prod-karobar-2',
    sku: 'NVF-SPT-01',
    barcode: '890100000002',
    brand: 'Naviforce',
    collection: 'Military Sport',
    model: 'Naviforce',
    movement: 'Quartz',
    dialColor: 'Black',
    strap: 'Leather/Stainless Steel',
    caseMaterial: 'Alloy',
    caseSize: '44mm',
    gender: 'Men',
    stock: 0,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 1100,
    sellingPrice: 1100,
    supplierId: 'sup-gongabu',
    supplierName: 'Gongabu Watch Store',
    warrantyMonths: 12,
    status: 'Out of Stock',
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop'],
    description: 'Naviforce Sport Watch - Official Stock Item',
    isFeatured: true
  },
  {
    id: 'prod-karobar-3',
    sku: 'RDO-GLD-01',
    barcode: '890100000003',
    brand: 'Rado',
    collection: 'Jubile Golden',
    model: 'Rado Golden',
    movement: 'Quartz',
    dialColor: 'Gold',
    strap: 'Gold Plated Steel',
    caseMaterial: 'Gold Plated Stainless Steel',
    caseSize: '38mm',
    gender: 'Unisex',
    stock: 0,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 575,
    sellingPrice: 575,
    supplierId: 'sup-gongabu',
    supplierName: 'Gongabu Watch Store',
    warrantyMonths: 12,
    status: 'Out of Stock',
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop'],
    description: 'Rado Golden Edition - Official Stock Item',
    isFeatured: true
  },
  {
    id: 'prod-karobar-4',
    sku: 'RLX-GLD-01',
    barcode: '890100000004',
    brand: 'Rolex',
    collection: 'Datejust Gold',
    model: 'Rolex Golden',
    movement: 'Automatic',
    dialColor: 'Gold',
    strap: 'Gold Plated Jubilee',
    caseMaterial: 'Gold Plated Stainless Steel',
    caseSize: '40mm',
    gender: 'Men',
    stock: 0,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 850,
    sellingPrice: 850,
    supplierId: 'sup-gongabu',
    supplierName: 'Gongabu Watch Store',
    warrantyMonths: 12,
    status: 'Out of Stock',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'],
    description: 'Rolex Golden Timepiece - Official Stock Item',
    isFeatured: true
  },
  {
    id: 'prod-karobar-5',
    sku: 'RLX-SLV-01',
    barcode: '890100000005',
    brand: 'Rolex',
    collection: 'Oyster Silver',
    model: 'Rolex Silver',
    movement: 'Automatic',
    dialColor: 'Silver',
    strap: 'Stainless Steel',
    caseMaterial: 'Stainless Steel',
    caseSize: '40mm',
    gender: 'Unisex',
    stock: 0,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 850,
    sellingPrice: 850,
    supplierId: 'sup-gongabu',
    supplierName: 'Gongabu Watch Store',
    warrantyMonths: 12,
    status: 'Out of Stock',
    images: ['https://images.unsplash.com/photo-1547996160-012745cc583b?q=80&w=800&auto=format&fit=crop'],
    description: 'Rolex Silver Edition - Official Stock Item',
    isFeatured: true
  },
  {
    id: 'prod-karobar-6',
    sku: 'SIK-BLK-01',
    barcode: '890100000006',
    brand: 'Seiko',
    collection: 'Seiko 5 Black',
    model: 'Seiko Black',
    movement: 'Automatic',
    dialColor: 'Black',
    strap: 'Stainless Steel',
    caseMaterial: 'Stainless Steel',
    caseSize: '42mm',
    gender: 'Men',
    stock: 0,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 850,
    sellingPrice: 850,
    supplierId: 'sup-gongabu',
    supplierName: 'Gongabu Watch Store',
    warrantyMonths: 12,
    status: 'Out of Stock',
    images: ['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=800&auto=format&fit=crop'],
    description: 'Seiko Black Dial Watch - Official Stock Item',
    isFeatured: true
  },
  {
    id: 'prod-karobar-7',
    sku: 'SIK-SLV-01',
    barcode: '890100000007',
    brand: 'Seiko',
    collection: 'Seiko 5 Silver',
    model: 'Seiko Silver',
    movement: 'Automatic',
    dialColor: 'Silver',
    strap: 'Stainless Steel',
    caseMaterial: 'Stainless Steel',
    caseSize: '40mm',
    gender: 'Unisex',
    stock: 0,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 850,
    sellingPrice: 850,
    supplierId: 'sup-gongabu',
    supplierName: 'Gongabu Watch Store',
    warrantyMonths: 12,
    status: 'Out of Stock',
    images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop'],
    description: 'Seiko Silver Watch - Official Stock Item',
    isFeatured: true
  },
  {
    id: 'prod-karobar-8',
    sku: 'TSS-SLV-01',
    barcode: '890100000008',
    brand: 'Tissot',
    collection: 'PRX Silver',
    model: 'Tissot Silver',
    movement: 'Quartz',
    dialColor: 'Silver',
    strap: 'Stainless Steel',
    caseMaterial: 'Stainless Steel',
    caseSize: '40mm',
    gender: 'Unisex',
    stock: 0,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 850,
    sellingPrice: 850,
    supplierId: 'sup-gongabu',
    supplierName: 'Gongabu Watch Store',
    warrantyMonths: 12,
    status: 'Out of Stock',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop'],
    description: 'Tissot Silver Watch - Official Stock Item',
    isFeatured: true
  },
  {
    id: 'prod-karobar-9',
    sku: 'VKI-GLD-01',
    barcode: '890100000009',
    brand: 'Viokai',
    collection: 'Luxury Gold',
    model: 'Viokai Golden',
    movement: 'Quartz',
    dialColor: 'Gold',
    strap: 'Gold Plated Steel',
    caseMaterial: 'Gold Plated Stainless Steel',
    caseSize: '42mm',
    gender: 'Unisex',
    stock: 0,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 1100,
    sellingPrice: 1100,
    supplierId: 'sup-gongabu',
    supplierName: 'Gongabu Watch Store',
    warrantyMonths: 12,
    status: 'Out of Stock',
    images: ['https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=800&auto=format&fit=crop'],
    description: 'Viokai Golden Luxury Watch - Official Stock Item',
    isFeatured: true
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-gongabu',
    name: 'Gongabu Watch Store',
    contactPerson: 'Proprietor',
    email: 'gongabuwatchstore@gmail.com',
    mobile: '9851290086',
    address: 'Mahalaxmi-7, Lalitpur / Gongabu, Kathmandu',
    panNumber: '609823101',
    balanceDue: 0
  }
];

export const INITIAL_SALES: Sale[] = [];

export const INITIAL_PURCHASES: Purchase[] = [];

export const INITIAL_WARRANTIES: Warranty[] = [];

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc-1010', code: '1010', name: 'Cash in Hand (Showroom Till)', category: 'Assets', group: 'Current Assets', type: 'Cash', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-1020', code: '1020', name: 'Nabil Bank Corporate Account', category: 'Assets', group: 'Current Assets', type: 'Bank', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-1030', code: '1030', name: 'eSewa Merchant Wallet', category: 'Assets', group: 'Current Assets', type: 'Bank', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-1040', code: '1040', name: 'Khalti & ConnectIPS Gateway', category: 'Assets', group: 'Current Assets', type: 'Bank', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-1100', code: '1100', name: 'Accounts Receivable (Trade Debtors)', category: 'Assets', group: 'Current Assets', type: 'A/R', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-1200', code: '1200', name: 'Watch Inventory Asset (Merchandise)', category: 'Assets', group: 'Current Assets', type: 'Inventory', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-1300', code: '1300', name: 'Input VAT (Tax on Purchases)', category: 'Assets', group: 'Current Assets', type: 'VAT', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-1400', code: '1400', name: 'Advance & Showroom Security Deposits', category: 'Assets', group: 'Current Assets', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-1510', code: '1510', name: 'Showroom Fixtures & Display Vitrines', category: 'Assets', group: 'Fixed Assets', type: 'Fixed Asset', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-1520', code: '1520', name: 'Watchmaker Diagnostic & Repair Tools', category: 'Assets', group: 'Fixed Assets', type: 'Fixed Asset', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-1530', code: '1530', name: 'IT Equipment & POS Terminals', category: 'Assets', group: 'Fixed Assets', type: 'Fixed Asset', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-1590', code: '1590', name: 'Accumulated Depreciation (Contra-Asset)', category: 'Assets', group: 'Fixed Assets', type: 'Fixed Asset', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-2010', code: '2010', name: 'Accounts Payable (Trade Creditors)', category: 'Liabilities', group: 'Current Liabilities', type: 'A/P', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-2020', code: '2020', name: 'Output VAT Payable (13%)', category: 'Liabilities', group: 'Current Liabilities', type: 'VAT', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-2030', code: '2030', name: 'Customer Advances & Pre-Orders', category: 'Liabilities', group: 'Current Liabilities', type: 'A/P', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-2040', code: '2040', name: 'Accrued Expenses & Salaries Payable', category: 'Liabilities', group: 'Current Liabilities', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-3010', code: '3010', name: 'Owner Capital Equity', category: 'Equity', group: 'Capital & Equity', type: 'Equity', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-3020', code: '3020', name: 'Retained Earnings (Accumulated Profit)', category: 'Equity', group: 'Retained Earnings', type: 'Equity', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-3030', code: '3030', name: 'Owner Drawings', category: 'Equity', group: 'Capital & Equity', type: 'Equity', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-4010', code: '4010', name: 'Watch Sales Revenue', category: 'Revenue', group: 'Operating Revenue', type: 'Sales', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-4020', code: '4020', name: 'Watch Servicing & Repair Revenue', category: 'Revenue', group: 'Operating Revenue', type: 'Sales', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-4030', code: '4030', name: 'Other Operating Income', category: 'Revenue', group: 'Operating Revenue', type: 'Revenue', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-5010', code: '5010', name: 'Cost of Goods Sold (COGS)', category: 'Expenses', group: 'Direct Cost & COGS', type: 'Purchase', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-5020', code: '5020', name: 'Courier & Secure Logistics Expense', category: 'Expenses', group: 'Selling & Distribution Expenses', type: 'Courier Charges', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-5030', code: '5030', name: 'Sales Discounts Given', category: 'Expenses', group: 'Selling & Distribution Expenses', type: 'Discount', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-5040', code: '5040', name: 'Social Media & Influencer Marketing', category: 'Expenses', group: 'Selling & Distribution Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-5050', code: '5050', name: 'Showroom Rent & Boutique Lease', category: 'Expenses', group: 'Administrative & General Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-5060', code: '5060', name: 'Staff Salary, Allowances & Wages', category: 'Expenses', group: 'Administrative & General Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-5070', code: '5070', name: 'Showroom Utilities & Power', category: 'Expenses', group: 'Administrative & General Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false },
  { id: 'acc-5080', code: '5080', name: 'Depreciation Expense', category: 'Expenses', group: 'Administrative & General Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: true },
  { id: 'acc-5090', code: '5090', name: 'Bank Charges & Gateway Processing', category: 'Expenses', group: 'Financial & Bank Charges', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [];

export const INITIAL_CMS_BANNERS: CMSBanner[] = [];

export const INITIAL_CMS_VIDEOS: CMSVideo[] = [
  {
    id: 'vid-1',
    title: 'Masterpiece Mechanics Showcase',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-luxury-watch-41551-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop',
    slogan: 'Timeless Precision Crafted for the Connoisseur',
    active: true
  }
];

export const INITIAL_HOMEPAGE_CONTENT = {
  showroomNotice: 'Official Notice: We do NOT sell directly on website. All orders are fulfilled via TikTok, Instagram & Facebook Messenger.',
  brandTitle: 'कल्प',
  brandSubtitle: '',
  locationSubtitle: 'EXCLUSIVELY SERVING NEPAL',
  certifiedImporterBadge: 'CERTIFIED IMPORTER IN NEPAL',
  heroHeadlineLine1: 'Elegance Timed in Nepal.',
  heroHeadlineLine2: 'Timeless Precision Crafted for the Connoisseur',
  heroSubheadline: 'Discover original Swiss and luxury timepieces. Every purchase generates an automated, immutable digital QR warranty card linked directly to our official boutique records.',
  heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-luxury-watch-41551-large.mp4',
  exploreCollectionButtonText: 'EXPLORE COLLECTION',
  verifyWarrantyButtonText: 'VERIFY DIGITAL WARRANTY',
  socialChannelsText: 'Order directly via: TikTok • Instagram • Facebook Messenger',
  tiktokLink: 'https://tiktok.com',
  instagramLink: 'https://instagram.com',
  facebookLink: 'https://facebook.com',
  showroomEnabled: true,
  showroomTag: 'Flagship Boutique • Kathmandu, Nepal',
  showroomTitle: 'Durbar Marg Flagship Showroom',
  showroomDescription: 'Experience the finest timepieces in an exclusive, private environment. Our watch specialists are ready to guide your selection.',
  showroomAddress: '📍 Address: Opposite Annapurna Hotel, Durbar Marg, Kathmandu',
  showroomContact: '📞 Phone: +977 9823680863 | ✉️ Email: Kalpa9761@gmail.com | Hours: 10:00 AM - 7:30 PM (Sun - Fri)',
  showroomPhone: '9779823680863',
  showroomButtonText: 'Contact Showroom Representative',
  footerBrandDescription: 'Nepal’s leading luxury timepiece importer & digital warranty pioneer. Specializing in Rolex, Omega, Patek Philippe, Tissot, and Audemars Piguet with verified digital certificates.',
  footerCopyrightText: '© 2026 कल्प • Kalpa Luxury Timepiece Boutique. All Rights Reserved. Built with Automated ERP & Digital QR Warranty Engine.',
  footerLinks: [
    {
      id: 'link-privacy',
      label: 'Privacy Policy',
      active: true,
      content: 'Kalpa Luxury Timepieces values your privacy. All customer data, purchase records, and warranty registrations are securely stored and encrypted under strict data privacy protocols in our automated ERP engine. We never share customer information with third parties.'
    },
    {
      id: 'link-terms',
      label: 'Terms of Service',
      active: true,
      content: 'All timepieces sold by Kalpa Luxury come with verified digital QR certificates. Returns or exchanges must be presented with the original digital warranty QR code and untouched security seal within 7 days of purchase at our Durbar Marg showroom.'
    },
    {
      id: 'link-care-guide',
      label: 'Swiss Watch Care Guide',
      active: true,
      content: 'Maintain your luxury automatic and quartz movements: Avoid exposure to strong magnetic fields, ensure screw-down crowns are fully engaged before water exposure, and service mechanical movements every 3-5 years at our Durbar Marg showroom.'
    }
  ]
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

export const INITIAL_NOTIFICATION_TEMPLATES = [
  {
    id: 'tmpl-1',
    eventKey: 'SALE_WARRANTY_ISSUED',
    title: 'Digital Warranty Created - कल्प',
    body: 'Dear {{customerName}}, your purchase of {{watchModel}} comes with an official digital warranty {{warrantyId}}. Verify at: https://samaya-watch-store-nepal.ai.studio/warranty?code={{warrantyId}}',
    channels: ['SMS', 'WhatsApp']
  },
  {
    id: 'tmpl-2',
    eventKey: 'CLAIM_SUBMITTED',
    title: 'Warranty Claim Registered - कल्प',
    body: 'Dear {{customerName}}, your warranty claim #{{claimId}} for {{watchModel}} has been submitted successfully. Track status on our website.',
    channels: ['SMS', 'WhatsApp']
  },
  {
    id: 'tmpl-3',
    eventKey: 'CLAIM_APPROVED',
    title: 'Warranty Claim Approved - कल्प',
    body: 'Dear {{customerName}}, claim #{{claimId}} has been approved under warranty coverage and assigned for technical repair.',
    channels: ['SMS', 'WhatsApp']
  },
  {
    id: 'tmpl-4',
    eventKey: 'CLAIM_READY_COLLECTION',
    title: 'Watch Ready for Collection - कल्प',
    body: 'Dear {{customerName}}, your watch (Claim #{{claimId}}) has passed quality checks and is ready for pickup at Durbar Marg Flagship Store. OTP for collection: {{otpCode}}',
    channels: ['SMS', 'WhatsApp']
  },
  {
    id: 'tmpl-5',
    eventKey: 'WARRANTY_EXPIRING_SOON',
    title: 'Warranty Expiry Reminder - कल्प',
    body: 'Dear {{customerName}}, your warranty {{warrantyId}} for {{watchModel}} will expire in 30 days on {{expiryDate}}.',
    channels: ['SMS']
  }
];

export const INITIAL_WARRANTY_SETTINGS = {
  defaultWarrantyMonths: 12,
  expiryReminderDays: 30,
  gracePeriodDays: 14,
  warrantyPrefix: 'WRN-',
  claimPrefix: 'WC-',
  otpProtectionEnabled: true,
  termsNepali: [
    '१. यो डिजिटल वारेन्टी कार्ड कल्प (KALPA) बाट खरिद गरिएका आधिकारिक घडीहरूका लागि मात्र मान्य हुनेछ।',
    '२. वारेन्टीले केवल मेकानिकल तथा मुभमेन्ट त्रुटिहरू (Mechanical & Movement Defects) लाई मात्र समेट्छ।',
    '३. पानीको क्षति (Water damage) केवल आधिकारिक वाटर रेसिस्टेन्ट रेटिङभित्रको प्रयोगमा मात्र लागू हुनेछ।',
    '४. बाहिरी सिसा, फित्ता (Strap), वा केसमा ग्राहकको लापरवाही वा दुर्घटनाबाट भएको क्षति वारेन्टीभित्र पर्दैन।',
    '५. अनाधिकृत प्राविधिक वा पसलमा मर्मत गराइएमा वा छाप तोडिएमा वारेन्टी स्वतः रद्द (Void) हुनेछ।',
    '६. घडी संकलन (Collection) गर्दा मोबाइलमा प्राप्त OTP वा आधिकारिक डिजिटल हस्ताक्षर प्रस्तुत गर्नुपर्नेछ।'
  ]
};

