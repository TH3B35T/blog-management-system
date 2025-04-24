/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  ForbiddenException,
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
      throw new UnauthorizedException(
        'Authentication required. Please provide a valid token.',
      );
    }

    // Check user object
    if (!req.user) {
      this.logger.error(
        'User object is undefined - authorization will be denied',
      );
      throw new UnauthorizedException(
        'User not authenticated or token is invalid.',
      );
    }

    // Log user object
    this.logger.debug(`User from request: ${JSON.stringify(req.user)}`);
    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);

    // Check if user has required role
    if (!req.user.role) {
      this.logger.error(
        `User has no role property: ${JSON.stringify(req.user)}`,
      );
      throw new ForbiddenException('User has no assigned role.');
    }

    const userRole = req.user.role;
    const hasRole = requiredRoles.includes(userRole);
    this.logger.debug(`User has required role: ${hasRole}`);

    if (!hasRole) {
      throw new ForbiddenException(
        'Insufficient permissions to access this resource.',
      );
    }

    return hasRole;
  }
}
