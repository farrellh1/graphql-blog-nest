import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationArgs } from 'src/common';



@InputType()
export class UserFilterArgs {
  @Field({ nullable: true })
  @IsOptional()
  query?: string;
}

@ArgsType()
export class UserArgs extends PaginationArgs {
  @Field({ nullable: true })
  @IsOptional()
  filter?: UserFilterArgs;
}

