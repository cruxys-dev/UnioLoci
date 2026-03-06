import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    magicLink: jest.fn().mockResolvedValue({ success: true }),
    callback: jest.fn().mockResolvedValue({ success: true, entries: 'token' }),
    logout: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('magicLink', () => {
    it('should call authService.magicLink', async () => {
      const loginDto = { email: 'test@example.com' };
      await controller.magicLink(loginDto);
      expect(service.magicLink).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('callback', () => {
    it('should call authService.callback', async () => {
      const req = { headers: {} } as any;
      await controller.callback('token', req);
      expect(service.callback).toHaveBeenCalledWith('token', req);
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      await controller.logout('session-id');
      expect(service.logout).toHaveBeenCalledWith('session-id');
    });
  });
});
