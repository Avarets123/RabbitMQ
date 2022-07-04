import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './configs/mongoose.config';
import {RMQModule} from 'nestjs-rmq';
import { RMQConfig } from './configs/rmq.config';

@Module({
  imports: [
    UserModule,
    AuthModule, 
    ConfigModule.forRoot({isGlobal: true, envFilePath: 'envs/.account.env'}),
    RMQModule.forRootAsync(RMQConfig()),
    MongooseModule.forRootAsync(mongoConfig())
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
