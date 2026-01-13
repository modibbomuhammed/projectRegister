class Project {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || '';
    this.status = data.status || 'Planning';
    this.priority = data.priority || 'Medium';
    this.start_date = data.start_date || new Date().toISOString().split('T')[0];
    this.end_date = data.end_date || null;
    this.budget = data.budget || 0;
    this.actual_cost = data.actual_cost || 0;
    this.manager = data.manager || '';
    this.department = data.department || '';
    this.project_type = data.project_type || '';
    this.keywords = data.keywords || [];
    this.tags = data.tags || [];
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      priority: this.priority,
      start_date: this.start_date,
      end_date: this.end_date,
      budget: parseFloat(this.budget),
      actual_cost: parseFloat(this.actual_cost),
      manager: this.manager,
      department: this.department,
      project_type: this.project_type,
      keywords: this.keywords,
      tags: this.tags,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Project;