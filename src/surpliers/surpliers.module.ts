import { Module } from '@nestjs/common';
import { SuppliersService } from './surpliers.service';

@Module({
  providers: [SuppliersService],
  controllers: [SuppliersService],
})
export class SurpliersModule {}
