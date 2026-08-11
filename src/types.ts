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

export interface Account {
  id: string;
  code: string; // e.g. "1010"
  name: string;
  category: AccountCategory;
  type: 'Cash' | 'Bank' | 'Inventory' | 'A/R' | 'A/P' | 'Sales' | 'Purchase' | 'VAT' | 'Expenses' | 'Courier Charges' | 'Discount';
  balance: number;
}

export interface JournalEntryLine {
  accountId: string;
  accountName: string;
  accountCode: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string; // e.g., "JE-2026-001"
  date: string;
  description: string;
  reference?: string; // e.g., Invoice # or Purchase #
  lines: JournalEntryLine[];
  createdBy: string;
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

