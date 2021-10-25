import { Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProductEntity implements Product {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description: string;

  @Transform((entity) => entity.value.toNumber())
  @ApiProperty({ type: Number }) // Api Property defines the Swagger type
  price: Decimal; // defines the type of the actual object

  @ApiProperty()
  sku: string;

  @ApiProperty({ default: false })
  published: boolean;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
    // short for 👇
    // this.id = partial.id;
    // this.createdAt = partial.createdAt;
    // this.updatedAt = partial.updatedAt;
    // this.name = partial.name;
    // this.description = partial.description;
    // this.price = partial.price;
    // this.sku = partial.sku;
    // this.published = partial.published;
  }
}
