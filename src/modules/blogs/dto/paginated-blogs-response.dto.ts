import { ApiProperty } from '@nestjs/swagger';
import { BlogResponseDto } from './blog-response.dto';

export class PaginatedBlogsResponseDto {
  @ApiProperty({ type: [BlogResponseDto] })
  items: BlogResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
