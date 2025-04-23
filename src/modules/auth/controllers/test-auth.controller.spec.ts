import { Test, TestingModule } from '@nestjs/testing';
import { TestAuthController } from './test-auth.controller';
import { Request } from 'express';

describe('TestAuthController', () => {
  let controller: TestAuthController;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
  };

  const mockRequest = {
    user: mockUser,
    headers: {
      authorization: 'Bearer test-token',
    },
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestAuthController],
    }).compile();

    controller = module.get<TestAuthController>(TestAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('testAuth', () => {
    it('should return authentication success message with user', () => {
      const result = controller.testAuth(mockRequest);

      expect(result).toEqual({
        message: 'Authentication successful',
        user: mockUser,
      });
    });
  });
});
