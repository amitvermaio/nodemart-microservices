import "dotenv/config";
import app from "./src/app.js";
import connectDb from "./src/config/db.js";
import { connectBroker } from './src/broker/broker.js';

connectDb();
connectBroker();

app.listen(process.env.PORT || 4001, () => {
  console.log(`Server is running on port ${process.env.PORT || 4001}`);
});