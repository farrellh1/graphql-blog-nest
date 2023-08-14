import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './models/token.model';
import { SignInInput, SignUpInput } from './dto';
import { PasswordService } from './password.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<Token> {
    let user = await this.usersRepository.findOneBy({
      username: signUpInput.username,
    });
    if (user) {
      throw new ConflictException(
        `User with username ${signUpInput.username} has been used`,
      );
    }
    const hashedPassword = await this.passwordService.hashPassword(
      signUpInput.password,
    );

    user = this.usersRepository.create({
      ...signUpInput,
      password: hashedPassword,
    });

    user = await this.usersRepository.save(user);

    return this.generateTokens({ id: user.id });
  }

  async signIn(signInInput: SignInInput): Promise<Token> {
    const { username, password } = signInInput;
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`No user found for username: ${username}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid username or password');
    }

    return this.generateTokens({ id: user.id });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['id'];
    return this.usersService.findOne(id);
  }

  generateTokens(payload: { id: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { id: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.TOKEN_EXP,
    });
  }

  private generateRefreshToken(payload: { id: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.REFRESH_EXP,
    });
  }

  refreshToken(token: string) {
    try {
      const { id } = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return this.generateTokens({
        id,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
