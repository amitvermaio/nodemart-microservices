import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_AI_API_BASE_URL, {
  withCredentials: true,
  autoConnect: false,
});

export { socket };