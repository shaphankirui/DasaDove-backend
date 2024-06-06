import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: ProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        description: dto.description,
        model: dto.model,
        SAP: dto.SAP,
        pictureUrl: dto.pictureUrl,
        availability: dto.availability,
        quantity: dto.quantity,
        countable: dto.countable,
        category: {
          connect: { id: dto.categoryId },
        },
      },
    });
  }

  async getAllProducts() {
    return this.prisma.product.findMany();
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, dto: ProductDto) {
    const existingProduct = await this.getProductById(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name || existingProduct.name,
        price: dto.price || existingProduct.price,
        description: dto.description || existingProduct.description,
        model: dto.model || existingProduct.model,
        SAP: dto.SAP || existingProduct.SAP,
        pictureUrl: dto.pictureUrl || existingProduct.pictureUrl,
        availability: dto.availability || existingProduct.availability,
        quantity: dto.quantity || existingProduct.quantity,
        countable: dto.countable || existingProduct.countable,
        category: {
          connect: { id: dto.categoryId || existingProduct.categoryId },
        },
      },
    });
  }

  async deleteProduct(id: number) {
    await this.getProductById(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
