import { User } from 'src/users/entities/user.entity';

export class ResponseOutput {
  accessToken: string;
  user: User;
}
