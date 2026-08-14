export type Role = 'Super Admin' | 'Warranty Manager' | 'Warranty Staff' | 'Technician' | 'Sales Staff' | 'Manager' | 'Sales' | 'Inventory' | 'Account' | 'Marketing';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  role: Role;
  mobile: string;
  avatarUrl?: string;
  active: boolean;
}

export type MovementType = 'Automatic' | 'Manual Wind' | 'Quartz' | 'Co-Axial Automatic' | 'Smartwatch';
export type Gender = 'Men' | 'Women' | 'Unisex';
export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Discontinued';

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  brand: string;
  collection: string;
  model: string;
  movement: MovementType;
  dialColor: string;
  strap: string;
  caseMaterial: string;
  caseSize: string; // e.g., "40mm"
  gender: Gender;
  stock: number;
  reservedStock: number;
  soldQuantity: number;
  reorderLevel: number;
  purchasePrice: number; // in NPR
  sellingPrice: number; // in NPR
  supplierId: string;
  supplierName: string;
  warrantyMonths: number;
  status: ProductStatus;
  images: string[];
  videos?: string[];
  description: string;
  isFeatured?: boolean;
  isLimitedEdition?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  email?: string;
  facebookName?: string;
  instagramId?: string;
  tikTokUsername?: string;
  totalPurchases: number; // sum in NPR
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: string;
  panNumber?: string;
  balanceDue: number;
}

export type OrderSource = 'TikTok' | 'Instagram' | 'Facebook' | 'Messenger' | 'WhatsApp' | 'Walk-in';
export type DeliveryStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Returned' | 'Cancelled';
export type PaymentMethod = 'Cash on Delivery' | 'eSewa' | 'Khalti' | 'Bank Transfer' | 'ConnectIPS' | 'Cash';

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  productId: string;
  productBrand: string;
  productModel: string;
  watchModel: string; // Full name e.g., "Rolex Submariner Date 41mm"
  serialNumber: string;
  imei?: string; // For smartwatches
  sellingPrice: number;
  discount: number;
  vatAmount: number; // 13% or customized
  finalTotal: number;
  paymentMethod: PaymentMethod;
  courierName?: string;
  trackingNumber?: string;
  deliveryStatus: DeliveryStatus;
  salesPerson: string;
  orderSource: OrderSource;
  orderDate: string;
  deliveryDate?: string;
  warrantyId: string;
  createdBy: string;
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  invoiceNumber: string;
  purchaseDate: string;
  cost: number;
  quantity: number;
  tax: number;
  discount: number;
  warehouse: string;
  paymentMethod?: string;
  paymentAccountCode?: string;
  createdBy: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitCost: number;
  }[];
}

export type WarrantyStatus = 'Active' | 'Expired' | 'Void';
export type WarrantyActivationStatus = 'Pending' | 'Active' | 'Void';

export interface WarrantyServiceHistory {
  id: string;
  warrantyId: string;
  serviceDate: string;
  issue: string;
  repairDetails: string;
  replacement?: string;
  technician: string;
  remarks?: string;
}

export interface Warranty {
  id: string; // e.g., "WRN-2026-8891"
  salesId: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  productId: string;
  productBrand: string;
  productModel: string;
  dialColor: string;
  serialNumber: string;
  qrCodeUrl: string;
  warrantyStart: string; // YYYY-MM-DD
  warrantyEnd: string;   // YYYY-MM-DD
  status: WarrantyStatus;
  activationStatus: WarrantyActivationStatus;
  activatedAt?: string;
  activatedBy?: string;
  remarks?: string;
  dealerName: string;
  invoiceNumber: string;
  claimCount: number;
  lastActivity?: string;
  extendedEnd?: string;
  extensionReason?: string;
  serviceHistory: WarrantyServiceHistory[];
}

export type ClaimStatus = 
  | 'Submitted' 
  | 'Under Inspection' 
  | 'Approved' 
  | 'Partially Approved' 
  | 'Rejected' 
  | 'In Repair' 
  | 'Quality Check' 
  | 'Ready for Collection' 
  | 'Collected / Closed';

export interface WarrantyClaim {
  id: string; // WC-YYYY-XXXX
  warrantyId: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  productId: string;
  productBrand: string;
  productModel: string;
  serialNumber: string;
  invoiceNumber: string;
  purchaseDate: string;
  category: string;
  problemDescription: string;
  photos?: string[];
  status: ClaimStatus;
  submittedAt: string;
  inspection?: {
    inspector: string;
    inspectionDate: string;
    coverage: 'Covered' | 'Partially Covered' | 'Not Covered' | 'Further Review';
    notes: string;
    payableAmount?: number;
    rejectionReason?: string;
  };
  approval?: {
    approvedBy: string;
    approvalDate: string;
    status: 'Approved' | 'Partially Approved' | 'Rejected';
    notes?: string;
  };
  repair?: {
    technician: string;
    assignedAt: string;
    diagnosis?: string;
    actionTaken?: string;
    partsUsed?: string;
    cost?: number;
    completionDate?: string;
    photos?: string[];
  };
  qualityCheck?: {
    checkedBy: string;
    checkDate: string;
    timekeepingPassed: boolean;
    waterResistancePassed: boolean;
    crownDatePassed: boolean;
    aestheticPassed: boolean;
    passed: boolean;
  };
  collection?: {
    collectedAt: string;
    staffName: string;
    otpVerified: boolean;
    signature?: string;
    customerConfirmation: boolean;
  };
}

export interface WarrantyReplacement {
  id: string;
  originalWarrantyId: string;
  originalProductId: string;
  replacementProductId: string;
  replacementProductName: string;
  replacementSerialNumber: string;
  reason: string;
  approvedBy: string;
  date: string;
}

export interface WarrantyExtension {
  id: string;
  warrantyId: string;
  originalExpiry: string;
  extensionMonths: number;
  newExpiry: string;
  reason: string;
  approvedBy: string;
  createdAt: string;
}

export interface VerificationLog {
  id: string;
  warrantyId: string;
  method: 'QR Scan' | 'Mobile Search' | 'Warranty ID' | 'OTP';
  timestamp: string;
  result: 'Success' | 'Not Found' | 'Expired';
  ipAddress?: string;
}

export interface NotificationTemplate {
  id: string;
  eventKey: string;
  title: string;
  body: string;
  channels: ('SMS' | 'Email' | 'WhatsApp')[];
}

export interface WarrantySettings {
  defaultWarrantyMonths: number;
  expiryReminderDays: number;
  gracePeriodDays: number;
  warrantyPrefix: string;
  claimPrefix: string;
  otpProtectionEnabled: boolean;
  termsNepali: string[];
}

export type AccountCategory = 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'Expenses';

export type AccountGroup =
  | 'Current Assets'
  | 'Fixed Assets'
  | 'Other Non-Current Assets'
  | 'Current Liabilities'
  | 'Long Term Liabilities'
  | 'Capital & Equity'
  | 'Retained Earnings'
  | 'Operating Revenue'
  | 'Direct Cost & COGS'
  | 'Selling & Distribution Expenses'
  | 'Administrative & General Expenses'
  | 'Financial & Bank Charges'
  | 'Taxation';

export interface Account {
  id: string;
  code: string; // e.g. "1010", "1020", "4010"
  name: string;
  category: AccountCategory;
  group?: AccountGroup;
  type: 'Cash' | 'Bank' | 'Inventory' | 'A/R' | 'A/P' | 'Sales' | 'Purchase' | 'VAT' | 'Expenses' | 'Courier Charges' | 'Discount' | 'Fixed Asset' | 'Equity' | string;
  openingBalance?: number;
  balance: number;
  description?: string;
  isSystem?: boolean;
}

export type VoucherType =
  | 'Sales Invoice'
  | 'Purchase Invoice'
  | 'Customer Receipt'
  | 'Supplier Payment'
  | 'Expense Voucher'
  | 'Journal Voucher'
  | 'Contra / Transfer'
  | 'Sales Return'
  | 'Purchase Return'
  | 'Credit Note'
  | 'Debit Note'
  | 'Fixed Asset Purchase'
  | 'Depreciation Entry'
  | 'Year-End Adjustment'
  | 'Opening Balance';

export interface FiscalYear {
  id: string;
  code?: string;
  name: string; // e.g. "FY 2082/83 (2026/27)"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isCurrent?: boolean;
  status: 'Active' | 'Closed' | 'Locked' | 'Open';
  lockDate?: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string; // e.g. "Durbar Marg Showroom", "Online & Social Sales", "Service & Repair"
  description?: string;
  manager?: string;
  active?: boolean;
  isActive?: boolean;
}

export interface FixedAsset {
  id: string;
  code: string; // e.g. "AST-001"
  name: string;
  category: 'Showroom Fixtures' | 'Watchmaking Tools' | 'IT Equipment' | 'Vehicles' | 'Security Equipment' | string;
  purchaseDate: string;
  cost: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciationRate: number; // in percentage e.g. 15%
  depreciationMethod?: string;
  accumulatedDepreciation: number;
  netBookValue: number;
  status?: 'Active' | 'Disposed' | 'Written Off';
  accountId: string; // e.g. "1510" Showroom Equipment
  depreciationAccountId: string; // e.g. "5080" Depreciation Expense
}

export interface JournalEntryLine {
  accountId: string;
  accountName: string;
  accountCode: string;
  debit: number;
  credit: number;
  particulars?: string;
  customerId?: string;
  customerName?: string;
  supplierId?: string;
  supplierName?: string;
  productId?: string;
  productName?: string;
  costCenterId?: string;
  costCenterName?: string;
}

export interface JournalEntry {
  id: string;
  entryNumber?: string; // e.g., "JE-2026-001", "JV-2026-001"
  date: string;
  voucherType?: VoucherType;
  sourceModule?: 'Sales' | 'Purchases' | 'Banking' | 'Expenses' | 'Manual JV' | 'Inventory' | 'Fixed Assets' | 'Year-End' | 'System' | 'Accounting' | string;
  description: string;
  reference?: string; // e.g., Invoice # or Purchase # or Cheque #
  costCenterId?: string;
  costCenterName?: string;
  lines: JournalEntryLine[];
  createdBy: string;
  isPosted?: boolean;
  isReversed?: boolean;
  reversalOfId?: string;
  reversalReason?: string;
  fiscalYearId?: string;
}

export interface AccountingSettings {
  fiscalYearName: string;
  defaultCostCenter: string;
  vatRate: number;
  vatEnabled: boolean;
  valuationMethod: 'Weighted Average' | 'FIFO';
  lockDate?: string;
  accountMappings: {
    salesRevenue: string; // "4010"
    accountsReceivable: string; // "1100"
    watchInventory: string; // "1200"
    cogs: string; // "5010"
    accountsPayable: string; // "2010"
    inputVat: string; // "1300"
    outputVat: string; // "2020"
    cashInHand: string; // "1010"
    bankAccount: string; // "1020"
    esewaWallet: string; // "1030"
    discountsGiven: string; // "5030"
    courierExpense: string; // "5020"
    retainedEarnings: string; // "3020"
  };
}

export interface CMSBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkToSocial?: string;
  priority: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
  type: 'Slider' | 'Banner' | 'Popup' | 'Featured';
}

export interface CMSVideo {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl?: string;
  slogan: string;
  active: boolean;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  active: boolean;
  content?: string;
  url?: string;
}

export interface CMSHomepageContent {
  showroomNotice: string;
  brandTitle: string;
  brandSubtitle: string;
  locationSubtitle: string;
  certifiedImporterBadge: string;
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroSubheadline: string;
  heroVideoUrl: string;
  exploreCollectionButtonText: string;
  verifyWarrantyButtonText: string;
  socialChannelsText: string;
  tiktokLink: string;
  instagramLink: string;
  facebookLink: string;
  // Dynamic Showroom Boutique Card Properties
  showroomEnabled?: boolean;
  showroomTag?: string;
  showroomTitle?: string;
  showroomDescription?: string;
  showroomAddress?: string;
  showroomContact?: string;
  showroomPhone?: string;
  showroomButtonText?: string;
  // Dynamic Footer Properties
  footerBrandDescription?: string;
  footerCopyrightText?: string;
  footerLinks?: FooterLinkItem[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
}

