import { IsNotEmpty, IsNumber, IsJSON } from 'class-validator';

export class QuotationDto {
  @IsNumber()
  @IsNotEmpty()
  supplierId: number; // This will now store customerId

  @IsJSON()
  @IsNotEmpty()
  items: any;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
}
