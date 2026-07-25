import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PublicationDocument = Publication & Document;

@Schema({ timestamps: true })
export class Publication {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  date: Date;

  @Prop()
  price: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop()
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  rating: number;

  @Prop()
  purchaseLink: string;

  @Prop()
  coverImageUrl: string;

  @Prop()
  coverImagePublicId: string;
}

export const PublicationSchema = SchemaFactory.createForClass(Publication);
