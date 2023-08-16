import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    queryBuilder
      .take(params.take)
      .skip(params.skip)
      .orderBy(`users.${params.sortColumn}`, params.sortDirection);

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

  async update(
    id: number,
    updateUserInput: UpdateUserInput,
    currentUser: User,
  ): Promise<User> {
    const user = await this.findOne(id);
    if (user.id != currentUser.id) {
      throw new UnauthorizedException(
        "Not allowed to edit other user's profile",
      );
    }
    return await this.repository.save({ ...user, ...updateUserInput });
  }
}
