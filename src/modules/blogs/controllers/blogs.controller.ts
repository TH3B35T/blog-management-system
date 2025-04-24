import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  Req,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';
import { BlogsService } from '../services/blogs.service';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogQueryDto } from '../dto/blog-query.dto';
import { Blog } from '../entities/blog.entity';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { BlogResponseDto } from '../dto/blog-response.dto';
import { PaginatedBlogsResponseDto } from '../dto/paginated-blogs-response.dto';
import { User } from 'src/modules/users/entities/user.entity';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  private readonly logger = new Logger(BlogsController.name);

  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The blog post has been successfully created',
    type: BlogResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: Request,
  ): Promise<Blog> {
    this.logger.log('Creating blog post');
    return this.blogsService.create(createBlogDto, req.user as User);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts with pagination and filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved all blog posts',
    type: PaginatedBlogsResponseDto,
  })
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() queryDto: BlogQueryDto,
  ): Promise<PaginatedBlogsResponseDto> {
    this.logger.log(
      `Finding all blogs with query: ${JSON.stringify(queryDto)}`,
    );
    return this.blogsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved the blog post',
    type: BlogResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Blog post not found',
  })
  async findOne(@Param('id') id: string): Promise<Blog> {
    this.logger.log(`Finding blog with id: ${id}`);
    return this.blogsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The blog post has been successfully updated',
    type: BlogResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Blog post not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() req: Request,
  ): Promise<Blog> {
    this.logger.log(`Updating blog with id: ${id}`);
    return this.blogsService.update(id, updateBlogDto, req.user as User);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The blog post has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Blog post not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
    this.logger.log(`Deleting blog with id: ${id}`);
    return this.blogsService.remove(id, req.user as User);
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get all blog posts by author' })
  @ApiParam({ name: 'authorId', description: 'Author ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved all blog posts by author',
    type: [BlogResponseDto],
  })
  async findByAuthor(@Param('authorId') authorId: string): Promise<Blog[]> {
    this.logger.log(`Finding blogs by author with id: ${authorId}`);
    return this.blogsService.findByAuthor(authorId);
  }
}
