import 'dotenv/config';
import amqplib from 'amqplib';

let channel, connection;
const RABBITMQ_RETRY_DELAY = 5000; // 5 seconds

const connectBroker = async (retries = 5) => {
  if (connection) return connection;

  for (let i = 0; i < retries; i++) {
    try {
      connection = await amqplib.connect(process.env.RABBITMQ_URL);
      console.log('Connected to RABBITMQ');
      channel = await connection.createChannel();
      return connection;
    } catch (error) {
      console.warn(`RabbitMQ connection attempt ${i + 1}/${retries} failed. ${error.message}`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, RABBITMQ_RETRY_DELAY));
      } else {
        console.warn('Failed to connect to RabbitMQ after all retries. Will retry on next queue operation.');
      }
    }
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