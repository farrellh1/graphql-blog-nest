import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { GqlAuthGuard } from 'src/guard';
import { UpdateUserInput, UserArgs } from './dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly service: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'users' })
  async findAll(@Args() params: UserArgs) {
    return await this.service.findAll(params);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.service.update(updateUserInput.id, updateUserInput);
  }
}
