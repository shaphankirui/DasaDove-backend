import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuotationDto } from './quotation.dto';

@Injectable()
export class QuotationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuotation(dto: QuotationDto) {
    return this.prisma.quotation.create({
      data: {
        referenceNumber: dto.referenceNumber,
        supplierId: dto.supplierId,
        items: dto.items,
        totalAmount: dto.totalAmount,
        status: dto.status,
      },
    });
  }

  async getAllQuotations() {
    return this.prisma.quotation.findMany();
  }

  async getQuotationById(id: number) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
    });
    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${id} not found`);
    }
    return quotation;
  }

  async updateQuotation(id: number, dto: QuotationDto) {
    const existingQuotation = await this.getQuotationById(id);
    return this.prisma.quotation.update({
      where: { id },
      data: {
        referenceNumber:
          dto.referenceNumber || existingQuotation.referenceNumber,
        supplierId: dto.supplierId || existingQuotation.supplierId,
        items: dto.items || existingQuotation.items,
        totalAmount: dto.totalAmount || existingQuotation.totalAmount,
        status: dto.status || existingQuotation.status,
      },
    });
  }

  async deleteQuotation(id: number) {
    await this.getQuotationById(id);
    return this.prisma.quotation.delete({
      where: { id },
    });
  }
}
