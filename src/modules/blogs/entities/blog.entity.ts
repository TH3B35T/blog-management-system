import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('blogs')
export class Blog extends BaseEntity {
  @ApiProperty({
    example: 'How to Use NestJS',
    description: 'Title of the blog post',
  })
  @Column()
  title: string;

  @ApiProperty({
    example: 'NestJS is a progressive Node.js framework...',
    description: 'Content of the blog post',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    example: ['nestjs', 'typescript'],
    description: 'Tags for categorizing the blog post',
  })
  @Column('simple-array')
  tags: string[];

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the author',
  })
  @Column()
  authorId: string;

  @ApiProperty({ type: () => User, description: 'Author of the blog post' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;
}
