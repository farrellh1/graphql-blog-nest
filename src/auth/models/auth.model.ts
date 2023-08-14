import { ObjectType } from '@nestjs/graphql';
import { Token } from './token.model';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Auth extends Token {
  user: User;
}
