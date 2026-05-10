import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, CreditCard, ShoppingBag, Package, Eye, Plus } from 'lucide-react';
import StatsCard from '@/features/dashboard/components/StatsCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { useOrderStore } from '@/store/useOrderStore';
import { useUserStore } from '@/store/useUserStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { useProductStore } from '@/store/useProductStore';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { fetchOrdersByStatus, orders } = useOrderStore();
  const { fetchUsers, users } = useUserStore();
  const { fetchCustomers, customers } = useCustomerStore();
  const { fetchProducts, products } = useProductStore();

  const [recentOrders, setRecentOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchOrdersByStatus('process');
    fetchUsers();
    fetchCustomers();
    fetchProducts();
    
    const loadDashboardData = async () => {
      try {
        const ordersRes = await api.get('/api/order/all');
        const allOrders = ordersRes.data.data;
        setRecentOrders(allOrders.slice(0, 5));
        
        const revenue = allOrders
          .filter(o => o.status === 'pass')
          .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };
    loadDashboardData();
  }, [fetchOrdersByStatus, fetchUsers, fetchCustomers, fetchProducts]);

  const stats = [
    { title: 'ออร์เดอร์รอตรวจสอบ', value: orders.length, change: 'รออนุมัติ', trend: 'up', color: 'yellow', icon: ShoppingBag },
    { title: 'รายได้ที่อนุมัติแล้ว', value: `฿${totalRevenue.toLocaleString()}`, change: 'ทั้งหมด', trend: 'up', color: 'green', icon: CreditCard },
    { title: 'พนักงานขาย', value: users.filter(u => u.role === 'sale').length, change: 'คน', trend: 'up', color: 'blue', icon: Users },
    { title: 'จำนวนลูกค้า', value: customers.length, change: 'ราย', trend: 'up', color: 'purple', icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">แดชบอร์ดผู้ดูแลระบบ</h1>
        <p className="text-gray-500 text-sm mt-1">ภาพรวมข้อมูลการขายและการดำเนินงานทั้งหมด</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b">
            <CardTitle>รายการใบเสนอราล่าสุด</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/order/process')}>
              ดูทั้งหมด
            </Button>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Est No.</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono font-medium text-blue-600">{order.estNo}</TableCell>
                    <TableCell className="text-gray-600">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </TableCell>
                    <TableCell className="font-bold text-gray-900">฿{Number(order.totalPrice).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        order.status === 'pass' ? 'bg-green-100 text-green-700' : 
                        order.status === 'process' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      )}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/order/detail/${order._id}`)}>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">ไม่มีข้อมูลล่าสุด</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <Card>
          <CardHeader className="px-6 py-5 border-b">
            <CardTitle>สรุปสถานะคลังสินค้า</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">สินค้าทั้งหมด</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{products.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">พนักงานขายที่แอคทีฟ</span>
              </div>
              <span className="text-lg font-bold text-purple-600">{users.filter(u => u.role === 'sale').length}</span>
            </div>
            <Button className="w-full mt-4" onClick={() => navigate('/admin/product/create')}>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มสินค้าใหม่
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
