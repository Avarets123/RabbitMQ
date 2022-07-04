import { Body, Controller } from "@nestjs/common";
import { AccountLogin, AccountRegister } from "@rabbit-mq/contracts";
import { AuthService } from "../auth/auth.service";
import {RMQRoute, RMQValidate} from 'nestjs-rmq';




@Controller()
export class AuthController {

    constructor(private userService: AuthService) {}


    @RMQValidate()
    @RMQRoute(AccountRegister.topic)
    async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
        return this.userService.register(dto);

    }

    @RMQValidate()
    @RMQRoute(AccountLogin.topic)
    async login(@Body() {email, password}: AccountLogin.Request): Promise<AccountLogin.Response> {
        const {id} = await this.userService.validateUser(email, password);

        return this.userService.login(id);
    }
}




