import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './event.schema';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findAll(skip: number, limit: number, status?: string) {
    const filter = status ? { status } : {};
    const total = await this.eventModel.countDocuments(filter).exec();
    const items = await this.eventModel
      .find(filter)
      .sort({ date: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return { items, total };
  }

  async findAllAdmin() {
    return this.eventModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(createDto: CreateEventDto, file?: Express.Multer.File) {
    let imageUrl = '';
    let imagePublicId = '';

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadBuffer(file, 'events');
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const created = new this.eventModel({
      ...createDto,
      imageUrl,
      imagePublicId,
    });
    return created.save();
  }

  async update(id: string, updateDto: UpdateEventDto, file?: Express.Multer.File) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    if (file) {
      if (event.imagePublicId) {
        await this.cloudinaryService.destroyAsset(event.imagePublicId);
      }
      const uploadResult = await this.cloudinaryService.uploadBuffer(file, 'events');
      updateDto['imageUrl'] = uploadResult.secure_url;
      updateDto['imagePublicId'] = uploadResult.public_id;
    }

    return this.eventModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async remove(id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    if (event.imagePublicId) {
      await this.cloudinaryService.destroyAsset(event.imagePublicId);
    }
    return this.eventModel.findByIdAndDelete(id).exec();
  }

  async cleanupExpired() {
    const now = new Date();
    const expired = await this.eventModel.find({ date: { $lt: now } });
    let count = 0;
    for (const event of expired) {
      if (event.imagePublicId) {
        await this.cloudinaryService.destroyAsset(event.imagePublicId);
      }
      await this.eventModel.findByIdAndDelete(event._id);
      count++;
    }
    return { deletedCount: count };
  }
}
