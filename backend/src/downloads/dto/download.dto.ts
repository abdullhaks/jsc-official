import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDownloadDto {
  @IsEnum(['pdf', 'image', 'video'])
  @IsNotEmpty()
  fileType: string;

  @IsString()
  @IsOptional()
  category?: string;

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
  @Type(() => Number)
  @IsNumber()
  downloadCount?: number;
}

export class UpdateDownloadDto extends CreateDownloadDto {}
