import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MpesaAuthModule } from 'src/mpesa-auth/mpesa-auth.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [MpesaAuthModule],
})
export class OrdersModule {}
