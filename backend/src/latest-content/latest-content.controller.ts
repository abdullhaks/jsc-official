import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { LatestContentService } from './latest-content.service';
import { CreateLatestContentDto, UpdateLatestContentDto } from './dto/latest-content.dto';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationHelper } from '../common/pagination/pagination.helper';

@Controller()
export class LatestContentController {
  constructor(private readonly service: LatestContentService) {}

  @Public()
  @Get('latest-content')
  async findAll(@Query() dto: PaginationDto) {
    const { skip, limit } = PaginationHelper.getPaginationParams(dto.page, dto.limit);
    const { items, total } = await this.service.findAll(skip, limit);
    return PaginationHelper.buildPaginatedResponse(items, total, dto.page || 1, limit);
  }

  @Get('admin/latest-content')
  findAllAdmin() {
    return this.service.findAllAdmin();
  }

  @Post('admin/latest-content')
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createDto: CreateLatestContentDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.create(createDto, file);
  }

  @Patch('admin/latest-content/:id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateDto: UpdateLatestContentDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.update(id, updateDto, file);
  }

  @Delete('admin/latest-content/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
