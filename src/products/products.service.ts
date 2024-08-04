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
        productIdNumber: dto.productIdNumber,
        reorderLevel: dto.reaorderLevel,
        pictureUrl: dto.pictureUrl,
        availability: dto.availability,
        quantity: dto.quantity,
        storeQuantity: dto.storeQuantity,
        expiryDate: dto.expiryDate,
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
  async findProductByBarcode(barcode: string) {
    const product = await this.prisma.product.findFirst({
      where: { productIdNumber: barcode },
    });
    if (!product) {
      throw new NotFoundException(`Product with barcode ${barcode} not found`);
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
        productIdNumber: dto.productIdNumber || existingProduct.productIdNumber,
        reorderLevel: dto.reaorderLevel || existingProduct.reorderLevel,
        storeQuantity: dto.storeQuantity || existingProduct.storeQuantity,
        expiryDate: dto.expiryDate || existingProduct.expiryDate,
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

  async updateProductQuantity(id: number, quantity: number) {
    const existingProduct = await this.getProductById(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        quantity: quantity,
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
