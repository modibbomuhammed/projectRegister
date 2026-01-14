//
console.log({num: 1, CLIENT_URL: process.env.CLIENT_URL, database: process.env.DATABASE_URL});
//
require('dotenv').config();
//
console.log({num: 2, CLIENT_URL: process.env.CLIENT_URL, database: process.env.DATABASE_URL});
//



const cs = process.env.DATABASE_URL;

console.log('TYPE:', typeof cs);
console.log('RAW:', JSON.stringify(cs));
console.log('TRIMMED:', JSON.stringify(cs?.trim()));

new URL(cs); // ← THIS LINE






//////////////////////////////////////////
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const projectRoutes = require('./src/routes/projects');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});


// Middleware
app.use(limiter);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/projects', projectRoutes);

// Catch-all for frontend routing (LAST)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`PMO Application running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});