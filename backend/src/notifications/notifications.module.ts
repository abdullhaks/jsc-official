import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../events/event.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PushSubscription, PushSubscriptionSchema } from './push-subscription.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: PushSubscription.name, schema: PushSubscriptionSchema },
    { name: Event.name, schema: EventSchema },
  ])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
