import { subscribeToQueue } from './broker.js';

const startListeners = async () => {
  await subscribeToQueue('AUTH_NOTIFICATION.USER_CREATED', async (data) => {
    console.log('Received USER_CREATED event:', data);
    // Add your handling logic here
    const emailHTMLTemplate = `
      <h1>Welcome to Our Service!</h1>
    `
  });
};

export { startListeners };