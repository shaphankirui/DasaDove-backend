import { IsNotEmpty, IsNumber, IsJSON, IsOptional } from 'class-validator';

export class updateQuotationDto {
  @IsNumber()
  @IsOptional()
  supplierId: number; // This will now store customerId

  @IsJSON()
  @IsOptional()
  items: any;

  @IsNumber()
  @IsOptional()
  totalAmount: number;
}
