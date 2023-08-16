import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationArgs } from 'src/common/args';

@InputType()
export class CategoryFilterArgs {
  @Field({ nullable: true })
  @IsOptional()
  query?: string;
}

@ArgsType()
export class CategoryArgs extends PaginationArgs {
  @IsOptional()
  @Field({ nullable: true })
  filter?: CategoryFilterArgs;
}
