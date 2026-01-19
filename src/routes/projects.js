const express = require('express');
const router = express.Router();
const projectService = require('../services/projectService');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET project by ID with details
router.get('/:id', async (req, res) => {
  try {
    const project = await projectService.getProjectWithDetails(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// SEARCH projects
router.get('/search/:keyword', async (req, res) => {
  try {
    const projects = await projectService.searchProjects(req.params.keyword);
    res.json({
      keyword: req.params.keyword,
      count: projects.length,
      results: projects
    });
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// CREATE project
router.post('/', async (req, res) => {
  try {
    // Add uploaded_by from request or default
    const projectData = {
      ...req.body,
      uploaded_by: req.body.uploaded_by || req.headers['x-user'] || 'system'
    };
    
    const project = await projectService.createProject(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// UPDATE project
router.put('/:id', async (req, res) => {
  try {
    const last_modified_by = req.body.last_modified_by || req.headers['x-user'] || 'system';
    const project = await projectService.updateProject(req.params.id, req.body, last_modified_by);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// EXTEND project deadline
router.post('/:id/extend', async (req, res) => {
  try {
    const { extension_days, reason } = req.body;
    const extended_by = req.body.extended_by || req.headers['x-user'] || 'system';
    
    if (!extension_days || extension_days <= 0) {
      return res.status(400).json({ error: 'Extension days must be positive' });
    }
    
    const project = await projectService.extendProjectDeadline(
      req.params.id, 
      extension_days, 
      reason, 
      extended_by
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({
      message: `Project deadline extended by ${extension_days} days`,
      project: project
    });
  } catch (error) {
    console.error('Error extending project:', error);
    res.status(500).json({ error: 'Failed to extend project deadline' });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await projectService.deleteProject(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// GET project statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await projectService.getProjectStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET financial overview
router.get('/:id/financial', async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const financialMetrics = {
      estimated_budget: project.estimated_budget,
      budget_allocated: project.budget_allocated,
      budget_utilized: project.budget_utilized,
      contingency_funds: project.contingency_funds,
      total_expenditure: project.total_expenditure,
      available_funds: project.budget_allocated - project.budget_utilized,
      budget_variance: project.estimated_budget - project.total_expenditure,
      utilization_rate: project.estimated_budget > 0 
        ? (project.budget_utilized / project.estimated_budget) * 100 
        : 0
    };
    
    res.json(financialMetrics);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// GET schedule overview
router.get('/:id/schedule', async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const scheduleMetrics = {
      proposed_start: project.proposed_start_date,
      proposed_end: project.proposed_end_date,
      actual_start: project.actual_start_date,
      actual_end: project.actual_end_date,
      current_deadline: project.current_deadline,
      extension_count: project.extension_count,
      total_extension_days: project.total_extension_days,
      is_delayed: project.actual_end_date 
        ? new Date(project.actual_end_date) > new Date(project.proposed_end_date)
        : new Date() > new Date(project.current_deadline || project.proposed_end_date)
    };
    
    res.json(scheduleMetrics);
  } catch (error) {
    console.error('Error fetching schedule data:', error);
    res.status(500).json({ error: 'Failed to fetch schedule data' });
  }
});

// CRUD for Change Requests
router.get('/:id/change-requests', async (req, res) => {
  try {
    const changeRequests = await projectService.getChangeRequests(req.params.id);
    res.json(changeRequests);
  } catch (error) {
    console.error('Error fetching change requests:', error);
    res.status(500).json({ error: 'Failed to fetch change requests' });
  }
});

router.post('/:id/change-requests', async (req, res) => {
  try {
    const changeRequest = await projectService.createChangeRequest(req.params.id, req.body);
    res.status(201).json(changeRequest);
  } catch (error) {
    console.error('Error creating change request:', error);
    res.status(500).json({ error: 'Failed to create change request' });
  }
});

// CRUD for Risks
router.get('/:id/risks', async (req, res) => {
  try {
    const risks = await projectService.getRisks(req.params.id);
    res.json(risks);
  } catch (error) {
    console.error('Error fetching risks:', error);
    res.status(500).json({ error: 'Failed to fetch risks' });
  }
});

router.post('/:id/risks', async (req, res) => {
  try {
    const risk = await projectService.createRisk(req.params.id, req.body);
    res.status(201).json(risk);
  } catch (error) {
    console.error('Error creating risk:', error);
    res.status(500).json({ error: 'Failed to create risk' });
  }
});

// Budget Transactions
router.post('/:id/transactions', async (req, res) => {
  try {
    const project = await projectService.updateBudget(req.params.id, req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

router.get('/:id/transactions', async (req, res) => {
  try {
    const transactions = await projectService.getBudgetTransactions(req.params.id);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;