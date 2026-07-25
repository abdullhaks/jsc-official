import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { Public } from '../common/decorators/public.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationHelper } from '../common/pagination/pagination.helper';

@Controller()
export class ArticlesController {
  constructor(private readonly service: ArticlesService) {}

  @Public()
  @Get('articles')
  async findAll(@Query() dto: PaginationDto) {
    const { skip, limit } = PaginationHelper.getPaginationParams(dto.page, dto.limit);
    const { items, total } = await this.service.findAll(skip, limit);
    return PaginationHelper.buildPaginatedResponse(items, total, dto.page || 1, limit);
  }

  @Public()
  @Get('articles/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('admin/articles')
  findAllAdmin() {
    return this.service.findAllAdmin();
  }

  @Post('admin/articles')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'coverImage', maxCount: 1 },
    { name: 'inlineImage1', maxCount: 1 },
    { name: 'inlineImage2', maxCount: 1 },
  ]))
  create(
    @Body() createDto: CreateArticleDto,
    @UploadedFiles() files: { coverImage?: Express.Multer.File[]; inlineImage1?: Express.Multer.File[]; inlineImage2?: Express.Multer.File[] },
  ) {
    return this.service.create(createDto, files);
  }

  @Patch('admin/articles/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'coverImage', maxCount: 1 },
    { name: 'inlineImage1', maxCount: 1 },
    { name: 'inlineImage2', maxCount: 1 },
  ]))
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateArticleDto,
    @UploadedFiles() files: { coverImage?: Express.Multer.File[]; inlineImage1?: Express.Multer.File[]; inlineImage2?: Express.Multer.File[] },
  ) {
    return this.service.update(id, updateDto, files);
  }

  @Delete('admin/articles/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Public()
  @Get('articles/:id/share')
  async share(@Param('id') id: string) {
    return { shareUrl: `/articles/${id}`, text: 'Read this article!' };
  }

  @Public()
  @Post('articles/:id/view')
  incrementViews(@Param('id') id: string) {
    return this.service.incrementViews(id);
  }
}
