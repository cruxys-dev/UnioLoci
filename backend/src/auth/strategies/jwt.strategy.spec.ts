import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from '../entities/session.entity';
import { UnauthorizedException } from '@nestjs/common';
import { hash } from '../hash.helper';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockSessionRepository = {
    findOne: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: getRepositoryToken(Session),
          useValue: mockSessionRepository,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const payload = { sessionId: 'sid', token: 'stoken' };

    it('should throw UnauthorizedException if session id or token missing', async () => {
      await expect(strategy.validate({} as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if session not found', async () => {
      mockSessionRepository.findOne.mockResolvedValue(null);
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Session not found',
      );
    });

    it('should throw UnauthorizedException if session expired', async () => {
      mockSessionRepository.findOne.mockResolvedValue({
        expiresAt: new Date(Date.now() - 1000),
      });
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Session expired',
      );
    });

    it('should throw UnauthorizedException if token hash mismatch', async () => {
      mockSessionRepository.findOne.mockResolvedValue({
        expiresAt: new Date(Date.now() + 10000),
        tokenHash: 'mismatch',
      });
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Invalid session token',
      );
    });

    it('should return user and session id if valid', async () => {
      const mockUser = { id: 'uid' };
      mockSessionRepository.findOne.mockResolvedValue({
        id: 'sid',
        expiresAt: new Date(Date.now() + 10000),
        tokenHash: hash('stoken'),
        user: mockUser,
      });

      const result = await strategy.validate(payload);
      expect(result).toEqual({
        user: mockUser,
        sessionId: 'sid',
      });
    });
  });
});
