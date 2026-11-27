export type OrderStatus =
  | 'RECEIVED'
  | 'IN_PROGRESS'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED';

export interface OrderCustomer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
}

export interface OrderEmployee {
  id: number;
  name: string;
  email: string;
}

export interface OrderService {
  id: number;
  name: string;
  price: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  service: OrderService;
}

export interface OrderPayment {
  id: number;
  amount: string;
  method: 'CASH' | 'CARD' | 'MBWAY' | 'BANK_TRANSFER';
  status: PaymentStatus;
  paidAt: string | null;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: string;
  notes: string | null;
  receivedAt: string;
  estimatedDeliveryAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: OrderCustomer;
  employee: OrderEmployee | null;
  items: OrderItem[];
  payment: OrderPayment | null;
}

export interface CreateOrderItem {
  serviceId: number;
  quantity: number;
}

export interface CreateOrderData {
  customerId: number;
  employeeId?: number;
  estimatedDeliveryAt?: string;
  notes?: string;
  items: CreateOrderItem[];
}