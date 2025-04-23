import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogQueryDto } from '../dto/blog-query.dto';
import { PaginatedBlogsResponseDto } from '../dto/paginated-blogs-response.dto';

@Injectable()
export class BlogsRepository {
  private readonly logger = new Logger(BlogsRepository.name);

  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto, authorId: string): Promise<Blog> {
    this.logger.log(`Creating blog post with title: ${createBlogDto.title}`);
    const blog = this.blogsRepository.create({
      ...createBlogDto,
      authorId,
    });
    return this.blogsRepository.save(blog);
  }

  async findAll(queryDto: BlogQueryDto): Promise<PaginatedBlogsResponseDto> {
    const { tag, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.blogsRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .skip(skip)
      .take(limit)
      .orderBy('blog.createdAt', 'DESC');

    if (tag) {
      queryBuilder.where('blog.tags LIKE :tag', { tag: `%${tag}%` });
    }

    const [blogs, totalItems] = await queryBuilder.getManyAndCount();

    return {
      items: blogs.map((blog) => ({
        ...blog,
        authorUsername: blog.author ? blog.author.username : '',
      })),
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  async findOne(id: string): Promise<Blog> {
    this.logger.log(`Finding blog with id: ${id}`);
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!blog) {
      throw new Error(`Blog with id ${id} not found`);
    }

    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    this.logger.log(`Updating blog with id: ${id}`);
    await this.blogsRepository.update(id, updateBlogDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing blog with id: ${id}`);
    await this.blogsRepository.delete(id);
  }

  async findByAuthor(authorId: string): Promise<Blog[]> {
    this.logger.log(`Finding blogs by author with id: ${authorId}`);
    return this.blogsRepository.find({
      where: { authorId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
}
