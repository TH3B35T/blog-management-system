import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TestAuthController } from './controllers/test-auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('JwtModule');
        const expirationTimeEnv = configService.get<string>(
          'JWT_EXPIRATION_TIME',
        );
        let expiresIn: string | number = '1h'; // Default to 1 hour

        if (expirationTimeEnv) {
          // Try to parse as a number (seconds)
          const parsedValue = parseInt(expirationTimeEnv, 10);
          if (!isNaN(parsedValue)) {
            expiresIn = parsedValue;
          } else {
            // Use as is (might be a string like '1h', '1d', etc.)
            expiresIn = expirationTimeEnv;
          }
        }

        logger.log(`Setting JWT expiration time to: ${expiresIn}`);

        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController, TestAuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
