import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useOrderStore } from '@/store/useOrderStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Search, Eye, Filter, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const OrdersListPage = ({ status }) => {
  const navigate = useNavigate();
  const { orders, fetchOrdersByStatus, isLoading } = useOrderStore();
  
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchSale, setSearchSale] = useState('');

  useEffect(() => {
    fetchOrdersByStatus(status);
  }, [status, fetchOrdersByStatus]);

  const filteredOrders = orders.filter(order => {
    const customerName = `${order.customer?.title}${order.customer?.firstName} ${order.customer?.lastName}`.toLowerCase();
    const saleName = `${order.sale?.title}${order.sale?.firstName} ${order.sale?.lastName}`.toLowerCase();
    
    return customerName.includes(searchCustomer.toLowerCase()) && 
           saleName.includes(searchSale.toLowerCase());
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'process':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 flex items-center gap-1 w-fit">
          <Clock className="w-3 h-3" /> รอตรวจสอบ
        </Badge>;
      case 'pass':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1 w-fit">
          <CheckCircle className="w-3 h-3" /> อนุมัติแล้ว
        </Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex items-center gap-1 w-fit">
          <XCircle className="w-3 h-3" /> ไม่อนุมัติ
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'process': return 'ใบเสนอราคาที่รอการตรวจสอบ';
      case 'pass': return 'ใบเสนอราคาที่อนุมัติแล้ว';
      case 'fail': return 'ใบเสนอราคาที่ไม่อนุมัติ';
      default: return 'รายการใบเสนอราคา';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-gray-500 text-sm">จัดการและตรวจสอบใบเสนอราคาในระบบ</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            ตัวกรอง
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาตามชื่อลูกค้า..."
                className="pl-10"
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาตามชื่อพนักงานขาย..."
                className="pl-10"
                value={searchSale}
                onChange={(e) => setSearchSale(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Est No.</TableHead>
                <TableHead>ชื่อลูกค้า</TableHead>
                <TableHead>ชื่อโปรเจกต์</TableHead>
                <TableHead>พนักงานขาย</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    กำลังโหลดข้อมูล...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono font-medium text-blue-600">
                      {order.estNo}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {order.customer?.title}{order.customer?.firstName} {order.customer?.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500 truncate max-w-[150px]">
                        {order.project || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {order.sale?.firstName} {order.sale?.lastName}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ฿{Number(order.totalPrice).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => navigate(`/admin/order/detail/${order._id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        รายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    ไม่พบรายการใบเสนอราคา
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersListPage;
