import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth, Token } from './models';
import { RefreshTokenInput, SignInInput, SignUpInput } from './dto';
import { User } from 'src/users/entities/user.entity';
@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('signUpInput') signUpInput: SignUpInput) {
    signUpInput.username = signUpInput.username.toLowerCase();
    const { accessToken, refreshToken } = await this.service.signUp(signUpInput);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async signIn(@Args('signInInput') signInInput: SignInInput) {
    signInInput.username = signInInput.username.toLowerCase();
    const { accessToken, refreshToken } = await this.service.signIn(signInInput);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.service.refreshToken(token);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.service.getUserFromToken(auth.accessToken);
  }
}
