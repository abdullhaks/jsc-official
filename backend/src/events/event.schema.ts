import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  venue: string;

  @Prop()
  venueLocationUrl: string;

  @Prop()
  date: Date;

  @Prop()
  time: string;

  @Prop()
  imageUrl: string;

  @Prop()
  imagePublicId: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
