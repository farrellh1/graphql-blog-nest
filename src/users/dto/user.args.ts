import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationArgs } from 'src/common/args';

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

