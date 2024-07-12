import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
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

  @Get(':id')
  async getLpoById(@Param('id') id: string) {
    return this.lpoService.getLpoById(+id);
  }

  @Put(':id')
  async updateLpo(@Param('id') id: string, @Body() dto: LpoDto) {
    return this.lpoService.updateLpo(+id, dto);
  }

  @Delete(':id')
  async deleteLpo(@Param('id') id: string) {
    return this.lpoService.deleteLpo(+id);
  }
}