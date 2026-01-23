import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import redis from '../config/redis.js';

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = async (req, res) => {
  try {
    const { username, fullname, email, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '7d' }
    );

    res.cookie('NodeMart_Token', token, cookieOptions);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const identifier = email ? { email } : { username };

    const user = await User.findOne(identifier).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '7d' }
    );

    res.cookie('NodeMart_Token', token, cookieOptions);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.NodeMart_Token || req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      if (decoded?.id) {
        await redis.set(`blacklist:${token}`, 'true', 'EX', 7 * 24 * 60 * 60);
      }
    }

    res.clearCookie('NodeMart_Token', {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax'
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

