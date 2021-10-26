import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ProductEntity } from './entities/product.entity';
import { ConnectionArgsDto } from '../page/connection-args.dto';
import { Page } from '../page/page.dto';
import { ApiPageResponse } from '../page/api-page-response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
@ApiTags('products')
@ApiExtraModels(Page)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProductEntity })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return new ProductEntity(product);
  }

  @Get()
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  async findAll() {
    const products = await this.productsService.findAll();
    return products.map((product) => new ProductEntity(product));
  }

  @Get('drafts')
  @UseGuards(JwtAuthGuard) // 🔐
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  async findDrafts() {
    const products = await this.productsService.findDrafts();
    return products.map((product) => new ProductEntity(product));
  }

  @Get('page')
  @ApiPageResponse(ProductEntity)
  async findPage(@Query() connectionArgs: ConnectionArgsDto) {
    return this.productsService.findPage(connectionArgs);
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity })
  async findOne(@Param('id') id: string) {
    return new ProductEntity(await this.productsService.findOne(+id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // 🔐
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProductEntity })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return new ProductEntity(
      await this.productsService.update(+id, updateProductDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // 🔐
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProductEntity })
  async remove(@Param('id') id: string) {
    return new ProductEntity(await this.productsService.remove(+id));
  }
}
