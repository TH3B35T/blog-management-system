/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from '../services/blogs.service';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogQueryDto } from '../dto/blog-query.dto';
import { Blog } from '../entities/blog.entity';
import { Role } from '../../../common/enums/role.enum';
import { Request } from 'express';

describe('BlogsController', () => {
  let controller: BlogsController;
  let blogsService: BlogsService;

  const mockBlog = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Blog',
    content: 'Test content',
    tags: ['test', 'blog'],
    authorId: '123e4567-e89b-12d3-a456-426614174001',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Blog;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    username: 'testuser',
    email: 'test@example.com',
    role: Role.ADMIN,
  };

  const mockRequest = {
    user: mockUser,
    headers: {
      authorization: 'Bearer test-token',
    },
  } as unknown as Request;

  const mockBlogsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByAuthor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [
        {
          provide: BlogsService,
          useValue: mockBlogsService,
        },
      ],
    }).compile();

    controller = module.get<BlogsController>(BlogsController);
    blogsService = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a blog post', async () => {
      const createBlogDto: CreateBlogDto = {
        title: 'Test Blog',
        content: 'Test content',
        tags: ['test', 'blog'],
      };

      mockBlogsService.create.mockResolvedValue(mockBlog);

      const result = await controller.create(createBlogDto, mockRequest);

      expect(result).toEqual(mockBlog);
      expect(blogsService.create).toHaveBeenCalledWith(createBlogDto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of blog posts', async () => {
      const queryDto: BlogQueryDto = {
        tag: 'test',
        page: 1,
        limit: 10,
      };

      const paginatedResponse = {
        items: [mockBlog],
        page: 1,
        limit: 10,
        totalItems: 1,
        totalPages: 1,
      };

      mockBlogsService.findAll.mockResolvedValue(paginatedResponse);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(paginatedResponse);
      expect(blogsService.findAll).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('findOne', () => {
    it('should return a blog post by id', async () => {
      mockBlogsService.findOne.mockResolvedValue(mockBlog);

      const result = await controller.findOne(mockBlog.id);

      expect(result).toEqual(mockBlog);
      expect(blogsService.findOne).toHaveBeenCalledWith(mockBlog.id);
    });

    it('should throw NotFoundException if blog post not found', async () => {
      mockBlogsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(blogsService.findOne).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('update', () => {
    it('should update a blog post', async () => {
      const updateBlogDto: UpdateBlogDto = {
        title: 'Updated Title',
      };

      mockBlogsService.update.mockResolvedValue({
        ...mockBlog,
        title: updateBlogDto.title,
      });

      const result = await controller.update(
        mockBlog.id,
        updateBlogDto,
        mockRequest,
      );

      expect(result.title).toEqual(updateBlogDto.title);
      expect(blogsService.update).toHaveBeenCalledWith(
        mockBlog.id,
        updateBlogDto,
        mockUser,
      );
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const updateBlogDto: UpdateBlogDto = {
        title: 'Updated Title',
      };

      mockBlogsService.update.mockRejectedValue(new ForbiddenException());

      await expect(
        controller.update(mockBlog.id, updateBlogDto, mockRequest),
      ).rejects.toThrow(ForbiddenException);

      expect(blogsService.update).toHaveBeenCalledWith(
        mockBlog.id,
        updateBlogDto,
        mockUser,
      );
    });
  });

  describe('remove', () => {
    it('should remove a blog post', async () => {
      mockBlogsService.remove.mockResolvedValue(undefined);

      await controller.remove(mockBlog.id, mockRequest);

      expect(blogsService.remove).toHaveBeenCalledWith(mockBlog.id, mockUser);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      mockBlogsService.remove.mockRejectedValue(new ForbiddenException());

      await expect(controller.remove(mockBlog.id, mockRequest)).rejects.toThrow(
        ForbiddenException,
      );

      expect(blogsService.remove).toHaveBeenCalledWith(mockBlog.id, mockUser);
    });
  });

  describe('findByAuthor', () => {
    it('should return all blog posts by an author', async () => {
      mockBlogsService.findByAuthor.mockResolvedValue([mockBlog]);

      const result = await controller.findByAuthor(mockUser.id);

      expect(result).toEqual([mockBlog]);
      expect(blogsService.findByAuthor).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
