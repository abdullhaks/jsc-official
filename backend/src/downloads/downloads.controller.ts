import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import { CreateDownloadDto, UpdateDownloadDto } from './dto/download.dto';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationHelper } from '../common/pagination/pagination.helper';
import type { Response } from 'express';
import * as http from 'http';
import * as https from 'https';

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
    let fileUrl = download.fileUrl;

    if (!fileUrl) {
      return res.status(404).send('File not found');
    }

    // Auto-correct legacy PDFs/audio stored under /image/upload/ — must be /raw/upload/
    const storedResourceType = (download as any).resourceType;
    if (storedResourceType === 'raw' || download.fileType === 'pdf' || download.fileType === 'audio') {
      fileUrl = fileUrl.replace('/image/upload/', '/raw/upload/').replace('/video/upload/', '/raw/upload/');
    }

    // --- Determine file extension ---
    // Get the last URL path segment (everything after the final "/", ignoring query params)
    const urlPathSegment = fileUrl.split('?')[0].split('/').pop() || '';
    const dotIdx = urlPathSegment.lastIndexOf('.');
    // Only use the URL extension if the last segment actually has one (Cloudinary raw files often don't)
    const fileTypeExtMap: Record<string, string> = { pdf: 'pdf', image: 'jpg', video: 'mp4', audio: 'mp3' };
    const ext = dotIdx >= 0 ? urlPathSegment.slice(dotIdx + 1) : (fileTypeExtMap[download.fileType] || download.fileType);

    const safeTitle = download.title.replace(/[^a-zA-Z0-9\-_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    const filename = `${safeTitle || 'download'}.${ext}`;

    const streamUrl = (url: string) => {
      const client = url.startsWith('https') ? https : http;
      client.get(url, (cloudinaryRes) => {
        // Follow redirects (Cloudinary sometimes issues 301/302)
        if (
          cloudinaryRes.statusCode &&
          [301, 302, 307, 308].includes(cloudinaryRes.statusCode) &&
          cloudinaryRes.headers.location
        ) {
          return streamUrl(cloudinaryRes.headers.location);
        }

        if (cloudinaryRes.statusCode && cloudinaryRes.statusCode >= 400) {
          console.error(`Cloudinary returned ${cloudinaryRes.statusCode} for ${url}`);
          if (!res.headersSent) {
            res.status(502).send('File unavailable. Please re-upload this document from the admin panel.');
          }
          return;
        }

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        const contentType = cloudinaryRes.headers['content-type'] || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        if (cloudinaryRes.headers['content-length']) {
          res.setHeader('Content-Length', cloudinaryRes.headers['content-length']);
        }
        cloudinaryRes.pipe(res);
      }).on('error', (err) => {
        console.error('Streaming error:', err.message, 'for URL:', url);
        if (!res.headersSent) {
          res.status(500).send('Failed to retrieve file. Please try again.');
        }
      });
    };

    streamUrl(fileUrl);
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
