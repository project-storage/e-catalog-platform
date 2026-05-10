import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { User, Mail, Phone, Lock, Loader2, Save } from 'lucide-react';
import api from '@/lib/api';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/api/user/info');
        const data = res.data.data;
        setFormData({
          title: data.title || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          tel: data.tel || '',
          password: '',
        });
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');
      } finally {
        setIsFetching(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      await api.put(`/api/user/update/${user._id}`, updateData);
      setSuccess('อัพเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว');
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ข้อมูลส่วนตัว</h1>
        <p className="text-gray-500 text-sm">จัดการข้อมูลส่วนตัวและความปลอดภัยของบัญชีคุณ</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              รายละเอียดบัญชี
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">
                {success}
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
                  <Input
                    name="firstName"
                    placeholder="ชื่อ"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="lastName"
                    placeholder="นามสกุล"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
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
                    className="pl-10"
                    value={formData.tel}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-700">เปลี่ยนรหัสผ่าน (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-6 border-t border-gray-50">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  บันทึกการเปลี่ยนแปลง
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ProfilePage;
