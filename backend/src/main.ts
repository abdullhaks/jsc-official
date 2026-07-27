import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import dns from 'dns';

async function bootstrap() {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ── MongoDB Connection Status Logging ──────────────────────────────────────
  const mongoConnection = app.get<Connection>(getConnectionToken());

  mongoConnection.on('connected', () => {
    console.log('✅  [Database] MongoDB connected successfully.');
  });
  mongoConnection.on('error', (err) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error('❌  [Database] MongoDB connection error:', err.message);
  });
  mongoConnection.on('disconnected', () => {
    console.warn('⚠️   [Database] MongoDB disconnected.');
  });

  // Log current state if already connected before event fires
  if (mongoConnection.readyState === ConnectionStates.connected) {
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

  const rawOrigins = configService.get<string>('origins') || '';

  // Parse CORS origins from .env
  // Format: [localhost:5173,localhost:5174] -> ["http://localhost:5173", "http://localhost:5174"]
  let parsedOrigins: string[] = [];
  if (rawOrigins) {
    const cleaned = rawOrigins.replace(/[[\]]/g, '').trim();
    if (cleaned) {
      parsedOrigins = cleaned.split(',').map((origin) => {
        const trimmed = origin.trim();
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
          return `http://${trimmed}`;
        }
        return trimmed;
      });
    }
  }

  // Fallback origins if parsing failed or was empty
  if (parsedOrigins.length === 0) {
    parsedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  }

  app.enableCors({
    origin: parsedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀  [Server] JSC Backend running on http://localhost:${port}`);
  console.log(`📡  [API]    Prefix: /${apiPrefix}`);
}
bootstrap();
