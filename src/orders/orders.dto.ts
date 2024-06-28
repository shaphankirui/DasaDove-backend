// src/order/dto/order.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  @IsArray()
  items: any; // Adjust the type according to your data structure

  @IsNumber()
  @IsPositive()
  total: number;

  @IsNumber()
  @IsOptional()
  madeBy: number;

  @IsNumber()
  cashPaid: number;
  @IsNumber()
  mpesaPaid: number;
  @IsNumber()
  bankPaid: number;
  @IsNumber()
  totalAmountPaid: number;
  @IsNumber()
  @IsOptional()
  taxAmount: number;
  @IsNumber()
  @IsOptional()
  discountAmount: number;

  @IsNumber()
  @IsOptional()
  customerId: number;

  @IsString()
  @IsOptional()
  printerIp: string;
  @IsBoolean()
  @IsOptional()
  isVoided: boolean;
  @IsBoolean()
  @IsOptional()
  voidedBy: boolean;
  @IsString()
  @IsOptional()
  mpesaTransactionId: string;
}
