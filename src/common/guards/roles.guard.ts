/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      this.logger.error('No authorization header found');
      throw new UnauthorizedException('No authorization header found');
    }

    // Check user object
    if (!req.user) {
      this.logger.error(
        'User object is undefined - authorization will be denied',
      );
      throw new UnauthorizedException('User not authenticated');
    }

    // Log user object
    this.logger.debug(`User from request: ${JSON.stringify(req.user)}`);
    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);

    // Check if user has required role
    if (!req.user.role) {
      this.logger.error(
        `User has no role property: ${JSON.stringify(req.user)}`,
      );
      throw new UnauthorizedException('User has no role');
    }

    const hasRole = requiredRoles.some((role) => req.user.role === role);
    this.logger.debug(`User has required role: ${hasRole}`);

    return hasRole;
  }
}
