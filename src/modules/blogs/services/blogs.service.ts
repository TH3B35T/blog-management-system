import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogQueryDto } from '../dto/blog-query.dto';
import { Blog } from '../entities/blog.entity';
import { BlogsRepository } from '../repositories/blogs.repository';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../../common/enums/role.enum';
import { PaginatedBlogsResponseDto } from '../dto/paginated-blogs-response.dto';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);

  constructor(private readonly blogsRepository: BlogsRepository) {}

  async create(createBlogDto: CreateBlogDto, user: User): Promise<Blog> {
    this.logger.log(`Creating blog post by user: ${user.username}`);
    return this.blogsRepository.create(createBlogDto, user.id);
  }

  async findAll(queryDto: BlogQueryDto): Promise<PaginatedBlogsResponseDto> {
    this.logger.log(
      `Finding all blogs with query: ${JSON.stringify(queryDto)}`,
    );
    return this.blogsRepository.findAll(queryDto);
  }

  async findOne(id: string): Promise<Blog> {
    this.logger.log(`Finding blog with id: ${id}`);
    const blog = await this.blogsRepository.findOne(id);
    if (!blog) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    user: User,
  ): Promise<Blog> {
    this.logger.log(`Updating blog with id: ${id} by user: ${user.username}`);
    const blog = await this.findOne(id);

    // Check if the user is authorized to update this blog post
    if (blog.authorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to update this blog post',
      );
    }

    return this.blogsRepository.update(id, updateBlogDto);
  }

  async remove(id: string, user: User): Promise<void> {
    this.logger.log(`Removing blog with id: ${id} by user: ${user.username}`);
    const blog = await this.findOne(id);

    // Only admin can delete any blog post, editors and users can only delete their own
    if (blog.authorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to delete this blog post',
      );
    }

    await this.blogsRepository.remove(id);
  }

  async findByAuthor(authorId: string): Promise<Blog[]> {
    this.logger.log(`Finding blogs by author with id: ${authorId}`);
    return this.blogsRepository.findByAuthor(authorId);
  }
}
