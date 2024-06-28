import { Controller, Get, Param } from '@nestjs/common';
import { MpesaService } from './mpesa.service';

@Controller('mpesa')
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  @Get('check/:transactionId')
  async checkTransaction(@Param('transactionId') transactionId: string) {
    return this.mpesaService.checkTransaction(transactionId);
  }
}
