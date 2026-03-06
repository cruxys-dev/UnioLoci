import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = { id: 'uuid', email: 'test@example.com' } as User;
  const mockUserResponse = { id: 'uuid', email: 'test@example.com' };

  const mockUserService = {
    getMe: jest.fn().mockReturnValue(mockUserResponse),
    update: jest.fn().mockResolvedValue(mockUserResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return current user', () => {
      const result = controller.getMe(mockUser);
      expect(result).toEqual({
        success: true,
        entries: mockUserResponse,
        meta: undefined,
      });
      expect(service.getMe).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('updateMe', () => {
    it('should update current user', async () => {
      const updateDto = { name: 'New Name' };
      const result = await controller.updateMe('uuid', updateDto);
      expect(result).toEqual({
        success: true,
        entries: mockUserResponse,
        meta: undefined,
      });
      expect(service.update).toHaveBeenCalledWith('uuid', updateDto);
    });
  });
});
