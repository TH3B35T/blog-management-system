import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../../common/enums/role.enum';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique ID of the user',
  })
  declare id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'johndoe', description: 'Username of the user' })
  @Column({ unique: true })
  username: string;

  @ApiHideProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: 'Role of the user',
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation timestamp',
  })
  declare createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Last update timestamp',
  })
  declare updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Only hash the password if it has been modified
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
