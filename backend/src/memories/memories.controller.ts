import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto, UpdateMemoryDto } from './dto/memory.dto';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationHelper } from '../common/pagination/pagination.helper';

@Controller()
export class MemoriesController {
  constructor(private readonly service: MemoriesService) {}

  @Public()
  @Get('memories')
  async findAll(@Query() dto: PaginationDto) {
    const { skip, limit } = PaginationHelper.getPaginationParams(dto.page, dto.limit);
    const { items, total } = await this.service.findAll(skip, limit);
    return PaginationHelper.buildPaginatedResponse(items, total, dto.page || 1, limit);
  }

  @Public()
  @Get('memories/:id')
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('admin/memories')
  findAllAdmin() {
    return this.service.findAllAdmin();
  }

  @Post('admin/memories')
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createDto: CreateMemoryDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.create(createDto, file);
  }

  @Patch('admin/memories/:id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateDto: UpdateMemoryDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.update(id, updateDto, file);
  }

  @Delete('admin/memories/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
