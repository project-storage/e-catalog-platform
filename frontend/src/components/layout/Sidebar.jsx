import React from 'react';
import { NavLink } from 'react-router';
import { X, Home, Users, ShoppingCart, BarChart3, Settings, Package, Grid, UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { cn } from '@/lib/utils';

const adminItems = [
  { path: '/admin/dashboard', icon: Home, label: 'แดชบอร์ด' },
  { path: '/admin/products', icon: Package, label: 'สินค้า' },
  { path: '/admin/categories', icon: Grid, label: 'หมวดหมู่' },
  { path: '/admin/customers', icon: Users, label: 'ลูกค้า' },
  { path: '/admin/sales', icon: UserCheck, label: 'พนักงานขาย' },
  { path: '/admin/order/process', icon: Clock, label: 'รออนุมัติ' },
  { path: '/admin/order/pass', icon: CheckCircle, label: 'อนุมัติแล้ว' },
  { path: '/admin/order/fail', icon: XCircle, label: 'ไม่อนุมัติ' },
];

const saleItems = [
  { path: '/sale/dashboard', icon: Home, label: 'แดชบอร์ด' },
  { path: '/sale/products', icon: Package, label: 'สินค้า' },
  { path: '/sale/customers', icon: Users, label: 'ลูกค้า' },
  { path: '/sale/cart', icon: ShoppingCart, label: 'ตะกร้าสินค้า' },
  { path: '/sale/order/list-bils', icon: CheckCircle, label: 'รายการใบเสนอราคา' },
  { path: '/sale/order/histories', icon: Clock, label: 'ประวัติการสั่งซื้อ' },
  { path: '/sale/order/fail', icon: XCircle, label: 'รายการที่ถูกยกเลิก' },
];

const Sidebar = ({ isSale = false }) => {
  const { sidebarOpen, setSidebarOpen } = useLayoutStore();
  const sidebarItems = isSale ? saleItems : adminItems;

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200",
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">{isSale ? 'Sale Portal' : 'Admin Panel'}</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="mt-6 px-3 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group",
                  isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              <Icon className={cn(
                "w-5 h-5 mr-3 transition-colors",
                "group-hover:text-blue-600"
              )} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
