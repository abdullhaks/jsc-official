import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadBuffer(file: Express.Multer.File, folder: string = 'jsc', resourceType: "raw" | "auto" | "image" | "video" = 'auto'): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async destroyAsset(publicId: string, resourceType: string = 'image'): Promise<any> {
    if (!publicId) return;
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, { resource_type: resourceType as any }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
