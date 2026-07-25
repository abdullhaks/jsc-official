import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ── MongoDB Connection Status Logging ──────────────────────────────────────
  const mongoConnection = app.get<Connection>(getConnectionToken());

  mongoConnection.on('connected', () => {
    console.log('✅  [Database] MongoDB connected successfully.');
  });
  mongoConnection.on('error', (err) => {
    console.error('❌  [Database] MongoDB connection error:', err.message);
  });
  mongoConnection.on('disconnected', () => {
    console.warn('⚠️   [Database] MongoDB disconnected.');
  });

  // Log current state if already connected before event fires
  if (mongoConnection.readyState === 1) {
    console.log('✅  [Database] MongoDB already connected.');
  }
  // ──────────────────────────────────────────────────────────────────────────

  const apiPrefix = configService.get<string>('API_PREFIX') || 'api';
  app.setGlobalPrefix(apiPrefix, {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const clientUrl = configService.get<string>('CLIENT_URL');
  app.enableCors({
    origin: clientUrl || 'http://localhost:5173',
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀  [Server] JSC Backend running on http://localhost:${port}`);
  console.log(`📡  [API]    Prefix: /${apiPrefix}`);
}
bootstrap();

