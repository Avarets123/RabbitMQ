import { CourseGetCourse, PaymentCheck, PaymentGenerateLink, PaymentStatus } from "@rabbit-mq/contracts";
import { PurchaseState } from "@rabbit-mq/interfaces";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSaga } from "./buy-course.saga";
import { BuyCourseSagaState } from "./byu-course.saga.state";


export class BuyCourseSagaStateStarted implements BuyCourseSagaState {

    saga: BuyCourseSaga;

    public setContext(saga: BuyCourseSaga): void {
        throw new Error("Method not implemented.");
    }


    public  async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
        const {course} = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
            id: this.saga.courseId
        });

        if (!course) {
            throw new Error('Такого курса не существует !');
        }

        if (course.price === 0) {
            this.saga.setState(PurchaseState.Purchased, course._id);
            return { paymentLink: null, user: this.saga.user};
        }

        const { paymentLink } = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
            userId: this.saga.user._id,
            courseId: course._id,
            sum: course.price
        });

        this.saga.setState(PurchaseState.WaitingForPayment, course._id);

        return {paymentLink, user: this.saga.user};


    }
    public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        throw new Error("Нельзя проверить платеж, который не начался.");
    }
    public async cancel(): Promise<{ user: UserEntity; }> {
        this.saga.setState(PurchaseState.Canceled, this.saga.courseId);

        return {user: this.saga.user};

    }

}


export class BuyCourseSagaStateProcess implements BuyCourseSagaState {

    saga: BuyCourseSaga;


    public setContext(saga: BuyCourseSaga): void {
        throw new Error(".");
    }


    public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
        throw new Error("Нельзя создать ссылку на оплату в процессе.");
    }


    public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        
        const {status} = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
            userId: this.saga.user._id,
            courseId: this.saga.courseId
        });


        if (status === 'canceled') {
            this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
            return {user: this.saga.user, status: 'canceled'};
        }

        if (status !== 'success') {
            return { user: this.saga.user, status: 'progress' };
        }

        this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
        return {user: this.saga.user, status: 'success'};

        
    }


    public cancel(): Promise<{ user: UserEntity; }> {
        throw new Error("Нельзя отменить платеж в процессе.");
    }

}



export class BuyCourseSagaStateFinished implements BuyCourseSagaState {
    saga: BuyCourseSaga;


    public setContext(saga: BuyCourseSaga): void {
        throw new Error("Method not implemented.");
    }


    public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
        throw new Error("Нельзя оплатить купленный курс.");
    }


    public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        throw new Error("Нельзя проверить платеж купленного курса.");
    }

    
    public cancel(): Promise<{ user: UserEntity; }> {
        throw new Error("Нельзя отменить купленный курс.");
    }

}


export class BuyCourseSagaStateCanceled implements BuyCourseSagaState {
    saga: BuyCourseSaga;


    public setContext(saga: BuyCourseSaga): void {
        throw new Error("Method not implemented.");
    }


    public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {

        throw new Error('Что-то пошло не так !')
        // this.saga.setState(PurchaseState.Started, this.saga.courseId);
        // return this.saga
    }


    public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        throw new Error("Нельзя проверить платеж отмененного курса.");
    }

    
    public cancel(): Promise<{ user: UserEntity; }> {
        throw new Error("Нельзя отменить отмененный курс.");
    }

}