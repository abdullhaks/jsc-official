import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMemoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsString()
  @IsOptional()
  attendees?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  eventHighlights?: string[];
}

export class UpdateMemoryDto extends CreateMemoryDto {}
