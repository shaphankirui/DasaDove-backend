// src/product/dto/product.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  productIdNumber: string;
  @IsNumber()
  @IsNotEmpty()
  reaorderLevel: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  pictureUrl?: string; // Assuming this is a URL to the product picture

  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @IsOptional()
  @IsNumber()
  quantity?: number;
  @IsOptional()
  @IsNumber()
  storeQuantity?: number;

  @IsOptional()
  @IsBoolean()
  countable?: boolean;
  @IsOptional()
  @IsDateString()
  expiryDate?: Date;
}
