import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @MinLength(3) // these are validation pipes
  @ApiProperty()
  name: string;

  @IsOptional()
  @MaxLength(150)
  @ApiProperty({ required: false })
  description?: string;

  @Min(1.0)
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  sku: string;

  @ApiProperty({ required: false })
  published?: boolean;
}
