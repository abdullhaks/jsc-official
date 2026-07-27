import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    // Only return items that have an uploaded file
    const filter = { fileUrl: { $ne: '' } };
    const total = await this.model.countDocuments(filter).exec();
    const items = await this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    return { items, total };
  }

  async findAllAdmin() {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  /** Maps our fileType enum to the correct Cloudinary resource_type */
  private getResourceType(fileType: string): 'raw' | 'image' | 'video' {
    if (fileType === 'image') return 'image';
    if (fileType === 'video') return 'video';
    // pdf and audio must use 'raw' so Cloudinary stores them at /raw/upload/ and serves them correctly
    return 'raw';
  }

  private validateFile(fileType: string, file: Express.Multer.File) {
    if (!file) return;
    const mime = file.mimetype.toLowerCase();
    if (fileType === 'pdf') {
      if (mime !== 'application/pdf') {
        throw new BadRequestException('Uploaded file must be a PDF document.');
      }
    } else if (fileType === 'image') {
      if (!mime.startsWith('image/')) {
        throw new BadRequestException('Uploaded file must be an image.');
      }
    } else if (fileType === 'video') {
      if (!mime.startsWith('video/')) {
        throw new BadRequestException('Uploaded file must be a video.');
      }
    } else if (fileType === 'audio') {
      if (!mime.startsWith('audio/')) {
        throw new BadRequestException('Uploaded file must be an audio file.');
      }
    } else {
      throw new BadRequestException('Invalid file type selected.');
    }
  }

  async create(createDto: CreateDownloadDto, file?: Express.Multer.File) {
    let fileUrl = '';
    let filePublicId = '';
    let resourceType = '';
    if (file) {
      this.validateFile(createDto.fileType, file);
      const cloudResourceType = this.getResourceType(createDto.fileType);
      const upload = await this.cloudinaryService.uploadBuffer(file, 'downloads', cloudResourceType);
      fileUrl = upload.secure_url;
      filePublicId = upload.public_id;
      resourceType = cloudResourceType;
    }
    return this.model.create({ ...createDto, fileUrl, filePublicId, resourceType });
  }

  async update(id: string, updateDto: UpdateDownloadDto, file?: Express.Multer.File) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');

    if (file) {
      const resolvedFileType = updateDto.fileType || item.fileType;
      this.validateFile(resolvedFileType, file);
      if (item.filePublicId) {
        // Destroy using the stored resourceType so Cloudinary can find the asset
        await this.cloudinaryService.destroyAsset(item.filePublicId, (item as any).resourceType || 'raw');
      }
      const cloudResourceType = this.getResourceType(resolvedFileType);
      const upload = await this.cloudinaryService.uploadBuffer(file, 'downloads', cloudResourceType);
      updateDto['fileUrl'] = upload.secure_url;
      updateDto['filePublicId'] = upload.public_id;
      updateDto['resourceType'] = cloudResourceType;
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
