"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, amqplib_1.connect)('amqp://localhost');
        const channel = yield connection.createChannel();
        channel.assertExchange('test', 'topic', { durable: true });
        const replyQueue = yield channel.assertQueue('', { exclusive: true });
        channel.consume(replyQueue.queue, (message) => {
            console.log(message === null || message === void 0 ? void 0 : message.content.toString());
            console.log(message === null || message === void 0 ? void 0 : message.properties.correlationId);
        });
        channel.publish('test', 'my.command', Buffer.from('Работает !'), { replyTo: replyQueue.queue, correlationId: '1' });
    }
    catch (error) {
        console.log(error);
    }
});
start();
