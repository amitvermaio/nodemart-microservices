import { sendMail } from '../email.js';
import { subscribeToQueue } from './broker.js';
import { welcomeEmailTemplate } from '../template/welcome.js';
import { otpEmailTemplate } from '../template/otp.js';

const startListeners = async () => {
  await subscribeToQueue('AUTH_NOTIFICATION.USER_CREATED', async (data) => {
    console.log('Received USER_CREATED event:', data);
    
    const { email, fullname } = data;
    await sendMail(email, 'Welcome to Our Service', welcomeEmailTemplate({ name: fullname }));
  });

  await subscribeToQueue('AUTH_NOTIFICATION.PASSWORD_RESET_OTP', async (data) => {
    console.log('Received PASSWORD_RESET_OTP event:', data);

    const { email, fullname, otp } = data;
    await sendMail(email, 'Your Password Reset OTP - NodeMart', otpEmailTemplate({ name: fullname, otp }));
  });
};

export { startListeners };