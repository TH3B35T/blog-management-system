import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../../auth/dto/register.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    const user = this.usersRepository.create(registerDto);
    return this.usersRepository.save(user);
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where(
        'user.username = :usernameOrEmail OR user.email = :usernameOrEmail',
        {
          usernameOrEmail,
        },
      )
      .getOne();
  }
}
