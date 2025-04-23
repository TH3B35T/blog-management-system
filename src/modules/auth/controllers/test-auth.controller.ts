import { Controller, Get, UseGuards, Req, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Test')
@Controller('test-auth')
export class TestAuthController {
  private readonly logger = new Logger(TestAuthController.name);

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test authentication' })
  testAuth(@Req() req: Request) {
    this.logger.log(
      `Authentication test successful for user: ${JSON.stringify(req.user)}`,
    );
    return {
      message: 'Authentication successful',
      user: req.user,
    };
  }
}
