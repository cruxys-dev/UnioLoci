import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUser = {
    id: 'uuid',
    email: 'test@example.com',
    name: 'Test',
    aiRequestsBalance: 50,
    created_at: new Date(),
  } as User;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findOne('uuid');
      expect(result).toEqual(mockUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid' });
    });

    it('should return null if not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne('uuid');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updateDto: UpdateUserDto = { name: 'Updated Name' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, ...updateDto });

      const result = await service.update('uuid', updateDto);

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.name).toEqual('Updated Name');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(service.update('uuid', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getMe', () => {
    it('should transform user to UserResponseDto', () => {
      const result = service.getMe(mockUser);
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.id).toEqual(mockUser.id);
      expect(result.email).toEqual(mockUser.email);
    });
  });
});
