import 'dotenv/config';
import amqplib from 'amqplib';

let channel, connection;

const connectBroker = async () => {
  if (connection) return connection;

  try {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);
    console.log('Connected to RABBITMQ');
    channel = await connection.createChannel();

  } catch (error) {
    console.error('Error connecting to message broker:', error);
  }
}

const publishToQueue = async (queueName, data = {}) => {
  if (!channel || !connection) await connectBroker();

  try {
    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    console.error('Error publishing to queue:', error);
  }
}

const subscribeToQueue = async (queueName, callback) => {
  if (!channel || !connection) await connectBroker();

  try {
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        await callback(data);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error subscribing to queue:', error);
  }
}

export {
  channel,
  connection,
  connectBroker,
  publishToQueue,
  subscribeToQueue
};