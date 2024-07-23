// inventory.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';

export class InventoryDto {
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  buying_price: number;

  @IsString()
  @IsNotEmpty()
  added_by: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsBoolean()
  @IsNotEmpty()
  deleted: boolean;
}
