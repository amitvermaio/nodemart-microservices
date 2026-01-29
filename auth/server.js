import 'dotenv/config';
import app from './src/app.js';
import connectToDatabase from './src/config/db.js';
import { connectBroker } from './src/broker/broker.js';

connectToDatabase();
connectBroker();

app.listen(process.env.PORT, () => {
  console.log(`Auth service running on port ${process.env.PORT}`);
});