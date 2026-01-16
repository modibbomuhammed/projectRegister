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


class PMOApplication {
    constructor() {
        // Auto-detect API URL based on environment
        this.apiBaseUrl = this.detectApiUrl();
        console.log('API Base URL:', this.apiBaseUrl);
        
        this.currentPage = 1;
        this.projectsPerPage = 10;
        this.totalProjects = 0;
        this.allProjects = [];
        this.filteredProjects = [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadProjects();
        this.loadStats();
    }

    detectApiUrl() {
        // For local development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        }
        
        // For Render deployment
        if (window.location.hostname.includes('render.com') || window.location.hostname.includes('onrender.com')) {
            return `${window.location.origin}/api`;
        }
        
        // Default to same origin
        return '/api';
    }

    initializeElements() {
        console.log('Initializing elements...');
        
        // Main elements
        this.projectsTableBody = document.getElementById('projectsTableBody');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.statusFilter = document.getElementById('statusFilter');
        this.priorityFilter = document.getElementById('priorityFilter');
        this.addProjectBtn = document.getElementById('addProjectBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        
        // Modal elements
        this.projectModal = document.getElementById('projectModal');
        this.deleteModal = document.getElementById('deleteModal');
        this.projectForm = document.getElementById('projectForm');
        
        // Form elements - ADD ALL THESE
        this.modalTitle = document.getElementById('modalTitle');
        this.projectId = document.getElementById('projectId');
        this.projectCodeInput = document.getElementById('project_code'); // NEW
        this.nameInput = document.getElementById('name');
        this.descriptionInput = document.getElementById('description');
        this.statusInput = document.getElementById('status');
        this.priorityInput = document.getElementById('priority');
        this.categoryInput = document.getElementById('category'); // NEW
        this.departmentInput = document.getElementById('department');
        this.projectTypeInput = document.getElementById('project_type'); // NEW
        
        // Timeline elements - NEW
        this.proposedStartInput = document.getElementById('proposed_start_date');
        this.proposedEndInput = document.getElementById('proposed_end_date');
        this.actualStartInput = document.getElementById('actual_start_date');
        this.actualEndInput = document.getElementById('actual_end_date');
        this.currentDeadlineInput = document.getElementById('current_deadline');
        
        // Financial elements - NEW
        this.estimatedBudgetInput = document.getElementById('estimated_budget');
        this.budgetAllocatedInput = document.getElementById('budget_allocated');
        this.budgetUtilizedInput = document.getElementById('budget_utilized');
        this.contingencyFundsInput = document.getElementById('contingency_funds');
        
        // People elements - NEW
        this.projectManagerInput = document.getElementById('project_manager');
        this.contractorNameInput = document.getElementById('contractor_name');
        this.contractorCompanyInput = document.getElementById('contractor_company');
        this.uploadedByInput = document.getElementById('uploaded_by');
        this.teamMembersInput = document.getElementById('team_members');
        this.stakeholdersInput = document.getElementById('stakeholders');
        
        // Search elements
        this.keywordsInput = document.getElementById('keywords');
        this.tagsInput = document.getElementById('tags');
        
        // Pagination
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pageInfo = document.getElementById('pageInfo');
        this.pagination = document.getElementById('pagination');
        
        // Stats
        this.totalProjectsEl = document.getElementById('totalProjects');
        this.totalBudgetEl = document.getElementById('totalBudget');
        this.completedProjectsEl = document.getElementById('completedProjects');
        this.inProgressProjectsEl = document.getElementById('inProgressProjects');
        
        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        this.proposedStartInput.value = today;
        
        console.log('Elements initialized');
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Search and filter events
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        this.statusFilter.addEventListener('change', () => this.filterProjects());
        this.priorityFilter.addEventListener('change', () => this.filterProjects());
        
        // Button events
        this.addProjectBtn.addEventListener('click', () => this.showAddModal());
        this.refreshBtn.addEventListener('click', () => {
            console.log('Refresh clicked');
            this.loadProjects();
            this.loadStats();
            this.showToast('Data refreshed successfully!');
        });
        
        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal());
        document.getElementById('closeDeleteModal').addEventListener('click', () => this.hideDeleteModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.hideModal());
        document.getElementById('cancelDelete').addEventListener('click', () => this.hideDeleteModal());
        
        // Form submission
        this.projectForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Pagination
        this.prevBtn.addEventListener('click', () => this.changePage(-1));
        this.nextBtn.addEventListener('click', () => this.changePage(1));
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.projectModal) this.hideModal();
            if (e.target === this.deleteModal) this.hideDeleteModal();
        });
        
        console.log('Events bound');
    }

    async loadProjects() {
        console.log('Loading projects from:', `${this.apiBaseUrl}/projects`);
        this.showLoading(true);
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/projects`);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Projects loaded:', data.length, 'items');
            console.log('Sample project:', data.length > 0 ? data[0] : 'No projects');
            
            this.allProjects = data;
            this.filteredProjects = [...this.allProjects];
            this.currentPage = 1;
            this.renderProjects();
            this.updatePagination();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showToast('Error loading projects: ' + error.message, 'error');
            this.projectsTableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; color: #dc3545; padding: 2rem;">
                        <i class="fas fa-exclamation-triangle"></i> Error loading projects:<br>
                        <small>${error.message}</small><br>
                        <button onclick="app.loadProjects()" class="btn btn-sm btn-outline mt-2">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </td>
                </tr>
            `;
        } finally {
            this.showLoading(false);
        }
    }

    async loadStats() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/projects/stats/summary`);
            if (!response.ok) throw new Error('Failed to load stats');
            
            const stats = await response.json();
            console.log('Stats loaded:', stats);
            this.updateStats(stats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    updateStats(stats) {
        this.totalProjectsEl.textContent = stats.total || 0;
        this.completedProjectsEl.textContent = stats.completed || 0;
        this.inProgressProjectsEl.textContent = stats.in_progress || 0;
        
        const totalBudget = stats.total_estimated_budget || 0;
        this.totalBudgetEl.textContent = `$${totalBudget.toLocaleString()}`;
    }

    filterProjects() {
        const statusFilter = this.statusFilter.value;
        const priorityFilter = this.priorityFilter.value;
        const searchTerm = this.searchInput.value.toLowerCase();

        this.filteredProjects = this.allProjects.filter(project => {
            // Status filter
            if (statusFilter && project.status !== statusFilter) return false;
            
            // Priority filter
            if (priorityFilter && project.priority !== priorityFilter) return false;
            
            // Search filter
            if (searchTerm) {
                const searchFields = [
                    project.project_code || '',
                    project.name || '',
                    project.description || '',
                    project.project_manager || '',
                    project.contractor_name || '',
                    project.department || '',
                    project.project_type || '',
                    ...(project.keywords || []),
                    ...(project.tags || [])
                ].join(' ').toLowerCase();
                
                if (!searchFields.includes(searchTerm)) return false;
            }
            
            return true;
        });

        this.currentPage = 1;
        this.renderProjects();
        this.updatePagination();
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.trim();
        if (!searchTerm) {
            this.filterProjects();
            return;
        }

        this.showLoading(true);
        fetch(`${this.apiBaseUrl}/projects/search/${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                console.log('Search results:', data);
                this.filteredProjects = data.results;
                this.currentPage = 1;
                this.renderProjects();
                this.updatePagination();
                this.showToast(`Found ${data.count} projects for "${searchTerm}"`);
            })
            .catch(error => {
                console.error('Search error:', error);
                this.showToast('Search failed: ' + error.message, 'error');
            })
            .finally(() => this.showLoading(false));
    }

    renderProjects() {
        console.log('Rendering projects:', this.filteredProjects.length);
        
        if (this.filteredProjects.length === 0) {
            this.projectsTableBody.innerHTML = '';
            document.getElementById('noProjects').style.display = 'block';
            this.pagination.style.display = 'none';
            return;
        }

        document.getElementById('noProjects').style.display = 'none';
        
        const startIndex = (this.currentPage - 1) * this.projectsPerPage;
        const endIndex = startIndex + this.projectsPerPage;
        const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);

        this.projectsTableBody.innerHTML = projectsToShow.map(project => {
            // Format dates
            const startDate = project.proposed_start_date 
                ? new Date(project.proposed_start_date).toLocaleDateString() 
                : 'Not set';
            
            // Calculate budget info
            const budget = parseFloat(project.estimated_budget || 0);
            const utilized = parseFloat(project.budget_utilized || 0);
            const utilizationRate = budget > 0 ? Math.round((utilized / budget) * 100) : 0;
            
            // Status badge class
            const statusClass = `status-${project.status.toLowerCase().replace(' ', '-')}`;
            
            // Priority badge class
            const priorityClass = `priority-${project.priority.toLowerCase()}`;
            
            return `
                <tr>
                    <td>
                        <strong class="project-code">${this.escapeHtml(project.project_code || 'N/A')}</strong>
                    </td>
                    <td>
                        <strong>${this.escapeHtml(project.name)}</strong>
                        <div class="keywords">
                            ${(project.keywords || []).slice(0, 3).map(keyword => 
                                `<span class="keyword-tag">${this.escapeHtml(keyword)}</span>`
                            ).join('')}
                        </div>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            ${project.status}
                        </span>
                    </td>
                    <td>
                        <span class="priority-badge ${priorityClass}">
                            ${project.priority}
                        </span>
                    </td>
                    <td>${this.escapeHtml(project.department || '')}</td>
                    <td>
                        <strong>$${budget.toLocaleString()}</strong>
                        ${budget > 0 ? `
                            <div class="budget-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${utilizationRate}%"></div>
                                </div>
                                <small>${utilizationRate}% used</small>
                            </div>
                        ` : ''}
                    </td>
                    <td>${this.escapeHtml(project.project_manager || '')}</td>
                    <td>${startDate}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-outline me-1" 
                                    onclick="app.editProject('${project.id}')"
                                    title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline me-1" 
                                    onclick="app.viewProject('${project.id}')"
                                    title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" 
                                    onclick="app.showDeleteModal('${project.id}', '${this.escapeHtml(project.name)}')"
                                    title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        console.log('Projects rendered');
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        
        if (totalPages <= 1) {
            this.pagination.style.display = 'none';
            return;
        }
        
        this.pagination.style.display = 'flex';
        this.pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        this.prevBtn.disabled = this.currentPage === 1;
        this.nextBtn.disabled = this.currentPage === totalPages;
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        const newPage = this.currentPage + direction;
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderProjects();
            this.updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    showAddModal() {
        console.log('Showing add modal');
        this.modalTitle.textContent = 'Add New Project';
        this.projectForm.reset();
        this.projectId.value = '';
        
        // Set default values
        const today = new Date().toISOString().split('T')[0];
        this.proposedStartInput.value = today;
        this.statusInput.value = 'Planning';
        this.priorityInput.value = 'Medium';
        this.uploadedByInput.value = 'admin'; // Default value
        
        // Generate project code
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.projectCodeInput.value = `PRJ-${year}-${random}`;
        
        this.projectModal.style.display = 'block';
    }

    async editProject(projectId) {
        console.log('Editing project:', projectId);
        try {
            const response = await fetch(`${this.apiBaseUrl}/projects/${projectId}`);
            if (!response.ok) throw new Error('Failed to load project');
            
            const project = await response.json();
            console.log('Project loaded for editing:', project);
            this.populateForm(project);
            this.modalTitle.textContent = 'Edit Project';
            this.projectModal.style.display = 'block';
        } catch (error) {
            console.error('Error loading project:', error);
            this.showToast('Error loading project: ' + error.message, 'error');
        }
    }

    populateForm(project) {
        console.log('Populating form with:', project);
        
        this.projectId.value = project.id;
        this.projectCodeInput.value = project.project_code || '';
        this.nameInput.value = project.name || '';
        this.descriptionInput.value = project.description || '';
        this.statusInput.value = project.status || 'Planning';
        this.priorityInput.value = project.priority || 'Medium';
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

    async viewProject(projectId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/projects/${projectId}`);
            if (!response.ok) throw new Error('Failed to load project');
            
            const project = await response.json();
            
            // Create a detailed view
            const detailHtml = `
                <h3>${this.escapeHtml(project.name)}</h3>
                <p><strong>Code:</strong> ${project.project_code || 'N/A'}</p>
                <p><strong>Status:</strong> ${project.status}</p>
                <p><strong>Priority:</strong> ${project.priority}</p>
                <p><strong>Department:</strong> ${project.department || 'N/A'}</p>
                <p><strong>Manager:</strong> ${project.project_manager || 'N/A'}</p>
                <p><strong>Budget:</strong> $${parseFloat(project.estimated_budget || 0).toLocaleString()}</p>
                <p><strong>Description:</strong> ${this.escapeHtml(project.description || 'No description')}</p>
            `;
            
            // Show in alert (you can replace with a modal later)
            alert('Project Details:\n\n' + detailHtml.replace(/<[^>]*>/g, ''));
        } catch (error) {
            console.error('Error viewing project:', error);
            this.showToast('Error viewing project: ' + error.message, 'error');
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        console.log('Form submitted');
        
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
            proposed_start_date: this.proposedStartInput.value || null,
            proposed_end_date: this.proposedEndInput.value || null,
            actual_start_date: this.actualStartInput.value || null,
            actual_end_date: this.actualEndInput.value || null,
            current_deadline: this.currentDeadlineInput.value || null,
            
            // Financial
            estimated_budget: parseFloat(this.estimatedBudgetInput.value) || 0,
            budget_allocated: parseFloat(this.budgetAllocatedInput.value) || 0,
            budget_utilized: parseFloat(this.budgetUtilizedInput.value) || 0,
            contingency_funds: parseFloat(this.contingencyFundsInput.value) || 0,
            
            // People
            project_manager: this.projectManagerInput.value.trim(),
            contractor_name: this.contractorNameInput.value.trim(),
            contractor_company: this.contractorCompanyInput.value.trim(),
            uploaded_by: this.uploadedByInput.value.trim() || 'admin',
            last_modified_by: this.uploadedByInput.value.trim() || 'admin',
            team_members: this.teamMembersInput.value.split(',').map(m => m.trim()).filter(m => m),
            stakeholders: this.stakeholdersInput.value.split(',').map(s => s.trim()).filter(s => s),
            
            // Search & Organization
            keywords: this.keywordsInput.value.split(',').map(k => k.trim()).filter(k => k),
            tags: this.tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
        };

        console.log('Project data to save:', projectData);

        const projectId = this.projectId.value;
        const url = projectId ? `${this.apiBaseUrl}/projects/${projectId}` : `${this.apiBaseUrl}/projects`;
        const method = projectId ? 'PUT' : 'POST';

        try {
            console.log('Sending request to:', url, 'Method:', method);
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData)
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const savedProject = await response.json();
            console.log('Project saved:', savedProject);
            
            this.hideModal();
            this.loadProjects();
            this.loadStats();
            this.showToast(`Project "${savedProject.name}" saved successfully!`);
        } catch (error) {
            console.error('Error saving project:', error);
            this.showToast('Error saving project: ' + error.message, 'error');
        }
    }

    showDeleteModal(projectId, projectName) {
        console.log('Showing delete modal for:', projectId);
        this.deleteProjectId = projectId;
        document.getElementById('deleteProjectName').textContent = projectName;
        this.deleteModal.style.display = 'block';
    }

    async handleDelete() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/projects/${this.deleteProjectId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            this.hideDeleteModal();
            this.loadProjects();
            this.loadStats();
            this.showToast('Project deleted successfully!');
        } catch (error) {
            console.error('Error deleting project:', error);
            this.showToast('Error deleting project: ' + error.message, 'error');
        }
    }

    hideModal() {
        this.projectModal.style.display = 'none';
        this.projectForm.reset();
    }

    hideDeleteModal() {
        this.deleteModal.style.display = 'none';
        this.deleteProjectId = null;
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
        document.getElementById('projectsTable').style.opacity = show ? '0.5' : '1';
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast';
        toast.classList.add(type === 'error' ? 'error' : 'show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    app = new PMOApplication();
});

// Bind delete confirmation
document.getElementById('confirmDelete').addEventListener('click', () => {
    console.log('Delete confirmed');
    app.handleDelete();
});

// Add CSS for budget progress bar
const style = document.createElement('style');
style.textContent = `
    .budget-progress {
        margin-top: 5px;
    }
    .progress-bar {
        height: 6px;
        background: #e9ecef;
        border-radius: 3px;
        overflow: hidden;
    }
    .progress-fill {
        height: 100%;
        background: var(--primary);
        transition: width 0.3s ease;
    }
    .project-code {
        font-family: monospace;
        background: #f8f9fa;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.9em;
    }
    .keyword-tag {
        display: inline-block;
        background: #e9ecef;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        margin-right: 4px;
        margin-top: 4px;
    }
    .mt-2 {
        margin-top: 0.5rem;
    }
    .me-1 {
        margin-right: 0.25rem;
    }
`;
document.head.appendChild(style);