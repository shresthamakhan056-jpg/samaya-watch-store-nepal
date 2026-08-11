import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  User,
  Product,
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

  // Accounting
  accounts: Account[];
  addAccount: (accountData: Omit<Account, 'id' | 'balance'> & { initialBalance?: number }) => Account;
  deleteAccount: (id: string) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'entryNumber'>) => void;
  syncJournalEntriesAndAccounts: () => { entriesCount: number; newEntriesCreated: number; accountsCount: number };

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

    // 2b. Banners listener
    const bannersRef = doc(db, 'cms_content', 'banners');
    const unsubBanners = onSnapshot(bannersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.banners) && data.banners.length > 0) {
          setBanners(data.banners);
        }
      }
    }, (err) => {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
        isQuotaExceededRef.current = true;
      }
      console.log('Firestore banners listener notice:', err);
    });

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
    const nextContent = { ...homepageContent, ...updated };
    setHomepageContent(nextContent);
    // Sync to Firestore
    setDoc(doc(db, 'cms_content', 'homepage'), nextContent, { merge: true }).catch(console.error);
    logAction('Updated Homepage CMS', 'Marketing CMS', 'Updated homepage hero, text, buttons and social links.');
  };

  const addBanner = (banner: Omit<CMSBanner, 'id'>) => {
    const newBanner: CMSBanner = {
      ...banner,
      id: `ban-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    };
    setBanners(prev => {
      const next = [...prev, newBanner];
      setDoc(doc(db, 'cms_content', 'banners'), { banners: next }, { merge: true }).catch(err => {
        console.error('Firestore add banner sync error:', err);
      });
      return next;
    });
    logAction('Added Banner Slide', 'Marketing CMS', `Added slide photo banner "${banner.title}"`);
  };

  const toggleBannerActive = (id: string) => {
    setBanners(prev => {
      const next = prev.map(b => b.id === id ? { ...b, active: !b.active } : b);
      setDoc(doc(db, 'cms_content', 'banners'), { banners: next }, { merge: true }).catch(console.error);
      return next;
    });
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => {
      const next = prev.filter(b => b.id !== id);
      setDoc(doc(db, 'cms_content', 'banners'), { banners: next }, { merge: true }).catch(console.error);
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
      orderDate: new Date().toISOString().substring(0, 10),
      deliveryDate: new Date().toISOString().substring(0, 10),
      warrantyId,
      createdBy: currentUser.name
    };

    // 3. Create Warranty object
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (product.warrantyMonths || 24));

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
      warrantyStart: startDate.toISOString().substring(0, 10),
      warrantyEnd: endDate.toISOString().substring(0, 10),
      status: 'Active',
      dealerName: 'कल्प',
      invoiceNumber,
      remarks: `Official ${product.brand} International Warranty. Inspected prior to dispatch.`,
      serviceHistory: []
    };

    // 4. Update Product inventory stock
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        const newStock = p.stock - 1;
        let newStatus: Product['status'] = 'In Stock';
        if (newStock === 0) newStatus = 'Out of Stock';
        else if (newStock <= p.reorderLevel) newStatus = 'Low Stock';
        return {
          ...p,
          stock: newStock,
          soldQuantity: p.soldQuantity + 1,
          status: newStatus
        };
      }
      return p;
    }));

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

  // Warranty lookup
  const getWarrantyByIdOrMobile = (query: string): Warranty | undefined => {
    const clean = query.trim().toUpperCase();
    if (!clean) return undefined;

    return warranties.find(w =>
      w.id.toUpperCase() === clean ||
      w.serialNumber.toUpperCase() === clean ||
      w.customerMobile.replace(/\D/g, '').endsWith(clean.replace(/\D/g, '')) ||
      w.invoiceNumber.toUpperCase() === clean
    );
  };

  const getWarrantiesByMobile = (mobile: string): Warranty[] => {
    const clean = mobile.replace(/\D/g, '');
    if (!clean) return [];
    return warranties.filter(w => w.customerMobile.replace(/\D/g, '').includes(clean));
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

    // Automatically update matching account balances
    setAccounts(prev => {
      const next = prev.map(acc => {
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

  // Accounts Management (Dynamic creation / removal)
  const addAccount = (accountData: Omit<Account, 'id' | 'balance'> & { initialBalance?: number }) => {
    const newAcc: Account = {
      id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      code: accountData.code,
      name: accountData.name,
      category: accountData.category,
      type: accountData.type,
      balance: accountData.initialBalance || 0
    };
    setAccounts(prev => {
      const updated = [...prev, newAcc];
      saveAccountsCloud(updated);
      return updated;
    });
    logAction('Added Account', 'Accounting', `Created new account [${newAcc.code}] ${newAcc.name} (${newAcc.category})`);
    return newAcc;
  };

  const deleteAccount = (id: string) => {
    const target = accounts.find(a => a.id === id || a.code === id);
    if (!target) return;
    setAccounts(prev => {
      const updated = prev.filter(a => a.id !== id && a.code !== id);
      saveAccountsCloud(updated);
      return updated;
    });
    logAction('Deleted Account', 'Accounting', `Removed account [${target.code}] ${target.name}`);
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

    // 3. Re-calculate all account balances from journal entries
    const accountBalancesMap: Record<string, number> = {};

    updatedJournalEntries.forEach(je => {
      je.lines.forEach(line => {
        if (!accountBalancesMap[line.accountCode]) {
          accountBalancesMap[line.accountCode] = 0;
        }
        const accDef = accounts.find(a => a.code === line.accountCode);
        const category = accDef?.category || (line.accountCode.startsWith('1') || line.accountCode.startsWith('5') ? 'Assets' : 'Revenue');

        if (category === 'Assets' || category === 'Expenses') {
          accountBalancesMap[line.accountCode] += (line.debit - line.credit);
        } else {
          accountBalancesMap[line.accountCode] += (line.credit - line.debit);
        }
      });
    });

    setAccounts(prev => prev.map(acc => {
      const computedBal = accountBalancesMap[acc.code];
      if (computedBal !== undefined) {
        return { ...acc, balance: computedBal };
      }
      return acc;
    }));

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
    setCustomers(INITIAL_CUSTOMERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales(INITIAL_SALES);
    setPurchases([]);
    setWarranties(INITIAL_WARRANTIES);
    setAccounts(INITIAL_ACCOUNTS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setBanners(INITIAL_CMS_BANNERS);
    setVideos(INITIAL_CMS_VIDEOS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
    logAction('System Reset', 'System', 'Reset ERP database to default demo dataset.');
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
        customers,
        addCustomer,
        suppliers,
        addSupplier,
        sales,
        createSale,
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
        deleteAccount,
        journalEntries,
        addJournalEntry,
        syncJournalEntriesAndAccounts,
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
