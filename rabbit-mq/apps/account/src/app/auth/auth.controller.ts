import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";

export class RegisterDto {
    displayName?: string;
    email: string;
    password: string;
}

export class LoginDto {
    email: string;
    password: string;
}


@Controller('auth')
export class AuthController {

    constructor(private userService: AuthService) {}


    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<{email: string}> {
        return this.userService.register(dto);

    }

    @Post('login')
    async login(@Body() {email, password}: LoginDto): Promise<{access_token: string}> {
        const {id} = await this.userService.validateUser(email, password);

        return this.userService.login(id);
    }
}




