const ProjectService = require('../services/projectService');
const SearchService = require('../services/searchService');

class ProjectController {
  constructor() {
    this.projectService = new ProjectService();
    this.searchService = new SearchService(this.projectService);
  }

  async getAllProjects(req, res) {
    try {
      const projects = await this.projectService.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProjectById(req, res) {
    try {
      const project = await this.projectService.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchProjects(req, res) {
    try {
      const keyword = req.params.keyword;
      const projects = await this.searchService.searchByKeyword(keyword);
      res.json({
        keyword,
        count: projects.length,
        results: projects
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async advancedSearch(req, res) {
    try {
      const filters = req.body;
      const projects = await this.searchService.searchAdvanced(filters);
      res.json({
        filters,
        count: projects.length,
        results: projects
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProject(req, res) {
    try {
      const projectData = req.body;
      const project = await this.projectService.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProject(req, res) {
    try {
      const project = await this.projectService.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProject(req, res) {
    try {
      const deleted = await this.projectService.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProjectStats(req, res) {
    try {
      const stats = await this.projectService.getProjectStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getKeywordSuggestions(req, res) {
    try {
      const suggestions = await this.searchService.getKeywordsSuggestions();
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProjectController;