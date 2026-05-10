import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCategoryStore } from '@/store/useCategoryStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { ChevronLeft, Loader2 } from 'lucide-react';

const CategoryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCategoryById, updateCategory } = useCategoryStore();
  
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const category = await getCategoryById(id);
        setName(category.name);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
      } finally {
        setIsFetching(false);
      }
    };
    loadCategory();
  }, [id, getCategoryById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      await updateCategory(id, { name });
      navigate('/admin/categories');
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
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/categories')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">แก้ไขหมวดหมู่</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">ข้อมูลหมวดหมู่</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ชื่อหมวดหมู่</label>
              <Input
                placeholder="ระบุชื่อหมวดหมู่"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <Button variant="outline" type="button" onClick={() => navigate('/admin/categories')} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                'บันทึกการแก้ไข'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CategoryEditPage;
