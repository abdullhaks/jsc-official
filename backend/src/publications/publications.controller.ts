import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto, UpdatePublicationDto } from './dto/publication.dto';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationHelper } from '../common/pagination/pagination.helper';

@Controller()
export class PublicationsController {
  constructor(private readonly service: PublicationsService) {}

  @Public()
  @Get('publications')
  async findAll(@Query() dto: PaginationDto) {
    const { skip, limit } = PaginationHelper.getPaginationParams(dto.page, dto.limit);
    const { items, total } = await this.service.findAll(skip, limit);
    return PaginationHelper.buildPaginatedResponse(items, total, dto.page || 1, limit);
  }

  @Get('admin/publications')
  findAllAdmin() {
    return this.service.findAllAdmin();
  }

  @Post('admin/publications')
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createDto: CreatePublicationDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.create(createDto, file);
  }

  @Patch('admin/publications/:id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateDto: UpdatePublicationDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.update(id, updateDto, file);
  }

  @Delete('admin/publications/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
