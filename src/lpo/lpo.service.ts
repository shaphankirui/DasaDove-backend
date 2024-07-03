


import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LpoDto } from './lpo.dto';

@Injectable()
export class LpoService {
  constructor(private readonly prisma: PrismaService) {}

  async createLpo(dto: LpoDto) {
    return this.prisma.localPurchaseOrder.create({
      data: {
        referenceNumber: dto.referenceNumber,
        supplierId: dto.supplierId,
        items: dto.items,
        totalAmount: dto.totalAmount,
        status: dto.status,
      },
    });
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
        referenceNumber: dto.referenceNumber || existingLpo.referenceNumber,
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
}
