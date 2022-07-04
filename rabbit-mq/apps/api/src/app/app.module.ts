import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import {RMQModule} from 'nestjs-rmq'
import { RMQConfig } from './configs/rmq.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';


@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: 'envs/.api.env', isGlobal: true}),
    RMQModule.forRootAsync(RMQConfig()),
    JwtModule.registerAsync(jwtConfig()),
    PassportModule
  ],
  controllers: [AuthController, UserController]
})
export class AppModule {}
