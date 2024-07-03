import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CustomerDetailsDto {
  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsNumber()
  @IsOptional()
  dueCredit?: number;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
