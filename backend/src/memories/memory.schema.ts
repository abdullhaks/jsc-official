import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MemoryDocument = Memory & Document;

@Schema({ timestamps: true })
export class Memory {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  date: Date;

  @Prop()
  attendees: string;

  @Prop()
  location: string;

  @Prop({ type: [String], default: [] })
  eventHighlights: string[];

  @Prop()
  imageUrl: string;

  @Prop()
  imagePublicId: string;
}

export const MemorySchema = SchemaFactory.createForClass(Memory);
