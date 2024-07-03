import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerDetailsDto } from './customerDto.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async createCustomer(@Body() dto: CustomerDetailsDto) {
    return this.customersService.createCustomer(dto);
  }

  @Get()
  async getAllCustomers() {
    return this.customersService.getAllCustomers();
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: string) {
    return this.customersService.getCustomerById(+id);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() dto: CustomerDetailsDto,
  ) {
    return this.customersService.updateCustomer(+id, dto);
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    return this.customersService.deleteCustomer(+id);
  }
}
