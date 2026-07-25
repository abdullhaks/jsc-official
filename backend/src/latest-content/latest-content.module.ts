import { Module } from '@nestjs/common';
import { LatestContentService } from './latest-content.service';
import { LatestContentController } from './latest-content.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LatestContent, LatestContentSchema } from './latest-content.schema';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LatestContent.name, schema: LatestContentSchema }]),
    CloudinaryModule,
  ],
  providers: [LatestContentService],
  controllers: [LatestContentController],
})
export class LatestContentModule {}
