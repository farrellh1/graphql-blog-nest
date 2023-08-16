import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, PostsModule, TypeOrmModule.forFeature([Comment])],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
