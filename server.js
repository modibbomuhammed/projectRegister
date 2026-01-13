const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const projectRoutes = require('./src/routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', projectRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'PMO Application API',
    endpoints: {
      getAllProjects: 'GET /api/projects',
      getProjectById: 'GET /api/projects/:id',
      searchProjects: 'GET /api/projects/search/:keyword',
      createProject: 'POST /api/projects',
      updateProject: 'PUT /api/projects/:id',
      deleteProject: 'DELETE /api/projects/:id'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`PMO Application running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/projects`);
});