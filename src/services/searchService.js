class SearchService {
  constructor(projectService) {
    this.projectService = projectService;
  }

  async searchByKeyword(keyword) {
    const projects = await this.projectService.getAllProjects();
    const searchTerm = keyword.toLowerCase().trim();
    
    return projects.filter(project => {
      // Search in name
      if (project.name.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Search in description
      if (project.description.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Search in manager name
      if (project.manager.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Search in department
      if (project.department.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Search in project type
      if (project.projectType.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Search in keywords array
      if (project.keywords.some(k => k.toLowerCase().includes(searchTerm))) {
        return true;
      }
      
      // Search in tags array
      if (project.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
        return true;
      }
      
      // Search in team members
      if (project.team.some(member => member.toLowerCase().includes(searchTerm))) {
        return true;
      }
      
      // Search in stakeholders
      if (project.stakeholders.some(stakeholder => stakeholder.toLowerCase().includes(searchTerm))) {
        return true;
      }
      
      return false;
    });
  }

  async searchAdvanced(filters) {
    const projects = await this.projectService.getAllProjects();
    
    return projects.filter(project => {
      // Keyword search across multiple fields
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const keywordMatch = 
          project.name.toLowerCase().includes(keyword) ||
          project.description.toLowerCase().includes(keyword) ||
          project.manager.toLowerCase().includes(keyword) ||
          project.keywords.some(k => k.toLowerCase().includes(keyword)) ||
          project.tags.some(t => t.toLowerCase().includes(keyword));
        
        if (!keywordMatch) return false;
      }
      
      // Status filter
      if (filters.status && project.status !== filters.status) {
        return false;
      }
      
      // Priority filter
      if (filters.priority && project.priority !== filters.priority) {
        return false;
      }
      
      // Department filter
      if (filters.department && project.department !== filters.department) {
        return false;
      }
      
      // Project type filter
      if (filters.projectType && project.projectType !== filters.projectType) {
        return false;
      }
      
      // Date range filter
      if (filters.startDateAfter && new Date(project.startDate) < new Date(filters.startDateAfter)) {
        return false;
      }
      
      if (filters.endDateBefore && new Date(project.endDate) > new Date(filters.endDateBefore)) {
        return false;
      }
      
      // Budget range filter
      if (filters.minBudget && project.budget < filters.minBudget) {
        return false;
      }
      
      if (filters.maxBudget && project.budget > filters.maxBudget) {
        return false;
      }
      
      return true;
    });
  }

  async getKeywordsSuggestions() {
    const projects = await this.projectService.getAllProjects();
    const keywordsSet = new Set();
    
    projects.forEach(project => {
      project.keywords.forEach(keyword => {
        keywordsSet.add(keyword.toLowerCase());
      });
      project.tags.forEach(tag => {
        keywordsSet.add(tag.toLowerCase());
      });
    });
    
    return Array.from(keywordsSet);
  }
}

module.exports = SearchService;