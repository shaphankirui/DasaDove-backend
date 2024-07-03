import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerDetailsDto } from './customerDto.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(dto: CustomerDetailsDto) {
    return this.prisma.customer.create({
      data: {
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        dueCredit: dto.dueCredit,
        isActive: dto.isActive,
      },
    });
  }

  async getAllCustomers() {
    return this.prisma.customer.findMany();
  }

  async getCustomerById(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async updateCustomer(id: number, dto: CustomerDetailsDto) {
    const existingCustomer = await this.getCustomerById(id);
    return this.prisma.customer.update({
      where: { id },
      data: {
        fullName: dto.fullName || existingCustomer.fullName,
        phoneNumber: dto.phoneNumber || existingCustomer.phoneNumber,
        dueCredit: dto.dueCredit || existingCustomer.dueCredit,
        isActive: dto.isActive || existingCustomer.isActive,
      },
    });
  }

  async deleteCustomer(id: number) {
    await this.getCustomerById(id);
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
