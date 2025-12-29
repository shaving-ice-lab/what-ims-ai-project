import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 购物车商品项
export interface CartItem {
  materialSkuId: number;
  supplierId: number;
  materialName: string;
  brand: string;
  spec: string;
  unit: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  minQuantity: number;
  stepQuantity: number;
}

// 购物车状态
interface CartState {
  items: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // 添加商品到购物车
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.materialSkuId === action.payload.materialSkuId &&
          item.supplierId === action.payload.supplierId
      );

      if (existingIndex !== -1) {
        const existingItem = state.items[existingIndex];
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        }
      } else {
        state.items.push(action.payload);
      }
    },

    // 更新商品数量
    updateQuantity: (
      state,
      action: PayloadAction<{
        materialSkuId: number;
        supplierId: number;
        quantity: number;
      }>
    ) => {
      const item = state.items.find(
        (i) =>
          i.materialSkuId === action.payload.materialSkuId &&
          i.supplierId === action.payload.supplierId
      );
      if (item) {
        item.quantity = Math.max(action.payload.quantity, item.minQuantity);
      }
    },

    // 删除商品
    removeItem: (
      state,
      action: PayloadAction<{
        materialSkuId: number;
        supplierId: number;
      }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.materialSkuId === action.payload.materialSkuId &&
            item.supplierId === action.payload.supplierId
          )
      );
    },

    // 清空购物车
    clearCart: (state) => {
      state.items = [];
    },

    // 清空指定供应商的商品
    clearSupplierItems: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.supplierId !== action.payload);
    },

    // 设置购物车数据（从服务器同步）
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  setLoading,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  clearSupplierItems,
  setItems,
} = cartSlice.actions;

export default cartSlice.reducer;

// 选择器
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalAmount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartItemsBySupplierId = (supplierId: number) => (state: { cart: CartState }) =>
  state.cart.items.filter((item) => item.supplierId === supplierId);
