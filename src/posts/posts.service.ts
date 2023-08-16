import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostInput, PostArgs, UpdatePostInput } from './dto';
import { User } from 'src/users/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private repository: Repository<Post>,
    private categoryService: CategoriesService,
  ) {}
  async create(createPostInput: CreatePostInput, user: User) {
    let categories = [];
    if (createPostInput.categoryIds) {
      categories = await this.categoryService.findMany(
        createPostInput.categoryIds,
      );
    }
    const post = this.repository.create({
      ...createPostInput,
      author: user,
      categories: categories,
    });
    
    return await this.repository.save(post);
  }

  async findAll(params: PostArgs): Promise<Post[]> {
    const queryBuilder = this.repository.createQueryBuilder('posts');
    queryBuilder
      .take(params.take)
      .skip(params.skip)
      .orderBy(`posts.${params.sortColumn}`, params.sortDirection);

    if (params?.filter) {
      if (params?.filter.query) {
        queryBuilder
          .where('posts.title ILIKE :title', {
            title: `%${params.filter?.query}%`,
          })
          .orWhere('posts.content ILIKE :content', {
            content: `%${params.filter?.query}%`,
          });
      }
      if (params.filter.authorId) {
        queryBuilder.where('posts.authorId = :authorId', {
          authorId: params.filter.authorId,
        });
      }
    }
    const { entities } = await queryBuilder.getRawAndEntities();
    return entities;
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.repository.findOneByOrFail({ id });
    post.readCount += 1;
    return await this.repository.save(post);
  }

  async clap(id: number): Promise<Post> {
    const post = await this.repository.findOneByOrFail({ id });
    post.clapCount += 1;
    return await this.repository.save(post);
  }

  async update(
    id: number,
    updatePostInput: UpdatePostInput,
    user: User,
  ): Promise<Post> {
    const post = await this.findOne(id);
    if (post.authorId != user.id) {
      throw new UnauthorizedException("Not allowed to edit other user's post");
    }
    let categories = [];
    if (updatePostInput.categoryIds) {
      categories = await this.categoryService.findMany(
        updatePostInput.categoryIds,
      );
      post.categories = categories;
    }
    return await this.repository.save({ ...post, ...updatePostInput });
  }

  async remove(id: number, user: User): Promise<Post> {
    const post = await this.findOne(id);
    if (post.authorId != user.id) {
      throw new UnauthorizedException("Not allowed to edit other user's post");
    }
    return await this.repository.remove(post);
  }
}
