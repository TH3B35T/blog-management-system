import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({
    example: 'How to Use NestJS',
    description: 'Title of the blog post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'NestJS is a progressive Node.js framework...',
    description: 'Content of the blog post',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: ['nestjs', 'typescript'],
    description: 'Tags for categorizing the blog post',
  })
  @IsArray()
  @IsOptional()
  tags: string[] = [];
}
