// orders.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { OrderDto } from './orders.dto';
import { OrdersService } from './orders.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { RefundDto } from './refund.dto';

@UseGuards(JwtGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  // @Post('with-mpesa')
  // async createOrderWithMpesa(@Body() dto: OrderDto, @GetUser() user: User) {
  //   return this.orderService.createOrderWithMpesa(dto, user.id);
  // }
  @Post()
  async createOrderWithMpesa(@Body() dto: OrderDto, @GetUser() user: User) {
    return this.orderService.createOrder(dto, user.id);
  }
  @Post('refund')
  async refundOrdes(@Body() dto: RefundDto) {
    return this.orderService.refundOrder(dto);
  }

  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }
  @Get('report/day')
  async getReportForDay(@Query('date') date: string) {
    return this.orderService.getReportForDay(date);
  }

  @Get('report/month')
  async getReportForMonth(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.orderService.getReportForMonth(year, month);
  }

  @Get('report/range')
  async getReportForDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.orderService.getReportForDateRange(startDate, endDate);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    const numericId = parseInt(id, 10); // Convert to number
    console.log(`Controller - getOrderById - ID: ${numericId}`);
    return this.orderService.getOrderById(numericId);
  }

  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() dto: OrderDto) {
    const numericId = parseInt(id, 10); // Convert to number
    return this.orderService.updateOrder(numericId, dto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    const numericId = parseInt(id, 10); // Convert to number
    return this.orderService.deleteOrder(numericId);
  }
  @Post('mpesa/result')
  async handleMpesaResult(@Req() req: Request, @Res() res: Response) {
    // Process the result from M-Pesa
    console.log('M-Pesa Result:', req.body);

    // Here you could update the order status based on the M-Pesa result
    // For example:
    // const transactionId = req.body.TransactionID;
    // const resultCode = req.body.ResultCode;
    // await this.orderService.updateOrderMpesaStatus(transactionId, resultCode);

    // res.status(200).send('OK');
  }

  @Post('mpesa/timeout')
  async handleMpesaTimeout(@Req() req: Request, @Res() res: Response) {
    // Handle timeout scenario
    console.log('M-Pesa Timeout:', req.body);

    // Here you could update the order status to indicate a timeout
    // For example:
    // const transactionId = req.body.TransactionID;
    // await this.orderService.updateOrderMpesaStatus(transactionId, 'TIMEOUT');

    // res.status(200).send('OK');
  }
}
