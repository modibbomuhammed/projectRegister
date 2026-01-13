const Project = require('../models/Project');
const DataManager = require('../utils/dataManager');

class ProjectService {
  constructor() {
    this.dataManager = new DataManager('../data/projects.json');
  }

  async getAllProjects() {
    return await this.dataManager.getAll();
  }

  async getProjectById(id) {
    return await this.dataManager.getById(id);
  }

  async createProject(projectData) {
    const project = new Project(projectData);
    const savedProject = await this.dataManager.create(project.toJSON());
    return savedProject;
  }

  async updateProject(id, projectData) {
    const existingProject = await this.getProjectById(id);
    if (!existingProject) {
      return null;
    }
    
    const project = new Project(existingProject);
    project.update(projectData);
    
    return await this.dataManager.update(id, project.toJSON());
  }

  async deleteProject(id) {
    return await this.dataManager.delete(id);
  }

  async getProjectStats() {
    const projects = await this.getAllProjects();
    
    const stats = {
      total: projects.length,
      byStatus: {},
      byPriority: {},
      byDepartment: {},
      byType: {},
      totalBudget: 0,
      totalActualCost: 0
    };
    
    projects.forEach(project => {
      // Count by status
      stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
      
      // Count by priority
      stats.byPriority[project.priority] = (stats.byPriority[project.priority] || 0) + 1;
      
      // Count by department
      stats.byDepartment[project.department] = (stats.byDepartment[project.department] || 0) + 1;
      
      // Count by type
      stats.byType[project.projectType] = (stats.byType[project.projectType] || 0) + 1;
      
      // Financial totals
      stats.totalBudget += project.budget || 0;
      stats.totalActualCost += project.actualCost || 0;
    });
    
    return stats;
  }
}

module.exports = ProjectService;