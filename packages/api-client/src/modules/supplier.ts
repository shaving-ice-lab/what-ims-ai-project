import { ApiClient } from '../client';

export interface Supplier {
  id: number;
  name: string;
  code: string;
  contactName: string;
  contactPhone: string;
  email?: string;
  address?: string;
  category: string;
  minOrderAmount: number;
  deliveryDays: string[];
  deliveryAreas: string[];
  status: 'active' | 'inactive' | 'pending';
  createTime: string;
  updateTime: string;
}

export interface SupplierListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  category?: string;
  keyword?: string;
}

export interface SupplierListResult {
  list: Supplier[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DeliverySettings {
  minOrderAmount: number;
  deliveryDays: string[];
  deliveryAreas: string[];
  deliveryMode: 'self_delivery' | 'express_delivery';
}

export const createSupplierApi = (client: ApiClient) => ({
  getList: (params?: SupplierListParams) =>
    client.get<SupplierListResult>('/suppliers', { params }),

  getDetail: (id: number) => client.get<Supplier>(`/suppliers/${id}`),

  getDeliverySettings: (id: number) => client.get<DeliverySettings>(`/suppliers/${id}/delivery`),

  updateDeliverySettings: (id: number, settings: DeliverySettings) =>
    client.put<void>(`/suppliers/${id}/delivery`, settings),

  getStatistics: (id: number, startDate?: string, endDate?: string) =>
    client.get<{ orderCount: number; orderAmount: number }>(`/suppliers/${id}/statistics`, {
      params: { startDate, endDate },
    }),
});

export type SupplierApi = ReturnType<typeof createSupplierApi>;
