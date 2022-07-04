import { UserEntity } from "../entities/user.entity";
import {RMQService} from 'nestjs-rmq'
import { PurchaseState } from "@rabbit-mq/interfaces";
import { BuyCourseSagaState } from "./byu-course.saga.state";
import { BuyCourseSagaStateCanceled, BuyCourseSagaStateFinished, BuyCourseSagaStateProcess, BuyCourseSagaStateStarted } from "./buy-course.steps";


export class BuyCourseSaga {

    state: BuyCourseSagaState;

    constructor(public user: UserEntity, public courseId: string, public rmqService: RMQService) {}


    setState(state: PurchaseState, courseId: string) {
        switch (state) {
            case PurchaseState.Started:

                this.state = new BuyCourseSagaStateStarted();
                
                break;

            case PurchaseState.WaitingForPayment:
                this.state = new BuyCourseSagaStateProcess();
                break;

            case PurchaseState.Purchased:
                this.state = new BuyCourseSagaStateFinished()
                break;
                
            case PurchaseState.Canceled:
                this.state = new BuyCourseSagaStateCanceled();
                break;
        }

        this.state.setContext(this);
        this.user.updateCourseStatus(courseId, state)
    }

    getState() {
        return this.state;
    }
}