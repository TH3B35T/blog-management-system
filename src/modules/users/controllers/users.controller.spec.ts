/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { Role } from '../../../common/enums/role.enum';
import { Request } from 'express';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: 'test@example.com',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockRequest = {
    user: mockUser,
    headers: {
      authorization: 'Bearer test-token',
    },
  } as unknown as Request;

  const mockUsersService = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if user exists', async () => {
      mockUsersService.findOneById.mockResolvedValue(mockUser);

      const result = await controller.findOne(mockUser.id, mockRequest);

      expect(result).toEqual(mockUser);
      expect(usersService.findOneById).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUsersService.findOneById.mockRejectedValue(new NotFoundException());

      await expect(
        controller.findOne('non-existent-id', mockRequest),
      ).rejects.toThrow(NotFoundException);

      expect(usersService.findOneById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw NotFoundException if any other error occurs', async () => {
      mockUsersService.findOneById.mockRejectedValue(
        new Error('Some other error'),
      );

      await expect(controller.findOne('some-id', mockRequest)).rejects.toThrow(
        NotFoundException,
      );

      expect(usersService.findOneById).toHaveBeenCalledWith('some-id');
    });
  });
});
