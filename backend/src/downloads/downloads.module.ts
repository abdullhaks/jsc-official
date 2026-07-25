import { Module } from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import { DownloadsController } from './downloads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Download, DownloadSchema } from './download.schema';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Download.name, schema: DownloadSchema }]),
    CloudinaryModule,
  ],
  providers: [DownloadsService],
  controllers: [DownloadsController],
})
export class DownloadsModule {}
