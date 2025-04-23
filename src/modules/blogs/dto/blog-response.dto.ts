import { ApiProperty } from '@nestjs/swagger';

export class BlogResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'How to Use NestJS' })
  title: string;

  @ApiProperty({ example: 'NestJS is a progressive Node.js framework...' })
  content: string;

  @ApiProperty({ example: ['nestjs', 'typescript'] })
  tags: string[];

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  authorId: string;

  @ApiProperty({ example: 'johndoe' })
  authorUsername: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
