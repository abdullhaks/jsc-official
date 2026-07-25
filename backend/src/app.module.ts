import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { EventsModule } from './events/events.module';
import { LatestContentModule } from './latest-content/latest-content.module';
import { MemoriesModule } from './memories/memories.module';
import { PublicationsModule } from './publications/publications.module';
import { DownloadsModule } from './downloads/downloads.module';
import { ArticlesModule } from './articles/articles.module';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || configService.get<string>('mongo_url'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AdminModule,
    AuthModule,
    EventsModule,
    LatestContentModule,
    MemoriesModule,
    PublicationsModule,
    DownloadsModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
