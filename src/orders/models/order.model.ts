export interface OrderBreakdown {
  symbol: string;
  allocatedAmount: number;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderType: 'BUY' | 'SELL';
  totalAmount: number;
  executionDate: string;
  createdAt: string;
  breakdown: OrderBreakdown[];
}