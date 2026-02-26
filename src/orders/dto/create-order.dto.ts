import {
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsString,
  Min,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class PortfolioItemDto {
  @IsString()
  symbol: string;

  @IsNumber()
  @Min(0.0001)
  weight: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.0001)
  price?: number;
}

export class CreateOrderDto {
  @IsEnum(['BUY', 'SELL'])
  orderType: 'BUY' | 'SELL';

  @IsNumber()
  @Min(0.01)
  totalAmount: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PortfolioItemDto)
  portfolio: PortfolioItemDto[];
}