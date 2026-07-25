import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class InlineImage {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;

  @Prop()
  position: number; // For rendering order or placement
}

@Schema()
export class Author {
  @Prop({ required: true })
  name: string;

  @Prop()
  bio: string;

  @Prop()
  avatarUrl: string;
}

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  coverImageUrl: string;

  @Prop()
  coverImagePublicId: string;

  @Prop({ type: [InlineImage], default: [] })
  inlineImages: InlineImage[];

  @Prop({ type: Author, required: true })
  author: Author;

  @Prop({ default: 0 })
  views: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
