import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './orders.dto';
import { MpesaService } from 'src/mpesa-auth/mpesa/mpesa.service';
import { RefundDto } from './refund.dto';
import * as ThermalPrinter from 'node-thermal-printer';
import PrinterTypes from 'node-thermal-printer';

@Injectable()
export class OrdersService {
  private printer: ThermalPrinter.printer | null = null;

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
      let orderItems;
      if (typeof order.items === 'string') {
        try {
          orderItems = JSON.parse(order.items);
        } catch (error) {
          throw new BadRequestException('Invalid order items format');
        }
      } else {
        orderItems = order.items;
      }
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

  async printData(orderId: string, orderData: any) {
    try {
      const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON, // Adjust if you're using a different printer type
        interface: 'printer:USB002',
        options: {
          timeout: 5000,
        },
        width: 48, // Adjust based on your printer's specifications
        characterSet: 'PC437_USA', // Adjust if needed for your language
      });

      const isConnected = await printer.isPrinterConnected();
      console.log('Printer connected:', isConnected);

      if (!isConnected) {
        throw new Error('Printer is not connected');
      }

      // Store information
      const storeName = 'DEMO Org';
      const storeAddress = 'P.O BOX 61600- 002100 ELDORET';
      const storeBranch = 'Eldoret';
      const storePhone = '(+254) 0705419040';
      const tillNumber = '9478205';

      // Order information
      const orderNumber = orderData.orderId;
      const servedBy = orderData.Served_by;
      const orderDate = new Date().toLocaleString();
      const items = orderData.Items;
      const total = orderData.Total;
      const subtotal = total * 0.84;
      const tax = total * 0.16;

      // Start printing
      printer.alignCenter();
      printer.setTextSize(1, 1);
      printer.bold(true);
      printer.println(storeName);
      printer.bold(false);
      printer.setTextNormal();
      printer.println(storeAddress);
      printer.println(storePhone);
      printer.drawLine();

      printer.bold(true);
      printer.println(`Cash Sale #${orderNumber}`);
      printer.println(`Date Time: ${orderDate}`);
      printer.println(`Store: ${storeBranch}`);
      printer.bold(false);
      printer.drawLine();

      // Print order items
      items.forEach((item: any) => {
        printer.leftRight(
          `${item.selectedItems} x ${item.name}`,
          `Ksh.${(item.price * item.selectedItems).toFixed(2)}`,
        );
      });

      printer.drawLine();

      // Print PAYMENTS MODES
      printer.bold(true);
      printer.println(`BUY GOODS: ${tillNumber}`);
      printer.bold(false);
      printer.drawLine();

      // Print totals
      printer.leftRight('Subtotal:', `Ksh.${subtotal.toFixed(2)}`);
      printer.leftRight('Tax:', `Ksh.${tax.toFixed(2)}`);
      printer.bold(true);
      printer.leftRight('Total:', `Ksh.${total.toFixed(2)}`);
      printer.bold(false);

      // Print footer
      printer.drawLine();
      printer.println(`You were Served By: ${servedBy}`);
      printer.println('Thank you for your business!');
      printer.println('');

      // pos bottom
      printer.drawLine();
      printer.println('NON-FISCAL RECEIPT');
      printer.println('FISCAL RECEIPT');
      printer.println('PROVIDED UPON CHECKOUT');
      printer.println('--** END OF NON-TAX INVOICE **--');
      printer.println('');
      printer.println('POS developed by LancolaTech Ltd');
      printer.println('Call: +254715223428');
      printer.println('www.c-pos.co.ke');

      // Cut the paper
      printer.cut();

      // Execute print job
      const result = await printer.execute();
      console.log('Print successful:', result);
    } catch (error) {
      console.error('Error printing receipt:', error);
      throw error; // Rethrow the error if you want to handle it in the calling function
    }
  }
  private centerText(text: string): string {
    const maxWidth = 48; // Assuming a maximum width of 48 characters
    const padding = ' '.repeat(Math.max(0, (maxWidth - text.length) / 2));
    return `${padding}${text}${padding}`;
  }
}
