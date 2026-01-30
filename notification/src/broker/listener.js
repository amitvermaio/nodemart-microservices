import { sendMail } from '../email.js';
import { subscribeToQueue } from './broker.js';
import { welcomeEmailTemplate } from '../template/welcome.js';

const startListeners = async () => {
  await subscribeToQueue('AUTH_NOTIFICATION.USER_CREATED', async (data) => {
    console.log('Received USER_CREATED event:', data);
    
    const { email, fullname } = data;
    await sendMail(email, 'Welcome to Our Service', welcomeEmailTemplate({ name: fullname }));
  });
};

export { startListeners };