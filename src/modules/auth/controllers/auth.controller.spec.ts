/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { Role } from '../../../common/enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthResponse: AuthResponseDto = {
    accessToken: 'test-token',
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'testuser',
      email: 'test@example.com',
      role: Role.USER,
    },
  };

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
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
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        role: Role.USER,
      };

      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException if username/email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        username: 'existinguser',
        password: 'password123',
        role: Role.USER,
      };

      mockAuthService.register.mockRejectedValue(
        new ConflictException('Username or email already exists'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        ConflictException,
      );

      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto: LoginDto = {
        usernameOrEmail: 'testuser',
        password: 'password123',
      };

      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const loginDto: LoginDto = {
        usernameOrEmail: 'wronguser',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
