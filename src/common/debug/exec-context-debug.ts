/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExecutionContext, Logger } from '@nestjs/common';

export function debugExecutionContext(context: ExecutionContext): void {
  const logger = new Logger('ContextDebug');

  try {
    const request = context.switchToHttp().getRequest();
    const keys = Object.keys(request);
    logger.debug(`Request keys: ${keys.join(', ')}`);

    // Explore different ways the user might be accessed
    const userDirectAccess = request.user;
    const userFromProps = Object.getOwnPropertyDescriptor(request, 'user');
    const userFromProto = Object.getPrototypeOf(request).user;

    logger.debug(`User direct access: ${JSON.stringify(userDirectAccess)}`);
    logger.debug(`User property descriptor: ${JSON.stringify(userFromProps)}`);
    logger.debug(`User from prototype: ${JSON.stringify(userFromProto)}`);

    // Try to get user from session, auth info or other common places
    const authInfo = request.authInfo
      ? JSON.stringify(request.authInfo)
      : 'undefined';
    const session = request.session ? 'exists' : 'undefined';

    logger.debug(`Auth info: ${authInfo}`);
    logger.debug(`Session: ${session}`);

    // List all properties of request with their types
    const propTypes = {};
    for (const key of keys) {
      const type = typeof request[key];
      propTypes[key] = type;
    }
    logger.debug(`Property types: ${JSON.stringify(propTypes)}`);
  } catch (error) {
    logger.error(`Error debugging execution context: ${error.message}`);
  }
}
