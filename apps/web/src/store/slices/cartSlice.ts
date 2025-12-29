import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  supplierId: number;
  supplierName: string;
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
  minQuantity: number;
  stepQuantity: number;
}

interface CartState {
  items: Record<number, CartItem[]>;
  totalCount: number;
  totalAmount: number;
  lastUpdated?: string;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: {},
  totalCount: 0,
  totalAmount: 0,
  loading: false,
  error: null,
};

// 辅助函数：重新计算购物车总计
const recalculateTotals = (state: CartState) => {
  const allItems = Object.values(state.items).flat();
  state.totalCount = allItems.reduce((sum, item) => sum + item.quantity, 0);
  state.totalAmount = allItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  state.lastUpdated = new Date().toISOString();
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
        (item) => item.materialSkuId === action.payload.materialSkuId
      );

      if (existingItemIndex >= 0) {
        const existingItem = state.items[supplierId]?.[existingItemIndex];
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        }
      } else {
        state.items[supplierId].push(action.payload);
      }

      recalculateTotals(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        supplierId: number;
        materialSkuId: number;
        quantity: number;
      }>
    ) => {
      const { supplierId, materialSkuId, quantity } = action.payload;
      if (state.items[supplierId]) {
        const item = state.items[supplierId].find((item) => item.materialSkuId === materialSkuId);
        if (item) {
          item.quantity = quantity;
          if (quantity === 0) {
            state.items[supplierId] = state.items[supplierId].filter(
              (item) => item.materialSkuId !== materialSkuId
            );
            if (state.items[supplierId].length === 0) {
              delete state.items[supplierId];
            }
          }
        }
      }
      recalculateTotals(state);
    },
    removeFromCart: (
      state,
      action: PayloadAction<{
        supplierId: number;
        materialSkuId: number;
      }>
    ) => {
      const { supplierId, materialSkuId } = action.payload;
      if (state.items[supplierId]) {
        state.items[supplierId] = state.items[supplierId].filter(
          (item) => item.materialSkuId !== materialSkuId
        );
        if (state.items[supplierId].length === 0) {
          delete state.items[supplierId];
        }
      }
      recalculateTotals(state);
    },
    clearSupplierCart: (state, action: PayloadAction<number>) => {
      delete state.items[action.payload];
      recalculateTotals(state);
    },
    clearCart: (state) => {
      state.items = {};
      state.totalCount = 0;
      state.totalAmount = 0;
      state.lastUpdated = new Date().toISOString();
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
  addToCart,
  updateQuantity,
  removeFromCart,
  clearSupplierCart,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
