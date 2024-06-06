import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        description: dto.description,
        pictureUrl: dto.pictureUrl,
      },
    });
  }

  async getAllCategories() {
    return this.prisma.category.findMany();
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async updateCategory(id: number, dto: CategoryDto) {
    const existingCategory = await this.getCategoryById(id);
    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name || existingCategory.name,
        description: dto.description || existingCategory.description,
        pictureUrl: dto.pictureUrl || existingCategory.pictureUrl,
      },
    });
  }

  async deleteCategory(id: number) {
    await this.getCategoryById(id);
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
