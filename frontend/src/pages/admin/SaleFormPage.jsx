import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { ChevronLeft, Loader2, User, Mail, Phone, Lock } from 'lucide-react';
import api from '@/lib/api';

const SaleFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const { getUserById } = useUserStore();
  
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const loadSale = async () => {
        try {
          const sale = await getUserById(id);
          setFormData({
            title: sale.title || '',
            firstName: sale.firstName || '',
            lastName: sale.lastName || '',
            email: sale.email || '',
            tel: sale.tel || '',
            password: '',
            confirmPassword: '',
          });
        } catch (err) {
          setError('ไม่สามารถโหลดข้อมูลพนักงานขายได้');
        } finally {
          setIsFetching(false);
        }
      };
      loadSale();
    }
  }, [id, isEdit, getUserById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setIsLoading(false);
      return;
    }

    try {
      if (isEdit) {
        // For update, we might not want to send password if it's empty
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
          delete updateData.confirmPassword;
        }
        await api.put(`/api/user/update/${id}`, updateData);
      } else {
        await api.post('/api/auth/register', formData);
      }
      navigate('/admin/sales');
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/sales')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'แก้ไขข้อมูลพนักงานขาย' : 'เพิ่มพนักงานขายใหม่'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">ข้อมูลส่วนตัว</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 space-y-2">
                <label className="text-sm font-medium text-gray-700">คำนำหน้า</label>
                <select
                  name="title"
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={formData.title}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>เลือก...</option>
                  <option value="นาย.">นาย.</option>
                  <option value="นาง.">นาง.</option>
                  <option value="น.ส.">น.ส.</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      name="firstName"
                      placeholder="ชื่อ"
                      className="pl-10"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      name="lastName"
                      placeholder="นามสกุล"
                      className="pl-10"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">อีเมล</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    name="tel"
                    placeholder="08XXXXXXXX"
                    className="pl-10"
                    value={formData.tel}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="my-4 border-gray-100" />
            <CardTitle className="text-lg font-semibold py-2">ความปลอดภัย</CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {isEdit ? 'เปลี่ยนรหัสผ่าน (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)' : 'รหัสผ่าน'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEdit}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ยืนยันรหัสผ่าน</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isEdit || !!formData.password}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <Button variant="outline" type="button" onClick={() => navigate('/admin/sales')} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                isEdit ? 'บันทึกการแก้ไข' : 'สร้างบัญชี'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default SaleFormPage;
