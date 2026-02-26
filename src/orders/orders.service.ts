import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';
import { APP_CONFIG } from '../config/app.config';
import { getExecutionDate } from '../common/utils/market-calendar.util';
import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
  private readonly WEIGHT_TOLERANCE = 0.0001;

  constructor(private readonly repository: OrdersRepository) {}

  createOrder(dto: CreateOrderDto) {
    this.validatePortfolio(dto);

    const breakdown = this.calculateAllocations(dto);

    const order = {
      id: randomUUID(),
      orderType: dto.orderType,
      totalAmount: dto.totalAmount,
      executionDate: getExecutionDate(),
      createdAt: new Date().toISOString(),
      breakdown,
    };

    this.repository.save(order);

    return order;
  }

  getAllOrders() {
    return this.repository.findAll();
  }

  private validatePortfolio(dto: CreateOrderDto) {
    const totalWeight = dto.portfolio.reduce(
      (sum, item) => sum + item.weight,
      0,
    );

    if (Math.abs(totalWeight - 100) > this.WEIGHT_TOLERANCE) {
      throw new BadRequestException(
        'Portfolio weights must total 100',
      );
    }
  }

  private calculateAllocations(dto: CreateOrderDto) {
    const precision = APP_CONFIG.SHARE_DECIMAL_PLACES;
    const defaultPrice = APP_CONFIG.DEFAULT_STOCK_PRICE;

    let remainingAmount = dto.totalAmount;

    return dto.portfolio.map((item, index) => {
      const price = item.price ?? defaultPrice;

      let allocatedAmount: number;

      if (index === dto.portfolio.length - 1) {
        allocatedAmount = this.roundCurrency(remainingAmount);
      } else {
        allocatedAmount = this.roundCurrency(
          (dto.totalAmount * item.weight) / 100,
        );
        remainingAmount -= allocatedAmount;
      }

      const quantity = this.roundToPrecision(
        allocatedAmount / price,
        precision,
      );

      return {
        symbol: item.symbol,
        allocatedAmount,
        price,
        quantity,
      };
    });
  }

  private roundToPrecision(value: number, precision: number) {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }

  private roundCurrency(value: number) {
    return Math.round(value * 100) / 100;
  }
}