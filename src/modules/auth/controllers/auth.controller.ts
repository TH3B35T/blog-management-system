/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email or username already exists',
  })
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<AuthResponseDto> {
    this.logger.log(`Registering user: ${JSON.stringify(registerDto)}`);
    const result = await this.authService.register(registerDto);
    this.logger.log(`Registration result: ${JSON.stringify(result)}`);
    // Add decoded token payload for debugging
    try {
      const tokenParts = result.accessToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], 'base64').toString(),
        );
        this.logger.log(`Token payload: ${JSON.stringify(payload)}`);
        (result as any).decodedPayload = payload;
      }
    } catch (e) {
      this.logger.error(`Error decoding token: ${e.message}`);
    }

    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with credentials' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt for: ${loginDto.usernameOrEmail}`);
    const result = await this.authService.login(loginDto);
    this.logger.log(`Login successful for: ${loginDto.usernameOrEmail}`);

    // Add decoded token payload for debugging
    try {
      const tokenParts = result.accessToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], 'base64').toString(),
        );
        this.logger.log(`Token payload: ${JSON.stringify(payload)}`);
        (result as any).decodedPayload = payload;
      }
    } catch (e) {
      this.logger.error(`Error decoding token: ${e.message}`);
    }

    return result;
  }
}
