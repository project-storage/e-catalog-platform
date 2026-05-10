import React, { useEffect, useState } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Filter, ShoppingCart, Plus, Package } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const ProductsPage = () => {
  const { products, fetchProducts, isLoading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { addToCart, items } = useCartStore();
  
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = products.filter(product => {
    const matchesName = product.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCategory = searchCategory ? product.category?.name === searchCategory : true;
    return matchesName && matchesCategory;
  });

  const getProductCountInCart = (id) => {
    const item = items.find(i => i._id === id);
    return item ? item.qty : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายการสินค้า</h1>
          <p className="text-gray-500 text-sm">เลือกสินค้าเพื่อเพิ่มลงในใบเสนอราคา</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ค้นหาตามชื่อสินค้า..."
            className="pl-10"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <select
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          กำลังโหลดสินค้า...
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const countInCart = getProductCountInCart(product._id);
            return (
              <Card key={product._id} className="overflow-hidden group hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product._id ? (
                    <img 
                      src={`https://e-cattalog-backend.onrender.com/api/product/image/${product._id}`} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {countInCart > 0 && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                      {countInCart}
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Badge variant="secondary" className="mb-2 text-[10px] uppercase font-bold tracking-wider">
                      {product.category?.name || 'ไม่มีหมวดหมู่'}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 truncate" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 h-8">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      ฿{Number(product.price).toLocaleString()}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      เพิ่มลงตะกร้า
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          ไม่พบข้อมูลสินค้า
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
