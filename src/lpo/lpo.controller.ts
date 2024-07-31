import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { LpoService } from './lpo.service';
import { LpoDto } from './lpo.dto';

@Controller('lpo')
export class LpoController {
  constructor(private readonly lpoService: LpoService) {}

  @Post()
  async createLpo(@Body() dto: LpoDto) {
    return this.lpoService.createLpo(dto);
  }

  @Get()
  async getAllLpos() {
    return this.lpoService.getAllLpos();
  }
  @Get('range')
  async getLposByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.lpoService.getLposByDateRange(startDate, endDate);
  }

  @Get(':id')
  async getLpoById(@Param('id') id: string) {
    return this.lpoService.getLpoById(+id);
  }

  @Put(':id')
  async updateLpo(@Param('id') id: string, @Body() dto: LpoDto) {
    return this.lpoService.updateLpo(+id, dto);
  }
  @Put(':id/approve')
  async approveLpo(@Param('id') id: string) {
    return this.lpoService.approveLpo(+id);
  }

  @Put(':id/reject')
  async rejectLpo(@Param('id') id: string) {
    return this.lpoService.rejectLpo(+id);
  }

  @Delete(':id')
  async deleteLpo(@Param('id') id: string) {
    return this.lpoService.deleteLpo(+id);
  }
}
