import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationArgs } from 'src/common/args';

@InputType()
export class CommentFilterArgs {
  @Field(() => Int)
  @IsNotEmpty()
  postId: number;
}

@ArgsType()
export class CommentArgs extends PaginationArgs {
  @IsNotEmpty()
  @Field({ nullable: true })
  filter: CommentFilterArgs;
}
