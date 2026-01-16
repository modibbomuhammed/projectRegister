// class PMOApplication {
//     constructor() {
//         this.apiBaseUrl = process.env.API_BASE_URL
//         this.apiBaseUrl = `/api`;
        
//         this.currentPage = 1;
//         this.projectsPerPage = 10;
//         this.totalProjects = 0;
//         this.allProjects = [];
//         this.filteredProjects = [];
        
//         this.initializeElements();
//         this.bindEvents();
//         this.loadProjects();
//         this.loadStats();
//     }

//     initializeElements() {
//         // Main elements
//         this.projectsTableBody = document.getElementById('projectsTableBody');
//         this.searchInput = document.getElementById('searchInput');
//         this.searchBtn = document.getElementById('searchBtn');
//         this.statusFilter = document.getElementById('statusFilter');
//         this.priorityFilter = document.getElementById('priorityFilter');
//         this.addProjectBtn = document.getElementById('addProjectBtn');
//         this.refreshBtn = document.getElementById('refreshBtn');
        
//         // Modal elements
//         this.projectModal = document.getElementById('projectModal');
//         this.deleteModal = document.getElementById('deleteModal');
//         this.projectForm = document.getElementById('projectForm');
        
//         // Form elements
//         this.modalTitle = document.getElementById('modalTitle');
//         this.projectId = document.getElementById('projectId');
//         this.nameInput = document.getElementById('name');
//         this.descriptionInput = document.getElementById('description');
//         this.statusInput = document.getElementById('status');
//         this.priorityInput = document.getElementById('priority');
//         this.startDateInput = document.getElementById('start_date');
//         this.endDateInput = document.getElementById('end_date');
//         this.budgetInput = document.getElementById('budget');
//         this.actualCostInput = document.getElementById('actual_cost');
//         this.managerInput = document.getElementById('manager');
//         this.departmentInput = document.getElementById('department');
//         this.projectTypeInput = document.getElementById('project_type');
//         this.keywordsInput = document.getElementById('keywords');
//         this.tagsInput = document.getElementById('tags');
        
//         // Pagination
//         this.prevBtn = document.getElementById('prevBtn');
//         this.nextBtn = document.getElementById('nextBtn');
//         this.pageInfo = document.getElementById('pageInfo');
//         this.pagination = document.getElementById('pagination');
        
//         // Stats
//         this.totalProjectsEl = document.getElementById('totalProjects');
//         this.totalBudgetEl = document.getElementById('totalBudget');
//         this.completedProjectsEl = document.getElementById('completedProjects');
//         this.inProgressProjectsEl = document.getElementById('inProgressProjects');
        
//         // Set today's date as default start date
//         this.startDateInput.value = new Date().toISOString().split('T')[0];
//     }

//     bindEvents() {
//         // Search and filter events
//         this.searchBtn.addEventListener('click', () => this.handleSearch());
//         this.searchInput.addEventListener('keypress', (e) => {
//             if (e.key === 'Enter') this.handleSearch();
//         });
//         this.statusFilter.addEventListener('change', () => this.filterProjects());
//         this.priorityFilter.addEventListener('change', () => this.filterProjects());
        
//         // Button events
//         this.addProjectBtn.addEventListener('click', () => this.showAddModal());
//         this.refreshBtn.addEventListener('click', () => {
//             this.loadProjects();
//             this.loadStats();
//             this.showToast('Data refreshed successfully!');
//         });
        
//         // Modal events
//         document.getElementById('closeModal').addEventListener('click', () => this.hideModal());
//         document.getElementById('closeDeleteModal').addEventListener('click', () => this.hideDeleteModal());
//         document.getElementById('cancelBtn').addEventListener('click', () => this.hideModal());
//         document.getElementById('cancelDelete').addEventListener('click', () => this.hideDeleteModal());
        
//         // Form submission
//         this.projectForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
//         // Pagination
//         this.prevBtn.addEventListener('click', () => this.changePage(-1));
//         this.nextBtn.addEventListener('click', () => this.changePage(1));
        
//         // Close modals on outside click
//         window.addEventListener('click', (e) => {
//             if (e.target === this.projectModal) this.hideModal();
//             if (e.target === this.deleteModal) this.hideDeleteModal();
//         });
//     }

//     async loadProjects() {
//         this.showLoading(true);
//         try {
//             const response = await fetch(`${this.apiBaseUrl}/projects`);
//             if (!response.ok) throw new Error('Failed to load projects');
            
//             this.allProjects = await response.json();
//             this.filteredProjects = [...this.allProjects];
//             this.currentPage = 1;
//             this.renderProjects();
//             this.updatePagination();
//         } catch (error) {
//             console.error('Error loading projects:', error);
//             this.showToast('Error loading projects', 'error');
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     async loadStats() {
//         try {
//             const response = await fetch(`${this.apiBaseUrl}/projects/stats/summary`);
//             if (!response.ok) throw new Error('Failed to load stats');
            
//             const stats = await response.json();
//             this.updateStats(stats);
//         } catch (error) {
//             console.error('Error loading stats:', error);
//         }
//     }

//     updateStats(stats) {
//         this.totalProjectsEl.textContent = stats.total || 0;
//         this.completedProjectsEl.textContent = stats.completed || 0;
//         this.inProgressProjectsEl.textContent = stats.in_progress || 0;
        
//         const totalBudget = stats.total_budget || 0;
//         this.totalBudgetEl.textContent = `₦${totalBudget.toLocaleString()}`;
//     }

//     filterProjects() {
//         const statusFilter = this.statusFilter.value;
//         const priorityFilter = this.priorityFilter.value;
//         const searchTerm = this.searchInput.value.toLowerCase();

//         this.filteredProjects = this.allProjects.filter(project => {
//             // Status filter
//             if (statusFilter && project.status !== statusFilter) return false;
            
//             // Priority filter
//             if (priorityFilter && project.priority !== priorityFilter) return false;
            
//             // Search filter
//             if (searchTerm) {
//                 const searchFields = [
//                     project.name,
//                     project.description,
//                     project.manager,
//                     project.department,
//                     project.project_type,
//                     ...(project.keywords || []),
//                     ...(project.tags || [])
//                 ].join(' ').toLowerCase();
                
//                 if (!searchFields.includes(searchTerm)) return false;
//             }
            
//             return true;
//         });

//         this.currentPage = 1;
//         this.renderProjects();
//         this.updatePagination();
//     }

//     handleSearch() {
//         const searchTerm = this.searchInput.value.trim();
//         if (!searchTerm) {
//             this.filterProjects();
//             return;
//         }

//         this.showLoading(true);
//         fetch(`${this.apiBaseUrl}/projects/search/${encodeURIComponent(searchTerm)}`)
//             .then(response => response.json())
//             .then(data => {
//                 this.filteredProjects = data.results;
//                 this.currentPage = 1;
//                 this.renderProjects();
//                 this.updatePagination();
//                 this.showToast(`Found ${data.count} projects for "${searchTerm}"`);
//             })
//             .catch(error => {
//                 console.error('Search error:', error);
//                 this.showToast('Search failed', 'error');
//             })
//             .finally(() => this.showLoading(false));
//     }

//     renderProjects() {
//         if (this.filteredProjects.length === 0) {
//             this.projectsTableBody.innerHTML = '';
//             document.getElementById('noProjects').style.display = 'block';
//             this.pagination.style.display = 'none';
//             return;
//         }

//         document.getElementById('noProjects').style.display = 'none';
        
//         const startIndex = (this.currentPage - 1) * this.projectsPerPage;
//         const endIndex = startIndex + this.projectsPerPage;
//         const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);

//         this.projectsTableBody.innerHTML = projectsToShow.map(project => `
//             <tr>
//                 <td>
//                     <strong>${this.escapeHtml(project.name)}</strong>
//                     <div class="keywords">
//                         ${(project.keywords || []).map(keyword => 
//                             `<span class="keyword-tag">${this.escapeHtml(keyword)}</span>`
//                         ).join('')}
//                     </div>
//                 </td>
//                 <td>
//                     <span class="status-badge status-${project.status.toLowerCase().replace(' ', '-')}">
//                         ${project.status}
//                     </span>
//                 </td>
//                 <td>
//                     <span class="priority-badge priority-${project.priority.toLowerCase()}">
//                         ${project.priority}
//                     </span>
//                 </td>
//                 <td>${this.escapeHtml(project.department || '')}</td>
//                 <td>
//                     <strong>₦${parseFloat(project.budget || 0).toLocaleString()}</strong>
//                     ${project.actual_cost > 0 ? 
//                         `<br><small>Spent: ₦${parseFloat(project.actual_cost).toLocaleString()}</small>` : ''}
//                 </td>
//                 <td>${this.escapeHtml(project.manager || '')}</td>
//                 <td>${project.start_date ? new Date(project.start_date).toLocaleDateString() : ''}</td>
//                 <td>
//                     <div class="action-buttons">
//                         <button class="btn btn-sm btn-outline" onclick="app.editProject('${project.id}')">
//                             <i class="fas fa-edit"></i>
//                         </button>
//                         <button class="btn btn-sm btn-outline" onclick="app.viewProject('${project.id}')">
//                             <i class="fas fa-eye"></i>
//                         </button>
//                         <button class="btn btn-sm btn-danger" onclick="app.showDeleteModal('${project.id}', '${this.escapeHtml(project.name)}')">
//                             <i class="fas fa-trash"></i>
//                         </button>
//                     </div>
//                 </td>
//             </tr>
//         `).join('');
//     }

//     updatePagination() {
//         const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        
//         if (totalPages <= 1) {
//             this.pagination.style.display = 'none';
//             return;
//         }
        
//         this.pagination.style.display = 'flex';
//         this.pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
//         this.prevBtn.disabled = this.currentPage === 1;
//         this.nextBtn.disabled = this.currentPage === totalPages;
//     }

//     changePage(direction) {
//         const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
//         const newPage = this.currentPage + direction;
        
//         if (newPage >= 1 && newPage <= totalPages) {
//             this.currentPage = newPage;
//             this.renderProjects();
//             this.updatePagination();
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         }
//     }

//     showAddModal() {
//         this.modalTitle.textContent = 'Add New Project';
//         this.projectForm.reset();
//         this.projectId.value = '';
//         this.startDateInput.value = new Date().toISOString().split('T')[0];
//         this.statusInput.value = 'Planning';
//         this.priorityInput.value = 'Medium';
//         this.budgetInput.value = '';
//         this.actualCostInput.value = '';
//         this.projectModal.style.display = 'block';
//     }

//     async editProject(projectId) {
//         try {
//             const response = await fetch(`${this.apiBaseUrl}/projects/${projectId}`);
//             if (!response.ok) throw new Error('Failed to load project');
            
//             const project = await response.json();
//             this.populateForm(project);
//             this.modalTitle.textContent = 'Edit Project';
//             this.projectModal.style.display = 'block';
//         } catch (error) {
//             console.error('Error loading project:', error);
//             this.showToast('Error loading project', 'error');
//         }
//     }

//     async viewProject(projectId) {
//         try {
//             const response = await fetch(`${this.apiBaseUrl}/projects/${projectId}`);
//             if (!response.ok) throw new Error('Failed to load project');
            
//             const project = await response.json();
            
//             // Create a detailed view modal
//             const detailHtml = `
//                 <div class="project-detail">
//                     <h2>${this.escapeHtml(project.name)}</h2>
//                     <div class="detail-grid">
//                         <div><strong>Status:</strong> ${project.status}</div>
//                         <div><strong>Priority:</strong> ${project.priority}</div>
//                         <div><strong>Department:</strong> ${project.department}</div>
//                         <div><strong>Manager:</strong> ${project.manager}</div>
//                         <div><strong>Budget:</strong> ₦${parseFloat(project.budget).toLocaleString()}</div>
//                         <div><strong>Actual Cost:</strong> ₦${parseFloat(project.actual_cost).toLocaleString()}</div>
//                         <div><strong>Start Date:</strong> ${new Date(project.start_date).toLocaleDateString()}</div>
//                         <div><strong>End Date:</strong> ${project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</div>
//                     </div>
//                     <div class="description">
//                         <h3>Description</h3>
//                         <p>${this.escapeHtml(project.description || 'No description provided.')}</p>
//                     </div>
//                     <div class="tags-section">
//                         <h3>Keywords</h3>
//                         <div class="tags">
//                             ${(project.keywords || []).map(keyword => 
//                                 `<span class="tag">${this.escapeHtml(keyword)}</span>`
//                             ).join('')}
//                         </div>
//                     </div>
//                 </div>
//             `;
            
//             // Show in alert or custom modal
//             alert(detailHtml.replace(/<[^>]*>/g, '')); // Simple text view for now
//             // For better view, you could create a view modal similar to edit modal
//         } catch (error) {
//             console.error('Error viewing project:', error);
//             this.showToast('Error viewing project', 'error');
//         }
//     }

//     populateForm(project) {
//         this.projectId.value = project.id;
//         this.nameInput.value = project.name;
//         this.descriptionInput.value = project.description || '';
//         this.statusInput.value = project.status;
//         this.priorityInput.value = project.priority;
//         this.startDateInput.value = project.start_date || '';
//         this.endDateInput.value = project.end_date || '';
//         this.budgetInput.value = project.budget || '';
//         this.actualCostInput.value = project.actual_cost || '';
//         this.managerInput.value = project.manager || '';
//         this.departmentInput.value = project.department || '';
//         this.projectTypeInput.value = project.project_type || '';
//         this.keywordsInput.value = (project.keywords || []).join(', ');
//         this.tagsInput.value = (project.tags || []).join(', ');
//     }

//     async handleFormSubmit(e) {
//         e.preventDefault();
        
//         const projectData = {
//             name: this.nameInput.value.trim(),
//             description: this.descriptionInput.value.trim(),
//             status: this.statusInput.value,
//             priority: this.priorityInput.value,
//             start_date: this.startDateInput.value,
//             end_date: this.endDateInput.value || null,
//             budget: parseFloat(this.budgetInput.value) || 0,
//             actual_cost: parseFloat(this.actualCostInput.value) || 0,
//             manager: this.managerInput.value.trim(),
//             department: this.departmentInput.value.trim(),
//             project_type: this.projectTypeInput.value.trim(),
//             keywords: this.keywordsInput.value.split(',').map(k => k.trim()).filter(k => k),
//             tags: this.tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
//         };

//         const projectId = this.projectId.value;
//         const url = projectId ? `${this.apiBaseUrl}/projects/${projectId}` : `${this.apiBaseUrl}/projects`;
//         const method = projectId ? 'PUT' : 'POST';

//         try {
//             const response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(projectData)
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to save project');
//             }

//             const savedProject = await response.json();
//             this.hideModal();
//             this.loadProjects();
//             this.loadStats();
//             this.showToast(`Project "${savedProject.name}" saved successfully!`);
//         } catch (error) {
//             console.error('Error saving project:', error);
//             this.showToast('Error saving project', 'error');
//         }
//     }

//     showDeleteModal(projectId, projectName) {
//         this.deleteProjectId = projectId;
//         document.getElementById('deleteProjectName').textContent = projectName;
//         this.deleteModal.style.display = 'block';
//     }

//     async handleDelete() {
//         try {
//             const response = await fetch(`${this.apiBaseUrl}/projects/${this.deleteProjectId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete project');
//             }

//             this.hideDeleteModal();
//             this.loadProjects();
//             this.loadStats();
//             this.showToast('Project deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting project:', error);
//             this.showToast('Error deleting project', 'error');
//         }
//     }

//     hideModal() {
//         this.projectModal.style.display = 'none';
//         this.projectForm.reset();
//     }

//     hideDeleteModal() {
//         this.deleteModal.style.display = 'none';
//         this.deleteProjectId = null;
//     }

//     showLoading(show) {
//         document.getElementById('loading').style.display = show ? 'block' : 'none';
//         document.getElementById('projectsTable').style.opacity = show ? '0.5' : '1';
//     }

//     showToast(message, type = 'success') {
//         const toast = document.getElementById('toast');
//         toast.textContent = message;
//         toast.className = 'toast';
//         toast.classList.add(type === 'error' ? 'error' : 'show');
        
//         setTimeout(() => {
//             toast.classList.remove('show');
//         }, 3000);
//     }

//     escapeHtml(text) {
//         const div = document.createElement('div');
//         div.textContent = text;
//         return div.innerHTML;
//     }
// }

// // Bind delete confirmation
// document.getElementById('confirmDelete').addEventListener('click', () => {
//     app.handleDelete();
// });

// // Initialize app when DOM is loaded
// let app;
// document.addEventListener('DOMContentLoaded', () => {
//     app = new PMOApplication();
// });













// Add these new properties to the Project class in your frontend
class Project {
  constructor(data) {
    // Basic Info
    this.id = data.id;
    this.project_code = data.project_code || `PRJ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    this.name = data.name;
    this.description = data.description || '';
    
    // Categorization
    this.status = data.status || 'Planning';
    this.priority = data.priority || 'Medium';
    this.category = data.category || '';
    this.department = data.department || '';
    this.project_type = data.project_type || '';
    
    // Timeline Tracking
    this.proposed_start_date = data.proposed_start_date || new Date().toISOString().split('T')[0];
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
    this.last_modified_by = data.last_modified_by || 'system';
    this.team_members = data.team_members || [];
    this.stakeholders = data.stakeholders || [];
    
    // Search & Organization
    this.keywords = data.keywords || [];
    this.tags = data.tags || [];
    
    // Related data
    this.change_requests = data.change_requests || [];
    this.risks = data.risks || [];
    this.milestones = data.milestones || [];
    this.budget_transactions = data.budget_transactions || [];
  }

// Update the form population method in your PMOApplication class
populateForm(project) {
  this.projectId.value = project.id;
  this.projectCodeInput.value = project.project_code;
  this.nameInput.value = project.name;
  this.descriptionInput.value = project.description || '';
  this.statusInput.value = project.status;
  this.priorityInput.value = project.priority;
  this.categoryInput.value = project.category || '';
  this.departmentInput.value = project.department || '';
  this.projectTypeInput.value = project.project_type || '';
  
  // Timeline
  this.proposedStartInput.value = project.proposed_start_date || '';
  this.proposedEndInput.value = project.proposed_end_date || '';
  this.actualStartInput.value = project.actual_start_date || '';
  this.actualEndInput.value = project.actual_end_date || '';
  this.currentDeadlineInput.value = project.current_deadline || '';
  
  // Financial
  this.estimatedBudgetInput.value = project.estimated_budget || '';
  this.budgetAllocatedInput.value = project.budget_allocated || '';
  this.budgetUtilizedInput.value = project.budget_utilized || '';
  this.contingencyFundsInput.value = project.contingency_funds || '';
  
  // People
  this.projectManagerInput.value = project.project_manager || '';
  this.contractorNameInput.value = project.contractor_name || '';
  this.contractorCompanyInput.value = project.contractor_company || '';
  this.uploadedByInput.value = project.uploaded_by || '';
  this.teamMembersInput.value = (project.team_members || []).join(', ');
  this.stakeholdersInput.value = (project.stakeholders || []).join(', ');
  
  // Search & Organization
  this.keywordsInput.value = (project.keywords || []).join(', ');
  this.tagsInput.value = (project.tags || []).join(', ');
}

// Update the form submission handler
async handleFormSubmit(e) {
  e.preventDefault();
  
  const projectData = {
    project_code: this.projectCodeInput.value.trim(),
    name: this.nameInput.value.trim(),
    description: this.descriptionInput.value.trim(),
    status: this.statusInput.value,
    priority: this.priorityInput.value,
    category: this.categoryInput.value.trim(),
    department: this.departmentInput.value.trim(),
    project_type: this.projectTypeInput.value.trim(),
    
    // Timeline
    proposed_start_date: this.proposedStartInput.value,
    proposed_end_date: this.proposedEndInput.value,
    actual_start_date: this.actualStartInput.value || null,
    actual_end_date: this.actualEndInput.value || null,
    current_deadline: this.currentDeadlineInput.value,
    
    // Financial
    estimated_budget: parseFloat(this.estimatedBudgetInput.value) || 0,
    budget_allocated: parseFloat(this.budgetAllocatedInput.value) || 0,
    budget_utilized: parseFloat(this.budgetUtilizedInput.value) || 0,
    contingency_funds: parseFloat(this.contingencyFundsInput.value) || 0,
    
    // People
    project_manager: this.projectManagerInput.value.trim(),
    contractor_name: this.contractorNameInput.value.trim(),
    contractor_company: this.contractorCompanyInput.value.trim(),
    uploaded_by: this.uploadedByInput.value.trim() || 'system',
    last_modified_by: this.uploadedByInput.value.trim() || 'system',
    team_members: this.teamMembersInput.value.split(',').map(m => m.trim()).filter(m => m),
    stakeholders: this.stakeholdersInput.value.split(',').map(s => s.trim()).filter(s => s),
    
    // Search & Organization
    keywords: this.keywordsInput.value.split(',').map(k => k.trim()).filter(k => k),
    tags: this.tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
  };

  const projectId = this.projectId.value;
  const url = projectId ? `${this.apiBaseUrl}/projects/${projectId}` : `${this.apiBaseUrl}/projects`;
  const method = projectId ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      throw new Error('Failed to save project');
    }

    const savedProject = await response.json();
    this.hideModal();
    this.loadProjects();
    this.loadStats();
    this.showToast(`Project "${savedProject.name}" saved successfully!`);
  } catch (error) {
    console.error('Error saving project:', error);
    this.showToast('Error saving project', 'error');
  }
}
}