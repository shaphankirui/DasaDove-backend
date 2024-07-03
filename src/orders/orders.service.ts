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
    // Check M-Pesa transaction
    const mpesaResult = await this.mpesaService.checkTransaction(
      dto.mpesaTransactionId,
    );

    // Validate the M-Pesa transaction
    if (
      mpesaResult.ResultCode !== '0' ||
      mpesaResult.ResultDesc !==
        'The service request is processed successfully.'
    ) {
      throw new Error('M-Pesa transaction failed or not found');
    }

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
