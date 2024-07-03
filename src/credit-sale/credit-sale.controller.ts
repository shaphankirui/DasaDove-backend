import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreditSaleDto } from './credit.dto';
import { CreditService } from './credit-sale.service';

@Controller('credit-sales')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Post()
  async createCreditSale(@Body() dto: CreditSaleDto) {
    return this.creditService.createCreditSale(dto);
  }

  @Get()
  async getAllCreditSales() {
    return this.creditService.getAllCreditSales();
  }

  @Get(':id')
  async getCreditSaleById(@Param('id') id: string) {
    return this.creditService.getCreditSaleById(+id);
  }

  @Put(':id')
  async updateCreditSale(
    @Param('id') id: string,
    @Body() dto: Partial<CreditSaleDto>,
  ) {
    return this.creditService.updateCreditSale(+id, dto);
  }

  @Delete(':id')
  async deleteCreditSale(@Param('id') id: string) {
    return this.creditService.deleteCreditSale(+id);
  }

  @Get('reports/by-shift/:shiftId')
  async getCreditSaleReportByShift(@Param('shiftId') shiftId: number) {
    return this.creditService.getCreditSaleReportByShift(shiftId);
  }

  @Get('reports/by-date-range/:startDate/:endDate')
  async getCreditSaleReportByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    return this.creditService.getCreditSaleReportByDateRange(
      startDate,
      endDate,
    );
  }
}
