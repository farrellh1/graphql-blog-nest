import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortDirection, {
  name: 'SortDirection',
});

@ArgsType()
export class SortArgs {
  @IsEnum(SortDirection)
  @Field(() => SortDirection, { defaultValue: SortDirection.DESC })
  sortDirection?: SortDirection = SortDirection.DESC;

  @Field()
  sortColumn?: string = 'id';
}
