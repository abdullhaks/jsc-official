import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLatestContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  views?: string;

  @IsEnum(['youtube', 'instagram', 'other'])
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  contentUrl: string;
}

export class UpdateLatestContentDto extends CreateLatestContentDto {}
