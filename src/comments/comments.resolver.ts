import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/users/entities/user.entity';
import { CommentArgs } from './dto';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guard';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    private readonly service: CommentsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() user: User,
  ): Promise<Comment> {
    console.log(user);
    
    return this.service.create(createCommentInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Comment], { name: 'comments' })
  findAll(@Args() params: CommentArgs): Promise<Comment[]> {
    return this.service.findAll(params);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Comment> {
    return this.service.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() user: User,
  ): Promise<Comment> {
    return this.service.update(updateCommentInput.id, updateCommentInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  removeComment(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<Comment> {
    return this.service.remove(id, user);
  }

  @ResolveField('user', () => User)
  async author(@Parent() comment: Comment): Promise<User> {
    return this.usersService.findOne(comment.userId);
  }

  @ResolveField('post', () => Post)
  async post(@Parent() comment: Comment): Promise<Post> {
    return this.postsService.findOne(comment.postId);
  }
}
