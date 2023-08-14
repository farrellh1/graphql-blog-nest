import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  take?: number;

  skip?: number;
}
