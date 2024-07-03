import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplierDto } from './suppliersDto.dto';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async createSupplier(dto: SupplierDto) {
    return this.prisma.supplier.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        totalUnpaidSuppliers: dto.totalUnpaidSuppliers,
        deleted: dto.deleted,
      },
    });
  }

  async getAllSuppliers() {
    return this.prisma.supplier.findMany();
  }

  async getSupplierById(id: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async updateSupplier(id: number, dto: SupplierDto) {
    const existingSupplier = await this.getSupplierById(id);
    return this.prisma.supplier.update({
      where: { id },
      data: {
        name: dto.name || existingSupplier.name,
        phone: dto.phone || existingSupplier.phone,
        totalUnpaidSuppliers: dto.totalUnpaidSuppliers || existingSupplier.totalUnpaidSuppliers,
        deleted: dto.deleted || existingSupplier.deleted,
      },
    });
  }

  async deleteSupplier(id: number) {
    await this.getSupplierById(id);
    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}
