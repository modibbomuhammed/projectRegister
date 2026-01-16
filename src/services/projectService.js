// const pool = require('../db/pool');
// const Project = require('../models/Project');

// class ProjectService {
//   async getAllProjects() {
//     const query = 'SELECT * FROM projects ORDER BY created_at DESC';
//     const result = await pool.query(query);
//     return result.rows.map(row => new Project(row).toJSON());
//   }

//   async getProjectById(id) {
//     const query = 'SELECT * FROM projects WHERE id = $1';
//     const result = await pool.query(query, [id]);
//     if (result.rows.length === 0) return null;
//     return new Project(result.rows[0]).toJSON();
//   }

//   async searchProjects(keyword) {
//     const query = `
//       SELECT * FROM projects 
//       WHERE 
//         name ILIKE $1 OR 
//         description ILIKE $1 OR 
//         manager ILIKE $1 OR 
//         department ILIKE $1 OR
//         $2 = ANY(keywords) OR
//         $2 = ANY(tags)
//       ORDER BY created_at DESC
//     `;
//     const searchTerm = `%${keyword}%`;
//     const result = await pool.query(query, [searchTerm, keyword]);
//     return result.rows.map(row => new Project(row).toJSON());
//   }

//   async createProject(projectData) {
//     const query = `
//       INSERT INTO projects (
//         name, description, status, priority, start_date, end_date,
//         budget, actual_cost, manager, department, project_type, keywords, tags
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
//       RETURNING *
//     `;
    
//     const values = [
//       projectData.name,
//       projectData.description,
//       projectData.status,
//       projectData.priority,
//       projectData.start_date,
//       projectData.end_date,
//       projectData.budget,
//       projectData.actual_cost,
//       projectData.manager,
//       projectData.department,
//       projectData.project_type,
//       projectData.keywords || [],
//       projectData.tags || []
//     ];
    
//     const result = await pool.query(query, values);
//     return new Project(result.rows[0]).toJSON();
//   }

//   async updateProject(id, projectData) {
//     const query = `
//       UPDATE projects SET
//         name = $1,
//         description = $2,
//         status = $3,
//         priority = $4,
//         start_date = $5,
//         end_date = $6,
//         budget = $7,
//         actual_cost = $8,
//         manager = $9,
//         department = $10,
//         project_type = $11,
//         keywords = $12,
//         tags = $13,
//         updated_at = NOW()
//       WHERE id = $14
//       RETURNING *
//     `;
    
//     const values = [
//       projectData.name,
//       projectData.description,
//       projectData.status,
//       projectData.priority,
//       projectData.start_date,
//       projectData.end_date,
//       projectData.budget,
//       projectData.actual_cost,
//       projectData.manager,
//       projectData.department,
//       projectData.project_type,
//       projectData.keywords || [],
//       projectData.tags || [],
//       id
//     ];
    
//     const result = await pool.query(query, values);
//     if (result.rows.length === 0) return null;
//     return new Project(result.rows[0]).toJSON();
//   }

//   async deleteProject(id) {
//     const query = 'DELETE FROM projects WHERE id = $1 RETURNING id';
//     const result = await pool.query(query, [id]);
//     return result.rows.length > 0;
//   }

//   async getProjectStats() {
//     const query = `
//       SELECT 
//         COUNT(*) as total,
//         COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
//         COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress,
//         COUNT(CASE WHEN status = 'Planning' THEN 1 END) as planning,
//         SUM(budget) as total_budget,
//         SUM(actual_cost) as total_cost,
//         AVG(budget) as avg_budget
//       FROM public.projects
//     `;
//     const result = await pool.query(query);
//     return result.rows[0];
//   }
// }

// module.exports = new ProjectService();


const pool = require('../db/pool');
const { Project, ChangeRequest, Risk } = require('../models/Project');

class ProjectService {
  async getAllProjects() {
    const query = `
      SELECT *, 
        (SELECT COUNT(*) FROM change_requests cr WHERE cr.project_id = p.id) as change_request_count,
        (SELECT COUNT(*) FROM risks r WHERE r.project_id = p.id) as risk_count,
        (SELECT COUNT(*) FROM schedule_milestones sm WHERE sm.project_id = p.id) as milestone_count
      FROM projects p 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows.map(row => new Project(row).toJSON());
  }

  async getProjectById(id) {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return new Project(result.rows[0]).toJSON();
  }

  async getProjectWithDetails(id) {
    const projectQuery = 'SELECT * FROM projects WHERE id = $1';
    const projectResult = await pool.query(projectQuery, [id]);
    
    if (projectResult.rows.length === 0) return null;
    
    const project = new Project(projectResult.rows[0]);
    
    // Get related data
    const [changeRequests, risks, milestones, transactions] = await Promise.all([
      this.getChangeRequests(id),
      this.getRisks(id),
      this.getMilestones(id),
      this.getBudgetTransactions(id)
    ]);
    
    return {
      ...project.toJSON(),
      change_requests: changeRequests,
      risks: risks,
      milestones: milestones,
      budget_transactions: transactions
    };
  }

  async searchProjects(keyword) {
    const query = `
      SELECT * FROM projects 
      WHERE 
        name ILIKE $1 OR 
        description ILIKE $1 OR 
        project_code ILIKE $1 OR
        project_manager ILIKE $1 OR 
        contractor_name ILIKE $1 OR
        department ILIKE $1 OR
        $2 = ANY(keywords) OR
        $2 = ANY(tags)
      ORDER BY created_at DESC
    `;
    const searchTerm = `%${keyword}%`;
    const result = await pool.query(query, [searchTerm, keyword]);
    return result.rows.map(row => new Project(row).toJSON());
  }

  async createProject(projectData) {
    const query = `
      INSERT INTO projects (
        project_code, name, description, status, priority, category, department, project_type,
        proposed_start_date, proposed_end_date, actual_start_date, actual_end_date, 
        current_deadline, extension_count, total_extension_days,
        estimated_budget, budget_allocated, budget_utilized, contingency_funds, total_expenditure,
        project_manager, contractor_name, contractor_company, uploaded_by, last_modified_by,
        team_members, stakeholders, keywords, tags
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, 
        $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25,
        $26, $27, $28, $29
      ) RETURNING *
    `;
    
    const project = new Project(projectData);
    const projectJson = project.toJSON();
    
    const values = [
      projectJson.project_code,
      projectJson.name,
      projectJson.description,
      projectJson.status,
      projectJson.priority,
      projectJson.category,
      projectJson.department,
      projectJson.project_type,
      projectJson.proposed_start_date,
      projectJson.proposed_end_date,
      projectJson.actual_start_date,
      projectJson.actual_end_date,
      projectJson.current_deadline || projectJson.proposed_end_date,
      projectJson.extension_count,
      projectJson.total_extension_days,
      projectJson.estimated_budget,
      projectJson.budget_allocated,
      projectJson.budget_utilized,
      projectJson.contingency_funds,
      projectJson.total_expenditure,
      projectJson.project_manager,
      projectJson.contractor_name,
      projectJson.contractor_company,
      projectJson.uploaded_by,
      projectJson.last_modified_by,
      projectJson.team_members,
      projectJson.stakeholders,
      projectJson.keywords,
      projectJson.tags
    ];
    
    const result = await pool.query(query, values);
    return new Project(result.rows[0]).toJSON();
  }

  async updateProject(id, projectData, modifiedBy = 'system') {
    const query = `
      UPDATE projects SET
        name = $1,
        description = $2,
        status = $3,
        priority = $4,
        category = $5,
        department = $6,
        project_type = $7,
        proposed_start_date = $8,
        proposed_end_date = $9,
        actual_start_date = $10,
        actual_end_date = $11,
        current_deadline = $12,
        extension_count = $13,
        total_extension_days = $14,
        estimated_budget = $15,
        budget_allocated = $16,
        budget_utilized = $17,
        contingency_funds = $18,
        total_expenditure = $19,
        project_manager = $20,
        contractor_name = $21,
        contractor_company = $22,
        last_modified_by = $23,
        team_members = $24,
        stakeholders = $25,
        keywords = $26,
        tags = $27,
        updated_at = NOW(),
        version = version + 1
      WHERE id = $28
      RETURNING *
    `;
    
    const values = [
      projectData.name,
      projectData.description,
      projectData.status,
      projectData.priority,
      projectData.category,
      projectData.department,
      projectData.project_type,
      projectData.proposed_start_date,
      projectData.proposed_end_date,
      projectData.actual_start_date,
      projectData.actual_end_date,
      projectData.current_deadline,
      projectData.extension_count || 0,
      projectData.total_extension_days || 0,
      projectData.estimated_budget || 0,
      projectData.budget_allocated || 0,
      projectData.budget_utilized || 0,
      projectData.contingency_funds || 0,
      projectData.total_expenditure || 0,
      projectData.project_manager,
      projectData.contractor_name,
      projectData.contractor_company,
      modifiedBy,
      projectData.team_members || [],
      projectData.stakeholders || [],
      projectData.keywords || [],
      projectData.tags || [],
      id
    ];
    
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    return new Project(result.rows[0]).toJSON();
  }

  async deleteProject(id) {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  async getProjectStats() {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'Planning' THEN 1 END) as planning,
        COUNT(CASE WHEN status = 'On Hold' THEN 1 END) as on_hold,
        COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled,
        SUM(estimated_budget) as total_estimated_budget,
        SUM(budget_utilized) as total_budget_utilized,
        SUM(total_expenditure) as total_expenditure,
        AVG(estimated_budget) as avg_estimated_budget,
        COUNT(CASE WHEN priority = 'High' THEN 1 END) as high_priority,
        COUNT(CASE WHEN priority = 'Medium' THEN 1 END) as medium_priority,
        COUNT(CASE WHEN priority = 'Low' THEN 1 END) as low_priority
      FROM projects
    `;
    
    const result = await pool.query(query);
    return result.rows[0];
  }

  async extendProjectDeadline(id, extensionDays, reason, extendedBy) {
    const project = await this.getProjectById(id);
    if (!project) return null;

    const newDeadline = new Date(project.current_deadline || project.proposed_end_date);
    newDeadline.setDate(newDeadline.getDate() + extensionDays);

    const query = `
      UPDATE projects SET
        current_deadline = $1,
        extension_count = extension_count + 1,
        total_extension_days = total_extension_days + $2,
        last_modified_by = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const values = [newDeadline.toISOString().split('T')[0], extensionDays, extendedBy, id];
    const result = await pool.query(query, values);

    // Log the extension
    await this.logProjectExtension(id, extensionDays, reason, extendedBy);

    return new Project(result.rows[0]).toJSON();
  }

  async logProjectExtension(projectId, extensionDays, reason, extendedBy) {
    const query = `
      INSERT INTO project_extensions (project_id, extension_days, reason, extended_by)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(query, [projectId, extensionDays, reason, extendedBy]);
  }

  async getChangeRequests(projectId) {
    const query = 'SELECT * FROM change_requests WHERE project_id = $1 ORDER BY submitted_date DESC';
    const result = await pool.query(query, [projectId]);
    return result.rows.map(row => new ChangeRequest(row).toJSON());
  }

  async getRisks(projectId) {
    const query = 'SELECT * FROM risks WHERE project_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [projectId]);
    return result.rows.map(row => new Risk(row).toJSON());
  }

  async getMilestones(projectId) {
    const query = 'SELECT * FROM schedule_milestones WHERE project_id = $1 ORDER BY planned_date';
    const result = await pool.query(query, [projectId]);
    return result.rows;
  }

  async getBudgetTransactions(projectId) {
    const query = 'SELECT * FROM budget_transactions WHERE project_id = $1 ORDER BY date DESC';
    const result = await pool.query(query, [projectId]);
    return result.rows;
  }

  async createChangeRequest(projectId, changeRequestData) {
    const query = `
      INSERT INTO change_requests (
        project_id, change_number, title, description, type, status, priority,
        impact_budget, impact_schedule_days, submitted_by, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const changeRequest = new ChangeRequest({
      ...changeRequestData,
      project_id: projectId
    });
    
    const values = [
      projectId,
      changeRequest.change_number,
      changeRequest.title,
      changeRequest.description,
      changeRequest.type,
      changeRequest.status,
      changeRequest.priority,
      changeRequest.impact_budget,
      changeRequest.impact_schedule_days,
      changeRequest.submitted_by,
      changeRequest.notes
    ];
    
    const result = await pool.query(query, values);
    return new ChangeRequest(result.rows[0]).toJSON();
  }

  async createRisk(projectId, riskData) {
    const query = `
      INSERT INTO risks (
        project_id, risk_number, title, description, category, probability, impact,
        status, mitigation_strategy, contingency_plan, responsible_person, target_date, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const risk = new Risk({
      ...riskData,
      project_id: projectId
    });
    
    const values = [
      projectId,
      risk.risk_number,
      risk.title,
      risk.description,
      risk.category,
      risk.probability,
      risk.impact,
      risk.status,
      risk.mitigation_strategy,
      risk.contingency_plan,
      risk.responsible_person,
      risk.target_date,
      risk.notes
    ];
    
    const result = await pool.query(query, values);
    return new Risk(result.rows[0]).toJSON();
  }

  async updateBudget(projectId, transactionData) {
    // First add the transaction
    const transactionQuery = `
      INSERT INTO budget_transactions (
        project_id, transaction_number, date, description, category, type,
        amount, vendor, invoice_number, payment_status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const transactionNumber = `TX-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    await pool.query(transactionQuery, [
      projectId,
      transactionNumber,
      transactionData.date,
      transactionData.description,
      transactionData.category,
      transactionData.type,
      transactionData.amount,
      transactionData.vendor,
      transactionData.invoice_number,
      transactionData.payment_status || 'Pending',
      transactionData.notes
    ]);

    // Update project budget based on transaction type
    let updateField = '';
    if (transactionData.type === 'Planned') {
      updateField = 'budget_allocated = budget_allocated + $1';
    } else if (transactionData.type === 'Actual') {
      updateField = 'budget_utilized = budget_utilized + $1, total_expenditure = total_expenditure + $1';
    }

    if (updateField) {
      const updateQuery = `
        UPDATE projects 
        SET ${updateField}, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;
      await pool.query(updateQuery, [transactionData.amount, projectId]);
    }

    return this.getProjectById(projectId);
  }
}

module.exports = new ProjectService();