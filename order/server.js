import 'dotenv/config';
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { connectBroker } from './src/broker/broker.js';

const PORT = process.env.PORT || 4003;

connectDB();
connectBroker();

app.listen(PORT, () => { 
  console.log(`Order Service is running on port ${PORT}`);
});