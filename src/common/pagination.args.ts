import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field({ defaultValue: 10 })
  take?: number = 10;

  @Field({ defaultValue: 0 })
  skip?: number = 0;
}
