import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GqlAuthGuard } from 'src/guard';
import { JwtStrategy } from './strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PasswordService } from './password.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    GqlAuthGuard,
    PasswordService,
  ],
  exports: [GqlAuthGuard],
})
export class AuthModule {}
