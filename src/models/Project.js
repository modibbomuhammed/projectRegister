// class Project {
//   constructor(data) {
//     this.id = data.id;
//     this.name = data.name;
//     this.description = data.description || '';
//     this.status = data.status || 'Planning';
//     this.priority = data.priority || 'Medium';
//     this.start_date = data.start_date || new Date().toISOString().split('T')[0];
//     this.end_date = data.end_date || null;
//     this.budget = data.budget || 0;
//     this.actual_cost = data.actual_cost || 0;
//     this.manager = data.manager || '';
//     this.department = data.department || '';
//     this.project_type = data.project_type || '';
//     this.keywords = data.keywords || [];
//     this.tags = data.tags || [];
//     this.created_at = data.created_at || new Date();
//     this.updated_at = data.updated_at || new Date();
//   }

//   toJSON() {
//     return {
//       id: this.id,
//       name: this.name,
//       description: this.description,
//       status: this.status,
//       priority: this.priority,
//       start_date: this.start_date,
//       end_date: this.end_date,
//       budget: parseFloat(this.budget),
//       actual_cost: parseFloat(this.actual_cost),
//       manager: this.manager,
//       department: this.department,
//       project_type: this.project_type,
//       keywords: this.keywords,
//       tags: this.tags,
//       created_at: this.created_at,
//       updated_at: this.updated_at
//     };
//   }
// }

// module.exports = Project;

const { DateTime } = require('luxon');

class Project {
  constructor(data) {
    // Basic Info
    this.id = data.id;
    this.project_code = data.project_code || this.generateProjectCode();
    this.name = data.name;
    this.description = data.description || '';
    
    // Categorization
    this.status = data.status || 'Planning';
    this.priority = data.priority || 'Medium';
    this.category = data.category || '';
    this.department = data.department || '';
    this.project_type = data.project_type || '';
    
    // Timeline Tracking
    this.proposed_start_date = data.proposed_start_date || DateTime.now().toISODate();
    this.proposed_end_date = data.proposed_end_date || null;
    this.actual_start_date = data.actual_start_date || null;
    this.actual_end_date = data.actual_end_date || null;
    this.current_deadline = data.current_deadline || data.proposed_end_date;
    this.extension_count = data.extension_count || 0;
    this.total_extension_days = data.total_extension_days || 0;
    
    // Financial Tracking
    this.estimated_budget = parseFloat(data.estimated_budget) || 0;
    this.budget_allocated = parseFloat(data.budget_allocated) || 0;
    this.budget_utilized = parseFloat(data.budget_utilized) || 0;
    this.contingency_funds = parseFloat(data.contingency_funds) || 0;
    this.total_expenditure = parseFloat(data.total_expenditure) || 0;
    
    // People
    this.project_manager = data.project_manager || '';
    this.contractor_name = data.contractor_name || '';
    this.contractor_company = data.contractor_company || '';
    this.uploaded_by = data.uploaded_by || 'system';
    this.last_modified_by = data.last_modified_by || data.uploaded_by || 'system';
    this.team_members = data.team_members || [];
    this.stakeholders = data.stakeholders || [];
    
    // Search & Organization
    this.keywords = data.keywords || [];
    this.tags = data.tags || [];
    
    // Tracking
    this.created_at = data.created_at || DateTime.now().toISO();
    this.updated_at = data.updated_at || DateTime.now().toISO();
    this.version = data.version || 1;
  }

  generateProjectCode() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PRJ-${year}-${random}`;
  }

  calculateFinancialMetrics() {
    const budget_variance = this.estimated_budget - this.total_expenditure;
    const budget_utilization_rate = this.estimated_budget > 0 
      ? (this.budget_utilized / this.estimated_budget) * 100 
      : 0;
    const available_funds = this.budget_allocated - this.budget_utilized;
    
    return {
      budget_variance,
      budget_utilization_rate: Math.round(budget_utilization_rate * 100) / 100,
      available_funds,
      is_over_budget: this.budget_utilized > this.estimated_budget,
      is_under_budget: this.budget_utilized < this.estimated_budget
    };
  }

  calculateScheduleMetrics() {
    if (!this.proposed_start_date || !this.current_deadline) {
      return null;
    }
    
    const proposedStart = new Date(this.proposed_start_date);
    const proposedEnd = new Date(this.proposed_end_date);
    const currentDeadline = new Date(this.current_deadline);
    const actualStart = this.actual_start_date ? new Date(this.actual_start_date) : null;
    const actualEnd = this.actual_end_date ? new Date(this.actual_end_date) : null;
    
    const now = new Date();
    const proposedDuration = Math.ceil((proposedEnd - proposedStart) / (1000 * 60 * 60 * 24));
    const elapsedDays = actualStart ? Math.ceil((now - actualStart) / (1000 * 60 * 60 * 24)) : 0;
    
    let schedule_variance = 0;
    let completion_percentage = 0;
    
    if (actualEnd) {
      // Project completed
      schedule_variance = Math.ceil((actualEnd - proposedEnd) / (1000 * 60 * 60 * 24));
      completion_percentage = 100;
    } else if (actualStart) {
      // Project in progress
      const totalDays = Math.ceil((currentDeadline - actualStart) / (1000 * 60 * 60 * 24));
      completion_percentage = totalDays > 0 ? Math.min(100, Math.round((elapsedDays / totalDays) * 100)) : 0;
      schedule_variance = Math.ceil((currentDeadline - proposedEnd) / (1000 * 60 * 60 * 24));
    }
    
    return {
      proposed_duration_days: proposedDuration,
      elapsed_days: elapsedDays,
      remaining_days: actualStart ? Math.ceil((currentDeadline - now) / (1000 * 60 * 60 * 24)) : null,
      schedule_variance,
      completion_percentage,
      is_behind_schedule: schedule_variance > 0,
      is_ahead_of_schedule: schedule_variance < 0
    };
  }

  toJSON() {
    const financialMetrics = this.calculateFinancialMetrics();
    const scheduleMetrics = this.calculateScheduleMetrics();
    
    return {
      // Basic Info
      id: this.id,
      project_code: this.project_code,
      name: this.name,
      description: this.description,
      
      // Categorization
      status: this.status,
      priority: this.priority,
      category: this.category,
      department: this.department,
      project_type: this.project_type,
      
      // Timeline Tracking
      proposed_start_date: this.proposed_start_date,
      proposed_end_date: this.proposed_end_date,
      actual_start_date: this.actual_start_date,
      actual_end_date: this.actual_end_date,
      current_deadline: this.current_deadline,
      extension_count: this.extension_count,
      total_extension_days: this.total_extension_days,
      
      // Financial Tracking
      estimated_budget: this.estimated_budget,
      budget_allocated: this.budget_allocated,
      budget_utilized: this.budget_utilized,
      contingency_funds: this.contingency_funds,
      total_expenditure: this.total_expenditure,
      
      // People
      project_manager: this.project_manager,
      contractor_name: this.contractor_name,
      contractor_company: this.contractor_company,
      uploaded_by: this.uploaded_by,
      last_modified_by: this.last_modified_by,
      team_members: this.team_members,
      stakeholders: this.stakeholders,
      
      // Search & Organization
      keywords: this.keywords,
      tags: this.tags,
      
      // Metrics
      financial_metrics: financialMetrics,
      schedule_metrics: scheduleMetrics,
      
      // Tracking
      created_at: this.created_at,
      updated_at: this.updated_at,
      version: this.version
    };
  }

  update(data, modifiedBy = 'system') {
    const fields = [
      // Basic Info
      'name', 'description',
      // Categorization
      'status', 'priority', 'category', 'department', 'project_type',
      // Timeline Tracking
      'proposed_start_date', 'proposed_end_date', 'actual_start_date', 
      'actual_end_date', 'current_deadline', 'extension_count', 'total_extension_days',
      // Financial Tracking
      'estimated_budget', 'budget_allocated', 'budget_utilized', 
      'contingency_funds', 'total_expenditure',
      // People
      'project_manager', 'contractor_name', 'contractor_company',
      'team_members', 'stakeholders',
      // Search & Organization
      'keywords', 'tags'
    ];
    
    fields.forEach(field => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });
    
    this.last_modified_by = modifiedBy;
    this.updated_at = DateTime.now().toISO();
    this.version += 1;
  }
}

// Additional models for related entities
class ChangeRequest {
  constructor(data) {
    this.id = data.id;
    this.project_id = data.project_id;
    this.change_number = data.change_number || `CR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    this.title = data.title;
    this.description = data.description || '';
    this.type = data.type || 'Scope';
    this.status = data.status || 'Pending';
    this.priority = data.priority || 'Medium';
    this.impact_budget = parseFloat(data.impact_budget) || 0;
    this.impact_schedule_days = parseInt(data.impact_schedule_days) || 0;
    this.submitted_by = data.submitted_by;
    this.submitted_date = data.submitted_date || DateTime.now().toISODate();
    this.approved_by = data.approved_by;
    this.approved_date = data.approved_date;
    this.implementation_date = data.implementation_date;
    this.notes = data.notes || '';
    this.created_at = data.created_at || DateTime.now().toISO();
    this.updated_at = data.updated_at || DateTime.now().toISO();
  }

  toJSON() {
    return {
      id: this.id,
      project_id: this.project_id,
      change_number: this.change_number,
      title: this.title,
      description: this.description,
      type: this.type,
      status: this.status,
      priority: this.priority,
      impact_budget: this.impact_budget,
      impact_schedule_days: this.impact_schedule_days,
      submitted_by: this.submitted_by,
      submitted_date: this.submitted_date,
      approved_by: this.approved_by,
      approved_date: this.approved_date,
      implementation_date: this.implementation_date,
      notes: this.notes,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

class Risk {
  constructor(data) {
    this.id = data.id;
    this.project_id = data.project_id;
    this.risk_number = data.risk_number || `RISK-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    this.title = data.title;
    this.description = data.description || '';
    this.category = data.category || 'Technical';
    this.probability = data.probability || 'Medium';
    this.impact = data.impact || 'Medium';
    this.status = data.status || 'Identified';
    this.mitigation_strategy = data.mitigation_strategy || '';
    this.contingency_plan = data.contingency_plan || '';
    this.responsible_person = data.responsible_person || '';
    this.target_date = data.target_date;
    this.closure_date = data.closure_date;
    this.notes = data.notes || '';
    this.created_at = data.created_at || DateTime.now().toISO();
    this.updated_at = data.updated_at || DateTime.now().toISO();
  }

  toJSON() {
    return {
      id: this.id,
      project_id: this.project_id,
      risk_number: this.risk_number,
      title: this.title,
      description: this.description,
      category: this.category,
      probability: this.probability,
      impact: this.impact,
      severity: this.calculateSeverity(),
      status: this.status,
      mitigation_strategy: this.mitigation_strategy,
      contingency_plan: this.contingency_plan,
      responsible_person: this.responsible_person,
      target_date: this.target_date,
      closure_date: this.closure_date,
      notes: this.notes,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  calculateSeverity() {
    const severityMatrix = {
      'High-High': 'Critical',
      'High-Medium': 'High',
      'Medium-High': 'High',
      'Medium-Medium': 'Medium',
      'Low-High': 'Medium',
      'High-Low': 'Medium',
      'Medium-Low': 'Low',
      'Low-Medium': 'Low',
      'Low-Low': 'Low'
    };
    return severityMatrix[`${this.probability}-${this.impact}`] || 'Medium';
  }
}

module.exports = { Project, ChangeRequest, Risk };