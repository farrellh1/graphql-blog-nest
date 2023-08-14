import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
  @Field()
  @IsEmail()
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
