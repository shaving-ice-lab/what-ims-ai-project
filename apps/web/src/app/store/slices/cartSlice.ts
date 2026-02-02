import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  supplierId: number;
  materialSkuId: number;
  materialName: string;
  brand: string;
  spec: string;
  unit: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  finalPrice: number;
  minQuantity: number;
  stepQuantity: number;
}

interface CartState {
  items: Record<number, CartItem[]>; // Grouped by supplierId
  totalAmount: number;
  itemCount: number;
}

const initialState: CartState = {
  items: {},
  totalAmount: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { supplierId, materialSkuId } = action.payload;
      
      if (!state.items[supplierId]) {
        state.items[supplierId] = [];
      }
      
      const supplierItems = state.items[supplierId]!;
      const existingItemIndex = supplierItems.findIndex(
        item => item.materialSkuId === materialSkuId
      );
      
      if (existingItemIndex >= 0) {
        supplierItems[existingItemIndex]!.quantity += action.payload.quantity;
      } else {
        supplierItems.push(action.payload);
      }
      
      // Update totals
      state.itemCount = Object.values(state.items).reduce(
        (total, items) => total + items.length,
        0
      );
      state.totalAmount = Object.values(state.items).reduce(
        (total, items) => total + items.reduce(
          (sum, item) => sum + (item.finalPrice * item.quantity),
          0
        ),
        0
      );
    },
    updateQuantity: (state, action: PayloadAction<{
      supplierId: number;
      materialSkuId: number;
      quantity: number;
    }>) => {
      const { supplierId, materialSkuId, quantity } = action.payload;
      
      if (state.items[supplierId]) {
        const item = state.items[supplierId].find(
          item => item.materialSkuId === materialSkuId
        );
        
        if (item) {
          item.quantity = quantity;
          
          // Update totals
          state.totalAmount = Object.values(state.items).reduce(
            (total, items) => total + items.reduce(
              (sum, item) => sum + (item.finalPrice * item.quantity),
              0
            ),
            0
          );
        }
      }
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
        
        // Update totals
        state.itemCount = Object.values(state.items).reduce(
          (total, items) => total + items.length,
          0
        );
        state.totalAmount = Object.values(state.items).reduce(
          (total, items) => total + items.reduce(
            (sum, item) => sum + (item.finalPrice * item.quantity),
            0
          ),
          0
        );
      }
    },
    clearCart: (state, action: PayloadAction<number | undefined>) => {
      const supplierId = action.payload;
      
      if (supplierId !== undefined) {
        delete state.items[supplierId];
      } else {
        state.items = {};
      }
      
      // Update totals
      state.itemCount = Object.values(state.items).reduce(
        (total, items) => total + items.length,
        0
      );
      state.totalAmount = Object.values(state.items).reduce(
        (total, items) => total + items.reduce(
          (sum, item) => sum + (item.finalPrice * item.quantity),
          0
        ),
        0
      );
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
