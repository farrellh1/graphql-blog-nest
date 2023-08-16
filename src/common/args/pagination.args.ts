import { ArgsType, Field } from '@nestjs/graphql';
import { SortArgs } from './sort.args';

@ArgsType()
export class PaginationArgs extends SortArgs {
  @Field({ defaultValue: 10 })
  take?: number = 10;

  @Field({ defaultValue: 0 })
  skip?: number = 0;
}
