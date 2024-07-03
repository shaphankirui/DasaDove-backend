import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreditSaleDto } from './credit.dto';

@Injectable()
export class CreditService {
  constructor(private readonly prisma: PrismaService) {}

  async createCreditSale(dto: CreditSaleDto) {
    const creditSale = await this.prisma.creditSale.create({
      data: {
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customer_id },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${dto.customer_id} not found`,
      );
    }

    const updatedDueCredit = (customer.dueCredit || 0) + dto.credit_amount;

    await this.prisma.customer.update({
      where: { id: dto.customer_id },
      data: { dueCredit: updatedDueCredit },
    });

    return creditSale;
  }

  async getAllCreditSales() {
    const creditSales = await this.prisma.creditSale.findMany({
      where: { fully_paid: 0 },
    });

    const totalCreditSales = creditSales.reduce(
      (total, sale) => total + sale.credit_amount,
      0,
    );

    return { creditSales, totalCreditSales };
  }

  async getCreditSaleById(id: number) {
    const creditSale = await this.prisma.creditSale.findUnique({
      where: { id },
    });

    if (!creditSale) {
      throw new NotFoundException(`Credit Sale with ID ${id} not found`);
    }

    return creditSale;
  }

  async updateCreditSale(id: number, dto: Partial<CreditSaleDto>) {
    const creditSale = await this.prisma.creditSale.findUnique({
      where: { id },
    });

    if (!creditSale) {
      throw new NotFoundException(`Credit Sale with ID ${id} not found`);
    }

    const updatedCreditSale = await this.prisma.creditSale.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    return updatedCreditSale;
  }

  async deleteCreditSale(id: number) {
    const creditSale = await this.prisma.creditSale.findUnique({
      where: { id },
    });

    if (!creditSale) {
      throw new NotFoundException(`Credit Sale with ID ${id} not found`);
    }

    await this.prisma.creditSale.delete({
      where: { id },
    });
  }

  async getCreditSaleReportByShift(shiftId: number) {
    const creditSales = await this.prisma.creditSale.findMany({
      where: { shift_id: shiftId },
    });

    const unpaidCreditSales = creditSales.filter(
      (sale) => sale.fully_paid === 0,
    );
    const paidCreditSales = creditSales.filter((sale) => sale.fully_paid !== 0);

    const totalCreditSales = unpaidCreditSales.reduce(
      (total, sale) => total + sale.credit_amount,
      0,
    );
    const totalPaidCreditSales = paidCreditSales.reduce(
      (total, sale) => total + sale.credit_amount,
      0,
    );

    return {
      unpaidCreditSales,
      totalCreditSales,
      paidCreditSales,
      totalPaidCreditSales,
    };
  }

  async getCreditSaleReportByDateRange(
    startDateStr: string,
    endDateStr: string,
  ) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const creditSales = await this.prisma.creditSale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const unpaidCreditSales = creditSales.filter(
      (sale) => sale.fully_paid === 0,
    );
    const paidCreditSales = creditSales.filter((sale) => sale.fully_paid !== 0);

    const totalCreditSales = unpaidCreditSales.reduce(
      (total, sale) => total + sale.credit_amount,
      0,
    );
    const totalPaidCreditSales = paidCreditSales.reduce(
      (total, sale) => total + sale.credit_amount,
      0,
    );

    return {
      unpaidCreditSales,
      totalCreditSales,
      paidCreditSales,
      totalPaidCreditSales,
    };
  }
}
