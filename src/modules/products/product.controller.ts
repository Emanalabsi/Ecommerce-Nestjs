import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { CreateProductDto } from './dtos/product-create.dto';
import { ProductService } from './product.service';

@Controller('products')
@Injectable()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getProducts() {
    const products = await this.productService.getProducts();
    return products;
  }

  @Post()
  async addProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.addProduct(createProductDto);
    return product;
  }
}
