import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      where: {
        published: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: {
        id: id,
      },
    });
  }

  findDrafts() {
    return this.prisma.product.findMany({
      where: {
        published: false,
      },
    });
  }

  async findPage() {
    const where: Prisma.ProductWhereInput = { published: true };
    return findManyCursorConnection<
      Product,
      Pick<Prisma.ProductWhereUniqueInput, 'id'>
    >(
      // 👇 args contain take, skip and cursor

      (args) =>
        this.prisma.product.findMany({
          ...args,
          where: where,
        }),
      () => this.prisma.product.count({ where }),
      { first: 4 }, // 👈 returns all product records
    );
  }
}
