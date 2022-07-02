import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtModule} from '@nestjs/jwt'
import { jwtConfig } from '../configs/jwt.config';

@Module({
  imports: [UserModule, JwtModule.registerAsync(jwtConfig()) ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
