import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Download, DownloadDocument } from './download.schema';
import { CreateDownloadDto, UpdateDownloadDto } from './dto/download.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Injectable()
export class DownloadsService {
  constructor(
    @InjectModel(Download.name) private model: Model<DownloadDocument>,
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

  async create(createDto: CreateDownloadDto, file?: Express.Multer.File) {
    let fileUrl = '';
    let filePublicId = '';
    if (file) {
      const upload = await this.cloudinaryService.uploadBuffer(file, 'downloads', 'auto');
      fileUrl = upload.secure_url;
      filePublicId = upload.public_id;
    }
    return this.model.create({ ...createDto, fileUrl, filePublicId });
  }

  async update(id: string, updateDto: UpdateDownloadDto, file?: Express.Multer.File) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');

    if (file) {
      if (item.filePublicId) await this.cloudinaryService.destroyAsset(item.filePublicId);
      const upload = await this.cloudinaryService.uploadBuffer(file, 'downloads', 'auto');
      updateDto['fileUrl'] = upload.secure_url;
      updateDto['filePublicId'] = upload.public_id;
    }
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async remove(id: string) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');
    if (item.filePublicId) await this.cloudinaryService.destroyAsset(item.filePublicId);
    return this.model.findByIdAndDelete(id).exec();
  }

  async findById(id: string) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');
    return item;
  }

  async incrementDownload(id: string) {
    const item = await this.model.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true }).exec();
    if (!item) throw new NotFoundException('Not found');
    return item;
  }
}
