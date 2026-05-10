import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Menu, Bell, Search, ChevronDown, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSidebarOpen } = useLayoutStore();
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const currentPage = location.pathname.split('/').pop() || 'dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userInitials = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : '??';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-800 capitalize">{currentPage}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </Button>
          
          <div className="relative">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {userInitials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-gray-500 uppercase">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                  <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
                </div>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(user?.role === 'admin' ? '/admin/profile' : '/sale/profile');
                  }}
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  โปรไฟล์
                </button>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/admin/settings');
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  ตั้งค่า
                </button>
                <hr className="my-1 border-gray-100" />
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
