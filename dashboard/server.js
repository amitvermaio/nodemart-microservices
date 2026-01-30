import 'dotenv/config';
import app from './src/app.js';
import connectDb from './src/config/db.js';
import { connectBroker } from './src/broker/broker.js';
import { startListener } from './src/broker/listener.js';

const PORT = process.env.PORT || 3007;

connectDb();
connectBroker().then(() => { 
  startListener()
});

app.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`);
});