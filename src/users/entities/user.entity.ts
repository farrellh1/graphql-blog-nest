import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Post } from 'src/posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  bio?: string;

  @Column()
  password: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.author, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Post], { nullable: true })
  posts: Post[];
}
