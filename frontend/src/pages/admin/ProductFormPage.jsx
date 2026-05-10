import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { ChevronLeft, Upload, Loader2, Package, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/api';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const { createProduct, updateProduct, getProductById } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      const loadProduct = async () => {
        try {
          const product = await getProductById(id);
          setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category?._id || '',
          });
          setPreviewUrl(`https://e-cattalog-backend.onrender.com/api/product/image/${id}`);
        } catch (err) {
          setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
        } finally {
          setIsFetching(false);
        }
      };
      loadProduct();
    }
  }, [id, isEdit, fetchCategories, getProductById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('price', formData.price);
      productData.append('description', formData.description);
      productData.append('category', formData.category);
      if (image) {
        productData.append('image', image);
      }

      if (isEdit) {
        await api.put(`/api/product/update/${id}`, productData);
      } else {
        await api.post('/api/product/create', productData);
      }
      
      navigate('/admin/products');
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">ข้อมูลทั่วไป</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ชื่อสินค้า</label>
              <Input
                name="name"
                placeholder="ระบุชื่อสินค้า"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ราคา (บาท)</label>
                <Input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">หมวดหมู่</label>
                <select
                  name="category"
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>เลือกหมวดหมู่</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">รายละเอียด</label>
              <textarea
                name="description"
                rows={4}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                placeholder="ระบุรายละเอียดสินค้า..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">รูปภาพสินค้า</label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={!isEdit}
                />
                {previewUrl ? (
                  <div className="relative w-full max-h-48 flex justify-center">
                    <img src={previewUrl} alt="Preview" className="max-h-48 object-contain rounded-lg shadow-sm" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <p className="text-sm font-medium">คลิกหรือลากรูปภาพมาวางที่นี่</p>
                    <p className="text-xs">PNG, JPG ขนาดไม่เกิน 5MB</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <Button variant="outline" type="button" onClick={() => navigate('/admin/products')} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ProductFormPage;
