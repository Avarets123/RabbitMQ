import { connect } from "amqplib";

const start = async () => {

    try {
        
        const connection = await connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertExchange('test', 'topic');
        const queue = await channel.assertQueue('my-cool-queue', { durable: true });
        channel.bindQueue(queue.queue, 'test', 'my.command');
        channel.consume(queue.queue, (message) => {
            if (!message) {
                return;
            }
            console.log(message.content.toString());

            if (message.properties.replyTo) {
                console.log(message.properties.replyTo);
                channel.sendToQueue(message.properties.replyTo, Buffer.from('Ответ !'), {correlationId: message.properties.correlationId})
            }

        },
        { noAck: true})


    } catch (error) {
        console.log(error)
    }

};

start();