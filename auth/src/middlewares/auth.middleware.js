import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import redis from '../config/redis.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.NodeMart_Token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
    } catch (error) {
      res.clearCookie('NodeMart_Token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    const isBlacklisted = await redis.get(`blacklist:${token}`);
   
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};