import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { QuotationDto } from './quotation.dto';

@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  async createQuotation(@Body() dto: QuotationDto) {
    return this.quotationsService.createQuotation(dto);
  }

  @Get()
  async getAllQuotations() {
    return this.quotationsService.getAllQuotations();
  }

  @Get(':id')
  async getQuotationById(@Param('id') id: string) {
    return this.quotationsService.getQuotationById(+id);
  }

  @Put(':id')
  async updateQuotation(@Param('id') id: string, @Body() dto: QuotationDto) {
    return this.quotationsService.updateQuotation(+id, dto);
  }

  @Delete(':id')
  async deleteQuotation(@Param('id') id: string) {
    return this.quotationsService.deleteQuotation(+id);
  }
}
