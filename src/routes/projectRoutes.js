const express = require('express');
const ProjectController = require('../controllers/projectController');

const router = express.Router();
const projectController = new ProjectController();

// GET all projects
router.get('/', projectController.getAllProjects.bind(projectController));

// GET project by ID
router.get('/:id', projectController.getProjectById.bind(projectController));

// SEARCH projects by keyword
router.get('/search/:keyword', projectController.searchProjects.bind(projectController));

// ADVANCED search projects
router.post('/search/advanced', projectController.advancedSearch.bind(projectController));

// GET project statistics
router.get('/stats/summary', projectController.getProjectStats.bind(projectController));

// GET keyword suggestions
router.get('/keywords/suggestions', projectController.getKeywordSuggestions.bind(projectController));

// CREATE new project
router.post('/', projectController.createProject.bind(projectController));

// UPDATE project
router.put('/:id', projectController.updateProject.bind(projectController));

// DELETE project
router.delete('/:id', projectController.deleteProject.bind(projectController));

module.exports = router;