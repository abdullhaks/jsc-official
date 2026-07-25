import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LatestContentDocument = LatestContent & Document;

@Schema({ timestamps: true })
export class LatestContent {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  date: Date;

  @Prop({ type: String })
  views: string;

  @Prop({ required: true, enum: ['youtube', 'instagram', 'other'], default: 'youtube' })
  type: string;

  @Prop()
  contentUrl: string;

  @Prop()
  imageUrl: string;

  @Prop()
  imagePublicId: string;
}

export const LatestContentSchema = SchemaFactory.createForClass(LatestContent);
