import { Test, TestingModule } from '@nestjs/testing';
import { BrevoProvider } from './brevo.provider';
import { ConfigService } from '@nestjs/config';

describe('BrevoProvider', () => {
  let provider: BrevoProvider;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-api-key'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrevoProvider,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    provider = module.get<BrevoProvider>(BrevoProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
