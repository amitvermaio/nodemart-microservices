import jwt from 'jsonwebtoken';

const authenticate = (roles = [ 'user' ] ) => (req, res, next) => {
  const token = req.cookies['NodeMart_Token'] || req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
}

export { authenticate };