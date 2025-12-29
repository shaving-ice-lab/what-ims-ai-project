import { ApiClient } from '../client';

export interface Order {
  id: number;
  orderNo: string;
  storeId: number;
  storeName: string;
  supplierId: number;
  supplierName: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  remark?: string;
  deliveryTime?: string;
  createTime: string;
  updateTime: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

export interface OrderItem {
  id: number;
  materialId: number;
  materialName: string;
  spec: string;
  unit: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface OrderListParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
  storeId?: number;
  supplierId?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

export interface OrderListResult {
  list: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateOrderParams {
  supplierId: number;
  items: { materialId: number; quantity: number }[];
  remark?: string;
  deliveryTime?: string;
}

export const createOrderApi = (client: ApiClient) => ({
  getList: (params?: OrderListParams) => client.get<OrderListResult>('/orders', { params }),

  getDetail: (id: number) => client.get<Order>(`/orders/${id}`),

  create: (params: CreateOrderParams) => client.post<Order>('/orders', params),

  confirm: (id: number) => client.post<void>(`/orders/${id}/confirm`),

  ship: (id: number) => client.post<void>(`/orders/${id}/ship`),

  complete: (id: number) => client.post<void>(`/orders/${id}/complete`),

  cancel: (id: number, reason?: string) => client.post<void>(`/orders/${id}/cancel`, { reason }),
});

export type OrderApi = ReturnType<typeof createOrderApi>;
