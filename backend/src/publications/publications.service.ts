import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publication, PublicationDocument } from './publication.schema';
import { CreatePublicationDto, UpdatePublicationDto } from './dto/publication.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectModel(Publication.name) private model: Model<PublicationDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findAll(skip: number, limit: number) {
    const total = await this.model.countDocuments().exec();
    const items = await this.model.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    return { items, total };
  }

  async findAllAdmin() {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async create(createDto: CreatePublicationDto, file?: Express.Multer.File) {
    let coverImageUrl = '';
    let coverImagePublicId = '';
    if (file) {
      const upload = await this.cloudinaryService.uploadBuffer(file, 'publications');
      coverImageUrl = upload.secure_url;
      coverImagePublicId = upload.public_id;
    }
    return this.model.create({ ...createDto, coverImageUrl, coverImagePublicId });
  }

  async update(id: string, updateDto: UpdatePublicationDto, file?: Express.Multer.File) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');

    if (file) {
      if (item.coverImagePublicId) await this.cloudinaryService.destroyAsset(item.coverImagePublicId);
      const upload = await this.cloudinaryService.uploadBuffer(file, 'publications');
      updateDto['coverImageUrl'] = upload.secure_url;
      updateDto['coverImagePublicId'] = upload.public_id;
    }
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async remove(id: string) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');
    if (item.coverImagePublicId) await this.cloudinaryService.destroyAsset(item.coverImagePublicId);
    return this.model.findByIdAndDelete(id).exec();
  }
}
