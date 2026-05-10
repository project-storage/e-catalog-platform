import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import AdminLayout from '@/components/layout/AdminLayout';
import SaleLayout from '@/components/layout/SaleLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Public Pages
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));

// Admin Pages
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const UsersPage = lazy(() => import('@/pages/UsersPage'));
const OrdersPage = lazy(() => import('@/pages/admin/OrdersListPage'));
const OrderDetailPage = lazy(() => import('@/pages/admin/OrderDetailPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const ProductsPage = lazy(() => import('@/pages/admin/ProductsPage'));
const ProductFormPage = lazy(() => import('@/pages/admin/ProductFormPage'));
const CategoriesPage = lazy(() => import('@/pages/admin/CategoriesPage'));
const CategoryEditPage = lazy(() => import('@/pages/admin/CategoryEditPage'));
const CustomersPage = lazy(() => import('@/pages/admin/CustomersPage'));
const CustomerFormPage = lazy(() => import('@/pages/admin/CustomerFormPage'));
const SalesPage = lazy(() => import('@/pages/admin/SalesPage'));
const SaleFormPage = lazy(() => import('@/pages/admin/SaleFormPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const PdfViewPage = lazy(() => import('@/pages/PdfViewPage'));

// Sale Pages
const SaleDashboardPage = lazy(() => import('@/pages/sale/DashboardPage'));
const SaleProductsPage = lazy(() => import('@/pages/sale/ProductsPage'));
const SaleCustomersPage = lazy(() => import('@/pages/sale/CustomersPage'));
const SaleCustomerFormPage = lazy(() => import('@/pages/sale/CustomerFormPage'));
const CartPage = lazy(() => import('@/pages/sale/CartPage'));
const SaleOrdersPage = lazy(() => import('@/pages/sale/OrdersListPage'));
const SaleOrderDetailPage = lazy(() => import('@/pages/sale/OrderDetailPage'));

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          
          <Route path="order/process" element={<OrdersPage status="process" />} />
          <Route path="order/pass" element={<OrdersPage status="pass" />} />
          <Route path="order/fail" element={<OrdersPage status="fail" />} />
          <Route path="order/detail/:id" element={<OrderDetailPage />} />
          
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/create" element={<ProductFormPage />} />
          <Route path="product/edit/:id" element={<ProductFormPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="category/edit/:id" element={<CategoryEditPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customer/create" element={<CustomerFormPage />} />
          <Route path="customer/edit/:id" element={<CustomerFormPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="sale/create" element={<SaleFormPage />} />
          <Route path="sale/edit/:id" element={<SaleFormPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="order/create-pdf/:id" element={<PdfViewPage />} />
        </Route>

        {/* Sale Routes */}
        <Route
          path="/sale"
          element={
            <ProtectedRoute allowedRoles={['sale']}>
              <SaleLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SaleDashboardPage />} />
          <Route path="products" element={<SaleProductsPage />} />
          <Route path="customers" element={<SaleCustomersPage />} />
          <Route path="customer/create" element={<SaleCustomerFormPage />} />
          <Route path="customer/edit/:id" element={<SaleCustomerFormPage />} />
          <Route path="cart" element={<CartPage />} />
          
          <Route path="order/list-bils" element={<SaleOrdersPage status="pass" />} />
          <Route path="order/histories" element={<SaleOrdersPage status="process" />} />
          <Route path="order/fail" element={<SaleOrdersPage status="fail" />} />
          <Route path="order/detail/:id" element={<SaleOrderDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="order/create-pdf/:id" element={<PdfViewPage />} />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
