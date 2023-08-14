import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationArgs } from 'src/common';

@ObjectType()
export class FilterUserInput {
  @Field()
  @IsOptional()
  query?: string;
}

@ArgsType()
export class UserQuery extends PaginationArgs {
  @Field(() => FilterUserInput)
  @IsOptional()
  filter?: FilterUserInput;
}
