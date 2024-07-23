// inventory.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryDto } from './inventory.dto';
import { Inventory } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async createInventory(dto: InventoryDto): Promise<Inventory> {
    return this.prisma.inventory.create({
      data: {
        ...dto,
        createdAt: new Date(),
      },
    });
  }

  async getAllInventories(): Promise<Inventory[]> {
    return this.prisma.inventory.findMany();
  }

  async getInventoryById(id: number): Promise<Inventory> {
    const inventory = await this.prisma.inventory.findUnique({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return inventory;
  }

  async updateInventory(id: number, dto: InventoryDto): Promise<Inventory> {
    try {
      return await this.prisma.inventory.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
  }

  async deleteInventory(id: number): Promise<void> {
    try {
      await this.prisma.inventory.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
  }

  async getInventoryReportForDay(date: Date): Promise<Inventory[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.inventory.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async getInventoryReportForTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Inventory[]> {
    return this.prisma.inventory.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}
