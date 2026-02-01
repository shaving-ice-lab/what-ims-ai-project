import { describe, expect, it, beforeEach } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  clearSupplierCart,
  setLoading,
  setError,
} from '../slices/cartSlice';

describe('cartSlice', () => {
  const initialState = {
    items: {},
    totalCount: 0,
    totalAmount: 0,
    loading: false,
    error: null,
  };

  const mockItem = {
    supplierId: 1,
    supplierName: 'Test Supplier',
    materialSkuId: 100,
    materialName: 'Test Material',
    brand: 'Brand A',
    spec: '500g',
    unit: '袋',
    quantity: 2,
    unitPrice: 10,
    markupAmount: 1,
    finalPrice: 11,
    minQuantity: 1,
    stepQuantity: 1,
  };

  const mockItem2 = {
    ...mockItem,
    materialSkuId: 200,
    materialName: 'Test Material 2',
    quantity: 3,
    finalPrice: 15,
  };

  describe('addToCart', () => {
    it('should add item to empty cart', () => {
      const state = cartReducer(initialState, addToCart(mockItem));
      
      expect(state.items[1]).toHaveLength(1);
      expect(state.items[1][0].materialSkuId).toBe(100);
      expect(state.totalCount).toBe(2);
      expect(state.totalAmount).toBe(22); // 11 * 2
    });

    it('should add item to new supplier group', () => {
      const stateWithItem = cartReducer(initialState, addToCart(mockItem));
      const newItem = { ...mockItem, supplierId: 2, supplierName: 'Supplier 2' };
      const state = cartReducer(stateWithItem, addToCart(newItem));

      expect(Object.keys(state.items)).toHaveLength(2);
      expect(state.items[1]).toHaveLength(1);
      expect(state.items[2]).toHaveLength(1);
    });

    it('should update quantity for existing item', () => {
      const stateWithItem = cartReducer(initialState, addToCart(mockItem));
      const sameItem = { ...mockItem, quantity: 3 };
      const state = cartReducer(stateWithItem, addToCart(sameItem));

      expect(state.items[1]).toHaveLength(1);
      expect(state.items[1][0].quantity).toBe(5); // 2 + 3
      expect(state.totalCount).toBe(5);
    });

    it('should add multiple different items to same supplier', () => {
      const stateWithItem = cartReducer(initialState, addToCart(mockItem));
      const state = cartReducer(stateWithItem, addToCart(mockItem2));

      expect(state.items[1]).toHaveLength(2);
      expect(state.totalCount).toBe(5); // 2 + 3
      expect(state.totalAmount).toBe(67); // (11 * 2) + (15 * 3)
    });

    it('should set lastUpdated timestamp', () => {
      const state = cartReducer(initialState, addToCart(mockItem));
      expect(state.lastUpdated).toBeDefined();
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity for existing item', () => {
      const stateWithItem = cartReducer(initialState, addToCart(mockItem));
      const state = cartReducer(
        stateWithItem,
        updateQuantity({
          supplierId: 1,
          materialSkuId: 100,
          quantity: 5,
        })
      );

      expect(state.items[1][0].quantity).toBe(5);
      expect(state.totalCount).toBe(5);
      expect(state.totalAmount).toBe(55); // 11 * 5
    });

    it('should remove item when quantity is 0', () => {
      const stateWithItem = cartReducer(initialState, addToCart(mockItem));
      const state = cartReducer(
        stateWithItem,
        updateQuantity({
          supplierId: 1,
          materialSkuId: 100,
          quantity: 0,
        })
      );

      expect(state.items[1]).toBeUndefined();
      expect(state.totalCount).toBe(0);
      expect(state.totalAmount).toBe(0);
    });

    it('should remove supplier group when last item is removed', () => {
      const stateWithItem = cartReducer(initialState, addToCart(mockItem));
      const state = cartReducer(
        stateWithItem,
        updateQuantity({
          supplierId: 1,
          materialSkuId: 100,
          quantity: 0,
        })
      );

      expect(state.items[1]).toBeUndefined();
    });

    it('should not affect non-existent items', () => {
      const stateWithItem = cartReducer(initialState, addToCart(mockItem));
      const state = cartReducer(
        stateWithItem,
        updateQuantity({
          supplierId: 1,
          materialSkuId: 999,
          quantity: 5,
        })
      );

      expect(state.items[1][0].quantity).toBe(2); // unchanged
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      const stateWithItem = cartReducer(initialState, addToCart(mockItem));
      const state = cartReducer(
        stateWithItem,
        removeFromCart({
          supplierId: 1,
          materialSkuId: 100,
        })
      );

      expect(state.items[1]).toBeUndefined();
      expect(state.totalCount).toBe(0);
    });

    it('should only remove specified item, keeping others', () => {
      let state = cartReducer(initialState, addToCart(mockItem));
      state = cartReducer(state, addToCart(mockItem2));

      state = cartReducer(
        state,
        removeFromCart({
          supplierId: 1,
          materialSkuId: 100,
        })
      );

      expect(state.items[1]).toHaveLength(1);
      expect(state.items[1][0].materialSkuId).toBe(200);
    });

    it('should remove supplier group when last item is removed', () => {
      const stateWithItem = cartReducer(initialState, addToCart(mockItem));
      const state = cartReducer(
        stateWithItem,
        removeFromCart({
          supplierId: 1,
          materialSkuId: 100,
        })
      );

      expect(Object.keys(state.items)).toHaveLength(0);
    });
  });

  describe('clearSupplierCart', () => {
    it('should clear all items from specific supplier', () => {
      let state = cartReducer(initialState, addToCart(mockItem));
      state = cartReducer(state, addToCart(mockItem2));
      const supplier2Item = { ...mockItem, supplierId: 2 };
      state = cartReducer(state, addToCart(supplier2Item));

      state = cartReducer(state, clearSupplierCart(1));

      expect(state.items[1]).toBeUndefined();
      expect(state.items[2]).toHaveLength(1);
    });
  });

  describe('clearCart', () => {
    it('should clear entire cart', () => {
      let state = cartReducer(initialState, addToCart(mockItem));
      state = cartReducer(state, addToCart(mockItem2));

      state = cartReducer(state, clearCart());

      expect(state.items).toEqual({});
      expect(state.totalCount).toBe(0);
      expect(state.totalAmount).toBe(0);
      expect(state.error).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      const state = cartReducer(initialState, setLoading(true));
      expect(state.loading).toBe(true);
    });

    it('should set loading state to false', () => {
      const loadingState = { ...initialState, loading: true };
      const state = cartReducer(loadingState, setLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const state = cartReducer(initialState, setError('Something went wrong'));
      expect(state.error).toBe('Something went wrong');
    });

    it('should clear error message', () => {
      const errorState = { ...initialState, error: 'Previous error' };
      const state = cartReducer(errorState, setError(null));
      expect(state.error).toBeNull();
    });
  });

  describe('totalAmount calculation', () => {
    it('should correctly calculate total amount with multiple items', () => {
      let state = cartReducer(initialState, addToCart(mockItem));
      state = cartReducer(state, addToCart(mockItem2));

      // mockItem: finalPrice 11, quantity 2 = 22
      // mockItem2: finalPrice 15, quantity 3 = 45
      // Total = 67
      expect(state.totalAmount).toBe(67);
    });

    it('should recalculate total after quantity update', () => {
      let state = cartReducer(initialState, addToCart(mockItem));
      
      state = cartReducer(
        state,
        updateQuantity({
          supplierId: 1,
          materialSkuId: 100,
          quantity: 10,
        })
      );

      expect(state.totalAmount).toBe(110); // 11 * 10
    });
  });
});
