import { Document } from "mongoose";
import {IUser, UserRole} from '@rabbit-mq/interfaces';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User extends Document implements IUser {

    @Prop()
    displayName?: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    passwordHash: string;

    @Prop({required: true, enum: UserRole, type: String })
    role: UserRole;

}

export const UserSchema =  SchemaFactory.createForClass(User);