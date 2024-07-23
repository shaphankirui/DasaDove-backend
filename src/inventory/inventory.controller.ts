// inventory.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryDto } from './inventory.dto';
import { Inventory } from '@prisma/client';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  async createInventory(@Body() dto: InventoryDto): Promise<Inventory> {
    return this.inventoryService.createInventory(dto);
  }

  @Get()
  async getAllInventories(): Promise<Inventory[]> {
    return this.inventoryService.getAllInventories();
  }

  @Get(':id')
  async getInventoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Inventory> {
    return this.inventoryService.getInventoryById(id);
  }

  @Put(':id')
  async updateInventory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: InventoryDto,
  ): Promise<Inventory> {
    return this.inventoryService.updateInventory(id, dto);
  }

  @Delete(':id')
  async deleteInventory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.inventoryService.deleteInventory(id);
  }

  @Get('report/day')
  async getInventoryReportForDay(
    @Query('date') date: string,
  ): Promise<Inventory[]> {
    return this.inventoryService.getInventoryReportForDay(new Date(date));
  }

  @Get('report/range')
  async getInventoryReportForTimeRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Inventory[]> {
    return this.inventoryService.getInventoryReportForTimeRange(
      new Date(startDate),
      new Date(endDate),
    );
  }
}
