import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item._id === product._id);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item._id === product._id
                ? { ...item, qty: Number(item.qty) + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...product,
                qty: 1,
                discount: 0,
              },
            ],
          });
        }
      },

      removeFromCart: (productId) => {
        set({
          items: get().items.filter((item) => item._id !== productId),
        });
      },

      updateQty: (productId, qty) => {
        set({
          items: get().items.map((item) =>
            item._id === productId ? { ...item, qty: Math.max(1, Number(qty)) } : item
          ),
        });
      },

      updateDiscountByCategory: (categoryName, discount) => {
        set({
          items: get().items.map((item) =>
            item.category?.name === categoryName ? { ...item, discount: Number(discount) } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const sum = item.price * item.qty;
          const discountAmount = sum * (item.discount / 100);
          return total + (sum - discountAmount);
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
