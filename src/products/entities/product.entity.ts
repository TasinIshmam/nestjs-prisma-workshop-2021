import { Product, User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';

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

  constructor({ createdBy, ...data }: Partial<ProductEntity>) {
    Object.assign(this, data);

    if (createdBy) {
      this.createdBy = new UserEntity(createdBy);
    }
  }

  @Exclude()
  userId: string | null;

  @ApiProperty({ required: false, type: UserEntity })
  createdBy?: UserEntity;
}
