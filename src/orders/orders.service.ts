import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './orders.dto';
import { MpesaService } from 'src/mpesa-auth/mpesa/mpesa.service';
import { RefundDto } from './refund.dto';

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

  async refundOrder(dto: RefundDto) {
    const {
      orderId,
      refundItems,
      totalRefund,
      refundPaymentMethod,
      refundedBy,
    } = dto;

    // Start a transaction
    return this.prisma.$transaction(async (prisma) => {
      // Get the current order
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // Parse the items JSON
      const orderItems = JSON.parse(order.items as string);

      // Process each refund item
      for (const refundItem of refundItems) {
        const originalItem = orderItems.find(
          (item) => item.id === refundItem.id,
        );
        if (!originalItem) {
          throw new BadRequestException(
            `Item with ID ${refundItem.id} not found in the original order`,
          );
        }

        if (refundItem.quantity > originalItem.quantity) {
          throw new BadRequestException(
            `Cannot refund more items than originally ordered for product ${refundItem.id}`,
          );
        }

        // Update the order item quantity
        originalItem.quantity -= refundItem.quantity;

        // Update the product quantity
        await prisma.product.update({
          where: { id: refundItem.id },
          data: { quantity: { increment: refundItem.quantity } },
        });
      }

      // Adjust the amount paid based on the refund payment method
      const updateData: any = {
        total: { decrement: totalRefund },
        updatedAt: new Date(),
        items: JSON.stringify(orderItems),
      };

      if (refundPaymentMethod === 'Cash') {
        updateData.cashPaid = { decrement: totalRefund };
      } else if (refundPaymentMethod === 'Mpesa') {
        updateData.mpesaPaid = { decrement: totalRefund };
      } else if (refundPaymentMethod === 'Bank') {
        updateData.bankPaid = { decrement: totalRefund };
      }

      // Update the order
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
      });

      // Store the refund
      const refund = await prisma.refund.create({
        data: {
          orderId,
          refundItems: JSON.stringify(refundItems),
          totalRefund,
          refundPaymentMethod,
          refundedBy,
        },
      });

      return { updatedOrder, refund };
    });
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
