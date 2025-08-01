const jwt = require('jsonwebtoken');

// Debug function to decode JWT tokens
function decodeToken(token) {
  try {
    const decoded = jwt.decode(token);
    console.log('Token payload:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Debug function to verify token
function verifyToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    console.log('Token is valid:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

// Debug function to generate test token
function generateTestToken(payload, secret) {
  try {
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });
    console.log('Generated test token:', token);
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}

module.exports = {
  decodeToken,
  verifyToken,
  generateTestToken
}; 