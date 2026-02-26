import { Injectable } from '@nestjs/common';
import { Order } from './models/order.model';

@Injectable()
export class OrdersRepository {
  private orders: Order[] = [];

  save(order: Order) {
    this.orders.push(order);
  }

  findAll(): Order[] {
    return this.orders;
  }
}