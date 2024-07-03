import { Module } from '@nestjs/common';
import { CreditController } from './credit-sale.controller';
import { CreditService } from './credit-sale.service';

@Module({
  controllers: [CreditController],
  providers: [CreditService],
})
export class CreditSaleModule {}
