import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DownloadDocument = Download & Document;

@Schema({ timestamps: true })
export class Download {
  @Prop({ required: true, enum: ['pdf', 'image', 'video', 'audio'] })
  fileType: string;

  @Prop()
  category: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  date: Date;

  @Prop({ default: 0 })
  downloadCount: number;

  @Prop()
  fileUrl: string;

  @Prop()
  filePublicId: string;

  @Prop({ default: 'raw' })
  resourceType: string;
}

export const DownloadSchema = SchemaFactory.createForClass(Download);
