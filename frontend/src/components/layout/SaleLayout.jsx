import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar'; // We might want a different sidebar for sale
import Header from './Header';
import { useLayoutStore } from '@/store/useLayoutStore';

const SaleLayout = () => {
  const { sidebarOpen, setSidebarOpen } = useLayoutStore();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isSale={true} />
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SaleLayout;
