import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: OrdersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        OrdersRepository,
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<OrdersRepository>(OrdersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {

    it('should split allocation correctly', () => {
      const dto = {
        orderType: 'BUY',
        totalAmount: 100,
        portfolio: [
          { symbol: 'AAPL', weight: 60 },
          { symbol: 'TSLA', weight: 40 },
        ],
      };

      const result = service.createOrder(dto as any);

      expect(result.breakdown).toHaveLength(2);

      expect(result.breakdown[0].allocatedAmount).toBe(60);
      expect(result.breakdown[1].allocatedAmount).toBe(40);

      expect(result.breakdown[0].quantity).toBe(0.6);
      expect(result.breakdown[1].quantity).toBe(0.4);
    });

    it('should use provided price over default price', () => {
      const dto = {
        orderType: 'BUY',
        totalAmount: 100,
        portfolio: [
          { symbol: 'AAPL', weight: 50, price: 200 },
          { symbol: 'TSLA', weight: 50 },
        ],
      };

      const result = service.createOrder(dto as any);

      expect(result.breakdown[0].price).toBe(200);
      expect(result.breakdown[0].quantity).toBe(0.25);
    });

    it('should throw error if weights do not sum to 100', () => {
      const dto = {
        orderType: 'BUY',
        totalAmount: 100,
        portfolio: [
          { symbol: 'AAPL', weight: 50 },
          { symbol: 'TSLA', weight: 30 },
        ],
      };

      expect(() => service.createOrder(dto as any)).toThrow(
        BadRequestException,
      );
    });

    it('should store order in repository', () => {
      const saveSpy = jest.spyOn(repository, 'save');

      const dto = {
        orderType: 'BUY',
        totalAmount: 100,
        portfolio: [
          { symbol: 'AAPL', weight: 60 },
          { symbol: 'TSLA', weight: 40 },
        ],
      };

      service.createOrder(dto as any);

      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should allocate exact total amount without floating drift', () => {
      const dto = {
        orderType: 'BUY',
        totalAmount: 100,
        portfolio: [
          { symbol: 'AAPL', weight: 33.33 },
          { symbol: 'TSLA', weight: 33.33 },
          { symbol: 'MSFT', weight: 33.34 },
        ],
      };

      const result = service.createOrder(dto as any);

      const totalAllocated = result.breakdown.reduce(
        (sum, item) => sum + item.allocatedAmount,
        0,
      );

      expect(totalAllocated).toBe(100);
    });

    it('should round share quantity correctly to configured precision', () => {
      const dto = {
        orderType: 'BUY',
        totalAmount: 100,
        portfolio: [
          { symbol: 'AAPL', weight: 100, price: 3 },
        ],
      };

      const result = service.createOrder(dto as any);

      expect(result.breakdown[0].quantity).toBeCloseTo(33.333, 3);
    });

  });

  describe('getAllOrders', () => {
    it('should return stored orders', () => {
      const dto = {
        orderType: 'BUY',
        totalAmount: 100,
        portfolio: [
          { symbol: 'AAPL', weight: 60 },
          { symbol: 'TSLA', weight: 40 },
        ],
      };

      service.createOrder(dto as any);

      const orders = service.getAllOrders();

      expect(orders.length).toBe(1);
      expect(orders[0].totalAmount).toBe(100);
    });
  });
});