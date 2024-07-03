import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { SuppliersService } from './surpliers.service';
import { SupplierDto } from './suppliersDto.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  async createSupplier(@Body() dto: SupplierDto) {
    return this.suppliersService.createSupplier(dto);
  }

  @Get()
  async getAllSuppliers() {
    return this.suppliersService.getAllSuppliers();
  }

  @Get(':id')
  async getSupplierById(@Param('id') id: string) {
    return this.suppliersService.getSupplierById(+id);
  }

  @Put(':id')
  async updateSupplier(@Param('id') id: string, @Body() dto: SupplierDto) {
    return this.suppliersService.updateSupplier(+id, dto);
  }

  @Delete(':id')
  async deleteSupplier(@Param('id') id: string) {
    return this.suppliersService.deleteSupplier(+id);
  }
}
