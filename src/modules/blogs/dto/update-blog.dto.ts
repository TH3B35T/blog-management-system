import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiProperty({
    required: false,
    example: 'Updated NestJS Guide',
    description: 'Updated title of the blog post',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    required: false,
    example: 'Updated content...',
    description: 'Updated content of the blog post',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    required: false,
    example: ['nestjs', 'tutorial'],
    description: 'Updated tags for the blog post',
  })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
