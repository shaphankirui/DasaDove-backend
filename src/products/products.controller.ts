import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductDto } from './product.dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @UseGuards(JwtGuard)
  @Post()
  async createProduct(@Body() dto: ProductDto) {
    return this.productService.createProduct(dto);
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }
  @Get('search/barcode')
  async searchProductByBarcode(@Query('barcode') barcode: string) {
    return this.productService.findProductByBarcode(barcode);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(+id);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.updateProduct(+id, dto);
  }
  @Patch(':id/quantity')
  async updateProductQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productService.updateProductQuantity(+id, quantity);
  }

  // @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(+id);
  }
}
