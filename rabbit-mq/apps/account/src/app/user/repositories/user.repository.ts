import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IUser } from "@rabbit-mq/interfaces";
import { Model } from "mongoose";
import { UserEntity } from "../entities/user.entity";
import { User } from "../models/user.model";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}


    public async createUser(user: UserEntity): Promise<User> {

        const newUser = new this.userModel(user);
        return await newUser.save();
    }


    public async updateUser({_id, ...rest}: UserEntity) {
        return await this.userModel.updateOne({_id}, { $set: {...rest}}).exec();
    }


    public async findUser(email: string): Promise<User> {
        return await this.userModel.findOne({email}).exec();
    }
    
    public async findUserById(id: string) {
        return await this.userModel.findById(id).exec();
    }

    public async deleteUser(email: string) {
        return await this.userModel.deleteOne({email}).exec();
    }


    

}