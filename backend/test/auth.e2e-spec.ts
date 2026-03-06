import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/entities/user.entity';
import { MagicLink } from '../src/auth/entities/magic-link.entity';
import { Session } from '../src/auth/entities/session.entity';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { MAIL_QUEUE } from '../src/mail/mail.constants';
import { hash } from '../src/auth/hash.helper';

describe('Authentication Flow (e2e)', () => {
  let app: NestFastifyApplication;

  const mockUser = {
    id: 'user-uuid',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockMagicLink = {
    id: 'ml-uuid',
    tokenHash: hash('valid-token'),
    user: mockUser,
    expiresAt: new Date(Date.now() + 1000 * 60 * 15),
    usedAt: null,
  };

  const mockUserRepository = {
    findOneBy: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
  };

  const mockMagicLinkRepository = {
    create: jest.fn().mockReturnValue(mockMagicLink),
    save: jest.fn().mockResolvedValue(mockMagicLink),
    findOne: jest.fn().mockResolvedValue(mockMagicLink),
  };

  const mockSessionRepository = {
    create: jest.fn().mockReturnValue({ id: 'session-uuid' }),
    save: jest.fn().mockResolvedValue({ id: 'session-uuid' }),
  };

  const mockMailQueue = {
    add: jest.fn().mockResolvedValue({}),
  };

  beforeAll(async () => {
    // We override the methods that establish connections
    jest
      .spyOn(TypeOrmModule, 'forRoot')
      .mockReturnValue({ module: class {} } as any);
    jest
      .spyOn(TypeOrmModule, 'forRootAsync')
      .mockReturnValue({ module: class {} } as any);
    jest
      .spyOn(BullModule, 'forRoot')
      .mockReturnValue({ module: class {} } as any);
    jest
      .spyOn(BullModule, 'forRootAsync')
      .mockReturnValue({ module: class {} } as any);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .overrideProvider(getRepositoryToken(MagicLink))
      .useValue(mockMagicLinkRepository)
      .overrideProvider(getRepositoryToken(Session))
      .useValue(mockSessionRepository)
      .overrideProvider(getQueueToken(MAIL_QUEUE))
      .useValue(mockMailQueue)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    jest.restoreAllMocks();
  });

  describe('POST /auth/magic-link', () => {
    it('should return 200 and send magic link email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/magic-link')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        entries: null,
      });
      expect(mockMailQueue.add).toHaveBeenCalled();
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/magic-link')
        .send({ email: 'not-an-email' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /auth/callback', () => {
    it('should return 200 and JWT token for valid magic link token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/callback')
        .send({ token: 'valid-token' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.entries).toBeDefined();
    });

    it('should return 400 if magic link not found', async () => {
      mockMagicLinkRepository.findOne.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .post('/auth/callback')
        .send({ token: 'invalid-token' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Magic link not found');
    });
  });
});
