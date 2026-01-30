import 'dotenv/config';
import app from './src/app.js';
import connectDb from './src/config/db.js'
import { connectBroker } from './src/broker/broker.js';

const PORT = process.env.PORT || 4004;

connectDb();
connectBroker();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 