import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PushKeysDto {
  @IsString()
  @IsNotEmpty()
  p256dh: string;

  @IsString()
  @IsNotEmpty()
  auth: string;
}

export class PushSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @IsOptional()
  expirationTime?: number | null;

  @ValidateNested()
  @Type(() => PushKeysDto)
  keys: PushKeysDto;
}
