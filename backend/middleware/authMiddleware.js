const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // Get authorization header value
  const authHeader = req.headers.authorization;

  // Check if the header is present and properly formatted
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info (like user id and email) to the request object
    req.user = decoded;

    // Continue to next middleware/route handler
    next();
  } catch (err) {
    // Token verification failed (expired, invalid, etc.)
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
