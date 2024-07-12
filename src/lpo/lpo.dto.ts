import { IsNotEmpty, IsNumber, IsString, IsJSON } from 'class-validator';

export class LpoDto {
  @IsString()
  @IsNotEmpty()
  referenceNumber: string;

  @IsNumber()
  @IsNotEmpty()
  supplierId: number;

  @IsJSON()
  @IsNotEmpty()
  items: any;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  status: string;
}