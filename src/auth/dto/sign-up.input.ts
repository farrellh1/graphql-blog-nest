import { IsNotEmpty, IsOptional } from 'class-validator';
import { SignInInput } from './sign-in.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class SignUpInput extends PartialType(SignInInput) {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsOptional()
  @Field({ nullable: true })
  bio?: string;
}
