import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useOrderStore } from '@/store/useOrderStore';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { ChevronLeft, Printer, User, FileText, Package } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrderStore();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        alert('ไม่สามารถโหลดข้อมูลใบเสนอราคาได้');
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [id, getOrderById]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-[60vh]">กำลังโหลด...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">ไม่พบข้อมูลใบเสนอราคา</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">รายละเอียดใบเสนอราคา</h1>
            <p className="text-sm text-gray-500">Est No: {order.estNo}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(`/sale/order/create-pdf/${id}`)}>
          <Printer className="w-4 h-4 mr-2" />
          พิมพ์ PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="border-b border-gray-50">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Package className="w-4 h-4 mr-2 text-blue-600" />
              รายการสินค้า
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>สินค้า</TableHead>
                  <TableHead className="text-center">จำนวน</TableHead>
                  <TableHead className="text-right">ราคา/หน่วย</TableHead>
                  <TableHead className="text-right">ส่วนลด</TableHead>
                  <TableHead className="text-right">ราคารวม</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{item.product?.name}</div>
                      <div className="text-xs text-gray-500">{item.product?.category?.name}</div>
                    </TableCell>
                    <TableCell className="text-center">{item.qty}</TableCell>
                    <TableCell className="text-right">฿{item.product?.price?.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-red-600">-{item.discount}%</TableCell>
                    <TableCell className="text-right font-semibold">฿{item.finalPrice?.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-gray-50/50 flex flex-col items-end gap-2 py-6">
            <div className="flex justify-between w-full max-w-[240px] text-lg font-bold">
              <span className="text-gray-900">ราคาสุทธิ:</span>
              <span className="text-blue-600">฿{order.totalPrice?.toLocaleString()}</span>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-sm font-semibold flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                ข้อมูลลูกค้า
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase">ชื่อลูกค้า</p>
                <p className="text-sm font-medium">{order.customer?.title}{order.customer?.firstName} {order.customer?.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">อีเมล / เบอร์โทรศัพท์</p>
                <p className="text-sm">{order.customer?.email}</p>
                <p className="text-sm">{order.customer?.tel}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-sm font-semibold flex items-center">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                ข้อมูลเอกสาร
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase">ชื่อโปรเจกต์</p>
                <p className="text-sm font-medium">{order.project || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">วันที่สร้างเอกสาร</p>
                <p className="text-sm">{new Date(order.createdAt).toLocaleDateString('th-TH', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">สถานะปัจจุบัน</p>
                {order.status === 'process' && <Badge className="bg-yellow-100 text-yellow-700">รอตรวจสอบ</Badge>}
                {order.status === 'pass' && <Badge className="bg-green-100 text-green-700">อนุมัติแล้ว</Badge>}
                {order.status === 'fail' && <Badge className="bg-red-100 text-red-700">ไม่อนุมัติ</Badge>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
