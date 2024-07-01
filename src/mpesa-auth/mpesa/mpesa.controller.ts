import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { MpesaCallbackDto } from './mpesa-callback.dto';

@Controller('mpesa')
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  @Get('check/:transactionId')
  async checkTransaction(@Param('transactionId') transactionId: string) {
    return this.mpesaService.checkTransaction(transactionId);
  }
  @Post('stk-push')
  async initiateSTKPush(
    @Body()
    stkPushDto: {
      phoneNumber: string;
      amount: number;
      accountReference: string;
      transactionDesc: string;
    },
  ) {
    const { phoneNumber, amount, accountReference, transactionDesc } =
      stkPushDto;
    return this.mpesaService.initiateSTKPush(
      phoneNumber,
      amount,
      accountReference,
      transactionDesc,
    );
  }
  @Post('callback')
  async handleSTKPushCallback(@Body() callbackData: any) {
    try {
      console.log('Callback received:', JSON.stringify(callbackData, null, 2));
      return await this.mpesaService.handleSTKPushCallback(callbackData);
    } catch (error) {
      console.error('Error handling callback:', error);
      throw error;
    }
  }
}
