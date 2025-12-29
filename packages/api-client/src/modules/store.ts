import { ApiClient } from '../client';

export interface Store {
  id: number;
  name: string;
  code: string;
  contactName: string;
  contactPhone: string;
  address: string;
  area?: string;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

export interface StoreListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
}

export interface StoreListResult {
  list: Store[];
  total: number;
  page: number;
  pageSize: number;
}

export const createStoreApi = (client: ApiClient) => ({
  getList: (params?: StoreListParams) => client.get<StoreListResult>('/stores', { params }),

  getDetail: (id: number) => client.get<Store>(`/stores/${id}`),

  getStatistics: (id: number, startDate?: string, endDate?: string) =>
    client.get<{ orderCount: number; orderAmount: number }>(`/stores/${id}/statistics`, {
      params: { startDate, endDate },
    }),
});

export type StoreApi = ReturnType<typeof createStoreApi>;
