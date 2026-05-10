import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCartStore } from '@/store/useCartStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Trash2, ShoppingCart, User, Briefcase, FileText, ChevronRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQty, updateDiscountByCategory, clearCart, getTotal } = useCartStore();
  const { customers, fetchCustomersBySale } = useCustomerStore();
  const { user } = useAuthStore();
  
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [projectName, setProjectName] = useState('No Project');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estNo, setEstNo] = useState('');

  useEffect(() => {
    fetchCustomersBySale();
    const fetchLastOrder = async () => {
      try {
        const res = await api.get('/api/order/new');
        if (res.data.data && res.data.data.length > 0) {
          const lastEst = res.data.data[0].estNo;
          setEstNo(String(parseInt(lastEst) + 1).padStart(8, "0"));
        } else {
          setEstNo("20260001"); // Default start
        }
      } catch (error) {
        console.error("Failed to fetch last order:", error);
        setEstNo("20260001");
      }
    };
    fetchLastOrder();
  }, [fetchCustomersBySale]);

  const handleSubmitOrder = async () => {
    if (!selectedCustomer) {
      alert('กรุณาเลือกลูกค้า');
      return;
    }
    if (items.length === 0) {
      alert('ไม่มีสินค้าในตะกร้า');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderProducts = items.map(item => {
        const sum = item.price * item.qty;
        const discount = sum * (item.discount / 100);
        return {
          product: item._id,
          qty: item.qty,
          discount: item.discount,
          finalPrice: sum - discount
        };
      });

      const reqBody = {
        estNo: estNo,
        customer: selectedCustomer,
        sale: user._id,
        products: orderProducts,
        totalPrice: getTotal(),
        project: projectName
      };

      await api.post('/api/order/create', reqBody);
      clearCart();
      alert('ส่งใบเสนอราคาเรียบร้อยแล้ว รอการอนุมัติจาก Admin');
      navigate('/sale/products');
    } catch (error) {
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างใบเสนอราคา');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group items by category for discount management
  const categories = [...new Set(items.map(item => item.category?.name))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ตะกร้าสินค้า</h1>
        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
          Est No: {estNo}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                รายการสินค้าในตะกร้า
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>สินค้า</TableHead>
                    <TableHead className="w-[100px]">จำนวน</TableHead>
                    <TableHead>ราคา/หน่วย</TableHead>
                    <TableHead>รวมหลังหักส่วนลด</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                        ไม่มีสินค้าในตะกร้า
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => {
                      const sum = item.price * item.qty;
                      const discountAmount = sum * (item.discount / 100);
                      return (
                        <TableRow key={item._id}>
                          <TableCell>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.category?.name}</div>
                            {item.discount > 0 && (
                              <Badge className="mt-1 bg-red-50 text-red-600 hover:bg-red-50 text-[10px]">
                                ลด {item.discount}%
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => updateQty(item._id, e.target.value)}
                              className="h-8 text-center"
                            />
                          </TableCell>
                          <TableCell>฿{item.price.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold text-blue-600">
                            ฿{(sum - discountAmount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeFromCart(item._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {items.length > 0 && categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-700">จัดการส่วนลดตามหมวดหมู่ (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map(cat => (
                    <div key={cat} className="space-y-1">
                      <label className="text-xs text-gray-500 truncate block">{cat}</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        className="h-8"
                        onChange={(e) => updateDiscountByCategory(cat, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg font-semibold flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                ข้อมูลใบเสนอราคา
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                  ลูกค้า
                </label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  required
                >
                  <option value="">เลือกรายชื่อลูกค้า</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                  ชื่อโปรเจกต์
                </label>
                <Input
                  placeholder="ชื่อโปรเจกต์"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">จำนวนรายการ</span>
                  <span className="font-medium text-gray-900">{items.reduce((sum, item) => sum + Number(item.qty), 0)} ชิ้น</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-gray-900">ราคาสุทธิ</span>
                  <span className="text-blue-600">฿{getTotal().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12 text-lg shadow-md" 
                size="lg"
                disabled={isSubmitting || items.length === 0}
                onClick={handleSubmitOrder}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    กำลังส่งข้อมูล...
                  </>
                ) : (
                  <>
                    ยืนยันการสั่งซื้อ
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
