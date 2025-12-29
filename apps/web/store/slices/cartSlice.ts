import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  materialSkuId: number;
  materialName: string;
  brand: string;
  spec: string;
  unit: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  markupAmount: number;
  finalPrice: number;
  supplierId: number;
  supplierName: string;
  minQuantity: number;
  stepQuantity: number;
}

interface CartState {
  items: Record<number, CartItem[]>; // grouped by supplierId
  totalCount: number;
  lastUpdated?: string;
}

const initialState: CartState = {
  items: {},
  totalCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const supplierId = action.payload.supplierId;
      if (!state.items[supplierId]) {
        state.items[supplierId] = [];
      }
      
      const existingItemIndex = state.items[supplierId].findIndex(
        item => item.materialSkuId === action.payload.materialSkuId
      );
      
      if (existingItemIndex >= 0) {
        state.items[supplierId][existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.items[supplierId].push(action.payload);
      }
      
      state.totalCount = Object.values(state.items).flat().reduce((sum, item) => sum + item.quantity, 0);
      state.lastUpdated = new Date().toISOString();
    },
    updateQuantity: (state, action: PayloadAction<{
      supplierId: number;
      materialSkuId: number;
      quantity: number;
    }>) => {
      const { supplierId, materialSkuId, quantity } = action.payload;
      if (state.items[supplierId]) {
        const item = state.items[supplierId].find(item => item.materialSkuId === materialSkuId);
        if (item) {
          item.quantity = quantity;
          if (quantity === 0) {
            state.items[supplierId] = state.items[supplierId].filter(
              item => item.materialSkuId !== materialSkuId
            );
            if (state.items[supplierId].length === 0) {
              delete state.items[supplierId];
            }
          }
        }
      }
      state.totalCount = Object.values(state.items).flat().reduce((sum, item) => sum + item.quantity, 0);
      state.lastUpdated = new Date().toISOString();
    },
    removeFromCart: (state, action: PayloadAction<{
      supplierId: number;
      materialSkuId: number;
    }>) => {
      const { supplierId, materialSkuId } = action.payload;
      if (state.items[supplierId]) {
        state.items[supplierId] = state.items[supplierId].filter(
          item => item.materialSkuId !== materialSkuId
        );
        if (state.items[supplierId].length === 0) {
          delete state.items[supplierId];
        }
      }
      state.totalCount = Object.values(state.items).flat().reduce((sum, item) => sum + item.quantity, 0);
      state.lastUpdated = new Date().toISOString();
    },
    clearSupplierCart: (state, action: PayloadAction<number>) => {
      delete state.items[action.payload];
      state.totalCount = Object.values(state.items).flat().reduce((sum, item) => sum + item.quantity, 0);
      state.lastUpdated = new Date().toISOString();
    },
    clearCart: (state) => {
      state.items = {};
      state.totalCount = 0;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearSupplierCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
