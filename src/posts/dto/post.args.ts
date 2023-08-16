import { ArgsType, Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationArgs } from 'src/common/args';

export enum PostSortColumn {
  ID = 'id',
  TITLE = 'title',
  CLAPCOUNT = 'clapCount',
  READCOUNT = 'readCount',
}

registerEnumType(PostSortColumn, {
  name: 'PostSortColumn',
});

@InputType()
export class PostFilterArgs {
  @Field({ nullable: true })
  @IsOptional()
  query?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  authorId?: number;
}

@ArgsType()
export class PostArgs extends PaginationArgs {
  @IsOptional()
  @Field({ nullable: true })
  filter?: PostFilterArgs;

  @IsEnum(PostSortColumn)
  @Field(() => PostSortColumn, { defaultValue: PostSortColumn.ID })
  sortColumn?: PostSortColumn;
}
