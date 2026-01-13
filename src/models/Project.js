const { v4: uuidv4 } = require('uuid');
const { DateTime } = require('luxon');

class Project {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name || '';
    this.description = data.description || '';
    this.status = data.status || 'Planning'; // Planning, In Progress, Completed, On Hold, Cancelled
    this.priority = data.priority || 'Medium'; // High, Medium, Low
    this.startDate = data.startDate || DateTime.now().toISO();
    this.endDate = data.endDate || '';
    this.budget = data.budget || 0;
    this.actualCost = data.actualCost || 0;
    this.manager = data.manager || '';
    this.team = data.team || [];
    this.stakeholders = data.stakeholders || [];
    this.risks = data.risks || [];
    this.milestones = data.milestones || [];
    this.keywords = data.keywords || [];
    this.createdAt = data.createdAt || DateTime.now().toISO();
    this.updatedAt = data.updatedAt || DateTime.now().toISO();
    
    // Custom fields
    this.department = data.department || '';
    this.projectType = data.projectType || ''; // IT, Construction, Marketing, etc.
    this.tags = data.tags || [];
    this.documents = data.documents || [];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      priority: this.priority,
      startDate: this.startDate,
      endDate: this.endDate,
      budget: this.budget,
      actualCost: this.actualCost,
      manager: this.manager,
      team: this.team,
      stakeholders: this.stakeholders,
      risks: this.risks,
      milestones: this.milestones,
      keywords: this.keywords,
      department: this.department,
      projectType: this.projectType,
      tags: this.tags,
      documents: this.documents,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  update(data) {
    const fields = [
      'name', 'description', 'status', 'priority', 'startDate', 'endDate',
      'budget', 'actualCost', 'manager', 'team', 'stakeholders', 'risks',
      'milestones', 'keywords', 'department', 'projectType', 'tags', 'documents'
    ];
    
    fields.forEach(field => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });
    
    this.updatedAt = DateTime.now().toISO();
  }
}

module.exports = Project;