import { Injectable } from "@nestjs/common";
import { IUser } from "@rabbit-mq/interfaces";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import {RMQService} from 'nestjs-rmq'
import { BuyCourseSaga } from "./sagas/buy-course.saga";
import { UserEventEmmiter } from "./user.event.emmiter";

@Injectable()
export class UserService {

    constructor(
        private userRepository: UserRepository,
        private rmqService: RMQService,
        private userEventEmmiter: UserEventEmmiter
        
    ) {}



    async changeProfile(user: Pick<IUser, 'displayName'>, id: string) {

        const userExist = await this.userRepository.findUserById(id);

        if (!userExist) {
            throw new Error('User dont exist');
        }

        const userEntity = new UserEntity(userExist).updateProfile(user.displayName);
        await this.updateUser(userEntity);

        return { };
    }


    async buyCourse (userId: string, courseId: string) {

        const hasUser = await this.userRepository.findUserById(userId);
        if (!hasUser) {
            throw new Error('Такой пользователь не существуе !')
        }

        const userEntity = new UserEntity(hasUser);

        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
        
        const {user, paymentLink} = await saga.getState().pay();

        await this.updateUser(user);

        return {paymentLink}

    }


    async checkPayment (userId: string, courseId: string) {

        const hasUser = await this.userRepository.findUserById(userId);
        if (!hasUser) {
            throw new Error('Такой пользователь не существуе !')
        }

        const userEntity = new UserEntity(hasUser);

        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);

        const {user, status} = await saga.getState().checkPayment();

        await this.updateUser(user);

        return { status };
    }


    private updateUser(user: UserEntity) {

        return Promise.all([
            this.userEventEmmiter.handle(user),
            this.userRepository.updateUser(user)
        ])


    }
}