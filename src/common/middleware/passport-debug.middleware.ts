/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PassportDebugMiddleware implements NestMiddleware {
  private readonly logger = new Logger('PassportDebug');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`Request path: ${req.path}`);
    this.logger.log(
      `Authorization header: ${req.headers.authorization || 'none'}`,
    );

    Object.defineProperty(req, '_userDebug', {
      set: function (user) {
        this.logger.log(`User being set: ${JSON.stringify(user)}`);
      }.bind(this),
    });

    // After the request is processed, log if user exists
    res.on('finish', () => {
      this.logger.log(
        `Request finished. User exists: ${'user' in req}, Value: ${JSON.stringify(req.user)}`,
      );
    });

    next();
  }
}
