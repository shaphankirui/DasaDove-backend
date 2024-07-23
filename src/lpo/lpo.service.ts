import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LpoDto } from './lpo.dto';

@Injectable()
export class LpoService {
  constructor(private readonly prisma: PrismaService) {}

  async createLpo(dto: LpoDto) {
    const referenceNumber = this.generateReferenceNumber();
    return this.prisma.localPurchaseOrder.create({
      data: {
        referenceNumber,
        supplierId: dto.supplierId,
        items: dto.items,
        totalAmount: dto.totalAmount,
        status: 'pending', // Set initial status as pending
      },
    });
  }

  private generateReferenceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    return `LPO-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
  }

  async getAllLpos() {
    return this.prisma.localPurchaseOrder.findMany();
  }

  async getLpoById(id: number) {
    const lpo = await this.prisma.localPurchaseOrder.findUnique({
      where: { id },
    });
    if (!lpo) {
      throw new NotFoundException(`LPO with ID ${id} not found`);
    }
    return lpo;
  }

  async updateLpo(id: number, dto: LpoDto) {
    const existingLpo = await this.getLpoById(id);
    return this.prisma.localPurchaseOrder.update({
      where: { id },
      data: {
        supplierId: dto.supplierId || existingLpo.supplierId,
        items: dto.items || existingLpo.items,
        totalAmount: dto.totalAmount || existingLpo.totalAmount,
        status: dto.status || existingLpo.status,
      },
    });
  }

  async deleteLpo(id: number) {
    await this.getLpoById(id);
    return this.prisma.localPurchaseOrder.delete({
      where: { id },
    });
  }

  async approveLpo(id: number) {
    return this.prisma.localPurchaseOrder.update({
      where: { id },
      data: { status: 'approved' },
    });
  }

  async rejectLpo(id: number) {
    return this.prisma.localPurchaseOrder.update({
      where: { id },
      data: { status: 'rejected' },
    });
  }
}
