import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @IsNotEmpty()
  @Field(() => Int)
  postId: number;

  @IsNotEmpty()
  @Field()
  content: string;
}
