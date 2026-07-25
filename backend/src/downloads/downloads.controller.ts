import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import { CreateDownloadDto, UpdateDownloadDto } from './dto/download.dto';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationHelper } from '../common/pagination/pagination.helper';
import type { Response } from 'express';

@Controller()
export class DownloadsController {
  constructor(private readonly service: DownloadsService) {}

  @Public()
  @Get('downloads')
  async findAll(@Query() dto: PaginationDto) {
    const { skip, limit } = PaginationHelper.getPaginationParams(dto.page, dto.limit);
    const { items, total } = await this.service.findAll(skip, limit);
    return PaginationHelper.buildPaginatedResponse(items, total, dto.page || 1, limit);
  }

  @Public()
  @Post('downloads/:id/track')
  async trackDownload(@Param('id') id: string) {
    return this.service.incrementDownload(id);
  }

  @Public()
  @Get('downloads/:id/file')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const download = await this.service.incrementDownload(id);
    return res.redirect(download.fileUrl);
  }

  @Get('admin/downloads')
  findAllAdmin() {
    return this.service.findAllAdmin();
  }

  @Post('admin/downloads')
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createDto: CreateDownloadDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.create(createDto, file);
  }

  @Patch('admin/downloads/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(@Param('id') id: string, @Body() updateDto: UpdateDownloadDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.update(id, updateDto, file);
  }

  @Delete('admin/downloads/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
