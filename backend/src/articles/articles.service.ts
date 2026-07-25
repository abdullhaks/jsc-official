import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private model: Model<ArticleDocument>,
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

  async findOne(id: string) {
    const article = await this.model.findById(id);
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(
    createDto: CreateArticleDto,
    files: { coverImage?: Express.Multer.File[]; inlineImage1?: Express.Multer.File[]; inlineImage2?: Express.Multer.File[] },
  ) {
    let coverImageUrl = '';
    let coverImagePublicId = '';
    
    if (files.coverImage && files.coverImage[0]) {
      const upload = await this.cloudinaryService.uploadBuffer(files.coverImage[0], 'articles');
      coverImageUrl = upload.secure_url;
      coverImagePublicId = upload.public_id;
    }

    const inlineImages: any[] = [];
    if (files.inlineImage1 && files.inlineImage1[0]) {
      const upload = await this.cloudinaryService.uploadBuffer(files.inlineImage1[0], 'articles');
      inlineImages.push({ url: upload.secure_url, publicId: upload.public_id, position: 1 });
    }
    if (files.inlineImage2 && files.inlineImage2[0]) {
      const upload = await this.cloudinaryService.uploadBuffer(files.inlineImage2[0], 'articles');
      inlineImages.push({ url: upload.secure_url, publicId: upload.public_id, position: 2 });
    }

    return this.model.create({ ...createDto, coverImageUrl, coverImagePublicId, inlineImages });
  }

  async update(
    id: string,
    updateDto: UpdateArticleDto,
    files: { coverImage?: Express.Multer.File[]; inlineImage1?: Express.Multer.File[]; inlineImage2?: Express.Multer.File[] },
  ) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');

    const updateData: any = { ...updateDto };

    if (files.coverImage && files.coverImage[0]) {
      if (item.coverImagePublicId) await this.cloudinaryService.destroyAsset(item.coverImagePublicId);
      const upload = await this.cloudinaryService.uploadBuffer(files.coverImage[0], 'articles');
      updateData.coverImageUrl = upload.secure_url;
      updateData.coverImagePublicId = upload.public_id;
    }

    let inlineImages = [...(item.inlineImages || [])];
    
    if (files.inlineImage1 && files.inlineImage1[0]) {
      const existingIdx = inlineImages.findIndex(img => img.position === 1);
      if (existingIdx >= 0) {
        await this.cloudinaryService.destroyAsset(inlineImages[existingIdx].publicId);
      }
      const upload = await this.cloudinaryService.uploadBuffer(files.inlineImage1[0], 'articles');
      const newImg = { url: upload.secure_url, publicId: upload.public_id, position: 1 };
      if (existingIdx >= 0) inlineImages[existingIdx] = newImg;
      else inlineImages.push(newImg);
    }

    if (files.inlineImage2 && files.inlineImage2[0]) {
      const existingIdx = inlineImages.findIndex(img => img.position === 2);
      if (existingIdx >= 0) {
        await this.cloudinaryService.destroyAsset(inlineImages[existingIdx].publicId);
      }
      const upload = await this.cloudinaryService.uploadBuffer(files.inlineImage2[0], 'articles');
      const newImg = { url: upload.secure_url, publicId: upload.public_id, position: 2 };
      if (existingIdx >= 0) inlineImages[existingIdx] = newImg;
      else inlineImages.push(newImg);
    }
    
    updateData.inlineImages = inlineImages;

    return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async remove(id: string) {
    const item = await this.model.findById(id);
    if (!item) throw new NotFoundException('Not found');
    
    if (item.coverImagePublicId) await this.cloudinaryService.destroyAsset(item.coverImagePublicId);
    
    for (const inlineImg of item.inlineImages) {
      if (inlineImg.publicId) await this.cloudinaryService.destroyAsset(inlineImg.publicId);
    }
    
    return this.model.findByIdAndDelete(id).exec();
  }

  async incrementViews(id: string) {
    const item = await this.model.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).exec();
    if (!item) throw new NotFoundException('Article not found');
    return item;
  }
}
