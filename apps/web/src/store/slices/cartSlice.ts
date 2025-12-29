import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  supplierId: number;
  supplierName: string;
  materialId: number;
  skuId: number;
  name: string;
  brand: string;
  spec: string;
  unit: string;
  imageUrl?: string;
  quantity: number;
  price: number;
  minOrderQuantity: number;
  minOrderAmount: number;
  subtotal?: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<{ items: CartItem[]; total: number }>) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.error = null;
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.supplierId === action.payload.supplierId && 
                item.skuId === action.payload.skuId
      );
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      } else {
        const newItem = { ...action.payload };
        newItem.subtotal = newItem.quantity * newItem.price;
        state.items.push(newItem);
      }
      
      state.total = state.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ supplierId: number; skuId: number; quantity: number }>) => {
      const item = state.items.find(
        item => item.supplierId === action.payload.supplierId && 
                item.skuId === action.payload.skuId
      );
      
      if (item) {
        item.quantity = action.payload.quantity;
        item.subtotal = item.quantity * item.price;
        state.total = state.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      }
    },
    removeItem: (state, action: PayloadAction<{ supplierId: number; skuId: number }>) => {
      state.items = state.items.filter(
        item => !(item.supplierId === action.payload.supplierId && 
                  item.skuId === action.payload.skuId)
      );
      state.total = state.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
