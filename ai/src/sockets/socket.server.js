import 'dotenv/config';
import { parse } from "cookie";
import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import agent from '../agents/agent.js';

let io;

export const initSocketServer = async (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    }
  });

  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    
    const { NodeMart_Token: token } = cookies ? parse(cookies) : {};

    if (!token) {
      throw new Error("Authentication error: Token not found");
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      socket.token = token;
      next();
    } catch (error) {
      throw new Error("Authentication error: Invalid token");
    }
  });

  io.on("connection", (socket) => {

    socket.join(socket.user.id);

    socket.on("message", async (data) => {
      const agentResponse = await agent.invoke(
        { messages: [{ role: 'user', content: data }] },
        { metadata: { token: socket.token } }
      );
      
      const lastMessage = agentResponse.messages[agentResponse.messages.length - 1];

      socket.emit("message", lastMessage.content);
    })
  });
} 