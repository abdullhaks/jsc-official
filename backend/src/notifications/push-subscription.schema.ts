import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PushSubscriptionDocument = PushSubscription & Document;

@Schema({ timestamps: true })
export class PushSubscription {
  @Prop({ required: true, unique: true, index: true })
  endpoint: string;

  @Prop()
  expirationTime?: number | null;

  @Prop({ required: true, type: Object })
  keys: { p256dh: string; auth: string };
}

export const PushSubscriptionSchema = SchemaFactory.createForClass(PushSubscription);
