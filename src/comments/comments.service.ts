import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CommentArgs } from './dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private repository: Repository<Comment>,
  ) {}
  async create(
    createCommentInput: CreateCommentInput,
    user: User,
  ): Promise<Comment> {
    const comment = this.repository.create({
      ...createCommentInput,
      userId: user.id,
    });

    return await this.repository.save(comment);
  }

  async findAll(params: CommentArgs): Promise<Comment[]> {
    const queryBuilder = this.repository.createQueryBuilder('comments');
    queryBuilder
      .take(params.take)
      .skip(params.skip)
      .orderBy(`comments.${params.sortColumn}`, params.sortDirection);

    queryBuilder.where('comments.postId = :postId', {
      postId: params.filter.postId,
    });
    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Comment> {
    return await this.repository.findOneByOrFail({ id });
  }

  async update(
    id: number,
    updateCommentInput: UpdateCommentInput,
    user: User,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    if (comment.userId != user.id) {
      throw new UnauthorizedException("Not allowed to edit other user's comment");
    }
    return await this.repository.save({ ...comment, ...updateCommentInput });
  }

  async remove(id: number, user: User): Promise<Comment> {
    const post = await this.findOne(id);
    if (post.userId != user.id) {
      throw new UnauthorizedException("Not allowed to remove other user's comment");
    }
    return await this.repository.remove(post);
  }
}
