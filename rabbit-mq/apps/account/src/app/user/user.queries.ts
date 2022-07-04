import { Body, Controller } from "@nestjs/common";
import { AccountGetInfo, AccountUserCourses } from "@rabbit-mq/contracts";
import {RMQValidate, RMQRoute} from 'nestjs-rmq';
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";

@Controller()
export class UserQueries {

    constructor(private userRepository: UserRepository) {}

    @RMQValidate()
    @RMQRoute(AccountGetInfo.topic)
    async userInfo (@Body() {id}: AccountGetInfo.Request): Promise<AccountGetInfo.Response> {

        const user = await this.userRepository.findUserById(id);
        const profile = new UserEntity(user).getUserProfile();

        return {
            profile
        };
    }


    @RMQValidate()
    @RMQRoute(AccountUserCourses.topic)
    async userCourses(@Body() {id}: AccountUserCourses.Request): Promise<AccountUserCourses.Response> {

        const user = await this.userRepository.findUserById(id);

        return {
            courses: user.courses
        };

    }
    
}