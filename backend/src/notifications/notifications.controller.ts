import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { PushSubscriptionDto } from './dto/push-subscription.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Public()
  @Get('vapid-public-key')
  getPublicKey() { return this.notificationsService.getPublicKey(); }

  @Public()
  @Post('subscriptions')
  subscribe(@Body() subscription: PushSubscriptionDto) { return this.notificationsService.subscribe(subscription); }

  @Public()
  @Delete('subscriptions')
  unsubscribe(@Body('endpoint') endpoint: string) { return this.notificationsService.unsubscribe(endpoint); }
}
