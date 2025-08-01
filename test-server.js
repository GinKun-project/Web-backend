const express = require('express');
const cors = require('cors');

// Create a simple test server
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend server is working!' });
});

// Test the routes we created
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API routes are working!',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      achievements: '/api/achievements',
      gameStats: '/api/gameStats',
      settings: '/api/settings'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/test`);
  console.log(`🔗 API Test URL: http://localhost:${PORT}/api/test`);
});

module.exports = app; 