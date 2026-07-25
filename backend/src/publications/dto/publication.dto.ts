import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ArrayMaxSize, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreatePublicationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsString()
  @IsOptional()
  price?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;

  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rating?: number;

  @IsString()
  @IsOptional()
  purchaseLink?: string;
}

export class UpdatePublicationDto extends CreatePublicationDto {}
