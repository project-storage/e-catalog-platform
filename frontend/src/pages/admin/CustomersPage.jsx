import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCustomerStore } from '@/store/useCustomerStore';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Plus, Search, Edit2, Trash2, Filter, Users, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const CustomersPage = () => {
  const navigate = useNavigate();
  const { customers, fetchCustomers, deleteCustomer, isLoading } = useCustomerStore();
  const { users, fetchUsers } = useUserStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchUsers();
  }, [fetchCustomers, fetchUsers]);

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบลูกค้านี้?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบลูกค้า');
      }
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.title} ${customer.firstName} ${customer.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) || 
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.tel.includes(searchTerm);
    
    const matchesSale = selectedSale ? customer.sale?._id === selectedSale : true;
    
    return matchesSearch && matchesSale;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการลูกค้า</h1>
          <p className="text-gray-500 text-sm">ดูและจัดการข้อมูลลูกค้าทั้งหมดในระบบ</p>
        </div>
        <Button onClick={() => navigate('/admin/customer/create')} className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มลูกค้าใหม่
        </Button>
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
                placeholder="ค้นหาชื่อ, อีเมล หรือเบอร์โทรศัพท์..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <UserCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={selectedSale}
                onChange={(e) => setSelectedSale(e.target.value)}
              >
                <option value="">พนักงานขายทั้งหมด</option>
                {users.filter(u => u.role === 'sale').map((sale) => (
                  <option key={sale._id} value={sale._id}>
                    {sale.firstName} {sale.lastName}
                  </option>
                ))}
              </select>
            </div>
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
                <TableHead>ที่อยู่</TableHead>
                <TableHead>พนักงานขาย</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    กำลังโหลดข้อมูล...
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {customer.title}{customer.firstName} {customer.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-xs text-gray-500">{customer.tel}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]" title={customer.address}>
                        {customer.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.sale ? (
                        <Badge variant="secondary" className="font-normal">
                          {customer.sale.firstName} {customer.sale.lastName}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => navigate(`/admin/customer/edit/${customer._id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(customer._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    ไม่พบข้อมูลลูกค้า
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

export default CustomersPage;
