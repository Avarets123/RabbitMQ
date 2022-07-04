import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRole } from '@rabbit-mq/interfaces';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import {JwtService} from '@nestjs/jwt'
import { AccountLogin, AccountRegister } from '@rabbit-mq/contracts';

@Injectable()
export class AuthService {

    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
        ) {}


    async register({email, password, displayName}: AccountRegister.Request): Promise<AccountRegister.Response> {

        const oldUser = await this.userRepository.findUser(email);

        if (oldUser) {
            throw new HttpException('Такой пользователь уже зарегистрирован', HttpStatus.BAD_REQUEST);
        }

        const newUserEntity = await new UserEntity({
            displayName, email,
            passwordHash: '',
            role: UserRole.Students
        }).setHashPassword(password);


        const newUser = await this.userRepository.createUser(newUserEntity);

        return {email: newUser.email}

    }

    async validateUser(email: string, password: string): Promise<{id: string}> {

        const user = await this.userRepository.findUser(email);

        if (!user) {
            throw new HttpException('Неверный логин или пароль', HttpStatus.BAD_REQUEST);
        }

        const  userEntity = new UserEntity(user);
        const isCorrectPassword = userEntity.validatePassword(password);

        if (!isCorrectPassword) {
            throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
        }

        return { id: user._id};

    }

    async login(id: string): Promise<AccountLogin.Response> {
        return {
            access_token: await this.jwtService.signAsync({ id })
        }
    }


}
