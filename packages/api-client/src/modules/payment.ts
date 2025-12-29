import { ApiClient } from '../client';

export type PaymentMethod = 'wechat' | 'alipay' | 'balance' | 'offline';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Payment {
  id: number;
  orderId: number;
  orderNo: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidTime?: string;
  createTime: string;
}

export interface CreatePaymentParams {
  orderId: number;
  method: PaymentMethod;
}

export interface CreatePaymentResult {
  paymentId: number;
  payUrl?: string;
  qrCode?: string;
}

export interface PaymentListParams {
  page?: number;
  pageSize?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
}

export interface PaymentListResult {
  list: Payment[];
  total: number;
  page: number;
  pageSize: number;
}

export const createPaymentApi = (client: ApiClient) => ({
  create: (params: CreatePaymentParams) => client.post<CreatePaymentResult>('/payments', params),

  getDetail: (id: number) => client.get<Payment>(`/payments/${id}`),

  getByOrder: (orderId: number) => client.get<Payment>(`/payments/order/${orderId}`),

  checkStatus: (id: number) => client.get<{ status: PaymentStatus }>(`/payments/${id}/status`),

  getList: (params?: PaymentListParams) => client.get<PaymentListResult>('/payments', { params }),
});

export type PaymentApi = ReturnType<typeof createPaymentApi>;
