import { ApiClient } from '../client';

export interface Material {
  id: number;
  name: string;
  code: string;
  categoryId: number;
  categoryName: string;
  brand: string;
  spec: string;
  unit: string;
  basePrice: number;
  supplierId: number;
  supplierName: string;
  stock: boolean;
  image?: string;
  description?: string;
  createTime: string;
  updateTime: string;
}

export interface MaterialListParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  supplierId?: number;
  keyword?: string;
  inStock?: boolean;
}

export interface MaterialListResult {
  list: Material[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpdatePriceParams {
  materialId: number;
  price: number;
}

export interface UpdateStockParams {
  materialId: number;
  inStock: boolean;
}

export const createMaterialApi = (client: ApiClient) => ({
  getList: (params?: MaterialListParams) =>
    client.get<MaterialListResult>('/materials', { params }),

  getDetail: (id: number) => client.get<Material>(`/materials/${id}`),

  getByCategory: (categoryId: number) =>
    client.get<Material[]>(`/materials/category/${categoryId}`),

  updatePrice: (params: UpdatePriceParams) =>
    client.put<void>(`/materials/${params.materialId}/price`, { price: params.price }),

  updateStock: (params: UpdateStockParams) =>
    client.put<void>(`/materials/${params.materialId}/stock`, { inStock: params.inStock }),

  batchUpdatePrice: (items: UpdatePriceParams[]) =>
    client.post<void>('/materials/batch-price', { items }),
});

export type MaterialApi = ReturnType<typeof createMaterialApi>;
