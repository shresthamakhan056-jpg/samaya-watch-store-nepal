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

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Makhan Shrestha',
    mobile: '9823680863',
    email: 'shresthamakhan056@gmail.com',
    address: 'New Road, Kathmandu',
    totalPurchases: 25000,
    createdAt: '2026-01-01'
  },
  {
    id: 'cust-2',
    name: 'Gongabu Watch Collector',
    mobile: '9851290086',
    email: 'collector@kalpachhen.com',
    address: 'Mahalaxmi-7, Lalitpur',
    totalPurchases: 18500,
    createdAt: '2026-01-15'
  }
];

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

export const INITIAL_WARRANTIES: Warranty[] = [
  {
    id: 'WRN-2026-0001',
    salesId: 'sale-init-1',
    customerId: 'cust-1',
    customerName: 'Makhan Shrestha',
    customerMobile: '9823680863',
    productId: 'prod-karobar-1',
    productBrand: 'Tissot',
    productModel: 'PRX Powermatic 80',
    dialColor: 'Blue',
    serialNumber: 'TIS-PRX-882910',
    qrCodeUrl: 'https://kalpachhen.com/warranty?code=WRN-2026-0001',
    warrantyStart: '2026-01-01',
    warrantyEnd: '2027-01-01',
    status: 'Active',
    activationStatus: 'Active',
    claimCount: 0,
    dealerName: 'कल्प',
    invoiceNumber: 'STW-2026-0001',
    remarks: 'Official Tissot Swiss Timepiece. Inspected & certified genuine prior to dispatch.',
    serviceHistory: []
  },
  {
    id: 'WRN-2026-0101',
    salesId: 'sale-init-2',
    customerId: 'cust-2',
    customerName: 'Gongabu Watch Collector',
    customerMobile: '9851290086',
    productId: 'prod-karobar-2',
    productBrand: 'Seiko',
    productModel: 'Prospex Diver Automatic',
    dialColor: 'Black',
    serialNumber: 'SEI-DIV-551920',
    qrCodeUrl: 'https://kalpachhen.com/warranty?code=WRN-2026-0101',
    warrantyStart: '2026-01-15',
    warrantyEnd: '2027-01-15',
    status: 'Active',
    activationStatus: 'Active',
    claimCount: 0,
    dealerName: 'कल्प',
    invoiceNumber: 'STW-2026-0101',
    remarks: 'Official Seiko Automatic Diver. Certified genuine with international coverage.',
    serviceHistory: []
  }
];

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc-1010', code: '1010', name: 'Cash in Hand (Showroom Till)', category: 'Assets', group: 'Current Assets', type: 'Cash', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-1030', code: '1030', name: 'eSewa Merchant Wallet', category: 'Assets', group: 'Current Assets', type: 'Bank', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-1040', code: '1040', name: 'Khalti & ConnectIPS Gateway', category: 'Assets', group: 'Current Assets', type: 'Bank', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-1050', code: '1050', name: 'eSewa Account-Daniel', category: 'Assets', group: 'Current Assets', type: 'Bank', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-1060', code: '1060', name: 'Dollar Account-Rimesh', category: 'Assets', group: 'Current Assets', type: 'Bank', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-1100', code: '1100', name: 'Accounts Receivable (Trade Debtors)', category: 'Assets', group: 'Current Assets', type: 'A/R', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-1200', code: '1200', name: 'Watch Inventory Asset (Merchandise)', category: 'Assets', group: 'Current Assets', type: 'Inventory', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-1300', code: '1300', name: 'Input VAT (Tax on Purchases)', category: 'Assets', group: 'Current Assets', type: 'VAT', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-1400', code: '1400', name: 'Advance & Showroom Security Deposits', category: 'Assets', group: 'Current Assets', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-1510', code: '1510', name: 'Showroom Fixtures & Display Vitrines', category: 'Assets', group: 'Fixed Assets', type: 'Fixed Asset', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-1520', code: '1520', name: 'Watchmaker Diagnostic & Repair Tools', category: 'Assets', group: 'Fixed Assets', type: 'Fixed Asset', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-1530', code: '1530', name: 'IT Equipment & POS Terminals', category: 'Assets', group: 'Fixed Assets', type: 'Fixed Asset', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-1590', code: '1590', name: 'Accumulated Depreciation (Contra-Asset)', category: 'Assets', group: 'Fixed Assets', type: 'Fixed Asset', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-1718', code: '1718', name: 'Domain Name Expenses', category: 'Expenses', group: 'Administrative & General Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-2010', code: '2010', name: 'Accounts Payable (Trade Creditors)', category: 'Liabilities', group: 'Current Liabilities', type: 'A/P', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-2020', code: '2020', name: 'Output VAT Payable (13%)', category: 'Liabilities', group: 'Current Liabilities', type: 'VAT', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-2030', code: '2030', name: 'Customer Advances & Pre-Orders', category: 'Liabilities', group: 'Current Liabilities', type: 'A/P', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-2040', code: '2040', name: 'Accrued Expenses & Salaries Payable', category: 'Liabilities', group: 'Current Liabilities', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-3010', code: '3010', name: 'Owner Capital Equity', category: 'Equity', group: 'Capital & Equity', type: 'Equity', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-3011', code: '3011', name: 'Makhan Shrestha-Partner', category: 'Equity', group: 'Capital & Equity', type: 'Equity', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-3012', code: '3012', name: 'Daniel Maharjan-Partner', category: 'Equity', group: 'Capital & Equity', type: 'Equity', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-3013', code: '3013', name: 'Rimesh Shrestha-Partner', category: 'Equity', group: 'Capital & Equity', type: 'Equity', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-3014', code: '3014', name: 'Sechan Pokharel-Partner', category: 'Equity', group: 'Capital & Equity', type: 'Equity', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-3020', code: '3020', name: 'Retained Earnings (Accumulated Profit)', category: 'Equity', group: 'Retained Earnings', type: 'Equity', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-3030', code: '3030', name: 'Owner Drawings', category: 'Equity', group: 'Capital & Equity', type: 'Equity', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-4010', code: '4010', name: 'Watch Sales Revenue', category: 'Revenue', group: 'Operating Revenue', type: 'Sales', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-4020', code: '4020', name: 'Watch Servicing & Repair Revenue', category: 'Revenue', group: 'Operating Revenue', type: 'Sales', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-4030', code: '4030', name: 'Other Operating Income', category: 'Revenue', group: 'Operating Revenue', type: 'Revenue', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-5010', code: '5010', name: 'Cost of Goods Sold (COGS)', category: 'Expenses', group: 'Direct Cost & COGS', type: 'Purchase', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-5020', code: '5020', name: 'Courier & Secure Logistics Expense', category: 'Expenses', group: 'Selling & Distribution Expenses', type: 'Courier Charges', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-5030', code: '5030', name: 'Sales Discounts Given', category: 'Expenses', group: 'Selling & Distribution Expenses', type: 'Discount', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-5040', code: '5040', name: 'Social Media & Influencer Marketing', category: 'Expenses', group: 'Selling & Distribution Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-5050', code: '5050', name: 'Showroom Rent & Store Lease', category: 'Expenses', group: 'Administrative & General Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-5060', code: '5060', name: 'Staff Salary, Allowances & Wages', category: 'Expenses', group: 'Administrative & General Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-5070', code: '5070', name: 'Showroom Utilities & Power', category: 'Expenses', group: 'Administrative & General Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' },
  { id: 'acc-5080', code: '5080', name: 'Depreciation Expense', category: 'Expenses', group: 'Administrative & General Expenses', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: true, status: 'Active' },
  { id: 'acc-5090', code: '5090', name: 'Bank Charges & Gateway Processing', category: 'Expenses', group: 'Financial & Bank Charges', type: 'Expenses', openingBalance: 0, balance: 0, isSystem: false, status: 'Active' }
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
  heroSubheadline: 'Discover original Swiss and luxury timepieces. Every purchase generates an automated, immutable digital QR warranty card linked directly to our official store records.',
  heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-luxury-watch-41551-large.mp4',
  exploreCollectionButtonText: 'EXPLORE COLLECTION',
  verifyWarrantyButtonText: 'VERIFY DIGITAL WARRANTY',
  socialChannelsText: 'Order directly via: TikTok • Instagram • Facebook Messenger',
  tiktokLink: 'https://www.tiktok.com/@kalpa9741?_r=1&_t=ZS-98taScxEoaG',
  instagramLink: 'https://www.instagram.com/kalpa_watch?igsh=Z3Vva2hrM2MzbGYz',
  facebookLink: 'https://www.facebook.com/profile.php?id=61593414713179',
  showroomEnabled: true,
  showroomTag: 'Flagship Showroom • Kathmandu, Nepal',
  showroomTitle: 'Kathmandu Flagship Showroom',
  showroomDescription: 'Experience the finest timepieces in an exclusive, private environment. Our watch specialists are ready to guide your selection.',
  showroomAddress: '📍 Address: Kathmandu, Nepal',
  showroomContact: '📞 Phone: +977 9823680863 | ✉️ Email: Kalpa9761@gmail.com | Hours: 10:00 AM - 7:30 PM (Sun - Fri)',
  showroomPhone: '9779823680863',
  showroomButtonText: 'Contact Showroom Representative',
  maintenanceMode: false,
  maintenanceNotice: 'We are currently performing scheduled maintenance to upgrade our system. For inquiries and purchases, please contact us on WhatsApp (+977 9823680863) or social channels.',
  footerBrandDescription: 'Nepal’s leading luxury timepiece importer & digital warranty pioneer. Specializing in Rolex, Omega, Patek Philippe, Tissot, and Audemars Piguet with verified digital certificates.',
  footerCopyrightText: '© 2026 कल्प • Kalpa Luxury Timepieces. All Rights Reserved. Built with Automated ERP & Digital QR Warranty Engine.',
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
      content: 'All timepieces sold by Kalpa Luxury come with verified digital QR certificates. Returns or exchanges must be presented with the original digital warranty QR code and untouched security seal within 7 days of purchase at our showroom.'
    }
  ]
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

export const INITIAL_NOTIFICATION_TEMPLATES = [
  {
    id: 'tmpl-1',
    eventKey: 'SALE_WARRANTY_ISSUED',
    title: 'Digital Warranty Created - कल्प',
    body: 'Dear {{customerName}}, your purchase of {{watchModel}} comes with an official digital warranty {{warrantyId}}. Verify at: https://kalpachhen.com/warranty?code={{warrantyId}}',
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

export const INITIAL_SUPPLY_ITEMS: any[] = [
  {
    id: 'sup-item-1',
    sku: 'PKG-BOX-LUX-01',
    name: 'Luxury Wooden Watch Presentation Box (Piano Lacquer)',
    category: 'Packaging Box',
    unit: 'pcs',
    currentStock: 45,
    reorderLevel: 15,
    estimatedUnitCost: 1450,
    supplierName: 'Kathmandu Packaging & Craft Industries',
    status: 'In Stock',
    description: 'High-gloss piano finish wooden box with golden hinge and velvet lining for luxury watches',
    createdAt: '2026-01-10'
  },
  {
    id: 'sup-item-2',
    sku: 'PKG-BOX-STD-02',
    name: 'Rigid Matte Black Watch Box with Gold Embossed Logo',
    category: 'Packaging Box',
    unit: 'pcs',
    currentStock: 80,
    reorderLevel: 25,
    estimatedUnitCost: 450,
    supplierName: 'Kathmandu Packaging & Craft Industries',
    status: 'In Stock',
    description: 'Sturdy rigid cardboard gift box with soft foam insert and gold foil branding',
    createdAt: '2026-01-10'
  },
  {
    id: 'sup-item-3',
    sku: 'PKG-BAG-GLD-03',
    name: 'Gold-Foil Matt Laminated Shopping Bag (Ribbon Handle)',
    category: 'Shopping & Gift Bag',
    unit: 'pcs',
    currentStock: 120,
    reorderLevel: 30,
    estimatedUnitCost: 120,
    supplierName: 'Apex Paper Crafts Nepal',
    status: 'In Stock',
    description: 'Heavy GSM luxury shopping bag with satin ribbon handle for customer walk-in deliveries',
    createdAt: '2026-01-15'
  },
  {
    id: 'sup-item-4',
    sku: 'PKG-CSH-VEL-04',
    name: 'Ultra-Soft Cream Velvet Watch Cushion / Pillow Insert',
    category: 'Cushion & Pillow Insert',
    unit: 'pcs',
    currentStock: 65,
    reorderLevel: 20,
    estimatedUnitCost: 85,
    supplierName: 'Kathmandu Packaging & Craft Industries',
    status: 'In Stock',
    description: 'Plush velvet pillow cushion to hold watch bracelets and straps securely inside boxes',
    createdAt: '2026-01-15'
  },
  {
    id: 'sup-item-5',
    sku: 'PKG-CLT-MIC-05',
    name: 'Anti-Static Microfiber Watch Polishing & Cleaning Cloth',
    category: 'Cleaning & Polishing Cloth',
    unit: 'pcs',
    currentStock: 150,
    reorderLevel: 40,
    estimatedUnitCost: 65,
    supplierName: 'Nepal Precision Tools & Optics',
    status: 'In Stock',
    description: 'Lint-free premium microfiber polishing cloth for sapphire crystal and stainless steel',
    createdAt: '2026-01-20'
  },
  {
    id: 'sup-item-6',
    sku: 'PKG-SLV-WRN-06',
    name: 'Embossed Leatherette Warranty Card & Booklet Sleeve',
    category: 'Warranty Card & Sleeve',
    unit: 'pcs',
    currentStock: 95,
    reorderLevel: 25,
    estimatedUnitCost: 110,
    supplierName: 'Apex Paper Crafts Nepal',
    status: 'In Stock',
    description: 'Tri-fold sleeve for digital warranty QR cards, user manuals, and invoice receipts',
    createdAt: '2026-01-20'
  },
  {
    id: 'sup-item-7',
    sku: 'SUP-TOOL-LNK-07',
    name: 'Watch Link Pin Remover & Sizing Adjustment Tool',
    category: 'Strap & Tool Accessories',
    unit: 'pcs',
    currentStock: 35,
    reorderLevel: 10,
    estimatedUnitCost: 350,
    supplierName: 'Nepal Precision Tools & Optics',
    status: 'In Stock',
    description: 'Handheld screw-down bracelet pin remover tool given with metal bracelet orders',
    createdAt: '2026-02-01'
  },
  {
    id: 'sup-item-8',
    sku: 'SUP-SEAL-HLG-08',
    name: 'Tamper-Evident Security Hologram Seal Stickers (Roll of 500)',
    category: 'Security Hologram Seal',
    unit: 'rolls',
    currentStock: 12,
    reorderLevel: 3,
    estimatedUnitCost: 2200,
    supplierName: 'Apex Paper Crafts Nepal',
    status: 'In Stock',
    description: 'Void-indicating hologram security seals applied over watch caseback and box seams',
    createdAt: '2026-02-01'
  },
  {
    id: 'sup-item-9',
    sku: 'SUP-DISP-ACR-09',
    name: 'Showroom Acrylic Watch Display Stand & C-Clip',
    category: 'Showroom & Display',
    unit: 'pcs',
    currentStock: 28,
    reorderLevel: 8,
    estimatedUnitCost: 480,
    supplierName: 'Nepal Precision Tools & Optics',
    status: 'In Stock',
    description: 'Crystal clear acrylic display stand for countertop and vitrine showcase merchandising',
    createdAt: '2026-02-05'
  },
  {
    id: 'sup-item-10',
    sku: 'PKG-SHIP-BOX-10',
    name: 'Reinforced Corrugated Courier Shipping Box (Air Bubble Lined)',
    category: 'Shipping & Courier Box',
    unit: 'pcs',
    currentStock: 110,
    reorderLevel: 35,
    estimatedUnitCost: 95,
    supplierName: 'Apex Paper Crafts Nepal',
    status: 'In Stock',
    description: 'Durable 3-ply corrugated box with inner bubble wrap for countrywide courier shipments',
    createdAt: '2026-02-05'
  }
];

export const INITIAL_SUPPLY_PURCHASES: any[] = [
  {
    id: 'spo-2026-001',
    purchaseType: 'Packaging & Boxes',
    supplierId: 'sup-pkg-1',
    supplierName: 'Kathmandu Packaging & Craft Industries',
    invoiceNumber: 'KPC-2026-8812',
    purchaseDate: '2026-07-20',
    cost: 72500,
    quantity: 50,
    paymentMethod: 'Cash in Hand',
    paymentAccountCode: '1010',
    accountType: '1210',
    notes: 'Bulk purchase of luxury wooden piano lacquer watch boxes for premium collections',
    createdBy: 'Super Admin',
    items: [
      {
        supplyItemId: 'sup-item-1',
        supplyItemName: 'Luxury Wooden Watch Presentation Box (Piano Lacquer)',
        category: 'Packaging Box',
        quantity: 50,
        unitCost: 1450,
        totalCost: 72500,
        unit: 'pcs'
      }
    ]
  },
  {
    id: 'spo-2026-002',
    purchaseType: 'General Store Supplies',
    supplierId: 'sup-pkg-2',
    supplierName: 'Apex Paper Crafts Nepal',
    invoiceNumber: 'APC-INV-4419',
    purchaseDate: '2026-07-28',
    cost: 32000,
    quantity: 318,
    paymentMethod: 'Cash in Hand',
    paymentAccountCode: '1010',
    accountType: '1210',
    notes: 'Shopping gift bags, microfiber cloths, and warranty card sleeves batch',
    createdBy: 'Super Admin',
    items: [
      {
        supplyItemId: 'sup-item-3',
        supplyItemName: 'Gold-Foil Matt Laminated Shopping Bag (Ribbon Handle)',
        category: 'Shopping & Gift Bag',
        quantity: 150,
        unitCost: 120,
        totalCost: 18000,
        unit: 'pcs'
      },
      {
        supplyItemId: 'sup-item-5',
        supplyItemName: 'Anti-Static Microfiber Watch Polishing & Cleaning Cloth',
        category: 'Cleaning & Polishing Cloth',
        quantity: 100,
        unitCost: 65,
        totalCost: 6500,
        unit: 'pcs'
      },
      {
        supplyItemId: 'sup-item-6',
        supplyItemName: 'Embossed Leatherette Warranty Card & Booklet Sleeve',
        category: 'Warranty Card & Sleeve',
        quantity: 68,
        unitCost: 110,
        totalCost: 7480,
        unit: 'pcs'
      }
    ]
  }
];

