import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Package, Layers, ShieldCheck, Calculator, Users, Sparkles, BarChart3, UserCheck, ShieldAlert, Search, X, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { SalesModule } from './SalesModule';
import { PurchaseModule } from './PurchaseModule';
import { InventoryModule } from './InventoryModule';
import { WarrantyModule } from './WarrantyModule';
import { AccountingModule } from './AccountingModule';
import { CustomerSupplierModule } from './CustomerSupplierModule';
import { MarketingCMS } from './MarketingCMS';
import { ReportsModule } from './ReportsModule';
import { UserManagement } from './UserManagement';
import { AuditLogsModule } from './AuditLogsModule';
import { DomainGoLiveGuide } from './DomainGoLiveGuide';

interface AdminLayoutProps {
  setIsAdminOpen: (open: boolean) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ setIsAdminOpen }) => {
  const { currentUser, setCurrentUser, users, globalSearch, loginStaffUser } = useApp();
  const [adminTab, setAdminTab] = useState<
    'dashboard' | 'sales' | 'purchases' | 'inventory' | 'warranty' | 'accounting' | 'customers' | 'cms' | 'reports' | 'users' | 'audit' | 'domain'
  >('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  
  // Local staff session login state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false); // Locked by default - require login credentials
  const [loginError, setLoginError] = useState('');

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginStaffUser(usernameInput, passwordInput);
    if (success) {
      setIsAuthorized(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Username or Password! (Default Super Admin: admin / admin123)');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  const handleExitShowroom = () => {
    setIsAuthorized(false);
    setUsernameInput('');
    setPasswordInput('');
    setIsAdminOpen(false);
  };

  // If NOT authorized, render ERP Admin Login Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#0F0F12] border-2 border-amber-500/40 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border-2 border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block pt-2">
              INTERNAL ERP SYSTEM
            </span>
            <h2 className="font-serif text-2xl font-bold text-amber-100 uppercase">
              समय- THE WATCH <span className="text-amber-500">STORE</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Authentication required. Enter your staff username and password to log in.
            </p>
          </div>

          <form onSubmit={handleStaffLogin} className="space-y-4 text-xs pt-2">
            <div>
              <label className="text-zinc-400 block mb-1 font-mono">Username:</label>
              <input
                type="text"
                required
                placeholder="Enter username (e.g. admin)"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 font-mono"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-mono">Password:</label>
              <input
                type="password"
                required
                placeholder="Enter password (e.g. admin123)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 font-mono"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-[11px] font-mono text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In to ERP Portal</span>
            </button>
          </form>

          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1 font-mono">
            <div className="text-amber-400 font-bold">Default Demo Credentials:</div>
            <div>Username: <strong className="text-zinc-200">admin</strong></div>
            <div>Password: <strong className="text-zinc-200">admin123</strong></div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 text-center">
            <button
              onClick={handleExitShowroom}
              className="text-xs text-zinc-400 hover:text-amber-300 cursor-pointer underline"
            >
              ← Back to Watch Store Showroom
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleGlobalSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults(null);
    } else {
      setSearchResults(globalSearch(q));
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales & Invoices', icon: ShoppingBag, badge: 'Auto ERP' },
    { id: 'purchases', label: 'Stock Procurement', icon: Package },
    { id: 'inventory', label: 'Watch Inventory', icon: Layers },
    { id: 'warranty', label: 'Digital Warranties', icon: ShieldCheck, badge: 'QR Code' },
    { id: 'accounting', label: 'Financial Accounting', icon: Calculator, badge: 'Double Entry' },
    { id: 'customers', label: 'Customers & Suppliers', icon: Users },
    { id: 'cms', label: 'Marketing CMS', icon: Sparkles },
    { id: 'reports', label: 'Reports & Tax', icon: BarChart3 },
    { id: 'domain', label: 'Domain & Go Live', icon: Globe, badge: 'Live Guide' },
    { id: 'users', label: 'Staff Roles (RBAC)', icon: UserCheck },
    { id: 'audit', label: 'Audit Logs', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#0A0A0B] border-r border-amber-500/20 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo / Portal Title */}
          <div className="pb-4 border-b border-zinc-800">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold block">
              INTERNAL ERP SYSTEM
            </span>
            <h1 className="font-serif text-lg font-bold text-amber-100 uppercase">
              समय- THE WATCH <span className="text-amber-500">STORE</span>
            </h1>
          </div>

          {/* Current User Badge & Lock / Switch */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center border border-amber-500/40 text-xs shrink-0">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-zinc-100 truncate">{currentUser.name}</div>
                <div className="text-[10px] font-mono text-amber-400 truncate">@{currentUser.username} • {currentUser.role}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Session
              </span>
              <button
                onClick={handleLogout}
                className="text-zinc-400 hover:text-rose-400 cursor-pointer text-[10px] font-mono flex items-center gap-1"
                title="Lock Session or Sign Out"
              >
                🔒 Lock / Sign Out
              </button>
            </div>
          </div>

          {/* Menu Items List */}
          <nav className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminTab(item.id as any);
                    setSearchResults(null);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
                      : 'text-zinc-400 hover:text-amber-200 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-amber-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-zinc-950 text-amber-300' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Return to Showroom */}
        <div className="pt-4 border-t border-zinc-800">
          <button
            onClick={handleExitShowroom}
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 font-bold text-xs hover:bg-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Exit ERP to Store Showroom</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Top Global Search Bar */}
        <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-3 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Global ERP Search: Search Invoice #, Customer Mobile, Watch Model, Warranty ID, Serial #, Barcode..."
              value={searchQuery}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-10 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => handleGlobalSearch('')}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Global Search Results Dropdown */}
          {searchResults && (
            <div className="absolute left-0 right-0 top-14 bg-[#0F0F12] border-2 border-amber-500/50 rounded-2xl p-4 shadow-2xl z-50 max-h-96 overflow-y-auto space-y-3 font-mono text-xs text-zinc-300">
              <div className="text-amber-400 font-bold uppercase border-b border-zinc-800 pb-2">
                Search Results for "{searchQuery}"
              </div>

              {searchResults.sales.length > 0 && (
                <div>
                  <span className="text-amber-300 font-bold block mb-1">Matching Sales Invoices ({searchResults.sales.length}):</span>
                  {searchResults.sales.map((s: any) => (
                    <div key={s.id} className="p-2 bg-zinc-950 rounded border border-zinc-800 mb-1 flex justify-between">
                      <span>Invoice #{s.invoiceNumber} - {s.customerName} ({s.watchModel})</span>
                      <span className="text-emerald-400 font-bold">NPR {s.finalTotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.warranties.length > 0 && (
                <div>
                  <span className="text-amber-300 font-bold block mb-1">Matching Warranties ({searchResults.warranties.length}):</span>
                  {searchResults.warranties.map((w: any) => (
                    <div key={w.id} className="p-2 bg-zinc-950 rounded border border-zinc-800 mb-1 flex justify-between">
                      <span>Warranty ID: {w.id} - {w.productBrand} ({w.serialNumber})</span>
                      <span className="text-emerald-400">{w.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.products.length > 0 && (
                <div>
                  <span className="text-amber-300 font-bold block mb-1">Matching Watch Models ({searchResults.products.length}):</span>
                  {searchResults.products.map((p: any) => (
                    <div key={p.id} className="p-2 bg-zinc-950 rounded border border-zinc-800 mb-1 flex justify-between">
                      <span>{p.brand} {p.model} (SKU: {p.sku})</span>
                      <span>Stock: {p.stock}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.sales.length === 0 && searchResults.warranties.length === 0 && searchResults.products.length === 0 && (
                <div className="text-zinc-500 text-center py-4">No records found matching "{searchQuery}".</div>
              )}
            </div>
          )}
        </div>

        {/* TAB RENDERING */}
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigateToPurchases={() => setAdminTab('purchases')}
            onNavigateToAccounting={() => setAdminTab('accounting')}
            onNavigateToSales={() => setAdminTab('sales')}
            onNavigateToInventory={() => setAdminTab('inventory')}
            onNavigateToCMS={() => setAdminTab('cms')}
          />
        )}
        {adminTab === 'sales' && <SalesModule />}
        {adminTab === 'purchases' && <PurchaseModule />}
        {adminTab === 'inventory' && <InventoryModule />}
        {adminTab === 'warranty' && <WarrantyModule />}
        {adminTab === 'accounting' && <AccountingModule />}
        {adminTab === 'customers' && <CustomerSupplierModule />}
        {adminTab === 'cms' && <MarketingCMS />}
        {adminTab === 'reports' && <ReportsModule />}
        {adminTab === 'domain' && <DomainGoLiveGuide />}
        {adminTab === 'users' && <UserManagement />}
        {adminTab === 'audit' && <AuditLogsModule />}

      </main>

    </div>
  );
};
