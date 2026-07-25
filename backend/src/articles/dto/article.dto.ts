import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AuthorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class InlineImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  publicId: string;

  @IsNumber()
  @IsOptional()
  position?: number;
}

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateNested()
  @Type(() => AuthorDto)
  @IsNotEmpty()
  author: AuthorDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InlineImageDto)
  inlineImages?: InlineImageDto[];
}

export class UpdateArticleDto extends CreateArticleDto {}
