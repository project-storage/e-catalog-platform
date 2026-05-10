import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, CreditCard, ShoppingBag, Plus, Eye, ChevronRight, ShoppingCart } from 'lucide-react';
import StatsCard from '@/features/dashboard/components/StatsCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { useOrderStore } from '@/store/useOrderStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const SaleDashboardPage = () => {
  const navigate = useNavigate();
  const { fetchOrdersBySaleAndStatus, orders } = useOrderStore();
  const { fetchCustomersBySale, customers } = useCustomerStore();

  const [recentOrders, setRecentOrders] = useState([]);
  const [myRevenue, setMyRevenue] = useState(0);

  useEffect(() => {
    fetchOrdersBySaleAndStatus('process');
    fetchCustomersBySale();
    
    const loadSaleDashboardData = async () => {
      try {
        const ordersRes = await api.get('/api/order/search/sale/status');
        const allMyOrders = ordersRes.data.data;
        setRecentOrders(allMyOrders.slice(0, 5));
        
        const revenue = allMyOrders
          .filter(o => o.status === 'pass')
          .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        setMyRevenue(revenue);
      } catch (error) {
        console.error("Sale dashboard error:", error);
      }
    };
    loadSaleDashboardData();
  }, [fetchOrdersBySaleAndStatus, fetchCustomersBySale]);

  const stats = [
    { title: 'ใบเสนอราคาของฉัน', value: orders.length, change: 'รออนุมัติ', trend: 'up', color: 'yellow', icon: ShoppingBag },
    { title: 'ยอดขายที่อนุมัติแล้ว', value: `฿${myRevenue.toLocaleString()}`, change: 'ทั้งหมด', trend: 'up', color: 'green', icon: CreditCard },
    { title: 'ลูกค้าในความดูแล', value: customers.length, change: 'ราย', trend: 'up', color: 'blue', icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">สวัสดี! ยินดีต้อนรับสู่ระบบขาย</h1>
          <p className="text-gray-500 text-sm mt-1">สรุปข้อมูลการขายและรายการใบเสนอราคาของคุณ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/sale/customer/create')}>
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มลูกค้า
          </Button>
          <Button onClick={() => navigate('/sale/products')}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            สร้างใบเสนอราคา
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b">
            <CardTitle>ใบเสนอราคาล่าสุด</CardTitle>
            <Button size="sm" variant="link" onClick={() => navigate('/sale/order/histories')}>
              ดูทั้งหมด <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Est No.</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right"></TableHead>
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
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/sale/order/detail/${order._id}`)}>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">ยังไม่มีรายการใบเสนอราคา</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">เริ่มต้นการขาย</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-blue-100 text-sm">
              คุณสามารถสร้างใบเสนอราคาใหม่ได้ทันทีเพียงเลือกสินค้าจากแคตตาล็อกและเลือกลูกค้าที่ต้องการ
            </p>
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">1</div>
                <span className="text-sm font-medium">เลือกสินค้าที่ต้องการ</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">2</div>
                <span className="text-sm font-medium">ปรับแต่งส่วนลดและจำนวน</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">3</div>
                <span className="text-sm font-medium">ยืนยันใบเสนอราคา</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold h-12" onClick={() => navigate('/sale/products')}>
              ไปที่รายการสินค้า
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SaleDashboardPage;
