import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuotationDto } from './quotation.dto';
import { updateQuotationDto } from './updateQuote.dto';

@Injectable()
export class QuotationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuotation(dto: QuotationDto) {
    const referenceNumber = this.generateReferenceNumber();
    return this.prisma.quotation.create({
      data: {
        referenceNumber,
        supplierId: dto.supplierId, // Use supplierId to store customerId
        items: dto.items,
        totalAmount: dto.totalAmount,
        status: 'pending', // Set default status to pending
      },
    });
  }

  private generateReferenceNumber(): string {
    const date = new Date();
    const timestamp = date.getTime();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `QT-${timestamp}-${randomStr}`;
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
  

  async updateQuotation(id: number, dto: updateQuotationDto) {
    const existingQuotation = await this.getQuotationById(id);
    return this.prisma.quotation.update({
      where: { id },
      data: {
        supplierId: dto.supplierId || existingQuotation.supplierId,
        items: dto.items || existingQuotation.items,
        totalAmount: dto.totalAmount || existingQuotation.totalAmount,
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
