import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Prisma, Product } from '@prisma/client';
import { ConnectionArgsDto } from '../page/connection-args.dto';

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

    return findManyCursorConnection<
      Product,
      Pick<Prisma.ProductWhereUniqueInput, 'id'>
    >(
      // 👇 args contain take, skip and cursor

      (args) => {
        /*
        This whole modified args this is a hack because I can't encode and decode the cursor properly.
        I tried doing it in the encodeCursor and decodeCursor option provided, but without much success.
        Those have been commented out.
         */
        let modified_args = args;
        if (args.cursor) {
          modified_args = {
            ...args,
            cursor: {
              id: +args.cursor.id,
            },
          };
        }
        return this.prisma.product.findMany({
          ...modified_args,
          where: where,
        });
      },
      () => this.prisma.product.count({ where }),
      connectionArgs,
      {
        getCursor: (record) => ({ id: record.id }),
        encodeCursor: (cursor) => JSON.stringify(cursor),

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // decodeCursor: (cursor) => {
        //   console.log(`CURSOR STRING: ${cursor}`);
        //   console.log(typeof cursor);
        //
        //   return +cursor;
        //
        //   // const cursorObj = JSON.parse(
        //   //   Buffer.from(cursor, 'base64').toString('ascii'),
        //   // );
        //   //
        //   // cursorObj.id = Number(cursorObj.id);
        //   // return cursorObj;
        // },
      },
    );
  }
}

function encodeCursor<Cursor>(prismaCursor: Cursor) {
  return Buffer.from(JSON.stringify(prismaCursor)).toString('base64');
}

function decodeCursor(cursor: string) {
  return JSON.parse(Buffer.from(cursor, 'base64').toString('ascii'));
}
