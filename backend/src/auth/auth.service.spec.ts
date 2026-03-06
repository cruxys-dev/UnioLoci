import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { MagicLink } from './entities/magic-link.entity';
import { Session } from './entities/session.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { getQueueToken } from '@nestjs/bullmq';
import { MAIL_QUEUE } from '../mail/mail.constants';
import { BadRequestException } from '@nestjs/common';
import { hash } from './hash.helper';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    name: 'Test',
  } as User;
  const mockMagicLink = {
    id: 'ml-id',
    tokenHash: hash('token'),
    user: mockUser,
    expiresAt: new Date(Date.now() + 10000),
    usedAt: null,
    actionType: 'login',
  } as unknown as MagicLink;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
  };

  const mockMagicLinkRepository = {
    create: jest.fn().mockReturnValue(mockMagicLink),
    save: jest.fn().mockResolvedValue(mockMagicLink),
    findOne: jest.fn(),
  };

  const mockSessionRepository = {
    create: jest.fn().mockReturnValue({ id: 'session-id' }),
    save: jest.fn().mockResolvedValue({ id: 'session-id' }),
    delete: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:3000'),
  };

  const mockMailQueue = {
    add: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('jwt-token'),
  };

  const mockUserService = {
    getMe: jest.fn().mockReturnValue({ id: 'user-id' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        {
          provide: getRepositoryToken(MagicLink),
          useValue: mockMagicLinkRepository,
        },
        {
          provide: getRepositoryToken(Session),
          useValue: mockSessionRepository,
        },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getQueueToken(MAIL_QUEUE), useValue: mockMailQueue },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('magicLink', () => {
    it('should create a new user and magic link if user does not exist', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.magicLink({ email: 'test@example.com' });

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockMagicLinkRepository.create).toHaveBeenCalled();
      expect(mockMagicLinkRepository.save).toHaveBeenCalled();
      expect(mockMailQueue.add).toHaveBeenCalled();
      expect(result).toEqual({ success: true, entries: null, meta: undefined });
    });

    it('should use existing user for magic link', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      await service.magicLink({ email: 'test@example.com' });

      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockMagicLinkRepository.create).toHaveBeenCalled();
    });
  });

  describe('callback', () => {
    const mockRequest = {
      headers: { 'user-agent': 'Jest' },
      ip: '127.0.0.1',
    } as any;

    it('should throw BadRequestException if magic link not found', async () => {
      mockMagicLinkRepository.findOne.mockResolvedValue(null);
      await expect(service.callback('token', mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if magic link expired', async () => {
      mockMagicLinkRepository.findOne.mockResolvedValue({
        ...mockMagicLink,
        expiresAt: new Date(Date.now() - 10000),
      });
      await expect(service.callback('token', mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if magic link already used', async () => {
      mockMagicLinkRepository.findOne.mockResolvedValue({
        ...mockMagicLink,
        usedAt: new Date(),
      });
      await expect(service.callback('token', mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create session and return JWT if valid', async () => {
      mockMagicLinkRepository.findOne.mockResolvedValue(mockMagicLink);

      const result = await service.callback('token', mockRequest);

      expect(mockMagicLinkRepository.save).toHaveBeenCalled();
      expect(mockSessionRepository.create).toHaveBeenCalled();
      expect(mockSessionRepository.save).toHaveBeenCalled();
      expect(mockJwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        entries: 'jwt-token',
        meta: undefined,
      });
    });
  });

  describe('logout', () => {
    it('should delete the session', async () => {
      const result = await service.logout('session-id');
      expect(mockSessionRepository.delete).toHaveBeenCalledWith('session-id');
      expect(result).toEqual({ success: true, entries: null, meta: undefined });
    });
  });

  describe('cleanExpiredSessions', () => {
    it('should delete expired sessions', async () => {
      await service.cleanExpiredSessions();
      expect(mockSessionRepository.delete).toHaveBeenCalled();
    });
  });
});
