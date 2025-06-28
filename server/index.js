const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const { swaggerUi, specs } = require('./config/swagger');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MERN Stack API' });
});

// API routes
app.use('/api/users', require('./routes/users'));
app.use('/api/history', require('./routes/history'));

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});