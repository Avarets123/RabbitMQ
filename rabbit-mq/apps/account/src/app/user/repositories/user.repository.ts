import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity } from "../entities/user.entity";
import { User } from "../models/user.model";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}


    async createUser(user: UserEntity): Promise<User> {

        const newUser = new this.userModel(user);

        return newUser.save();
    }

    async findUser(email: string): Promise<User> {
        return await this.userModel.findOne({email}).exec();
    }

    async deleteUser(email: string) {
        return await this.userModel.deleteOne({email}).exec();
    }

}