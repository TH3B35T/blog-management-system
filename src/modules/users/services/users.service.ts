import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../../auth/dto/register.dto';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    return this.usersRepository.createUser(registerDto);
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneByUsername(username);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneByEmail(email);
  }

  async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | null> {
    return this.usersRepository.findOneByUsernameOrEmail(usernameOrEmail);
  }
}
