import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Plus, Search, Edit2, Trash2, Filter, UserCheck, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const SalesPage = () => {
  const navigate = useNavigate();
  const { users, fetchUsers, deleteUser, isLoading } = useUserStore();
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานขายท่านนี้?')) {
      try {
        await deleteUser(id);
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบพนักงานขาย');
      }
    }
  };

  // Only show users with 'sale' role for this page
  const sales = users.filter(u => u.role === 'sale');

  const filteredSales = sales.filter(sale => {
    const fullName = `${sale.title} ${sale.firstName} ${sale.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) || 
      sale.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.tel.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการพนักงานขาย</h1>
          <p className="text-gray-500 text-sm">จัดการบัญชีผู้ใช้งานสำหรับพนักงานขาย</p>
        </div>
        <Button onClick={() => navigate('/admin/sale/create')} className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มพนักงานขายใหม่
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ค้นหาชื่อ, อีเมล หรือเบอร์โทรศัพท์..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ-นามสกุล</TableHead>
                <TableHead>ข้อมูลติดต่อ</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    กำลังโหลดข้อมูล...
                  </TableCell>
                </TableRow>
              ) : filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {sale.title}{sale.firstName} {sale.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{sale.email}</div>
                      <div className="text-xs text-gray-500">{sale.tel}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 uppercase">
                        {sale.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => navigate(`/admin/sale/edit/${sale._id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(sale._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    ไม่พบข้อมูลพนักงานขาย
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

export default SalesPage;
