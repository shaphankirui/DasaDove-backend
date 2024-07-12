import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './orders.dto';
import { MpesaService } from 'src/mpesa-auth/mpesa/mpesa.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mpesaService: MpesaService,
  ) {}

  async createOrder(dto: OrderDto, userId: number) {
    // // Check M-Pesa transaction
    // const mpesaResult = await this.mpesaService.checkTransaction(
    //   dto.mpesaTransactionId,
    // );

    // // Validate the M-Pesa transaction
    // if (
    //   mpesaResult.ResultCode !== '0' ||
    //   mpesaResult.ResultDesc !==
    //     'The service request is processed successfully.'
    // ) {
    //   throw new Error('M-Pesa transaction failed or not found');
    // }

    // If M-Pesa transaction is valid, create the order
    return this.prisma.order.create({
      data: {
        items: dto.items, // Assuming `items` is a list of items in your order
        total: dto.total,
        cashPaid: dto.cashPaid,
        mpesaPaid: dto.mpesaPaid,
        bankPaid: dto.bankPaid,
        totalAmountPaid: dto.totalAmountPaid,
        taxAmount: dto.taxAmount,
        discountAmount: dto.discountAmount,
        customerId: dto.customerId, // Ensure customerId matches the type expected by Prisma
        printerIp: dto.printerIp,
        isVoided: dto.isVoided,
        voidedBy: dto.voidedBy,
        mpesaTransactionId: dto.mpesaTransactionId,
        // Assuming `userId` is for the user who created the order
        user: { connect: { id: userId } },
      },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany();
  }

  async getOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async getReportForDay(date: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
      },
    });

    return this.calculateReportData(orders);
  }

  async getReportForMonth(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: new Date(endDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    return this.calculateReportData(orders);
  }

  async getReportForDateRange(startDate: string, endDate: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lt: new Date(
            new Date(endDate).setDate(new Date(endDate).getDate() + 1),
          ),
        },
      },
    });

    return this.calculateReportData(orders);
  }

  private calculateReportData(orders: any[]) {
    const totalSales = orders.length;
    const totalEarnings = orders.reduce((sum, order) => sum + order.total, 0);
    const totalCashPaid = orders.reduce(
      (sum, order) => sum + order.cashPaid,
      0,
    );
    const totalMpesaPaid = orders.reduce(
      (sum, order) => sum + order.mpesaPaid,
      0,
    );
    const totalBankPaid = orders.reduce(
      (sum, order) => sum + order.bankPaid,
      0,
    );

    return {
      orders,
      totalSales,
      totalEarnings,
      totalCashPaid,
      totalMpesaPaid,
      totalBankPaid,
    };
  }

  async updateOrder(id: number, dto: OrderDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.order.update({
      where: { id },
      data: dto,
    });
  }

  async deleteOrder(id: number) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
