import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsJSON,
  IsOptional,
  IsArray,
} from 'class-validator';

export class LpoDto {
  @IsString()
  @IsOptional()
  referenceNumber: string;

  @IsNumber()
  @IsOptional()
  supplierId: number;

  @IsArray()
  @IsNotEmpty()
  items: any;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsString()
  @IsOptional()
  status: string;
}
