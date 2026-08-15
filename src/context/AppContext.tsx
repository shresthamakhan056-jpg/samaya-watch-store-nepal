import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  User,
  Product,
  ProductStatus,
  Customer,
  Supplier,
  Sale,
  Purchase,
  Warranty,
  WarrantyServiceHistory,
  WarrantyClaim,
  WarrantyReplacement,
  WarrantyExtension,
  VerificationLog,
  NotificationTemplate,
  WarrantySettings,
  ClaimStatus,
  Account,
  JournalEntry,
  JournalEntryLine,
  FiscalYear,
  CostCenter,
  FixedAsset,
  VoucherType,
  CMSBanner,
  CMSVideo,
  CMSHomepageContent,
  AuditLog,
  Role,
  OrderSource,
  PaymentMethod,
  DeliveryStatus
} from '../types';
import {
  DEFAULT_CHART_OF_ACCOUNTS,
  DEFAULT_COST_CENTERS,
  DEFAULT_FISCAL_YEARS,
  DEFAULT_FIXED_ASSETS,
  AccountingEngine
} from '../utils/accountingEngine';
import { compressImageDataUrl } from '../utils/imageCompressor';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_SALES,
  INITIAL_PURCHASES,
  INITIAL_WARRANTIES,
  INITIAL_ACCOUNTS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_CMS_BANNERS,
  INITIAL_CMS_VIDEOS,
  INITIAL_HOMEPAGE_CONTENT,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATION_TEMPLATES,
  INITIAL_WARRANTY_SETTINGS
} from '../data/initialData';
import {
  auth,
  signInWithGoogle,
  logoutFirebase,
  onAuthStateChanged,
  db,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  deleteDoc,
  getDocs,
  FirebaseUser
} from '../lib/firebase';

interface AppContextType {
  // Current session & Staff Auth
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  updateUserRole: (id: string, role: Role) => void;
  toggleUserActive: (id: string) => void;
  resetUserPassword: (id: string, newPassword: string) => void;
  loginStaffUser: (username: string, password: string) => boolean;

  // Products & Inventory
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'soldQuantity' | 'reservedStock'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, quantityChange: number, reason: string) => void;
  restoreAllStocksExcept: (exceptSku?: string) => void;

  // Customers & Suppliers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalPurchases' | 'createdAt'>) => Customer;
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'balanceDue'>) => void;

  // Sales & Automation
  sales: Sale[];
  createSale: (saleData: {
    customerId?: string;
    customerName: string;
    customerMobile: string;
    customerAddress?: string;
    productId: string;
    serialNumber: string;
    imei?: string;
    sellingPrice: number;
    discount: number;
    paymentMethod: PaymentMethod;
    courierName?: string;
    trackingNumber?: string;
    orderSource: OrderSource;
  }) => { sale: Sale; warranty: Warranty } | { error: string };
  updateSale: (saleId: string, updatedFields: Partial<Sale>) => void;
  deleteSale: (saleId: string) => void;

  // Warranties & Automated Lifecycle
  warranties: Warranty[];
  getWarrantyByIdOrMobile: (query: string) => Warranty | undefined;
  getWarrantiesByMobile: (mobile: string) => Warranty[];
  updateWarrantyStatus: (warrantyId: string, status: 'Active' | 'Expired' | 'Void', remarks?: string) => void;
  activateWarranty: (warrantyId: string) => void;
  addServiceHistory: (warrantyId: string, service: Omit<WarrantyServiceHistory, 'id' | 'warrantyId'>) => void;

  // Automated Warranty Claims Pipeline
  claims: WarrantyClaim[];
  submitClaim: (claimData: Omit<WarrantyClaim, 'id' | 'status' | 'submittedAt'>) => WarrantyClaim | { error: string };
  updateClaimStatus: (claimId: string, status: ClaimStatus, details?: any) => void;
  addInspection: (claimId: string, inspection: NonNullable<WarrantyClaim['inspection']>) => void;
  approveClaim: (claimId: string, approval: NonNullable<WarrantyClaim['approval']>) => void;
  updateRepair: (claimId: string, repair: NonNullable<WarrantyClaim['repair']>) => void;
  passQualityCheck: (claimId: string, qc: NonNullable<WarrantyClaim['qualityCheck']>) => void;
  collectClaim: (claimId: string, collection: NonNullable<WarrantyClaim['collection']>) => void;

  // Replacements & Extensions
  replacements: WarrantyReplacement[];
  createReplacement: (rep: Omit<WarrantyReplacement, 'id' | 'date'>) => WarrantyReplacement;
  extensions: WarrantyExtension[];
  extendWarranty: (ext: Omit<WarrantyExtension, 'id' | 'createdAt'>) => WarrantyExtension;

  // Verification Audit Logs & Configuration
  verificationLogs: VerificationLog[];
  logVerification: (warrantyId: string, method: VerificationLog['method'], result: VerificationLog['result']) => void;
  notificationTemplates: NotificationTemplate[];
  updateNotificationTemplates: (templates: NotificationTemplate[]) => void;
  warrantySettings: WarrantySettings;
  updateWarrantySettings: (settings: Partial<WarrantySettings>) => void;

  // Purchases
  purchases: Purchase[];
  createPurchase: (purchaseData: {
    supplierId: string;
    invoiceNumber: string;
    purchaseDate: string;
    cost: number;
    quantity: number;
    paymentMethod?: string;
    paymentAccountCode?: string;
    items: { productId: string; productName: string; quantity: number; unitCost: number }[];
  }) => void;
  deletePurchase: (id: string) => void;

  // Accounting & Double-Entry Engine
  accounts: Account[];
  addAccount: (accountData: Omit<Account, 'id' | 'balance'> & { initialBalance?: number }) => Account;
  updateAccount: (id: string, updatedData: Partial<Account>) => Account | { error: string };
  deleteAccount: (id: string, force?: boolean) => { success: boolean; error?: string };
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'entryNumber'>) => void;
  postVoucher: (voucher: Omit<JournalEntry, 'id' | 'entryNumber'> & { entryNumber?: string }) => { entry?: JournalEntry; error?: string };
  reverseJournalEntry: (entryId: string, reason: string) => JournalEntry | { error: string };
  syncJournalEntriesAndAccounts: () => { entriesCount: number; newEntriesCreated: number; accountsCount: number };
  fiscalYears: FiscalYear[];
  addFiscalYear: (fy: Omit<FiscalYear, 'id'>) => void;
  closeFiscalYear: (id: string) => { success?: boolean; entryNumber?: string; error?: string };
  costCenters: CostCenter[];
  addCostCenter: (cc: Omit<CostCenter, 'id'>) => void;
  fixedAssets: FixedAsset[];
  addFixedAsset: (asset: Omit<FixedAsset, 'id'>) => void;
  runAssetDepreciation: (assetId: string) => JournalEntry | { error: string };
  resetAccountsToDefault: () => void;

  // Marketing & Dynamic Homepage CMS
  homepageContent: CMSHomepageContent;
  updateHomepageContent: (content: Partial<CMSHomepageContent>) => void;
  banners: CMSBanner[];
  addBanner: (banner: Omit<CMSBanner, 'id'>) => void;
  toggleBannerActive: (id: string) => void;
  deleteBanner: (id: string) => void;
  videos: CMSVideo[];
  updateHeroVideo: (video: CMSVideo) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAction: (action: string, module: string, details: string) => void;

  // Utilities
  resetToDefaultData: () => void;
  globalSearch: (query: string) => {
    products: Product[];
    sales: Sale[];
    warranties: Warranty[];
    customers: Customer[];
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'PWN_STORE_ERP_V1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);

  const [homepageContent, setHomepageContent] = useState<CMSHomepageContent>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_homepage_content`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.brandTitle || parsed.brandTitle !== 'कल्प') {
          const updated = { ...parsed, brandTitle: 'कल्प', brandSubtitle: '' };
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_homepage_content`, JSON.stringify(updated));
          return updated;
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing saved homepage_content:', e);
      }
    }
    return INITIAL_HOMEPAGE_CONTENT;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    if (saved) {
      const parsed: User[] = JSON.parse(saved);
      // Ensure all users have username and password, clean dummy name Prem Shrestha
      return parsed.map(u => {
        let name = u.name;
        if (name === 'Prem Shrestha') {
          name = 'Super Admin';
        }
        return {
          ...u,
          name,
          username: u.username || (u.id === 'usr-1' ? 'admin' : u.email.split('@')[0] || name.toLowerCase().replace(/\s+/g, '')),
          password: u.password || 'admin123'
        };
      });
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const primary = users[0] || INITIAL_USERS[0];
    if (primary.name === 'Prem Shrestha') {
      return { ...primary, name: 'Super Admin' };
    }
    return primary;
  });

  const isRemoteUpdateRef = useRef(false);
  const isQuotaExceededRef = useRef(false);
  const hasLoadedFromFirestoreRef = useRef(false);

  // Helper functions to save entity collections to Firestore & LocalStorage instantly
  const saveProductsCloud = (next: Product[]) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(next));
    if (!isQuotaExceededRef.current) {
      setDoc(doc(db, 'erp_store', 'products'), { items: next, updatedAt: new Date().toISOString() }).catch(console.error);
      setDoc(doc(db, 'erp_store', 'data'), { products: next, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    }
  };

  const saveSalesCloud = (next: Sale[]) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_sales`, JSON.stringify(next));
    if (!isQuotaExceededRef.current) {
      setDoc(doc(db, 'erp_store', 'sales'), { items: next, updatedAt: new Date().toISOString() }).catch(console.error);
      setDoc(doc(db, 'erp_store', 'data'), { sales: next, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    }
  };

  const saveCustomersCloud = (next: Customer[]) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_customers`, JSON.stringify(next));
    if (!isQuotaExceededRef.current) {
      setDoc(doc(db, 'erp_store', 'customers'), { items: next, updatedAt: new Date().toISOString() }).catch(console.error);
      setDoc(doc(db, 'erp_store', 'data'), { customers: next, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    }
  };

  const saveWarrantiesCloud = (next: Warranty[]) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_warranties`, JSON.stringify(next));
    if (!isQuotaExceededRef.current) {
      setDoc(doc(db, 'erp_store', 'warranties'), { items: next, updatedAt: new Date().toISOString() }).catch(console.error);
      setDoc(doc(db, 'erp_store', 'data'), { warranties: next, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    }
  };

  const savePurchasesCloud = (next: Purchase[]) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_purchases`, JSON.stringify(next));
    if (!isQuotaExceededRef.current) {
      setDoc(doc(db, 'erp_store', 'purchases'), { items: next, updatedAt: new Date().toISOString() }).catch(console.error);
      setDoc(doc(db, 'erp_store', 'data'), { purchases: next, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    }
  };

  const saveUsersCloud = (next: User[]) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(next));
    if (!isQuotaExceededRef.current) {
      setDoc(doc(db, 'erp_store', 'users'), { items: next, updatedAt: new Date().toISOString() }).catch(console.error);
      setDoc(doc(db, 'erp_store', 'data'), { users: next, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    }
  };

  const saveAccountsCloud = (next: Account[]) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_accounts`, JSON.stringify(next));
    if (!isQuotaExceededRef.current) {
      setDoc(doc(db, 'erp_store', 'accounts'), { items: next, updatedAt: new Date().toISOString() }).catch(console.error);
      setDoc(doc(db, 'erp_store', 'data'), { accounts: next, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    }
  };

  const saveJournalEntriesCloud = (next: JournalEntry[]) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_journal_entries`, JSON.stringify(next));
    if (!isQuotaExceededRef.current) {
      setDoc(doc(db, 'erp_store', 'journalEntries'), { items: next, updatedAt: new Date().toISOString() }).catch(console.error);
      setDoc(doc(db, 'erp_store', 'data'), { journalEntries: next, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    }
  };

  const saveSuppliersCloud = (next: Supplier[]) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_suppliers`, JSON.stringify(next));
    if (!isQuotaExceededRef.current) {
      setDoc(doc(db, 'erp_store', 'suppliers'), { items: next, updatedAt: new Date().toISOString() }).catch(console.error);
      setDoc(doc(db, 'erp_store', 'data'), { suppliers: next, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    }
  };

  // Realtime Firestore listeners for Homepage CMS & ERP Store Data
  useEffect(() => {
    // 1. Homepage Content doc listener
    const contentRef = doc(db, 'cms_content', 'homepage');
    const unsubContent = onSnapshot(contentRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as CMSHomepageContent;
        setHomepageContent(prev => ({ ...prev, ...data }));
      } else if (!isQuotaExceededRef.current) {
        // Initialize Firestore with default homepage content
        setDoc(contentRef, INITIAL_HOMEPAGE_CONTENT).catch(err => {
          if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
            isQuotaExceededRef.current = true;
          }
        });
      }
    }, (err) => {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
        isQuotaExceededRef.current = true;
      }
      console.log('Firestore homepage listener notice:', err);
    });

    // 2. Hero Video listener
    const videoRef = doc(db, 'cms_content', 'hero_video');
    const unsubVideo = onSnapshot(videoRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as CMSVideo;
        if (data && data.videoUrl) {
          setVideos([data]);
        }
      }
    }, (err) => {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
        isQuotaExceededRef.current = true;
      }
      console.log('Firestore video listener notice:', err);
    });

    // 2b. Banners Collection Listener (individual docs per banner)
    const unsubBannersCollection = onSnapshot(collection(db, 'cms_banners'), (colSnapshot) => {
      if (!colSnapshot.empty) {
        const remoteBanners = colSnapshot.docs.map(d => d.data() as CMSBanner);
        if (remoteBanners.length > 0) {
          setBanners(remoteBanners);
        }
      }
    }, (err) => {
      console.log('Firestore cms_banners collection notice:', err);
    });

    // Fallback single-doc banners listener
    const bannersRef = doc(db, 'cms_content', 'banners');
    const unsubBannersDoc = onSnapshot(bannersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.banners) && data.banners.length > 0) {
          setBanners(prev => prev.length === 0 ? data.banners : prev);
        }
      }
    }, (err) => {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
        isQuotaExceededRef.current = true;
      }
      console.log('Firestore banners listener notice:', err);
    });

    const unsubBanners = () => {
      unsubBannersCollection();
      unsubBannersDoc();
    };

    // Modular Products Listener
    const unsubProductsDoc = onSnapshot(doc(db, 'erp_store', 'products'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          isRemoteUpdateRef.current = true;
          hasLoadedFromFirestoreRef.current = true;
          setProducts(data.items);
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(data.items));
          setTimeout(() => { isRemoteUpdateRef.current = false; }, 500);
        }
      }
    }, (err) => console.log('Products listener notice:', err));

    // Modular Sales Listener
    const unsubSalesDoc = onSnapshot(doc(db, 'erp_store', 'sales'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          isRemoteUpdateRef.current = true;
          hasLoadedFromFirestoreRef.current = true;
          setSales(data.items);
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_sales`, JSON.stringify(data.items));
          setTimeout(() => { isRemoteUpdateRef.current = false; }, 500);
        }
      }
    }, (err) => console.log('Sales listener notice:', err));

    // 3. Main ERP Store Data listener (sales, products, customers, warranties, purchases, accounts, journalEntries, suppliers, auditLogs)
    const erpRef = doc(db, 'erp_store', 'data');
    const unsubErp = onSnapshot(erpRef, (snapshot) => {
      hasLoadedFromFirestoreRef.current = true;
      if (snapshot.exists()) {
        const data = snapshot.data();
        isRemoteUpdateRef.current = true;
        if (data.sales && Array.isArray(data.sales) && data.sales.length > 0) {
          setSales(data.sales);
        }
        if (data.users && Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
        }
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
        if (data.customers && Array.isArray(data.customers)) {
          setCustomers(data.customers);
        }
        if (data.suppliers && Array.isArray(data.suppliers) && data.suppliers.length > 0) {
          setSuppliers(data.suppliers);
        }
        if (data.purchases && Array.isArray(data.purchases) && data.purchases.length > 0) {
          setPurchases(data.purchases);
        }
        if (data.warranties && Array.isArray(data.warranties) && data.warranties.length > 0) {
          setWarranties(data.warranties);
        }
        if (data.accounts && Array.isArray(data.accounts) && data.accounts.length > 0) {
          setAccounts(data.accounts);
        }
        if (data.journalEntries && Array.isArray(data.journalEntries) && data.journalEntries.length > 0) {
          setJournalEntries(data.journalEntries);
        }
        if (data.auditLogs && Array.isArray(data.auditLogs)) {
          setAuditLogs(data.auditLogs);
        }
        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 500);
      }
    }, (err) => {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
        isQuotaExceededRef.current = true;
      }
      console.log('Firestore ERP listener notice:', err);
    });

    return () => {
      unsubContent();
      unsubVideo();
      unsubBanners();
      unsubProductsDoc();
      unsubSalesDoc();
      unsubErp();
    };
  }, []);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    if (!saved) return INITIAL_PRODUCTS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((p: any) => p.id !== 'prod-1' && p.sku !== 'RLX-SUB-41-BK');
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_customers`);
    if (!saved) return INITIAL_CUSTOMERS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((c: any) => c.id !== 'cust-1' && c.name !== 'Sujan Karki');
      }
      return INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_suppliers`);
    if (!saved) return INITIAL_SUPPLIERS;
    try {
      const parsed: Supplier[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((s: any) => s.id !== 'sup-1');
      }
      return INITIAL_SUPPLIERS;
    } catch {
      return INITIAL_SUPPLIERS;
    }
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_sales`);
    if (!saved) return INITIAL_SALES;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((s: any) => s.id !== 'sale-1' && s.invoiceNumber !== 'PWTN-2026-0101');
      }
      return INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_purchases`);
    if (!saved) return INITIAL_PURCHASES;
    try {
      const parsed: Purchase[] = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(p => p.id !== 'pur-1785862946231-ddxqb');
      }
      return INITIAL_PURCHASES;
    } catch {
      return INITIAL_PURCHASES;
    }
  });

  const [warranties, setWarranties] = useState<Warranty[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_warranties`);
    if (!saved) return INITIAL_WARRANTIES;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((w: any) => w.id !== 'WRN-2026-0101');
      }
      return INITIAL_WARRANTIES;
    } catch {
      return INITIAL_WARRANTIES;
    }
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_accounts`);
    if (!saved) return INITIAL_ACCOUNTS;
    try {
      const parsed: Account[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_journal_entries`);
    if (!saved) return INITIAL_JOURNAL_ENTRIES;
    try {
      const parsed: JournalEntry[] = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(je => !je.reference?.includes('pur-1785862946231-ddxqb') && je.id !== 'pur-1785862946231-ddxqb');
      }
      return INITIAL_JOURNAL_ENTRIES;
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  });

  const [banners, setBanners] = useState<CMSBanner[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_banners`);
    if (!saved) return INITIAL_CMS_BANNERS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((b: any) => b.id !== 'ban-1');
      }
      return INITIAL_CMS_BANNERS;
    } catch {
      return INITIAL_CMS_BANNERS;
    }
  });

  const [videos, setVideos] = useState<CMSVideo[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_videos`);
    return saved ? JSON.parse(saved) : INITIAL_CMS_VIDEOS;
  });

  const [claims, setClaims] = useState<WarrantyClaim[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_claims`);
    return saved ? JSON.parse(saved) : [];
  });

  const [replacements, setReplacements] = useState<WarrantyReplacement[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_replacements`);
    return saved ? JSON.parse(saved) : [];
  });

  const [extensions, setExtensions] = useState<WarrantyExtension[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_extensions`);
    return saved ? JSON.parse(saved) : [];
  });

  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_verification_logs`);
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notification_templates`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATION_TEMPLATES;
  });

  const [warrantySettings, setWarrantySettings] = useState<WarrantySettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_warranty_settings`);
    return saved ? JSON.parse(saved) : INITIAL_WARRANTY_SETTINGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_audit_logs`);
    if (!saved) return INITIAL_AUDIT_LOGS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((l: any) => l.id !== 'log-1');
      }
      return INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Save changes to localStorage & Firestore
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_customers`, JSON.stringify(customers));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_suppliers`, JSON.stringify(suppliers));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_sales`, JSON.stringify(sales));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_purchases`, JSON.stringify(purchases));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_warranties`, JSON.stringify(warranties));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_claims`, JSON.stringify(claims));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_replacements`, JSON.stringify(replacements));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_extensions`, JSON.stringify(extensions));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_verification_logs`, JSON.stringify(verificationLogs));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notification_templates`, JSON.stringify(notificationTemplates));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_warranty_settings`, JSON.stringify(warrantySettings));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_accounts`, JSON.stringify(accounts));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_journal_entries`, JSON.stringify(journalEntries));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(banners));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_videos`, JSON.stringify(videos));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_homepage_content`, JSON.stringify(homepageContent));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_audit_logs`, JSON.stringify(auditLogs));

    // Do not re-push if remote data not loaded yet, or if this state update was triggered by an incoming Firestore snapshot, or if quota is exceeded
    if (!hasLoadedFromFirestoreRef.current || isRemoteUpdateRef.current || isQuotaExceededRef.current) {
      return;
    }

    // Debounce pushing to Firestore Cloud Database to avoid write stream saturation
    const timer = setTimeout(() => {
      if (isQuotaExceededRef.current) return;
      setDoc(doc(db, 'erp_store', 'data'), {
        users,
        sales,
        products,
        customers,
        suppliers,
        purchases,
        warranties,
        claims,
        replacements,
        extensions,
        verificationLogs,
        notificationTemplates,
        warrantySettings,
        accounts,
        journalEntries,
        auditLogs,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => {
        if (err?.code === 'resource-exhausted' || err?.message?.includes('quota') || err?.message?.includes('resource-exhausted')) {
          isQuotaExceededRef.current = true;
        }
        console.log('Firestore sync notice:', err);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [users, products, customers, suppliers, sales, purchases, warranties, claims, replacements, extensions, verificationLogs, notificationTemplates, warrantySettings, accounts, journalEntries, banners, videos, homepageContent, auditLogs]);

  // Purge all legacy dummy data and hardcoded dummy figures on startup
  useEffect(() => {
    // 1. Purge dummy purchases
    setPurchases(prev => {
      const filtered = prev.filter(p => p.id !== 'pur-gongabu-20260802' && p.id !== 'pur-1785862946231-ddxqb' && p.invoiceNumber !== 'GWS-2026-0802');
      if (filtered.length !== prev.length) {
        savePurchasesCloud(filtered);
        return filtered;
      }
      return prev;
    });

    // 2. Purge dummy journal entries
    setJournalEntries(prev => {
      const filtered = prev.filter(je => 
        je.id !== 'je-pur-gongabu-20260802' && 
        je.id !== 'pur-1785862946231-ddxqb' && 
        je.reference !== 'GWS-2026-0802' &&
        !je.description?.includes('pur-1785862946231-ddxqb')
      );
      if (filtered.length !== prev.length) {
        saveJournalEntriesCloud(filtered);
        return filtered;
      }
      return prev;
    });

    // 3. Purge dummy fixed assets
    setFixedAssets(prev => {
      const filtered = prev.filter(a => a.id !== 'ast-1' && a.id !== 'ast-2' && a.id !== 'ast-3');
      if (filtered.length !== prev.length) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_fixed_assets`, JSON.stringify(filtered));
        return filtered;
      }
      return prev;
    });

    // 4. Ensure accounts opening balances are zeroed and clean
    setAccounts(prevAccounts => {
      let updated = false;
      const cleaned = prevAccounts.map(a => {
        // Zero out old hardcoded opening balances if they existed
        if (a.openingBalance && a.openingBalance > 0) {
          updated = true;
          return { ...a, openingBalance: 0 };
        }
        return a;
      });

      if (updated) {
        saveAccountsCloud(cleaned);
        return cleaned;
      }
      return prevAccounts;
    });
  }, []);

  const loginStaffUser = (username: string, password: string): boolean => {
    const trimmedUser = username.trim().toLowerCase();
    const found = users.find(u => u.username.toLowerCase() === trimmedUser && u.password === password && u.active);
    if (found) {
      setCurrentUser(found);
      logAction('Staff Login', 'Authentication', `Staff user "${found.name}" (${found.username}) logged in.`);
      return true;
    }
    return false;
  };

  const resetUserPassword = (id: string, newPassword: string) => {
    if (currentUser.role !== 'Super Admin' && currentUser.id !== id) return;
    setUsers(prev => {
      const nextUsers = prev.map(u => u.id === id ? { ...u, password: newPassword } : u);
      setDoc(doc(db, 'erp_store', 'data'), { users: nextUsers, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
      return nextUsers;
    });
    const targetUser = users.find(u => u.id === id);
    logAction('Reset User Password', 'User Management', `Password reset for user "${targetUser?.name || id}" (${targetUser?.username})`);
  };

  const updateHomepageContent = (updated: Partial<CMSHomepageContent>) => {
    setHomepageContent(prev => {
      const nextContent = { ...prev, ...updated };
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_homepage_content`, JSON.stringify(nextContent));
      if (!isQuotaExceededRef.current) {
        setDoc(doc(db, 'cms_content', 'homepage'), nextContent, { merge: true }).catch(err => {
          console.error('Firestore homepage sync error:', err);
        });
      }
      return nextContent;
    });
    logAction('Updated Homepage CMS', 'Marketing CMS', `Updated homepage settings (Maintenance Mode: ${updated.maintenanceMode !== undefined ? (updated.maintenanceMode ? 'Enabled' : 'Disabled') : 'Unchanged'})`);
  };

  const syncBannersToFirestore = async (bannersList: CMSBanner[]) => {
    try {
      // Sync each banner as an individual document in cms_banners collection
      await Promise.all(
        bannersList.map(async (b) => {
          let imageUrl = b.imageUrl;
          if (imageUrl && imageUrl.startsWith('data:image/')) {
            imageUrl = await compressImageDataUrl(imageUrl, 1000, 1000, 0.70);
          }
          const compressedBanner = { ...b, imageUrl };
          await setDoc(doc(db, 'cms_banners', b.id), compressedBanner, { merge: true });
        })
      );

      // Also attempt to sync summary list to cms_content/banners as fallback
      const summaryBanners = await Promise.all(
        bannersList.map(async (b) => {
          if (b.imageUrl && b.imageUrl.startsWith('data:image/')) {
            const compressed = await compressImageDataUrl(b.imageUrl, 700, 700, 0.50);
            return { ...b, imageUrl: compressed };
          }
          return b;
        })
      );
      await setDoc(doc(db, 'cms_content', 'banners'), { banners: summaryBanners }, { merge: true }).catch(() => {});
    } catch (err: any) {
      console.error('Firestore banners sync notice:', err);
    }
  };

  const addBanner = async (banner: Omit<CMSBanner, 'id'>) => {
    let compressedUrl = banner.imageUrl;
    if (banner.imageUrl?.startsWith('data:image/')) {
      compressedUrl = await compressImageDataUrl(banner.imageUrl, 1200, 1200, 0.72);
    }

    const bannerId = `ban-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newBanner: CMSBanner = {
      ...banner,
      imageUrl: compressedUrl,
      id: bannerId
    };

    // Save directly to individual Firestore doc in cms_banners collection
    setDoc(doc(db, 'cms_banners', bannerId), newBanner, { merge: true }).catch(err => {
      console.error('Failed to write new banner to cms_banners collection:', err);
    });

    setBanners(prev => {
      const next = [...prev, newBanner];
      syncBannersToFirestore(next);
      return next;
    });
    logAction('Added Banner Slide', 'Marketing CMS', `Added slide photo banner "${banner.title}"`);
  };

  const toggleBannerActive = (id: string) => {
    setBanners(prev => {
      const next = prev.map(b => {
        if (b.id === id) {
          const updated = { ...b, active: !b.active };
          setDoc(doc(db, 'cms_banners', id), { active: updated.active }, { merge: true }).catch(console.error);
          return updated;
        }
        return b;
      });
      syncBannersToFirestore(next);
      return next;
    });
  };

  const deleteBanner = (id: string) => {
    deleteDoc(doc(db, 'cms_banners', id)).catch(console.error);
    setBanners(prev => {
      const next = prev.filter(b => b.id !== id);
      syncBannersToFirestore(next);
      return next;
    });
  };

  const updateHeroVideo = (video: CMSVideo) => {
    setVideos([video]);
    // Sync to Firestore
    setDoc(doc(db, 'cms_content', 'hero_video'), video, { merge: true }).catch(err => {
      console.error('Firestore hero video sync error:', err);
      if (err?.message?.includes('exceeds') || err?.message?.includes('bytes') || err?.code === 'invalid-argument') {
        alert('⚠️ Note: Uploaded video file exceeds Firestore single-document limit (1MB max).\n\nWhile it displays in your current browser tab, it cannot be synced across devices or to the published shared URL.\n\n👉 Please enter a public video URL link (e.g. MP4 hosted on Mixkit, Pexels, Cloudinary, AWS S3) in the video settings.');
      }
    });
    logAction('Updated Hero Video', 'Marketing CMS', `Updated promotional background video stream`);
  };

  const logAction = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    if (currentUser.role !== 'Super Admin') return;
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    };
    setUsers(prev => {
      const next = [...prev, newUser];
      saveUsersCloud(next);
      return next;
    });
    logAction('Created User', 'User Management', `Added user ${newUser.name} as ${newUser.role}`);
  };

  const updateUser = (updatedUser: User) => {
    if (currentUser.role !== 'Super Admin' && currentUser.id !== updatedUser.id) return;
    setUsers(prev => {
      const nextUsers = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      saveUsersCloud(nextUsers);
      return nextUsers;
    });
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    logAction('Updated User Details', 'User Management', `Updated staff details for ${updatedUser.name} (@${updatedUser.username})`);
  };

  const deleteUser = (id: string) => {
    if (currentUser.role !== 'Super Admin') return;
    const target = users.find(u => u.id === id);
    if (!target) return;
    
    const remainingUsers = users.filter(u => u.id !== id);
    setUsers(remainingUsers);
    saveUsersCloud(remainingUsers);
    
    if (currentUser.id === id && remainingUsers.length > 0) {
      setCurrentUser(remainingUsers[0]);
    }
    logAction('Deleted User', 'User Management', `Removed staff user ${target.name} (@${target.username})`);
  };

  const updateUserRole = (id: string, role: Role) => {
    if (currentUser.role !== 'Super Admin') return;
    setUsers(prev => {
      const next = prev.map(u => u.id === id ? { ...u, role } : u);
      saveUsersCloud(next);
      return next;
    });
    logAction('Updated User Role', 'User Management', `Updated role for user ID ${id} to ${role}`);
  };

  const toggleUserActive = (id: string) => {
    if (currentUser.role !== 'Super Admin') return;
    setUsers(prev => {
      const next = prev.map(u => u.id === id ? { ...u, active: !u.active } : u);
      saveUsersCloud(next);
      return next;
    });
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'soldQuantity' | 'reservedStock'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      soldQuantity: 0,
      reservedStock: 0,
    };
    setProducts(prev => {
      const next = [newProd, ...prev];
      saveProductsCloud(next);
      return next;
    });
    logAction('Created Product', 'Inventory', `Added product ${newProd.brand} ${newProd.model} (SKU: ${newProd.sku})`);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === updated.id ? updated : p);
      saveProductsCloud(next);
      return next;
    });
    logAction('Updated Product', 'Inventory', `Updated product ${updated.brand} ${updated.model}`);
  };

  const deleteProduct = (id: string) => {
    if (currentUser.role !== 'Super Admin') return;
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      saveProductsCloud(next);
      return next;
    });
    logAction('Deleted Product', 'Inventory', `Deleted product ID ${id}`);
  };

  const adjustStock = (productId: string, quantityChange: number, reason: string) => {
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + quantityChange);
          let newStatus: Product['status'] = 'In Stock';
          if (newStock === 0) newStatus = 'Out of Stock';
          else if (newStock <= p.reorderLevel) newStatus = 'Low Stock';
          return { ...p, stock: newStock, status: newStatus };
        }
        return p;
      });
      saveProductsCloud(next);
      return next;
    });
    logAction('Adjusted Stock', 'Inventory', `Adjusted stock for ${productId} by ${quantityChange}. Reason: ${reason}`);
  };

  const restoreAllStocksExcept = (exceptSku: string = 'SIK-SLV-01') => {
    setProducts(prevProducts => {
      const restored = prevProducts.map(p => {
        if (p.sku === exceptSku || p.id === 'prod-karobar-7' || (p.model && p.model.toLowerCase().includes('seiko silver'))) {
          return {
            ...p,
            stock: 0,
            soldQuantity: 1,
            status: 'Out of Stock' as ProductStatus
          };
        }
        const initProd = INITIAL_PRODUCTS.find(ip => ip.id === p.id || ip.sku === p.sku);
        const targetStock = initProd ? initProd.stock : Math.max(1, p.stock || 1);
        return {
          ...p,
          stock: targetStock,
          soldQuantity: 0,
          status: (targetStock > 0 ? 'In Stock' : 'Out of Stock') as ProductStatus
        };
      });
      saveProductsCloud(restored);
      return restored;
    });
    logAction('Restored Inventory Stocks', 'Inventory', `Restored inventory quantities for all items except ${exceptSku}`);
  };

  const addCustomer = (custData: Omit<Customer, 'id' | 'totalPurchases' | 'createdAt'>): Customer => {
    const existing = customers.find(c => c.mobile === custData.mobile);
    if (existing) return existing;

    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      totalPurchases: 0,
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setCustomers(prev => {
      const next = [...prev, newCust];
      saveCustomersCloud(next);
      return next;
    });
    logAction('Created Customer', 'Customer CRM', `Added customer ${newCust.name} (${newCust.mobile})`);
    return newCust;
  };

  const addSupplier = (supData: Omit<Supplier, 'id' | 'balanceDue'>) => {
    const newSup: Supplier = {
      ...supData,
      id: `sup-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      balanceDue: 0
    };
    setSuppliers(prev => {
      const next = [...prev, newSup];
      saveSuppliersCloud(next);
      return next;
    });
    logAction('Created Supplier', 'Purchases', `Added supplier ${newSup.name}`);
  };

  // Automated Sale creation logic
  const createSale = (saleData: {
    customerId?: string;
    customerName: string;
    customerMobile: string;
    customerAddress?: string;
    productId: string;
    serialNumber: string;
    imei?: string;
    sellingPrice: number;
    discount: number;
    paymentMethod: PaymentMethod;
    courierName?: string;
    trackingNumber?: string;
    orderSource: OrderSource;
  }) => {
    const product = products.find(p => p.id === saleData.productId);
    if (!product) return { error: 'Selected watch product not found.' };
    if (product.stock < 1) return { error: 'Product is currently out of stock.' };

    // 1. Resolve customer
    let cust: Customer;
    if (saleData.customerId) {
      cust = customers.find(c => c.id === saleData.customerId) || {
        id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: saleData.customerName,
        mobile: saleData.customerMobile,
        address: saleData.customerAddress || 'Kathmandu, Nepal',
        totalPurchases: 0,
        createdAt: new Date().toISOString().substring(0, 10)
      };
    } else {
      cust = addCustomer({
        name: saleData.customerName,
        mobile: saleData.customerMobile,
        address: saleData.customerAddress || 'Kathmandu, Nepal'
      });
    }

    // Calculations
    const sellingPrice = saleData.sellingPrice || product.sellingPrice;
    const netTaxable = Math.max(0, sellingPrice - saleData.discount);
    const vatAmount = 0; // VAT removed as per requirements
    const finalTotal = netTaxable;

    // Numbers & IDs
    const currentYear = new Date().getFullYear();
    const count = sales.length + 1;
    const invSeq = String(count).padStart(4, '0');
    const invoiceNumber = `STW-${currentYear}-${invSeq}`;
    const warrantyId = `WRN-${currentYear}-${invSeq}`;

    // 2. Create Sale object
    const newSale: Sale = {
      id: `sale-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      invoiceNumber,
      customerId: cust.id,
      customerName: cust.name,
      customerMobile: cust.mobile,
      productId: product.id,
      productBrand: product.brand,
      productModel: product.model,
      watchModel: `${product.brand} ${product.model} ${product.dialColor}`,
      serialNumber: saleData.serialNumber,
      imei: saleData.imei,
      sellingPrice,
      discount: saleData.discount,
      vatAmount,
      finalTotal,
      paymentMethod: saleData.paymentMethod,
      courierName: saleData.courierName,
      trackingNumber: saleData.trackingNumber,
      deliveryStatus: 'Delivered',
      salesPerson: currentUser.name,
      orderSource: saleData.orderSource,
      orderDate: (saleData as any).orderDate || new Date().toISOString().substring(0, 10),
      deliveryDate: (saleData as any).orderDate || new Date().toISOString().substring(0, 10),
      warrantyId,
      createdBy: currentUser.name
    };

    // 3. Create Warranty object
    const salesDateStr = newSale.orderDate;
    const startDateObj = new Date(salesDateStr);
    const endDateObj = new Date(startDateObj);
    endDateObj.setMonth(endDateObj.getMonth() + (product.warrantyMonths || 12));

    const newWarranty: Warranty = {
      id: warrantyId,
      salesId: newSale.id,
      customerId: cust.id,
      customerName: cust.name,
      customerMobile: cust.mobile,
      productId: product.id,
      productBrand: product.brand,
      productModel: product.model,
      dialColor: product.dialColor,
      serialNumber: saleData.serialNumber,
      qrCodeUrl: `https://samaya-watch-store-nepal.ai.studio/warranty?code=${warrantyId}`,
      warrantyStart: salesDateStr,
      warrantyEnd: endDateObj.toISOString().substring(0, 10),
      status: 'Active',
      activationStatus: 'Active',
      claimCount: 0,
      dealerName: 'कल्प',
      invoiceNumber,
      remarks: `Official ${product.brand} International Warranty. Inspected prior to dispatch.`,
      serviceHistory: []
    };

    // 4. Update Product inventory stock
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id === product.id) {
          const newStock = Math.max(0, p.stock - 1);
          let newStatus: Product['status'] = 'In Stock';
          if (newStock === 0) newStatus = 'Out of Stock';
          else if (newStock <= p.reorderLevel) newStatus = 'Low Stock';
          return {
            ...p,
            stock: newStock,
            soldQuantity: (p.soldQuantity || 0) + 1,
            status: newStatus
          };
        }
        return p;
      });
      saveProductsCloud(next);
      return next;
    });

    // 5. Update Customer Total Purchases
    setCustomers(prev => prev.map(c => c.id === cust.id ? { ...c, totalPurchases: c.totalPurchases + finalTotal } : c));

    // 6. Double-Entry Accounting Entry
    const cogs = product.purchasePrice;
    const jeLines = [
      {
        accountId: saleData.paymentMethod === 'Cash' ? 'acc-1010' : saleData.paymentMethod === 'eSewa' ? 'acc-1030' : 'acc-1020',
        accountCode: saleData.paymentMethod === 'Cash' ? '1010' : saleData.paymentMethod === 'eSewa' ? '1030' : '1020',
        accountName: saleData.paymentMethod === 'Cash' ? 'Cash in Hand' : saleData.paymentMethod === 'eSewa' ? 'eSewa Merchant Wallet' : 'Nabil Bank Main Account',
        debit: finalTotal,
        credit: 0
      }
    ];

    if (saleData.discount > 0) {
      jeLines.push({
        accountId: 'acc-5030',
        accountCode: '5030',
        accountName: 'Sales Discounts Given',
        debit: saleData.discount,
        credit: 0
      });
    }

    jeLines.push({
      accountId: 'acc-4010',
      accountCode: '4010',
      accountName: 'Watch Sales Revenue',
      debit: 0,
      credit: sellingPrice
    });

    if (vatAmount > 0) {
      jeLines.push({
        accountId: 'acc-2020',
        accountCode: '2020',
        accountName: 'VAT Payable (13%)',
        debit: 0,
        credit: vatAmount
      });
    }

    const saleJE: JournalEntry = {
      id: `je-${Date.now()}-1-${Math.random().toString(36).substring(2, 7)}`,
      entryNumber: `JE-${currentYear}-${invSeq}`,
      date: new Date().toISOString().substring(0, 10),
      description: `Sale of ${product.brand} ${product.model} - Invoice #${invoiceNumber}`,
      reference: invoiceNumber,
      createdBy: currentUser.name,
      lines: jeLines
    };

    const cogsJE: JournalEntry = {
      id: `je-${Date.now()}-2-${Math.random().toString(36).substring(2, 7)}`,
      entryNumber: `JE-${currentYear}-${invSeq}-COGS`,
      date: new Date().toISOString().substring(0, 10),
      description: `COGS Recognition for Invoice #${invoiceNumber}`,
      reference: invoiceNumber,
      createdBy: currentUser.name,
      lines: [
        { accountId: 'acc-5010', accountCode: '5010', accountName: 'Cost of Goods Sold (COGS)', debit: cogs, credit: 0 },
        { accountId: 'acc-1200', accountCode: '1200', accountName: 'Watch Inventory Asset', debit: 0, credit: cogs }
      ]
    };

    setJournalEntries(prev => {
      const next = [saleJE, cogsJE, ...prev];
      saveJournalEntriesCloud(next);
      return next;
    });

    // Update Chart of Account balances
    setAccounts(prev => {
      const next = prev.map(acc => {
        if (acc.id === saleJE.lines[0].accountId) return { ...acc, balance: acc.balance + finalTotal };
        if (acc.id === 'acc-4010') return { ...acc, balance: acc.balance + sellingPrice };
        if (acc.id === 'acc-2020') return { ...acc, balance: acc.balance + vatAmount };
        if (acc.id === 'acc-5010') return { ...acc, balance: acc.balance + cogs };
        if (acc.id === 'acc-1200') return { ...acc, balance: Math.max(0, acc.balance - cogs) };
        return acc;
      });
      saveAccountsCloud(next);
      return next;
    });

    // 7. Save Sale and Warranty
    setSales(prev => {
      const next = [newSale, ...prev];
      saveSalesCloud(next);
      return next;
    });
    setWarranties(prev => {
      const next = [newWarranty, ...prev];
      saveWarrantiesCloud(next);
      return next;
    });

    logAction('Created Sale & Warranty', 'Sales & ERP', `Created Invoice #${invoiceNumber} for ${cust.name}. Generated Warranty ID #${warrantyId}. Stock decreased by 1.`);

    return { sale: newSale, warranty: newWarranty };
  };

  const updateSale = (saleId: string, updatedFields: Partial<Sale>) => {
    setSales(prev => {
      const next = prev.map(s => {
        if (s.id === saleId) {
          const sellingPrice = updatedFields.sellingPrice !== undefined ? updatedFields.sellingPrice : s.sellingPrice;
          const discount = updatedFields.discount !== undefined ? updatedFields.discount : s.discount;
          const netTotal = Math.max(0, sellingPrice - discount);

          const updatedSale: Sale = {
            ...s,
            ...updatedFields,
            sellingPrice,
            discount,
            vatAmount: 0,
            finalTotal: netTotal
          };

          // Also update corresponding warranty if exists
          if (s.warrantyId) {
            setWarranties(wPrev => {
              const wNext = wPrev.map(w => {
                if (w.id === s.warrantyId || w.invoiceNumber === s.invoiceNumber) {
                  const salesDate = updatedSale.orderDate || w.warrantyStart;
                  const startDateObj = new Date(salesDate);
                  const endDateObj = new Date(startDateObj);
                  endDateObj.setMonth(endDateObj.getMonth() + 12);
                  const newWarrantyEnd = endDateObj.toISOString().substring(0, 10);

                  return {
                    ...w,
                    customerName: updatedSale.customerName || w.customerName,
                    customerMobile: updatedSale.customerMobile || w.customerMobile,
                    serialNumber: updatedSale.serialNumber || w.serialNumber,
                    warrantyStart: salesDate,
                    warrantyEnd: newWarrantyEnd,
                    invoiceNumber: updatedSale.invoiceNumber || w.invoiceNumber
                  };
                }
                return w;
              });
              saveWarrantiesCloud(wNext);
              return wNext;
            });
          }

          return updatedSale;
        }
        return s;
      });
      saveSalesCloud(next);
      return next;
    });
    logAction('Updated Sale', 'Sales', `Updated sale order details for ${saleId}`);
  };

  const deleteSale = (saleId: string) => {
    if (currentUser.role !== 'Super Admin') return;
    const targetSale = sales.find(s => s.id === saleId);
    if (!targetSale) return;

    // 1. Remove sale
    const remainingSales = sales.filter(s => s.id !== saleId);
    setSales(remainingSales);
    saveSalesCloud(remainingSales);

    // 2. Remove matching warranty if exists
    if (targetSale.warrantyId || targetSale.invoiceNumber) {
      setWarranties(prev => {
        const nextWarranties = prev.filter(w => w.id !== targetSale.warrantyId && w.invoiceNumber !== targetSale.invoiceNumber);
        saveWarrantiesCloud(nextWarranties);
        return nextWarranties;
      });
    }

    // 3. Restore product stock (+1) and decrease soldQuantity (-1)
    setProducts(prev => {
      const nextProducts = prev.map(p => {
        if (
          p.id === targetSale.productId ||
          `${p.brand} ${p.model}`.toLowerCase() === targetSale.watchModel.toLowerCase() ||
          targetSale.watchModel.toLowerCase().includes(p.model.toLowerCase())
        ) {
          const restoredStock = p.stock + 1;
          const restoredSold = Math.max(0, (p.soldQuantity || 0) - 1);
          let newStatus: Product['status'] = 'In Stock';
          if (restoredStock === 0) newStatus = 'Out of Stock';
          else if (restoredStock <= p.reorderLevel) newStatus = 'Low Stock';

          return {
            ...p,
            stock: restoredStock,
            soldQuantity: restoredSold,
            status: newStatus
          };
        }
        return p;
      });
      saveProductsCloud(nextProducts);
      return nextProducts;
    });

    logAction('Deleted Sale Order', 'Sales & ERP', `Deleted Invoice #${targetSale.invoiceNumber} for ${targetSale.customerName}. Stock restored by +1.`);
  };

  // Warranty lookup
  const syncWarrantyWithSalesDate = (w: Warranty): Warranty => {
    const matchingSale = sales.find(s => s.warrantyId === w.id || s.invoiceNumber === w.invoiceNumber || (s.serialNumber && s.serialNumber === w.serialNumber));
    const salesDate = matchingSale?.orderDate || w.warrantyStart || new Date().toISOString().substring(0, 10);
    
    const startDateObj = new Date(salesDate);
    const endDateObj = new Date(startDateObj);
    endDateObj.setMonth(endDateObj.getMonth() + 12);
    const calculatedEnd = endDateObj.toISOString().substring(0, 10);

    return {
      ...w,
      warrantyStart: salesDate,
      warrantyEnd: w.extendedEnd ? w.warrantyEnd : calculatedEnd
    };
  };

  const getWarrantyByIdOrMobile = (query: string): Warranty | undefined => {
    const clean = query.trim().toUpperCase();
    if (!clean) return undefined;

    const found = warranties.find(w =>
      w.id.toUpperCase() === clean ||
      w.serialNumber.toUpperCase() === clean ||
      w.customerMobile.replace(/\D/g, '').endsWith(clean.replace(/\D/g, '')) ||
      w.invoiceNumber.toUpperCase() === clean
    );
    return found ? syncWarrantyWithSalesDate(found) : undefined;
  };

  const getWarrantiesByMobile = (mobile: string): Warranty[] => {
    const clean = mobile.replace(/\D/g, '');
    if (!clean) return [];
    return warranties.filter(w => w.customerMobile.replace(/\D/g, '').includes(clean)).map(syncWarrantyWithSalesDate);
  };

  const updateWarrantyStatus = (warrantyId: string, status: 'Active' | 'Expired' | 'Void', remarks?: string) => {
    setWarranties(prev => {
      const next = prev.map(w => w.id === warrantyId ? { ...w, status, remarks: remarks || w.remarks } : w);
      saveWarrantiesCloud(next);
      return next;
    });
    logAction('Updated Warranty Status', 'Warranty', `Updated warranty ${warrantyId} to ${status}`);
  };

  const activateWarranty = (warrantyId: string) => {
    setWarranties(prev => {
      const next = prev.map(w => {
        if (w.id === warrantyId) {
          return {
            ...w,
            status: 'Active' as const,
            activationStatus: 'Active' as const,
            activatedAt: new Date().toISOString(),
            activatedBy: currentUser.name
          };
        }
        return w;
      });
      saveWarrantiesCloud(next);
      return next;
    });
    logAction('Activated Warranty', 'Warranty Lifecycle', `Manually activated digital warranty #${warrantyId} by ${currentUser.name}`);
  };

  // Warranty Claims Pipeline
  const submitClaim = (claimData: Omit<WarrantyClaim, 'id' | 'status' | 'submittedAt'>): WarrantyClaim | { error: string } => {
    const targetWarranty = warranties.find(w => w.id === claimData.warrantyId);
    if (!targetWarranty) {
      return { error: 'Warranty record not found for this claim.' };
    }
    if (targetWarranty.status === 'Void') {
      return { error: 'This warranty has been marked VOID due to unauthorized tampering or policy violation.' };
    }

    const currentYear = new Date().getFullYear();
    const claimSeq = String(claims.length + 1).padStart(4, '0');
    const claimId = `${warrantySettings.claimPrefix}${currentYear}-${claimSeq}`;

    const newClaim: WarrantyClaim = {
      ...claimData,
      id: claimId,
      status: 'Submitted',
      submittedAt: new Date().toISOString()
    };

    setClaims(prev => [newClaim, ...prev]);

    // Increment claim count on warranty
    setWarranties(prev => prev.map(w => w.id === targetWarranty.id ? { ...w, claimCount: (w.claimCount || 0) + 1, lastActivity: new Date().toISOString() } : w));

    logAction('Submitted Warranty Claim', 'Warranty Claims', `Registered Claim #${claimId} for Warranty #${claimData.warrantyId}`);
    return newClaim;
  };

  const updateClaimStatus = (claimId: string, status: ClaimStatus, details?: any) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status, ...details } : c));
    logAction('Updated Claim Status', 'Warranty Claims', `Claim #${claimId} status changed to ${status}`);
  };

  const addInspection = (claimId: string, inspection: NonNullable<WarrantyClaim['inspection']>) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: inspection.coverage === 'Not Covered' ? 'Rejected' : 'Under Inspection',
          inspection
        };
      }
      return c;
    }));
    logAction('Recorded Inspection', 'Warranty Inspection', `Added inspection report for Claim #${claimId}: Coverage ${inspection.coverage}`);
  };

  const approveClaim = (claimId: string, approval: NonNullable<WarrantyClaim['approval']>) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        const nextStatus = approval.status === 'Rejected' ? 'Rejected' : 'Approved';
        return {
          ...c,
          status: nextStatus,
          approval
        };
      }
      return c;
    }));
    logAction('Claim Decision', 'Warranty Claims', `Decision for Claim #${claimId}: ${approval.status}`);
  };

  const updateRepair = (claimId: string, repair: NonNullable<WarrantyClaim['repair']>) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: repair.completionDate ? 'Quality Check' : 'In Repair',
          repair
        };
      }
      return c;
    }));

    // Add service log to the original warranty
    const targetClaim = claims.find(c => c.id === claimId);
    if (targetClaim && repair.actionTaken) {
      addServiceHistory(targetClaim.warrantyId, {
        serviceDate: repair.completionDate || new Date().toISOString().substring(0, 10),
        issue: targetClaim.problemDescription,
        repairDetails: repair.actionTaken,
        technician: repair.technician,
        remarks: repair.partsUsed ? `Parts used: ${repair.partsUsed}` : undefined
      });
    }

    logAction('Updated Repair Log', 'Warranty Repair', `Recorded repair updates for Claim #${claimId}`);
  };

  const passQualityCheck = (claimId: string, qc: NonNullable<WarrantyClaim['qualityCheck']>) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: qc.passed ? 'Ready for Collection' : 'In Repair',
          qualityCheck: qc
        };
      }
      return c;
    }));
    logAction('Quality Check', 'QC Department', `QC for Claim #${claimId}: ${qc.passed ? 'PASSED' : 'FAILED - RETURNED TO REPAIR'}`);
  };

  const collectClaim = (claimId: string, collection: NonNullable<WarrantyClaim['collection']>) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: 'Collected / Closed',
          collection
        };
      }
      return c;
    }));
    logAction('Collected Claim', 'Customer Service', `Watch collected for Claim #${claimId}. OTP Verified: ${collection.otpVerified}`);
  };

  // Replacements & Extensions
  const createReplacement = (repData: Omit<WarrantyReplacement, 'id' | 'date'>): WarrantyReplacement => {
    const newRep: WarrantyReplacement = {
      ...repData,
      id: `REP-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString().substring(0, 10)
    };
    setReplacements(prev => [newRep, ...prev]);

    // Re-link warranty product ID to replacement product
    setWarranties(prev => prev.map(w => {
      if (w.id === repData.originalWarrantyId) {
        return {
          ...w,
          productId: repData.replacementProductId,
          productBrand: 'कल्प Replacement',
          productModel: repData.replacementProductName,
          serialNumber: repData.replacementSerialNumber,
          remarks: `Watch replaced on ${newRep.date}. Original: ${w.productModel}`
        };
      }
      return w;
    }));

    logAction('Created Watch Replacement', 'Warranty Management', `Replaced watch for Warranty #${repData.originalWarrantyId} with ${repData.replacementProductName}`);
    return newRep;
  };

  const extendWarranty = (extData: Omit<WarrantyExtension, 'id' | 'createdAt'>): WarrantyExtension => {
    const newExt: WarrantyExtension = {
      ...extData,
      id: `EXT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    setExtensions(prev => [newExt, ...prev]);

    // Extend warranty end date
    setWarranties(prev => prev.map(w => {
      if (w.id === extData.warrantyId) {
        const currentEnd = new Date(w.extendedEnd || w.warrantyEnd);
        currentEnd.setMonth(currentEnd.getMonth() + extData.extensionMonths);
        return {
          ...w,
          extendedEnd: currentEnd.toISOString().substring(0, 10),
          extensionReason: extData.reason,
          status: 'Active'
        };
      }
      return w;
    }));

    logAction('Extended Warranty Term', 'Warranty Management', `Extended Warranty #${extData.warrantyId} by ${extData.extensionMonths} months. New expiry: ${newExt.newExpiry}`);
    return newExt;
  };

  // Verification Audit Logging
  const logVerification = (warrantyId: string, method: VerificationLog['method'], result: VerificationLog['result']) => {
    const newLog: VerificationLog = {
      id: `vlog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      warrantyId,
      method,
      timestamp: new Date().toISOString(),
      result
    };
    setVerificationLogs(prev => [newLog, ...prev.slice(0, 100)]);
  };

  const updateNotificationTemplates = (templates: NotificationTemplate[]) => {
    setNotificationTemplates(templates);
    logAction('Updated Notification Templates', 'Settings', 'Updated automated SMS/WhatsApp templates');
  };

  const updateWarrantySettings = (settings: Partial<WarrantySettings>) => {
    setWarrantySettings(prev => ({ ...prev, ...settings }));
    logAction('Updated Warranty Settings', 'Settings', 'Updated global warranty configuration and terms');
  };

  const addServiceHistory = (warrantyId: string, service: Omit<WarrantyServiceHistory, 'id' | 'warrantyId'>) => {
    const newService: WarrantyServiceHistory = {
      ...service,
      id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      warrantyId
    };

    setWarranties(prev => {
      const next = prev.map(w => {
        if (w.id === warrantyId) {
          return {
            ...w,
            serviceHistory: [newService, ...(w.serviceHistory || [])]
          };
        }
        return w;
      });
      saveWarrantiesCloud(next);
      return next;
    });

    logAction('Added Service Record', 'Warranty', `Added repair record for Warranty ${warrantyId}: ${service.issue}`);
  };

  // Purchases
  const createPurchase = (purchaseData: {
    supplierId: string;
    invoiceNumber: string;
    purchaseDate: string;
    cost: number;
    quantity: number;
    paymentMethod?: string;
    paymentAccountCode?: string;
    items: { productId: string; productName: string; quantity: number; unitCost: number }[];
  }) => {
    const supplier = suppliers.find(s => s.id === purchaseData.supplierId);
    const payAccCode = purchaseData.paymentAccountCode || '1010';
    const payAcc = accounts.find(a => a.code === payAccCode) || {
      id: payAccCode === '2010' ? 'acc-2010' : 'acc-1010',
      code: payAccCode,
      name: payAccCode === '2010' ? 'Accounts Payable (Suppliers)' : 'Cash in Hand'
    };

    const newPurchase: Purchase = {
      id: `pur-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      supplierId: purchaseData.supplierId,
      supplierName: supplier?.name || 'Swiss Supplier',
      invoiceNumber: purchaseData.invoiceNumber,
      purchaseDate: purchaseData.purchaseDate,
      cost: purchaseData.cost,
      quantity: purchaseData.quantity,
      tax: Math.round(purchaseData.cost * 0.13),
      discount: 0,
      warehouse: 'Durbar Marg Flagship Warehouse',
      paymentMethod: purchaseData.paymentMethod || payAcc.name,
      paymentAccountCode: payAccCode,
      createdBy: currentUser.name,
      items: purchaseData.items
    };

    // Update Product stock for each item
    purchaseData.items.forEach(item => {
      adjustStock(item.productId, item.quantity, `Purchase Order #${purchaseData.invoiceNumber}`);
    });

    setPurchases(prev => {
      const next = [newPurchase, ...prev];
      savePurchasesCloud(next);
      return next;
    });

    // Accounting Entry
    const purchaseJE: JournalEntry = {
      id: `je-pur-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      entryNumber: `JE-PUR-${Date.now().toString().slice(-4)}`,
      date: purchaseData.purchaseDate,
      description: `Purchase of inventory stock from ${supplier?.name || 'Supplier'} - Invoice #${purchaseData.invoiceNumber} (${payAcc.name})`,
      reference: purchaseData.invoiceNumber,
      createdBy: currentUser.name,
      lines: [
        { accountId: 'acc-1200', accountCode: '1200', accountName: 'Watch Inventory Asset', debit: purchaseData.cost, credit: 0 },
        { accountId: payAcc.id, accountCode: payAccCode, accountName: payAcc.name, debit: 0, credit: purchaseData.cost }
      ]
    };
    setJournalEntries(prev => {
      const next = [purchaseJE, ...prev];
      saveJournalEntriesCloud(next);
      return next;
    });

    // Update Chart of Account balances
    setAccounts(prev => {
      const next = prev.map(acc => {
        if (acc.code === '1200') return { ...acc, balance: acc.balance + purchaseData.cost };
        if (acc.code === payAccCode) {
          if (payAccCode.startsWith('1')) return { ...acc, balance: acc.balance - purchaseData.cost };
          return { ...acc, balance: acc.balance + purchaseData.cost };
        }
        return acc;
      });
      saveAccountsCloud(next);
      return next;
    });

    // Update Supplier balance due if on credit
    if (purchaseData.supplierId && payAccCode === '2010') {
      setSuppliers(prev => {
        const next = prev.map(s => s.id === purchaseData.supplierId ? { ...s, balanceDue: s.balanceDue + purchaseData.cost } : s);
        saveSuppliersCloud(next);
        return next;
      });
    }

    logAction('Created Purchase Order', 'Purchases', `Purchased ${purchaseData.quantity} watches total cost NPR ${purchaseData.cost.toLocaleString()} via ${payAcc.name}`);
  };

  const deletePurchase = (id: string) => {
    const target = purchases.find(p => p.id === id);
    if (!target) return;

    setPurchases(prev => {
      const next = prev.filter(p => p.id !== id);
      savePurchasesCloud(next);
      return next;
    });
    setJournalEntries(prev => {
      const next = prev.filter(je => je.reference !== target.invoiceNumber && !je.id.includes(id));
      saveJournalEntriesCloud(next);
      return next;
    });

    // Revert account balances
    setAccounts(prev => {
      const next = prev.map(acc => {
        if (acc.code === '1200') return { ...acc, balance: Math.max(0, acc.balance - target.cost) };
        if (acc.code === '2010') return { ...acc, balance: Math.max(0, acc.balance - target.cost) };
        return acc;
      });
      saveAccountsCloud(next);
      return next;
    });

    // Update supplier balance due
    if (target.supplierId) {
      setSuppliers(prev => {
        const next = prev.map(s => s.id === target.supplierId ? { ...s, balanceDue: Math.max(0, s.balanceDue - target.cost) } : s);
        saveSuppliersCloud(next);
        return next;
      });
    }

    logAction('Deleted Purchase Order', 'Purchases', `Deleted purchase order #${target.invoiceNumber} (${target.id}) of NPR ${target.cost.toLocaleString()}`);
  };

  // Manual Journal Entry
  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'entryNumber'>) => {
    const newJE: JournalEntry = {
      ...entry,
      id: `je-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      entryNumber: `JE-MAN-${Date.now().toString().slice(-4)}`
    };
    setJournalEntries(prev => {
      const next = [newJE, ...prev];
      saveJournalEntriesCloud(next);
      return next;
    });

    // Automatically update matching account balances & auto-create missing account headings in Chart of Accounts
    setAccounts(prev => {
      let currentAccounts = [...prev];

      // Auto-detect lines that don't exist in currentAccounts
      entry.lines.forEach(line => {
        if (line.accountCode && !currentAccounts.some(a => a.code === line.accountCode)) {
          const codePrefix = line.accountCode.substring(0, 1);
          let category: Account['category'] = 'Assets';
          let type = 'Current Asset';

          if (codePrefix === '2') {
            category = 'Liabilities';
            type = 'Current Liability';
          } else if (codePrefix === '3') {
            category = 'Equity';
            type = 'Equity';
          } else if (codePrefix === '4') {
            category = 'Revenue';
            type = 'Operating Revenue';
          } else if (codePrefix === '5') {
            category = 'Expenses';
            type = 'Operating Expense';
          }

          currentAccounts.push({
            id: line.accountId || `acc-${line.accountCode}`,
            code: line.accountCode,
            name: line.accountName || `Account ${line.accountCode}`,
            category,
            type,
            balance: 0
          });
        }
      });

      const next = currentAccounts.map(acc => {
        const matchingLines = entry.lines.filter(l => l.accountCode === acc.code || l.accountId === acc.id);
        if (matchingLines.length === 0) return acc;

        let netChange = 0;
        matchingLines.forEach(l => {
          if (acc.category === 'Assets' || acc.category === 'Expenses') {
            netChange += (l.debit - l.credit);
          } else {
            netChange += (l.credit - l.debit);
          }
        });

        return { ...acc, balance: acc.balance + netChange };
      });
      saveAccountsCloud(next);
      return next;
    });

    logAction('Added Manual Journal Entry', 'Accounting', `Posted JE #${newJE.entryNumber}: ${entry.description}`);
  };

  // Accounts & Double Entry Management
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_fiscal_years`);
    return saved ? JSON.parse(saved) : DEFAULT_FISCAL_YEARS;
  });

  const [costCenters, setCostCenters] = useState<CostCenter[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cost_centers`);
    return saved ? JSON.parse(saved) : DEFAULT_COST_CENTERS;
  });

  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_fixed_assets`);
    return saved ? JSON.parse(saved) : DEFAULT_FIXED_ASSETS;
  });

  const addFiscalYear = (fyData: Omit<FiscalYear, 'id'>) => {
    const newFY: FiscalYear = {
      ...fyData,
      id: `fy-${Date.now()}`
    };
    setFiscalYears(prev => {
      const updated = [newFY, ...prev.map(f => fyData.isCurrent ? { ...f, isCurrent: false } : f)];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_fiscal_years`, JSON.stringify(updated));
      return updated;
    });
    logAction('Added Fiscal Year', 'Accounting Master', `Added Fiscal Period: ${newFY.name}`);
  };

  const closeFiscalYear = (id: string): { success?: boolean; entryNumber?: string; error?: string } => {
    const fy = fiscalYears.find(f => f.id === id);
    if (!fy) return { error: 'Fiscal year not found' };
    if (fy.status === 'Closed') return { error: 'This fiscal year is already closed and locked.' };

    const pnl = AccountingEngine.generateProfitAndLoss(journalEntries, accounts);
    const closingEntry = AccountingEngine.createYearEndClosingEntry(pnl, accounts, journalEntries, fy.name, currentUser.name);

    if (closingEntry.lines.length > 0) {
      postVoucher(closingEntry);
    }

    setFiscalYears(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, status: 'Closed' as const, isCurrent: false } : f);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_fiscal_years`, JSON.stringify(updated));
      return updated;
    });
    logAction('Closed Fiscal Year', 'Accounting Period', `Closed accounting period ${fy.name} with closing entry #${closingEntry.entryNumber}`);
    return { success: true, entryNumber: closingEntry.entryNumber || 'JV-CLOSE' };
  };

  const addCostCenter = (ccData: Omit<CostCenter, 'id'>) => {
    const newCC: CostCenter = {
      ...ccData,
      id: `cc-${Date.now()}`
    };
    setCostCenters(prev => {
      const updated = [...prev, newCC];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_cost_centers`, JSON.stringify(updated));
      return updated;
    });
    logAction('Added Cost Center', 'Accounting Master', `Created Cost Center: ${newCC.name} (${newCC.code})`);
  };

  const addFixedAsset = (assetData: Omit<FixedAsset, 'id'>) => {
    const newAsset: FixedAsset = {
      ...assetData,
      id: `ast-${Date.now()}`
    };
    setFixedAssets(prev => {
      const updated = [...prev, newAsset];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_fixed_assets`, JSON.stringify(updated));
      return updated;
    });

    // Auto-post asset purchase voucher if cost > 0
    if (newAsset.cost > 0) {
      postVoucher({
        entryNumber: `AST-${newAsset.code}`,
        date: newAsset.purchaseDate,
        voucherType: 'Fixed Asset Purchase',
        sourceModule: 'Fixed Assets',
        description: `Acquisition of Fixed Asset: ${newAsset.name} (${newAsset.code})`,
        reference: newAsset.code,
        createdBy: currentUser.name,
        isPosted: true,
        lines: [
          {
            accountId: newAsset.accountId || 'acc-1510',
            accountCode: newAsset.accountId.replace('acc-', '') || '1510',
            accountName: accounts.find(a => a.id === newAsset.accountId)?.name || 'Fixed Asset Account',
            debit: newAsset.cost,
            credit: 0,
            particulars: `Purchase of ${newAsset.name}`
          },
          {
            accountId: 'acc-1020',
            accountCode: '1020',
            accountName: 'Nabil Bank Corporate Account',
            debit: 0,
            credit: newAsset.cost,
            particulars: `Bank disbursement for ${newAsset.name}`
          }
        ]
      });
    }

    logAction('Added Fixed Asset', 'Fixed Assets', `Registered asset ${newAsset.name} at NPR ${newAsset.cost.toLocaleString()}`);
  };

  const runAssetDepreciation = (assetId: string): JournalEntry | { error: string } => {
    const asset = fixedAssets.find(a => a.id === assetId);
    if (!asset) return { error: 'Asset not found' };
    if (asset.netBookValue <= asset.salvageValue) return { error: 'Asset is fully depreciated to salvage value.' };

    const annualDepreciation = Math.round((asset.cost - asset.salvageValue) * (asset.depreciationRate / 100));
    const deprAmt = Math.min(annualDepreciation, asset.netBookValue - asset.salvageValue);
    if (deprAmt <= 0) return { error: 'Depreciation amount is 0' };

    const voucherRes = postVoucher({
      entryNumber: `DEP-${asset.code}-${Date.now().toString().substring(8)}`,
      date: new Date().toISOString().substring(0, 10),
      voucherType: 'Depreciation Entry',
      sourceModule: 'Fixed Assets',
      description: `Annual Depreciation write-off for ${asset.name} (${asset.code}) at ${asset.depreciationRate}%`,
      reference: asset.code,
      createdBy: currentUser.name,
      isPosted: true,
      lines: [
        {
          accountId: asset.depreciationAccountId || 'acc-5080',
          accountCode: '5080',
          accountName: 'Depreciation Expense',
          debit: deprAmt,
          credit: 0,
          particulars: `Depreciation on ${asset.name}`
        },
        {
          accountId: 'acc-1590',
          accountCode: '1590',
          accountName: 'Accumulated Depreciation (Contra-Asset)',
          debit: 0,
          credit: deprAmt,
          particulars: `Accumulated depreciation reserve for ${asset.name}`
        }
      ]
    });

    if (voucherRes.error || !voucherRes.entry) return { error: voucherRes.error || 'Failed to post depreciation' };

    setFixedAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        const newAccum = a.accumulatedDepreciation + deprAmt;
        const newNBV = Math.max(a.salvageValue, a.cost - newAccum);
        return {
          ...a,
          accumulatedDepreciation: newAccum,
          netBookValue: newNBV
        };
      }
      return a;
    }));

    logAction('Ran Depreciation', 'Fixed Assets', `Depreciated ${asset.name} by NPR ${deprAmt.toLocaleString()}`);
    return voucherRes.entry;
  };

  /**
   * Universal Double-Entry Voucher Posting Engine
   * Validates: Sum(Debit) === Sum(Credit)
   */
  const postVoucher = (voucherData: Omit<JournalEntry, 'id'>): { entry?: JournalEntry; error?: string } => {
    const totalDebit = voucherData.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
    const totalCredit = voucherData.lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);

    const diff = Math.abs(Math.round((totalDebit - totalCredit) * 100) / 100);
    if (diff > 0.05) {
      return {
        error: `Double-Entry Validation Failed: Total Debit (NPR ${totalDebit.toLocaleString()}) does not match Total Credit (NPR ${totalCredit.toLocaleString()}). Difference: NPR ${diff.toLocaleString()}`
      };
    }

    const currentYear = new Date().getFullYear();
    let prefix = 'JV';
    if (voucherData.voucherType === 'Customer Receipt') prefix = 'REC';
    else if (voucherData.voucherType === 'Supplier Payment') prefix = 'PAY';
    else if (voucherData.voucherType === 'Expense Voucher') prefix = 'EXP';
    else if (voucherData.voucherType === 'Contra / Transfer') prefix = 'CNTR';
    else if (voucherData.voucherType === 'Sales Return' || voucherData.voucherType === 'Credit Note') prefix = 'CRN';
    else if (voucherData.voucherType === 'Purchase Return' || voucherData.voucherType === 'Debit Note') prefix = 'DBN';
    else if (voucherData.voucherType === 'Fixed Asset Purchase') prefix = 'AST';
    else if (voucherData.voucherType === 'Depreciation Entry') prefix = 'DEP';
    else if (voucherData.voucherType === 'Year-End Adjustment') prefix = 'ADJ';

    const count = journalEntries.length + 1;
    const entryNumber = voucherData.entryNumber || `${prefix}-${currentYear}-${String(count).padStart(4, '0')}`;

    const newJE: JournalEntry = {
      ...voucherData,
      id: `je-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      entryNumber,
      isPosted: true,
      createdBy: voucherData.createdBy || currentUser.name
    };

    setJournalEntries(prev => {
      const next = [newJE, ...prev];
      saveJournalEntriesCloud(next);
      return next;
    });

    // Update affected Account balances
    setAccounts(prev => {
      let currentAccounts = [...prev];

      // Auto-create missing account heads if line specifies a code not in Chart of Accounts
      newJE.lines.forEach(line => {
        if (line.accountCode && !currentAccounts.some(a => a.code === line.accountCode)) {
          const codePrefix = line.accountCode.substring(0, 1);
          let category: Account['category'] = 'Assets';
          let type = 'Current Asset';
          if (codePrefix === '2') { category = 'Liabilities'; type = 'Current Liability'; }
          else if (codePrefix === '3') { category = 'Equity'; type = 'Equity'; }
          else if (codePrefix === '4') { category = 'Revenue'; type = 'Operating Revenue'; }
          else if (codePrefix === '5') { category = 'Expenses'; type = 'Operating Expense'; }

          currentAccounts.push({
            id: line.accountId || `acc-${line.accountCode}`,
            code: line.accountCode,
            name: line.accountName || `Account ${line.accountCode}`,
            category,
            type,
            balance: 0
          });
        }
      });

      const next = currentAccounts.map(acc => {
        const matchingLines = newJE.lines.filter(l => l.accountCode === acc.code || l.accountId === acc.id);
        if (matchingLines.length === 0) return acc;

        let netDelta = 0;
        matchingLines.forEach(l => {
          if (acc.category === 'Assets' || acc.category === 'Expenses') {
            netDelta += ((Number(l.debit) || 0) - (Number(l.credit) || 0));
          } else {
            netDelta += ((Number(l.credit) || 0) - (Number(l.debit) || 0));
          }
        });

        return { ...acc, balance: acc.balance + netDelta };
      });

      saveAccountsCloud(next);
      return next;
    });

    logAction('Posted Accounting Voucher', 'Accounting Engine', `Posted ${newJE.voucherType || 'Voucher'} #${newJE.entryNumber}: Total NPR ${totalDebit.toLocaleString()}`);

    return { entry: newJE };
  };

  /**
   * Reversal Entry Generator for Audit Corrections
   */
  const reverseJournalEntry = (entryId: string, reason: string): JournalEntry | { error: string } => {
    const target = journalEntries.find(j => j.id === entryId);
    if (!target) return { error: 'Journal entry not found' };
    if (target.isReversed) return { error: 'This journal entry has already been reversed.' };

    const revJE = AccountingEngine.createReversalJournalEntry(target, reason, currentUser.name);

    // Mark original as reversed
    setJournalEntries(prev => {
      const next = [
        revJE,
        ...prev.map(j => j.id === entryId ? { ...j, isReversed: true, reversalReason: reason, reversalOfId: revJE.id } : j)
      ];
      saveJournalEntriesCloud(next);
      return next;
    });

    // Update account balances
    setAccounts(prev => {
      const next = prev.map(acc => {
        const matchingLines = revJE.lines.filter(l => l.accountCode === acc.code || l.accountId === acc.id);
        if (matchingLines.length === 0) return acc;

        let netDelta = 0;
        matchingLines.forEach(l => {
          if (acc.category === 'Assets' || acc.category === 'Expenses') {
            netDelta += ((Number(l.debit) || 0) - (Number(l.credit) || 0));
          } else {
            netDelta += ((Number(l.credit) || 0) - (Number(l.debit) || 0));
          }
        });

        return { ...acc, balance: acc.balance + netDelta };
      });
      saveAccountsCloud(next);
      return next;
    });

    logAction('Reversed Journal Entry', 'Audit & Control', `Reversed #${target.entryNumber} with Reversal Voucher #${revJE.entryNumber}. Reason: ${reason}`);

    return revJE;
  };

  const resetAccountsToDefault = () => {
    setAccounts(DEFAULT_CHART_OF_ACCOUNTS);
    setCostCenters(DEFAULT_COST_CENTERS);
    setFiscalYears(DEFAULT_FISCAL_YEARS);
    setFixedAssets(DEFAULT_FIXED_ASSETS);
    saveAccountsCloud(DEFAULT_CHART_OF_ACCOUNTS);
    logAction('Reset Chart of Accounts', 'Accounting Master', 'Restored standard Swiss/Nepal double-entry Chart of Accounts.');
  };

  // Accounts Management (Dynamic creation / alteration / removal)
  const addAccount = (accountData: Omit<Account, 'id' | 'balance'> & { initialBalance?: number }) => {
    const newAcc: Account = {
      id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      code: accountData.code,
      name: accountData.name,
      category: accountData.category,
      group: accountData.group,
      type: accountData.type,
      balance: accountData.initialBalance || 0,
      openingBalance: accountData.initialBalance || 0,
      description: accountData.description
    };
    setAccounts(prev => {
      const updated = [...prev, newAcc];
      saveAccountsCloud(updated);
      return updated;
    });
    logAction('Added Account Head', 'Accounting Master', `Created new account head [${newAcc.code}] ${newAcc.name} (${newAcc.category})`);
    return newAcc;
  };

  const updateAccount = (id: string, updatedData: Partial<Account>): Account | { error: string } => {
    const target = accounts.find(a => a.id === id || a.code === id);
    if (!target) return { error: 'Account not found' };

    // Check if new code conflicts with another account
    if (updatedData.code && updatedData.code !== target.code) {
      const codeExists = accounts.some(a => a.id !== target.id && a.code === updatedData.code);
      if (codeExists) {
        return { error: `Account code "${updatedData.code}" is already in use by another account.` };
      }
    }

    const oldCode = target.code;
    const newCode = updatedData.code || target.code;
    const oldName = target.name;
    const newName = updatedData.name || target.name;

    // Calculate balance adjustment if opening balance changed
    let newBalance = target.balance;
    if (updatedData.openingBalance !== undefined && updatedData.openingBalance !== target.openingBalance) {
      const deltaOpening = (updatedData.openingBalance || 0) - (target.openingBalance || 0);
      newBalance = (updatedData.balance !== undefined ? updatedData.balance : target.balance + deltaOpening);
    } else if (updatedData.balance !== undefined) {
      newBalance = updatedData.balance;
    }

    const modifiedAcc: Account = {
      ...target,
      ...updatedData,
      id: target.id,
      code: newCode,
      name: newName,
      balance: newBalance
    };

    // Update Accounts state and persist
    setAccounts(prev => {
      const next = prev.map(a => a.id === target.id ? modifiedAcc : a);
      saveAccountsCloud(next);
      return next;
    });

    // If code or name changed, propagate to all historical journal entry lines
    if (oldCode !== newCode || oldName !== newName) {
      setJournalEntries(prev => {
        const next = prev.map(je => ({
          ...je,
          lines: je.lines?.map(line => {
            if (line.accountId === target.id || line.accountCode === oldCode) {
              return {
                ...line,
                accountCode: newCode,
                accountName: newName
              };
            }
            return line;
          })
        }));
        saveJournalEntriesCloud(next);
        return next;
      });
    }

    logAction('Altered Account Head', 'Accounting Master', `Modified account head [${oldCode} -> ${newCode}] "${oldName}" -> "${newName}" (${modifiedAcc.category}, Group: ${modifiedAcc.group || 'N/A'})`);
    return modifiedAcc;
  };

  const deleteAccount = (id: string, force: boolean = false): { success: boolean; error?: string } => {
    const target = accounts.find(a => a.id === id || a.code === id);
    if (!target) return { success: false, error: 'Account not found' };

    // Check if journal entries exist for this account
    const referencingEntries = journalEntries.filter(je =>
      je.lines?.some(l => l.accountId === target.id || l.accountCode === target.code)
    );

    if (referencingEntries.length > 0 && !force) {
      return {
        success: false,
        error: `Cannot delete account [${target.code}] "${target.name}" because it is referenced in ${referencingEntries.length} journal entry voucher(s). You can edit/rename it or delete linked vouchers first.`
      };
    }

    setAccounts(prev => {
      const updated = prev.filter(a => a.id !== target.id && a.code !== target.code);
      saveAccountsCloud(updated);
      return updated;
    });

    logAction('Deleted Account Head', 'Accounting Master', `Removed account head [${target.code}] ${target.name} (${target.category})`);
    return { success: true };
  };

  // Sync accounts and journal entries
  const syncJournalEntriesAndAccounts = () => {
    let newEntriesCount = 0;
    const currentYear = new Date().getFullYear();

    const updatedJournalEntries = [...journalEntries];

    // 1. Ensure journal entries exist for all sales
    sales.forEach((sale, index) => {
      const hasJE = updatedJournalEntries.some(je => je.reference === sale.invoiceNumber);
      if (!hasJE) {
        const invSeq = String(index + 1).padStart(4, '0');
        const cogs = products.find(p => p.id === sale.productId)?.purchasePrice || sale.sellingPrice * 0.7;

        const jeLines = [
          {
            accountId: sale.paymentMethod === 'Cash' ? 'acc-1010' : sale.paymentMethod === 'eSewa' ? 'acc-1030' : 'acc-1020',
            accountCode: sale.paymentMethod === 'Cash' ? '1010' : sale.paymentMethod === 'eSewa' ? '1030' : '1020',
            accountName: sale.paymentMethod === 'Cash' ? 'Cash in Hand' : sale.paymentMethod === 'eSewa' ? 'eSewa Merchant Wallet' : 'Nabil Bank Main Account',
            debit: sale.finalTotal,
            credit: 0
          }
        ];

        if (sale.discount > 0) {
          jeLines.push({
            accountId: 'acc-5030',
            accountCode: '5030',
            accountName: 'Sales Discounts Given',
            debit: sale.discount,
            credit: 0
          });
        }

        jeLines.push({
          accountId: 'acc-4010',
          accountCode: '4010',
          accountName: 'Watch Sales Revenue',
          debit: 0,
          credit: sale.sellingPrice
        });

        const saleJE: JournalEntry = {
          id: `je-sync-sale-${sale.id}`,
          entryNumber: `JE-${currentYear}-${invSeq}`,
          date: sale.orderDate || new Date().toISOString().substring(0, 10),
          description: `Sale of ${sale.productBrand} ${sale.productModel} - Invoice #${sale.invoiceNumber}`,
          reference: sale.invoiceNumber,
          createdBy: sale.createdBy || 'System Sync',
          lines: jeLines
        };

        const cogsJE: JournalEntry = {
          id: `je-sync-cogs-${sale.id}`,
          entryNumber: `JE-${currentYear}-${invSeq}-COGS`,
          date: sale.orderDate || new Date().toISOString().substring(0, 10),
          description: `COGS Recognition for Invoice #${sale.invoiceNumber}`,
          reference: sale.invoiceNumber,
          createdBy: sale.createdBy || 'System Sync',
          lines: [
            { accountId: 'acc-5010', accountCode: '5010', accountName: 'Cost of Goods Sold (COGS)', debit: cogs, credit: 0 },
            { accountId: 'acc-1200', accountCode: '1200', accountName: 'Watch Inventory Asset', debit: 0, credit: cogs }
          ]
        };

        updatedJournalEntries.unshift(saleJE, cogsJE);
        newEntriesCount += 2;
      }
    });

    // 2. Ensure journal entries exist for all purchases
    purchases.forEach((pur) => {
      const hasJE = updatedJournalEntries.some(je => je.reference === pur.invoiceNumber);
      if (!hasJE) {
        const payAccCode = pur.paymentAccountCode || (pur.paymentMethod?.toLowerCase().includes('credit') ? '2010' : '1010');
        const payAccName = payAccCode === '2010' ? 'Accounts Payable (Suppliers)' : payAccCode === '1020' ? 'Nabil Bank Main Account' : payAccCode === '1030' ? 'eSewa Merchant Wallet' : 'Cash in Hand';
        const payAccId = payAccCode === '2010' ? 'acc-2010' : payAccCode === '1020' ? 'acc-1020' : payAccCode === '1030' ? 'acc-1030' : 'acc-1010';

        const purJE: JournalEntry = {
          id: `je-sync-pur-${pur.id}`,
          entryNumber: `JE-PUR-${pur.invoiceNumber}`,
          date: pur.purchaseDate || new Date().toISOString().substring(0, 10),
          description: `Purchase of inventory stock from ${pur.supplierName} - Invoice #${pur.invoiceNumber} (${payAccName})`,
          reference: pur.invoiceNumber,
          createdBy: pur.createdBy || 'System Sync',
          lines: [
            { accountId: 'acc-1200', accountCode: '1200', accountName: 'Watch Inventory Asset', debit: pur.cost, credit: 0 },
            { accountId: payAccId, accountCode: payAccCode, accountName: payAccName, debit: 0, credit: pur.cost }
          ]
        };
        updatedJournalEntries.unshift(purJE);
        newEntriesCount += 1;
      }
    });

    if (newEntriesCount > 0) {
      setJournalEntries(updatedJournalEntries);
    }

    // 3. Re-calculate all account balances from journal entries & auto-pull missing account headings
    setAccounts(prev => {
      let currentAccounts = [...prev];

      // Auto-detect journal entry lines with account codes missing from currentAccounts
      updatedJournalEntries.forEach(je => {
        je.lines.forEach(line => {
          if (line.accountCode && !currentAccounts.some(a => a.code === line.accountCode)) {
            const codePrefix = line.accountCode.substring(0, 1);
            let category: Account['category'] = 'Assets';
            let type = 'Current Asset';

            if (codePrefix === '2') {
              category = 'Liabilities';
              type = 'Current Liability';
            } else if (codePrefix === '3') {
              category = 'Equity';
              type = 'Equity';
            } else if (codePrefix === '4') {
              category = 'Revenue';
              type = 'Operating Revenue';
            } else if (codePrefix === '5') {
              category = 'Expenses';
              type = 'Operating Expense';
            }

            currentAccounts.push({
              id: line.accountId || `acc-${line.accountCode}`,
              code: line.accountCode,
              name: line.accountName || `Account ${line.accountCode}`,
              category,
              type,
              balance: 0
            });
          }
        });
      });

      const accountBalancesMap: Record<string, number> = {};

      updatedJournalEntries.forEach(je => {
        je.lines.forEach(line => {
          if (!accountBalancesMap[line.accountCode]) {
            accountBalancesMap[line.accountCode] = 0;
          }
          const accDef = currentAccounts.find(a => a.code === line.accountCode);
          const category = accDef?.category || (line.accountCode.startsWith('1') || line.accountCode.startsWith('5') ? 'Assets' : 'Revenue');

          if (category === 'Assets' || category === 'Expenses') {
            accountBalancesMap[line.accountCode] += (line.debit - line.credit);
          } else {
            accountBalancesMap[line.accountCode] += (line.credit - line.debit);
          }
        });
      });

      const next = currentAccounts.map(acc => {
        const computedBal = accountBalancesMap[acc.code];
        if (computedBal !== undefined) {
          return { ...acc, balance: computedBal };
        }
        return acc;
      });

      saveAccountsCloud(next);
      return next;
    });

    logAction('Journal Data Synced', 'Accounting', `Pulled and recalculated data from ${updatedJournalEntries.length} Journal Entries across Chart of Accounts.`);

    return {
      entriesCount: updatedJournalEntries.length,
      newEntriesCreated: newEntriesCount,
      accountsCount: accounts.length
    };
  };

  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setProducts(INITIAL_PRODUCTS);
    setCustomers([]);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales([]);
    setPurchases([]);
    setWarranties([]);
    setClaims([]);
    setReplacements([]);
    setExtensions([]);
    setVerificationLogs([]);
    setFixedAssets([]);
    setAccounts(INITIAL_ACCOUNTS);
    setJournalEntries([]);
    setBanners(INITIAL_CMS_BANNERS);
    setVideos(INITIAL_CMS_VIDEOS);
    setAuditLogs([]);
    localStorage.clear();
    logAction('System Reset', 'System', 'Cleared all dummy records and reset system to clean production state.');
  };

  const globalSearch = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return { products: [], sales: [], warranties: [], customers: [] };

    return {
      products: products.filter(p => p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q)),
      sales: sales.filter(s => s.invoiceNumber.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q) || s.customerMobile.includes(q) || s.serialNumber.toLowerCase().includes(q)),
      warranties: warranties.filter(w => w.id.toLowerCase().includes(q) || w.serialNumber.toLowerCase().includes(q) || w.customerName.toLowerCase().includes(q) || w.customerMobile.includes(q)),
      customers: customers.filter(c => c.name.toLowerCase().includes(q) || c.mobile.includes(q) || (c.instagramId && c.instagramId.toLowerCase().includes(q)))
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        updateUser,
        deleteUser,
        updateUserRole,
        toggleUserActive,
        resetUserPassword,
        loginStaffUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        restoreAllStocksExcept,
        customers,
        addCustomer,
        suppliers,
        addSupplier,
        sales,
        createSale,
        updateSale,
        deleteSale,
        warranties,
        getWarrantyByIdOrMobile,
        getWarrantiesByMobile,
        updateWarrantyStatus,
        activateWarranty,
        addServiceHistory,
        claims,
        submitClaim,
        updateClaimStatus,
        addInspection,
        approveClaim,
        updateRepair,
        passQualityCheck,
        collectClaim,
        replacements,
        createReplacement,
        extensions,
        extendWarranty,
        verificationLogs,
        logVerification,
        notificationTemplates,
        updateNotificationTemplates,
        warrantySettings,
        updateWarrantySettings,
        purchases,
        createPurchase,
        deletePurchase,
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        journalEntries,
        addJournalEntry,
        postVoucher,
        reverseJournalEntry,
        syncJournalEntriesAndAccounts,
        fiscalYears,
        addFiscalYear,
        closeFiscalYear,
        costCenters,
        addCostCenter,
        fixedAssets,
        addFixedAsset,
        runAssetDepreciation,
        resetAccountsToDefault,
        homepageContent,
        updateHomepageContent,
        banners,
        addBanner,
        toggleBannerActive,
        deleteBanner,
        videos,
        updateHeroVideo,
        auditLogs,
        logAction,
        resetToDefaultData,
        globalSearch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
