/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UsersService } from '../../users/services/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Log the JWT expiration time for debugging
    const expiresIn = this.configService.get('JWT_EXPIRATION_TIME');
    this.logger.log(`JWT is configured to expire in: ${expiresIn} seconds`);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(`Registering new user: ${registerDto.username}`);

      // Create the user
      const user = await this.usersService.createUser(registerDto);
      this.logger.debug(
        `User created: ${JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role,
        })}`,
      );

      // Generate token
      const payload: JwtPayload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload);
      this.logger.debug(`JWT token generated for user: ${user.username}`);

      // Decode token to verify payload (for debugging only)
      try {
        const decoded = this.jwtService.decode(accessToken);
        this.logger.debug(`Decoded token payload: ${JSON.stringify(decoded)}`);
      } catch (e) {
        this.logger.error(`Error decoding token: ${e.message}`);
      }

      return {
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      if (error.code === '23505') {
        // PostgreSQL unique constraint violation
        throw new ConflictException('Username or email already exists');
      }
      throw new InternalServerErrorException('Error while registering user');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt for: ${loginDto.usernameOrEmail}`);

    // Check if user exists with username or email
    const user = await this.usersService.findOneByUsernameOrEmail(
      loginDto.usernameOrEmail,
    );

    if (!user) {
      this.logger.debug(`User not found: ${loginDto.usernameOrEmail}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(loginDto.password);

    if (!isPasswordValid) {
      this.logger.debug(`Invalid password for user: ${user.username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug(
      `User authenticated: ${user.username}, role: ${user.role}`,
    );

    // Generate token
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    this.logger.debug(`JWT token generated for user: ${user.username}`);

    // Decode token to verify payload (for debugging only)
    try {
      const decoded = this.jwtService.decode(accessToken);
      this.logger.debug(`Decoded token payload: ${JSON.stringify(decoded)}`);
    } catch (e) {
      this.logger.error(`Error decoding token: ${e.message}`);
    }

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
