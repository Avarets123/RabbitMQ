import { IUser, UserRole } from "@rabbit-mq/interfaces";
import {compare, hash} from 'bcrypt';

export class UserEntity implements IUser {
    _id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;


    constructor(user: IUser) {
        this._id = user._id;
        this.passwordHash = user.passwordHash;
        this.displayName = user.displayName;
        this.email = user.email;
        this.role = user.role;
    }

    public async setHashPassword(password: string): Promise<this> {

        const hashPass = await hash(password, 9);
        this.passwordHash = hashPass;
        return this;

    }

    public async validatePassword(password: string) {
        return await compare(password, this.passwordHash);
    }
}