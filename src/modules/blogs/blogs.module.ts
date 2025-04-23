import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsService } from './services/blogs.service';
import { BlogsController } from './controllers/blogs.controller';
import { Blog } from './entities/blog.entity';
import { BlogsRepository } from './repositories/blogs.repository';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    AuthModule,
    JwtModule,
    UsersModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
  exports: [BlogsService],
})
export class BlogsModule {}
