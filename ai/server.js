import "dotenv/config";
import app from "./src/app.js";
import http from 'http';
import { initSocketServer } from './src/sockets/socket.server.js';

const httpServer = http.createServer(app);
initSocketServer(httpServer);

httpServer.listen(process.env.PORT, () => {
  console.log(`AI Server is running on port ${process.env.PORT}`);
});