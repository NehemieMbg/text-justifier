import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/token (POST)', () => {
    it('should return a token', () => {
      return request(app.getHttpServer())
        .post('/token')
        .send({ email: 'naomie.liu@test.com' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });
  });

  describe('/justify (POST)', () => {
    it('should return a justified text', async () => {
      return request(app.getHttpServer())
        .post('/justify')
        .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
        .set('Content-Type', 'text/plain')
        .send('This is a test text to justify.')
        .expect(201);
    });
  });
});
