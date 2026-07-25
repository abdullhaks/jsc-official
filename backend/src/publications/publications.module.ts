import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Publication, PublicationSchema } from './publication.schema';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Publication.name, schema: PublicationSchema }]),
    CloudinaryModule,
  ],
  providers: [PublicationsService],
  controllers: [PublicationsController],
})
export class PublicationsModule {}
