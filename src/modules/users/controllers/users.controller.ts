/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';
import { Request } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<User> {
    this.logger.log(`Getting user by ID: ${id}`);
    if (req.user) {
      this.logger.log(`Authenticated user: ${JSON.stringify(req.user)}`);
    }

    // Safely log headers
    if (req.headers && req.headers.authorization) {
      this.logger.log(`Authorization header present`);
    } else {
      this.logger.log(`Authorization header missing`);
    }

    try {
      const user = await this.usersService.findOneById(id);
      this.logger.log(`User found: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
