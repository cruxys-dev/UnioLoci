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
import { Session } from '../src/auth/entities/session.entity';
import { JwtService } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';

describe('User Profile (e2e)', () => {
  let app: NestFastifyApplication;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-uuid',
    email: 'test@example.com',
    name: 'Test User',
    aiRequestsBalance: 50,
  };

  const mockSession = {
    id: 'session-uuid',
    tokenHash: 'hashed-token',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    user: mockUser,
  };

  const mockUserRepository = {
    findOneBy: jest.fn().mockResolvedValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
  };

  const mockSessionRepository = {
    findOne: jest.fn().mockResolvedValue(mockSession),
  };

  beforeAll(async () => {
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
      .overrideProvider(getRepositoryToken(Session))
      .useValue(mockSessionRepository)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    jest.restoreAllMocks();
  });

  const getAuthToken = async () => {
    return jwtService.signAsync({
      sessionId: 'session-uuid',
      token: 'session-token',
    });
  };

  describe('GET /users/me', () => {
    it('should return user profile if authenticated', async () => {
      const token = await getAuthToken();
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.entries.email).toBe(mockUser.email);
    });

    it('should return 401 if token is missing', async () => {
      const response = await request(app.getHttpServer()).get('/users/me');
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /users/me', () => {
    it('should update and return user profile', async () => {
      const token = await getAuthToken();
      const updateDto = { name: 'Updated Name' };

      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send(updateDto);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });
});
