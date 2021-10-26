import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ConnectionArgsDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  first: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  last: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  after: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  before: string;
}
