import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
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
    const { startOfToday } = this.getKolkataDayBounds();
    const expired = await this.eventModel.find({ date: { $lt: startOfToday } });
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

  async getPublicSummary() {
    const { startOfToday, startOfTomorrow } = this.getKolkataDayBounds();
    const activeCount = await this.eventModel.countDocuments({ date: { $gte: startOfToday } }).exec();
    const todayEvents = await this.eventModel
      .find({ date: { $gte: startOfToday, $lt: startOfTomorrow } })
      .sort({ time: 1, createdAt: -1 })
      .select('_id title date time venue imageUrl')
      .exec();
    return { activeCount, todayEvents };
  }

  @Cron('0 0 6 * * *', { timeZone: 'Asia/Kolkata' })
  async removeExpiredEventsAtSixAM() {
    await this.cleanupExpired();
  }

  private getKolkataDayBounds(reference = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(reference);
    const date = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
    const startOfToday = new Date(`${date.year}-${date.month}-${date.day}T00:00:00+05:30`);
    const startOfTomorrow = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
    return { startOfToday, startOfTomorrow };
  }
}
