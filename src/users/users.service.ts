import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput, UpdateUserInput, UserArgs } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.repository.create(createUserInput);
    return await this.repository.save(user);
  }

  async findAll(params: UserArgs): Promise<User[]> {
    const queryBuilder = this.repository.createQueryBuilder('users');
    queryBuilder.take(params.take).skip(params.skip);

    if (params?.filter?.query) {
      queryBuilder
        .where('users.name ILIKE :name', {
          name: `%${params.filter?.query}%`,
        })
        .orWhere('users.username ILIKE :username', {
          username: `%${params.filter?.query}%`,
        });
    }
    const { entities } = await queryBuilder.getRawAndEntities();
    return entities;
  }

  async findOne(id: number): Promise<User> {
    return await this.repository.findOneByOrFail({ id });
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);
    return await this.repository.save({ ...user, ...updateUserInput });
  }
}
