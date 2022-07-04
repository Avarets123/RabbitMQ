import { AccountChangedCourse } from "@rabbit-mq/contracts";
import { IDomainEvents, IUser, IUserCourses, PurchaseState, UserRole } from "@rabbit-mq/interfaces";
import {compare, hash} from 'bcrypt';

export class UserEntity implements IUser {
    _id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    courses?: IUserCourses[];
    events: IDomainEvents[] = [];


    constructor(user: IUser) {
        this._id = user._id;
        this.passwordHash = user.passwordHash;
        this.displayName = user.displayName;
        this.email = user.email;
        this.role = user.role;
        this.courses = user.courses;
    }


    public addCourse(courseId: string) {

        const exist = this.courses.find(c => c.courseId === courseId);

        if (exist) {
            throw new Error('Добавляемый курс уже существует !');
        }

        this.courses.push({
            courseId,
            purchaseState: PurchaseState.Started
        });

    }

    


    public deleteCourse(courseId: string) {
        this.courses = this.courses.filter(c => c.courseId !== courseId);
    }

    public updateCourseStatus(courseId: string, state: PurchaseState) {

        const exist = this.courses.find(c => c.courseId === courseId);

        if (!exist) {
            this.courses.push({
                courseId,
                purchaseState: state
            });

            return this;
        }

        if (state === PurchaseState.Canceled) {
            this.courses = this.courses.filter(c => c.courseId !== courseId);
            return this;
        }


        this.courses.map(c => {
            if (c.courseId === courseId) {
                c.purchaseState = state;
                return c;
            }

            return c;
        });

        this.events.push(
            { topic: AccountChangedCourse.topic,
              data: { courseId, userId: this._id, state}
            });
        return this;

    }



    public getUserProfile() {
        return {
            email: this.email,
            role: this.role,
            displayName: this.displayName
        }
    }


    public async setHashPassword(password: string): Promise<this> {

        const hashPass = await hash(password, 9);
        this.passwordHash = hashPass;
        return this;

    }

    public async validatePassword(password: string) {
        return await compare(password, this.passwordHash);
    }

    public updateProfile(displayName: string): this {
        this.displayName = displayName;
        return this;
    }
}