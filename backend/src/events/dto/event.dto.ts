import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsString()
  @IsOptional()
  venueLocationUrl?: string;

  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsString()
  @IsOptional()
  time?: string;
}

export class UpdateEventDto extends CreateEventDto {}
