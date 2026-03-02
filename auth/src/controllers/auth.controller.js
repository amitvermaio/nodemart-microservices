import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import redis from '../config/redis.js';
import { publishToQueue } from '../broker/broker.js';

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
      return res.status(409).json({ message: 'User with this email or username already exists' });
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

    await Promise.all([
      publishToQueue('AUTH_NOTIFICATION.USER_CREATED', {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname
      }),
      publishToQueue('AUTH_SELLER_DASHBOARD.USER_CREATED', user)
    ]);

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
        fullname: req.user.fullname,
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

export const getUserAddresses = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addUserAddress = async (req, res) => {
  try {
    const user = req.user;
    const { street, city, state, country, zip, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach(address => address.isDefault = false);
    }

    user.addresses.push({ street, city, state, country, zip, isDefault: !!isDefault });
    await user.save();
    res.status(201).json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteUserAddress = async (req, res) => {
  try {
    const user = req.user;
    const { addressId } = req.params;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const wasDefault = address.isDefault;

    user.addresses.pull({ _id: addressId });

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      message: 'Address deleted successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const makeDefaultAddress = async (req, res) => {
  try {
    const user = req.user;
    const { addressId } = req.params;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.addresses.forEach(addr => addr.isDefault = false);
    address.isDefault = true;
    await user.save();

    res.status(200).json({
      message: 'Default address updated successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// ─── Forgot Password Flow ────────────────────────────────────────────

const OTP_EXPIRY_SECONDS = 5 * 60; // 5 minutes
const RESET_TOKEN_EXPIRY_SECONDS = 10 * 60; // 10 minutes

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'OTP has been sent.' });
    }

    const existingOtp = await redis.get(`otp:${email}`);
    if (existingOtp) {
      const ttl = await redis.ttl(`otp:${email}`);
      if (ttl > OTP_EXPIRY_SECONDS - 60) {
        return res.status(429).json({ message: 'OTP already sent. Please wait before requesting again.' });
      }
    }

    const otp = generateOtp();

    await redis.set(`otp:${email}`, otp, 'EX', OTP_EXPIRY_SECONDS);

    await publishToQueue('AUTH_NOTIFICATION.PASSWORD_RESET_OTP', {
      email: user.email,
      fullname: user.fullname,
      otp,
    });

    res.status(200).json({ message: 'OTP has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
      return res.status(400).json({ message: 'OTP has expired or was not requested.' });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    await redis.del(`otp:${email}`);

    const resetToken = crypto.randomBytes(32).toString('hex');
    await redis.set(`reset:${resetToken}`, email, 'EX', RESET_TOKEN_EXPIRY_SECONDS);

    res.status(200).json({ message: 'OTP verified successfully.', resetToken });
  } catch (error) {
    console.error('Verify OTP error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const email = await redis.get(`reset:${resetToken}`);
    if (!email) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await redis.del(`reset:${resetToken}`);

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
