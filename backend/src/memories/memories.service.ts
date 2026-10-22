import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Memory, MemoryDocument } from './memory.schema';
import { CreateMemoryDto, UpdateMemoryDto } from './dto/memory.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MemoriesService {
  constructor(
    @InjectModel(Memory.name) private model: Model<MemoryDocument>,
    private cloudinaryService: CloudinaryService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll(skip: number, limit: number) {
    const total = await this.model.countDocuments().exec();
    const items = await this.model.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    return { items, total };
  }

  async findAllAdmin() {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');
    return item;
  }

  async create(createDto: CreateMemoryDto, file?: Express.Multer.File) {
    let imageUrl = '';
    let imagePublicId = '';
    if (file) {
      const upload = await this.cloudinaryService.uploadBuffer(file, 'memories');
      imageUrl = upload.secure_url;
      imagePublicId = upload.public_id;
    }
    const memory = await this.model.create({ ...createDto, imageUrl, imagePublicId });
    void this.notificationsService.notifyNewMemory(memory).catch(() => undefined);
    return memory;
  }

  async update(id: string, updateDto: UpdateMemoryDto, file?: Express.Multer.File) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');

    if (file) {
      if (item.imagePublicId) await this.cloudinaryService.destroyAsset(item.imagePublicId);
      const upload = await this.cloudinaryService.uploadBuffer(file, 'memories');
      updateDto['imageUrl'] = upload.secure_url;
      updateDto['imagePublicId'] = upload.public_id;
    }
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async remove(id: string) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');
    if (item.imagePublicId) await this.cloudinaryService.destroyAsset(item.imagePublicId);
    return this.model.findByIdAndDelete(id).exec();
  }
}
