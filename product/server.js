import "dotenv/config";
import app from "./src/app.js";
import connectDb from "./src/config/db.js";
import { connectBroker } from './src/broker/broker.js';

const PORT = process.env.PORT || 4001;
const MAX_RETRIES = 10;
const RETRY_DELAY = 3000; // 3 seconds

async function startServer() {
  try {
    let dbConnected = false;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        await connectDb();
        dbConnected = true;
        break;
      } catch (error) {
        console.log(`Database connection attempt ${i + 1}/${MAX_RETRIES} failed. Retrying in ${RETRY_DELAY / 1000}s...`);
        if (i < MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    if (!dbConnected) {
      throw new Error('Failed to connect to database after all retries');
    }

    // Connect to broker (non-blocking)
    await connectBroker();

    app.listen(PORT, () => {
      console.log(`Product Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Product Service:', error);
    process.exit(1);
  }
}

startServer();