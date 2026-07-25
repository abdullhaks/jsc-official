import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import cookieParser from 'cookie-parser';

describe('DownloadsController (e2e)', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let authCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    // Login to get token for protected routes
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'adminjsc', password: 'admin123' });
    
    // Extract access_token cookie
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      const accessTokenCookie = cookies.find(c => c.startsWith('access_token='));
      if (accessTokenCookie) {
        authCookie = accessTokenCookie.split(';')[0];
      }
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/downloads (GET) - public', () => {
    return request(app.getHttpServer())
      .get('/api/downloads')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('items');
        expect(res.body).toHaveProperty('total');
      });
  });

  it('/api/admin/downloads (GET) - unauthorized without cookie', () => {
    return request(app.getHttpServer())
      .get('/api/admin/downloads')
      .expect(401);
  });

  it('/api/admin/downloads (GET) - authorized', () => {
    return request(app.getHttpServer())
      .get('/api/admin/downloads')
      .set('Cookie', [authCookie])
      .expect(200);
  });
});
