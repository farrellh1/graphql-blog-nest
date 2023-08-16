import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput, PostArgs, UpdatePostInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guard';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CurrentUser } from 'src/common/decorators';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly service: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: User,
  ): Promise<Post> {
    return this.service.create(createPostInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post], { name: 'posts' })
  findAll(@Args() params: PostArgs): Promise<Post[]> {
    return this.service.findAll(params);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Post> {
    return this.service.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post, { name: 'clap' })
  clapPost(@Args('id', { type: () => Int }) id: number): Promise<Post> {
    return this.service.clap(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() user: User,
  ): Promise<Post> {
    return this.service.update(updatePostInput.id, updatePostInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  removePost(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<Post> {
    return this.service.remove(id, user);
  }

  @ResolveField('author', () => User)
  async author(@Parent() post: Post): Promise<User> {
    return this.usersService.findOne(post.authorId);
  }
}
