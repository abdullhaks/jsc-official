import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationHelper } from '../common/pagination/pagination.helper';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get('events')
  async findAll(@Query() paginationDto: PaginationDto, @Query('status') status?: string) {
    const { skip, limit } = PaginationHelper.getPaginationParams(paginationDto.page, paginationDto.limit);
    const { items, total } = await this.eventsService.findAll(skip, limit, status);
    return PaginationHelper.buildPaginatedResponse(items, total, paginationDto.page || 1, limit);
  }

  @Get('admin/events')
  findAllAdmin() {
    return this.eventsService.findAllAdmin();
  }

  @Post('admin/events')
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createEventDto: CreateEventDto, @UploadedFile() file: Express.Multer.File) {
    return this.eventsService.create(createEventDto, file);
  }

  @Delete('admin/events/expired')
  cleanupExpired() {
    return this.eventsService.cleanupExpired();
  }

  @Patch('admin/events/:id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @UploadedFile() file: Express.Multer.File) {
    return this.eventsService.update(id, updateEventDto, file);
  }

  @Delete('admin/events/:id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Public()
  @Get('events/:id/share')
  async share(@Param('id') id: string) {
    return { shareUrl: `/events/${id}`, text: 'Check out this event!' };
  }
}
