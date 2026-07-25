import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
  jest.setTimeout(30000);
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/login (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'adminjsc', password: 'admin123' })
      .expect(201);
    
    expect(response.body).toHaveProperty('admin');
    expect(response.body.admin).toHaveProperty('username', 'adminjsc');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('/api/auth/login (POST) - fail (wrong password)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'adminjsc', password: 'wrong' })
      .expect(401);
  });

  it('/api/auth/me (GET) - unauthorized (no token)', () => {
    return request(app.getHttpServer())
      .get('/api/auth/me')
      .expect(401);
  });
});
