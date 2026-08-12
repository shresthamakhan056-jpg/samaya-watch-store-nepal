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
    stock: 1,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 1100,
    sellingPrice: 1100,
    supplierId: 'sup-karobar',
    supplierName: 'Watch Store Lalitpur',
    warrantyMonths: 12,
    status: 'In Stock',
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
    stock: 1,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 1100,
    sellingPrice: 1100,
    supplierId: 'sup-karobar',
    supplierName: 'Watch Store Lalitpur',
    warrantyMonths: 12,
    status: 'In Stock',
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
    stock: 2,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 575,
    sellingPrice: 575,
    supplierId: 'sup-karobar',
    supplierName: 'Watch Store Lalitpur',
    warrantyMonths: 12,
    status: 'In Stock',
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
    stock: 1,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 850,
    sellingPrice: 850,
    supplierId: 'sup-karobar',
    supplierName: 'Watch Store Lalitpur',
    warrantyMonths: 12,
    status: 'In Stock',
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
    stock: 1,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 850,
    sellingPrice: 850,
    supplierId: 'sup-karobar',
    supplierName: 'Watch Store Lalitpur',
    warrantyMonths: 12,
    status: 'In Stock',
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
    stock: 1,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 850,
    sellingPrice: 850,
    supplierId: 'sup-karobar',
    supplierName: 'Watch Store Lalitpur',
    warrantyMonths: 12,
    status: 'In Stock',
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
    stock: 1,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 850,
    sellingPrice: 850,
    supplierId: 'sup-karobar',
    supplierName: 'Watch Store Lalitpur',
    warrantyMonths: 12,
    status: 'In Stock',
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
    stock: 1,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 850,
    sellingPrice: 850,
    supplierId: 'sup-karobar',
    supplierName: 'Watch Store Lalitpur',
    warrantyMonths: 12,
    status: 'In Stock',
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
    stock: 2,
    reservedStock: 0,
    soldQuantity: 0,
    reorderLevel: 1,
    purchasePrice: 1100,
    sellingPrice: 1100,
    supplierId: 'sup-karobar',
    supplierName: 'Watch Store Lalitpur',
    warrantyMonths: 12,
    status: 'In Stock',
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

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'pur-gongabu-20260802',
    supplierId: 'sup-gongabu',
    supplierName: 'Gongabu Watch Store',
    invoiceNumber: 'GWS-2026-0802',
    purchaseDate: '2026-08-02',
    cost: 9800,
    quantity: 11,
    tax: 0,
    discount: 0,
    warehouse: 'Durbar Marg Flagship Warehouse',
    paymentMethod: 'Cash in Hand',
    paymentAccountCode: '1010',
    createdBy: 'Super Admin',
    items: [
      { productId: 'prod-karobar-1', productName: 'Mema Classic', quantity: 1, unitCost: 1100 },
      { productId: 'prod-karobar-2', productName: 'Naviforce Sport', quantity: 1, unitCost: 1100 },
      { productId: 'prod-karobar-3', productName: 'Rado Golden', quantity: 2, unitCost: 575 },
      { productId: 'prod-karobar-4', productName: 'Rolex Golden', quantity: 1, unitCost: 850 },
      { productId: 'prod-karobar-5', productName: 'Rolex Silver', quantity: 1, unitCost: 850 },
      { productId: 'prod-karobar-6', productName: 'Seiko Black', quantity: 1, unitCost: 850 },
      { productId: 'prod-karobar-7', productName: 'Seiko Silver', quantity: 1, unitCost: 850 },
      { productId: 'prod-karobar-8', productName: 'Tissot Silver', quantity: 1, unitCost: 850 },
      { productId: 'prod-karobar-9', productName: 'Viokai Golden', quantity: 2, unitCost: 1100 }
    ]
  }
];

export const INITIAL_WARRANTIES: Warranty[] = [];

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc-1010', code: '1010', name: 'Cash in Hand', category: 'Assets', type: 'Cash', balance: -9800 },
  { id: 'acc-1020', code: '1020', name: 'Nabil Bank Main Account', category: 'Assets', type: 'Bank', balance: 50000 },
  { id: 'acc-1030', code: '1030', name: 'eSewa Merchant Wallet', category: 'Assets', type: 'Bank', balance: 15000 },
  { id: 'acc-1100', code: '1100', name: 'Accounts Receivable', category: 'Assets', type: 'A/R', balance: 0 },
  { id: 'acc-1200', code: '1200', name: 'Watch Inventory Asset', category: 'Assets', type: 'Inventory', balance: 9800 },
  { id: 'acc-2010', code: '2010', name: 'Accounts Payable (Suppliers)', category: 'Liabilities', type: 'A/P', balance: 0 },
  { id: 'acc-2020', code: '2020', name: 'VAT Payable (13%)', category: 'Liabilities', type: 'VAT', balance: 0 },
  { id: 'acc-3010', code: '3010', name: 'Owner Capital Equity', category: 'Equity', type: 'Cash', balance: 55200 },
  { id: 'acc-4010', code: '4010', name: 'Watch Sales Revenue', category: 'Revenue', type: 'Sales', balance: 0 },
  { id: 'acc-5010', code: '5010', name: 'Cost of Goods Sold (COGS)', category: 'Expenses', type: 'Purchase', balance: 0 },
  { id: 'acc-5020', code: '5020', name: 'Courier & Logistics Expense', category: 'Expenses', type: 'Courier Charges', balance: 0 },
  { id: 'acc-5030', code: '5030', name: 'Sales Discounts Given', category: 'Expenses', type: 'Discount', balance: 0 },
  { id: 'acc-5040', code: '5040', name: 'Social Media Marketing Expense', category: 'Expenses', type: 'Expenses', balance: 0 },
  { id: 'acc-5050', code: '5050', name: 'Rent & Showroom Lease Expense', category: 'Expenses', type: 'Expenses', balance: 0 },
  { id: 'acc-5060', code: '5060', name: 'Staff Salary & Wages Expense', category: 'Expenses', type: 'Expenses', balance: 0 },
  { id: 'acc-5070', code: '5070', name: 'Office Operations & Utilities', category: 'Expenses', type: 'Expenses', balance: 0 }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je-pur-gongabu-20260802',
    entryNumber: 'JE-PUR-0802',
    date: '2026-08-02',
    description: 'Stock Procurement of All Watches from Gongabu Watch Store - Inv #GWS-2026-0802 (Cash Purchase)',
    reference: 'GWS-2026-0802',
    createdBy: 'Super Admin',
    lines: [
      { accountId: 'acc-1200', accountCode: '1200', accountName: 'Watch Inventory Asset', debit: 9800, credit: 0 },
      { accountId: 'acc-1010', accountCode: '1010', accountName: 'Cash in Hand', debit: 0, credit: 9800 }
    ]
  }
];

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
  showroomContact: '📞 Phone: +977 9851234567 | Opening Hours: 10:00 AM - 7:30 PM (Sun - Fri)',
  showroomPhone: '9779851234567',
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

