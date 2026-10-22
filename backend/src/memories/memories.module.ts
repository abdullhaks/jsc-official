import { Module } from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { MemoriesController } from './memories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Memory, MemorySchema } from './memory.schema';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Memory.name, schema: MemorySchema }]),
    CloudinaryModule,
    NotificationsModule,
  ],
  providers: [MemoriesService],
  controllers: [MemoriesController],
})
export class MemoriesModule {}
