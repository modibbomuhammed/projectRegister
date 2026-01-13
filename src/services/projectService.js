const pool = require('../db/pool');
const Project = require('../models/Project');

class ProjectService {
  async getAllProjects() {
    const query = 'SELECT * FROM projects ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows.map(row => new Project(row).toJSON());
  }

  async getProjectById(id) {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return new Project(result.rows[0]).toJSON();
  }

  async searchProjects(keyword) {
    const query = `
      SELECT * FROM projects 
      WHERE 
        name ILIKE $1 OR 
        description ILIKE $1 OR 
        manager ILIKE $1 OR 
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
        name, description, status, priority, start_date, end_date,
        budget, actual_cost, manager, department, project_type, keywords, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const values = [
      projectData.name,
      projectData.description,
      projectData.status,
      projectData.priority,
      projectData.start_date,
      projectData.end_date,
      projectData.budget,
      projectData.actual_cost,
      projectData.manager,
      projectData.department,
      projectData.project_type,
      projectData.keywords || [],
      projectData.tags || []
    ];
    
    const result = await pool.query(query, values);
    return new Project(result.rows[0]).toJSON();
  }

  async updateProject(id, projectData) {
    const query = `
      UPDATE projects SET
        name = $1,
        description = $2,
        status = $3,
        priority = $4,
        start_date = $5,
        end_date = $6,
        budget = $7,
        actual_cost = $8,
        manager = $9,
        department = $10,
        project_type = $11,
        keywords = $12,
        tags = $13,
        updated_at = NOW()
      WHERE id = $14
      RETURNING *
    `;
    
    const values = [
      projectData.name,
      projectData.description,
      projectData.status,
      projectData.priority,
      projectData.start_date,
      projectData.end_date,
      projectData.budget,
      projectData.actual_cost,
      projectData.manager,
      projectData.department,
      projectData.project_type,
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
        SUM(budget) as total_budget,
        SUM(actual_cost) as total_cost,
        AVG(budget) as avg_budget
      FROM projects
    `;
    
    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = new ProjectService();