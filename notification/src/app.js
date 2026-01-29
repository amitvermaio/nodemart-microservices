import express from "express";
import { connectBroker } from './broker/broker.js';
import { startListeners } from './broker/listener.js';
const app = express();

connectBroker().then(() => {
  startListeners();
})

app.get('/health', (req, res) => {
  res.status(200).send({ ok: true, uptime: process.uptime() });
});

export default app;