import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService implements OnModuleInit {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const seedUsername = this.configService.get('SEED_ADMIN_USERNAME') || 'adminjsc';
    const seedPassword = this.configService.get('SEED_ADMIN_PASSWORD') || 'admin123';

    const existingAdmin = await this.findByUsername(seedUsername);
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(seedPassword, 10);
      await this.adminModel.create({
        username: seedUsername,
        passwordHash,
        role: 'admin',
      });
      this.logger.log(`Seeded admin user: ${seedUsername}`);
    } else {
      this.logger.log(`Admin user ${seedUsername} already exists.`);
    }
  }

  async findByUsername(username: string): Promise<AdminDocument | null> {
    return this.adminModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<AdminDocument | null> {
    return this.adminModel.findById(id).exec();
  }
}
