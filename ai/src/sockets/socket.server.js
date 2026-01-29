import 'dotenv/config';
import { parse } from "cookie";
import { Server } from "socket.io";
import jwt from 'jsonwebtoken';

let io;

export const initSocketServer = async (httpServer) => {
  io = new Server(httpServer, {});

  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    
    const { NodeMart_Token: token } = cookies ? parse(cookies) : {};

    if (!token) {
      throw new Error("Authentication error: Token not found");
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      throw new Error("Authentication error: Invalid token");
    }
  });
} 