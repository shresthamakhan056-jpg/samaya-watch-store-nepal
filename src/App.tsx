import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroVideo } from './components/HeroVideo';
import { WatchGallery } from './components/WatchGallery';
import { SocialOrderModal } from './components/SocialOrderModal';
import { WarrantyPage } from './components/WarrantyPage';
import { PromotionsPage } from './components/PromotionsPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { MaintenancePage } from './components/MaintenancePage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useApp } from './context/AppContext';
import { Product } from './types';

function AppContent() {
  const { homepageContent } = useApp();
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery' | 'warranty' | 'promotions'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  if (isAdminOpen) {
    return <AdminLayout setIsAdminOpen={setIsAdminOpen} />;
  }

  // If Under Maintenance mode is enabled, display the maintenance page to regular visitors
  if (homepageContent?.maintenanceMode) {
    return <MaintenancePage setIsAdminOpen={setIsAdminOpen} />;
  }

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* HEADER */}
      <Header
        activeTab={currentPage}
        setActiveTab={(tab: string) => setCurrentPage(tab as any)}
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={setIsAdminOpen}
      />

      {/* PAGE ROUTING */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HeroVideo
            setActiveTab={(tab: string) => setCurrentPage(tab as any)}
            onOrderWatch={(prod) => setSelectedProductForModal(prod)}
          />
        )}

        {currentPage === 'gallery' && (
          <WatchGallery onOrderWatch={(prod) => setSelectedProductForModal(prod)} />
        )}

        {currentPage === 'warranty' && <WarrantyPage />}
        {currentPage === 'promotions' && (
          <PromotionsPage setActiveTab={(tab: string) => setCurrentPage(tab as any)} />
        )}
      </main>

      {/* FOOTER */}
      <Footer
        setActiveTab={(tab: string) => setCurrentPage(tab as any)}
        setIsAdminOpen={setIsAdminOpen}
      />

      {/* SOCIAL ORDER INQUIRY MODAL */}
      {selectedProductForModal && (
        <SocialOrderModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

