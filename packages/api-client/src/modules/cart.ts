import { ApiClient } from '../client';

export interface CartItem {
  id: number;
  materialId: number;
  materialName: string;
  spec: string;
  unit: string;
  price: number;
  quantity: number;
  supplierId: number;
  supplierName: string;
  inStock: boolean;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

export interface AddToCartParams {
  materialId: number;
  quantity: number;
}

export interface UpdateCartItemParams {
  itemId: number;
  quantity: number;
}

export const createCartApi = (client: ApiClient) => ({
  getCart: () => client.get<Cart>('/cart'),

  addItem: (params: AddToCartParams) => client.post<CartItem>('/cart/items', params),

  updateItem: (params: UpdateCartItemParams) =>
    client.put<CartItem>(`/cart/items/${params.itemId}`, { quantity: params.quantity }),

  removeItem: (itemId: number) => client.delete<void>(`/cart/items/${itemId}`),

  clearCart: () => client.delete<void>('/cart'),

  getItemCount: () => client.get<{ count: number }>('/cart/count'),
});

export type CartApi = ReturnType<typeof createCartApi>;
