import amqp from 'amqplib';
import logger from '../utils/logger.js';

interface IConnectionPool {
    uri: string;
    connections: amqp.Connection[];
}

class RabbitMQConnectionPool implements IConnectionPool {
    uri: string;
    connections: amqp.Connection[];

    constructor(uri: string) {
        this.uri = uri;
        this.connections = [];
    }

    public async send(queueName: string, message: any): Promise<void> {
        let connection: amqp.Connection | null = null;
        try {
            connection = await this.getConnection();
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName, { durable: true });

            channel.sendToQueue(queueName, Buffer.from(message));
            logger.info('Message sent successfully.');
        } catch (error) {
            logger.error('Publish message error:', error);
        } finally {
            if (connection) this.releaseConnection(connection);
        }
    }

    public async consume(
        queueName: string
    ): Promise<amqp.ConsumeMessage | null> {
        let connection: amqp.Connection | null = null;
        try {
            connection = await this.getConnection();
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName, { durable: true });

            channel.consume(
                queueName,
                (message) => {
                    logger.info('Message received successfully.');
                    if (message === null) {
                        logger.info('No message received.');
                        return null;
                    }
                    channel.ack(message);
                    return message;
                },
                { noAck: false }
            );
        } catch (error) {
            logger.error('Consume message error:', error);
        } finally {
            if (connection) this.releaseConnection(connection);
        }
        return null;
    }

    private async createConnection(): Promise<amqp.Connection> {
        const connection = await amqp.connect(this.uri);
        this.connections.push(connection);
        logger.info('New RabbitMQ connection created.');
        return connection;
    }

    private async getConnection(): Promise<amqp.Connection> {
        if (this.connections.length === 0) {
            return await this.createConnection();
        }

        const connection = this.connections.pop();
        logger.info('Reusing existing RabbitMQ connection from the pool.');
        return connection!;
    }

    private releaseConnection(connection: amqp.Connection): void {
        this.connections.push(connection);
        logger.info('RabbitMQ connection released back to the pool.');
    }
}

export default RabbitMQConnectionPool;
