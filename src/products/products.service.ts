import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Prisma, Product } from '@prisma/client';
import { ConnectionArgsDto } from '../page/connection-args.dto';
import { ProductEntity } from './entities/product.entity';
import { Page } from '../page/page.dto';

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

  async findPage(connectionArgs: ConnectionArgsDto) {
    const where: Prisma.ProductWhereInput = { published: true };
    // syntax for number id for findManyCursorConnect taken from: https://github.com/devoxa/prisma-relay-cursor-connection/blob/028aa081c1a59ff2b19dc81629ec293dd0ae98af/tests/index.spec.ts#L158

    const page = await findManyCursorConnection<
      Product,
      Pick<Prisma.ProductWhereUniqueInput, 'id'>
    >(
      // 👇 args contain take, skip and cursor
      (args) => {
        return this.prisma.product.findMany({
          ...args,
          where: where,
        });
      },
      () => this.prisma.product.count({ where }),
      connectionArgs,
      {
        getCursor: (record) => ({ id: record.id }),
        encodeCursor: (cursor) => {
          return String(cursor.id);
        },
        decodeCursor: (cursor) => {
          return { id: Number(cursor) };
        },
        recordToEdge: (record) => {
          return { node: new ProductEntity(record) };
        },
      },
    );

    return new Page<ProductEntity>(page);
  }
}

function encodeCursor<Cursor>(prismaCursor: Cursor) {
  return Buffer.from(JSON.stringify(prismaCursor)).toString('base64');
}

function decodeCursor(cursor: string) {
  return JSON.parse(Buffer.from(cursor, 'base64').toString('ascii'));
}
