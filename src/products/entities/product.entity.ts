import { Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ type: String })
  price: Decimal;

  @ApiProperty()
  sku: string;

  @ApiProperty({ default: false })
  published: boolean;
}
