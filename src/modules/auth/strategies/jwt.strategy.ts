/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
    this.logger.log(
      `JWT Strategy initialized with secret: ${configService.get('JWT_SECRET').substring(0, 3)}...`,
    );
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);

    if (!payload || !payload.sub) {
      this.logger.error('Invalid JWT payload structure');
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const user = await this.usersService.findOneById(payload.sub);

      if (!user) {
        this.logger.error(`User with ID ${payload.sub} not found`);
        throw new UnauthorizedException('User not found');
      }

      // Ensure the role is correctly set
      if (!user.role) {
        this.logger.error(
          `User is missing role property: ${JSON.stringify(user)}`,
        );
        throw new UnauthorizedException('User role is missing');
      }

      this.logger.debug(
        `User found: ${JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role,
        })}`,
      );

      return user;
    } catch (error) {
      this.logger.error(`Error during JWT validation: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
