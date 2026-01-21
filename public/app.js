function formatDateForInput(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) return '';
        
        // Adjust for local timezone
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}

class PMOApplication {
    constructor() {
        // Auto-detect API URL
        this.apiBaseUrl = this.detectApiUrl();
        console.log('🚀 PMO Application Initialized');
        
        // State management
        this.currentView = 'projects'; // 'projects', 'detail', 'dashboards'
        this.currentProjectId = null;
        this.currentTab = 'overview'; // 'overview', 'schedule', 'cost', 'risks', 'changes'
        this.allProjects = [];
        this.filteredProjects = [];
        this.currentPage = 1;
        this.projectsPerPage = 10;
        this.quickViewProjectId = null;
        
        // Initialize
        this.initializeElements();
        this.bindEvents();
        this.loadProjects();
    }

    detectApiUrl() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        }
        if (window.location.hostname.includes('render.com') || window.location.hostname.includes('onrender.com')) {
            return `${window.location.origin}/api`;
        }
        return '/api';
    }

    initializeElements() {
        // View containers
        this.projectsListView = document.getElementById('projectsListView');
        this.projectDetailView = document.getElementById('projectDetailView');
        this.dashboardsView = document.getElementById('dashboardsView');
        
        // Projects list elements
        this.projectsTableBody = document.getElementById('projectsTableBody');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.statusFilter = document.getElementById('statusFilter');
        this.priorityFilter = document.getElementById('priorityFilter');
        this.addProjectBtn = document.getElementById('addProjectBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.dashboardBtn = document.getElementById('dashboardBtn');
        
        // Stats elements
        this.totalProjectsEl = document.getElementById('totalProjects');
        this.totalBudgetEl = document.getElementById('totalBudget');
        this.completedProjectsEl = document.getElementById('completedProjects');
        this.inProgressProjectsEl = document.getElementById('inProgressProjects');
        
        // Pagination
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pageInfo = document.getElementById('pageInfo');
        this.pagination = document.getElementById('pagination');
        
        // Modals
        this.projectModal = document.getElementById('projectModal');
        this.quickViewModal = document.getElementById('quickViewModal');
        this.projectForm = document.getElementById('projectForm');
        
        // Delete modal elements
        this.deleteModal = document.getElementById('deleteModal');
        this.deleteProjectId = null;
        
        // Initialize form elements
        this.initializeFormElements();
    }

    initializeFormElements() {
        // Form elements
        this.modalTitle = document.getElementById('modalTitle');
        this.projectId = document.getElementById('projectId');
        this.projectCodeInput = document.getElementById('project_code');
        this.nameInput = document.getElementById('name');
        this.descriptionInput = document.getElementById('description');
        this.statusInput = document.getElementById('status');
        this.priorityInput = document.getElementById('priority');
        this.categoryInput = document.getElementById('category');
        this.departmentInput = document.getElementById('department');
        this.projectTypeInput = document.getElementById('project_type');
        this.proposedStartInput = document.getElementById('proposed_start_date');
        this.proposedEndInput = document.getElementById('proposed_end_date');
        this.actualStartInput = document.getElementById('actual_start_date');
        this.actualEndInput = document.getElementById('actual_end_date');
        this.currentDeadlineInput = document.getElementById('current_deadline');
        this.estimatedBudgetInput = document.getElementById('estimated_budget');
        this.budgetAllocatedInput = document.getElementById('budget_allocated');
        this.budgetUtilizedInput = document.getElementById('budget_utilized');
        this.contingencyFundsInput = document.getElementById('contingency_funds');
        this.projectManagerInput = document.getElementById('project_manager');
        this.contractorNameInput = document.getElementById('contractor_name');
        this.contractorCompanyInput = document.getElementById('contractor_company');
        this.uploadedByInput = document.getElementById('uploaded_by');
        this.teamMembersInput = document.getElementById('team_members');
        this.stakeholdersInput = document.getElementById('stakeholders');
        this.keywordsInput = document.getElementById('keywords');
        this.tagsInput = document.getElementById('tags');
        
        // Set default date
        const today = new Date().toISOString().split('T')[0];
        if (this.proposedStartInput) this.proposedStartInput.value = today;
    }

    bindEvents() {
        // Navigation
        this.refreshBtn.addEventListener('click', () => this.refreshData());
        this.dashboardBtn.addEventListener('click', () => this.showDashboards());
        
        // Search and filter
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        this.statusFilter.addEventListener('change', () => this.filterProjects());
        this.priorityFilter.addEventListener('change', () => this.filterProjects());
        
        // Project actions
        this.addProjectBtn.addEventListener('click', () => this.showAddModal());
        
        // Pagination
        this.prevBtn.addEventListener('click', () => this.changePage(-1));
        this.nextBtn.addEventListener('click', () => this.changePage(1));
        
        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal());
        document.getElementById('closeQuickView').addEventListener('click', () => this.hideQuickView());
        document.getElementById('closeQuickViewBtn').addEventListener('click', () => this.hideQuickView());
        document.getElementById('viewDetailsBtn').addEventListener('click', () => this.viewDetailsFromQuickView());
        document.getElementById('closeDeleteModal')?.addEventListener('click', () => this.hideDeleteModal());
        document.getElementById('cancelDelete')?.addEventListener('click', () => this.hideDeleteModal());
        document.getElementById('confirmDelete')?.addEventListener('click', () => this.handleDelete());
        
        // Form submission
        this.projectForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.projectModal) this.hideModal();
            if (e.target === this.quickViewModal) this.hideQuickView();
            if (e.target === this.deleteModal) this.hideDeleteModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.currentView === 'detail') this.showProjectsList();
                else if (this.currentView === 'dashboards') this.showProjectsList();
            }
        });
    }

    // ==================== VIEW MANAGEMENT ====================
    
    showProjectsList() {
        this.currentView = 'projects';
        this.currentProjectId = null;
        
        this.projectsListView.classList.remove('view-hidden');
        this.projectsListView.classList.add('view-active');
        this.projectDetailView.classList.remove('view-active');
        this.projectDetailView.classList.add('view-hidden');
        this.dashboardsView.classList.remove('view-active');
        this.dashboardsView.classList.add('view-hidden');
        
        // Update page title
        document.title = 'PMO Project Management';
    }

    showProjectDetail(projectId) {
        this.currentView = 'detail';
        this.currentProjectId = projectId;
        
        this.projectsListView.classList.remove('view-active');
        this.projectsListView.classList.add('view-hidden');
        this.projectDetailView.classList.remove('view-hidden');
        this.projectDetailView.classList.add('view-active');
        this.dashboardsView.classList.remove('view-active');
        this.dashboardsView.classList.add('view-hidden');
        
        // Load and display project details
        this.loadProjectDetail(projectId);
    }

    showDashboards() {
        this.currentView = 'dashboards';
        
        this.projectsListView.classList.remove('view-active');
        this.projectsListView.classList.add('view-hidden');
        this.projectDetailView.classList.remove('view-active');
        this.projectDetailView.classList.add('view-hidden');
        this.dashboardsView.classList.remove('view-hidden');
        this.dashboardsView.classList.add('view-active');
        
        // Load dashboards
        this.loadDashboards();
        
        // Update page title
        document.title = 'PMO Dashboards';
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        this.updateTabDisplay();
    }

    updateTabDisplay() {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to current tab
        const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${this.currentTab}"]`);
        if (activeTabBtn) activeTabBtn.classList.add('active');
        
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show current tab content
        const activeTabContent = document.getElementById(`${this.currentTab}Tab`);
        if (activeTabContent) activeTabContent.classList.add('active');
    }

    // ==================== PROJECT LIST FUNCTIONS ====================
    
    async loadProjects() {
        this.showLoading(true);
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/projects`);
            if (!response.ok) throw new Error('Failed to load projects');
            
            this.allProjects = await response.json();
            this.filteredProjects = [...this.allProjects];
            this.currentPage = 1;
            this.renderProjects();
            this.updatePagination();
            this.updateStats();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showToast('Error loading projects', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    updateStats() {
        if (!this.allProjects.length) return;
        
        const total = this.allProjects.length;
        const completed = this.allProjects.filter(p => p.status === 'Completed').length;
        const inProgress = this.allProjects.filter(p => p.status === 'In Progress').length;
        const totalBudget = this.allProjects.reduce((sum, p) => sum + (parseFloat(p.estimated_budget) || 0), 0);
        
        this.totalProjectsEl.textContent = total;
        this.completedProjectsEl.textContent = completed;
        this.inProgressProjectsEl.textContent = inProgress;
        this.totalBudgetEl.textContent = `₦${totalBudget.toLocaleString()}`;
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
            .then(response => {
                if (!response.ok) throw new Error(`Search failed: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('Search results:', data.count, 'projects');
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
        if (this.filteredProjects.length === 0) {
            this.projectsTableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 2rem; color: #6c757d;">
                        <i class="fas fa-inbox"></i> No projects found
                    </td>
                </tr>
            `;
            document.getElementById('noProjects').style.display = 'block';
            this.pagination.style.display = 'none';
            return;
        }

        document.getElementById('noProjects').style.display = 'none';
        
        const startIndex = (this.currentPage - 1) * this.projectsPerPage;
        const endIndex = startIndex + this.projectsPerPage;
        const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);

        this.projectsTableBody.innerHTML = projectsToShow.map(project => {
            const schedule = this.calculateProjectSchedule(project);
            const budget = parseFloat(project.estimated_budget || 0);
            const utilized = parseFloat(project.budget_utilized || 0);
            const utilizationRate = budget > 0 ? Math.round((utilized / budget) * 100) : 0;
            
            return `
                <tr>
                    <td>
                        <code class="project-code">${this.escapeHtml(project.project_code || 'N/A')}</code>
                    </td>
                    <td>
                        <strong>${this.escapeHtml(project.name)}</strong>
                        <div class="text-muted small">
                            ${schedule.isBehindSchedule ? 
                                '<span class="badge bg-danger">Behind</span>' :
                                schedule.isOnTrack ? 
                                '<span class="badge bg-success">On Track</span>' :
                                schedule.hasDelayedStart ? 
                                '<span class="badge bg-warning">Delayed</span>' :
                                '<span class="badge bg-info">Planned</span>'
                            }
                        </div>
                    </td>
                    <td>
                        <span class="status-badge status-${project.status.toLowerCase().replace(' ', '-')}">
                            ${project.status}
                        </span>
                    </td>
                    <td>
                        <span class="priority-badge priority-${project.priority.toLowerCase()}">
                            ${project.priority}
                        </span>
                    </td>
                    <td>${this.escapeHtml(project.department || '')}</td>
                    <td>
                        <strong>₦${budget.toLocaleString()}</strong>
                        <div class="small text-muted">${utilizationRate}% utilized</div>
                    </td>
                    <td>${this.escapeHtml(project.project_manager || '')}</td>
                    <td>${project.proposed_start_date ? new Date(project.proposed_start_date).toLocaleDateString() : ''}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-outline me-1" 
                                    onclick="app.showQuickView('${project.id}')"
                                    title="Quick View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline me-1" 
                                    onclick="app.showProjectDetail('${project.id}')"
                                    title="View Details">
                                <i class="fas fa-external-link-alt"></i>
                            </button>
                            <button class="btn btn-sm btn-outline me-1" 
                                    onclick="app.editProject('${project.id}')"
                                    title="Edit">
                                <i class="fas fa-edit"></i>
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

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
        document.getElementById('projectsTable').style.opacity = show ? '0.5' : '1';
    }

    // ==================== PROJECT DETAIL VIEW ====================
    
    async loadProjectDetail(projectId) {
        this.projectDetailView.innerHTML = `
            <div class="loading-detail">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading project details...</p>
            </div>
        `;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/projects/${projectId}`);
            if (!response.ok) throw new Error('Failed to load project details');
            
            const project = await response.json();
            this.renderProjectDetail(project);
            
            // Update page title
            document.title = `${project.name} - PMO Project Management`;
        } catch (error) {
            console.error('Error loading project detail:', error);
            this.projectDetailView.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Project</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="app.showProjectsList()">
                        <i class="fas fa-arrow-left"></i> Back to Projects
                    </button>
                </div>
            `;
        }
    }

    renderProjectDetail(project) {
        const schedule = this.calculateProjectSchedule(project);
        const financial = this.calculateProjectFinancials(project);
        
        const detailHTML = `
            <div class="detail-view-header">
                <button class="back-button" onclick="app.showProjectsList()">
                    <i class="fas fa-arrow-left"></i> Back to Projects
                </button>
                <div class="project-header-info">
                    <h2>
                        <i class="fas fa-project-diagram"></i>
                        ${this.escapeHtml(project.name)}
                        <span class="project-code">${project.project_code || ''}</span>
                    </h2>
                    <div class="project-subtitle">
                        <span id="forceColorBlue" class="status-badge status-${project.status.toLowerCase().replace(' ', '-')}">
                            ${project.status}
                        </span>
                        <span id="forceColorBlue" class="priority-badge priority-${project.priority.toLowerCase()}">
                            ${project.priority}
                        </span>
                        <span><i class="fas fa-building"></i> ${project.department || 'No Department'}</span>
                        <span><i class="fas fa-user-tie"></i> ${project.project_manager || 'No Manager'}</span>
                    </div>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-outline" onclick="app.editProject('${project.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-primary" onclick="app.extendDeadline('${project.id}')">
                        <i class="fas fa-calendar-plus"></i> Extend
                    </button>
                </div>
            </div>
            
            <div class="detail-tabs">
                <button class="tab-btn active" data-tab="overview" onclick="app.switchTab('overview')">
                    <i class="fas fa-home"></i> Overview
                </button>
                <button class="tab-btn" data-tab="schedule" onclick="app.switchTab('schedule')">
                    <i class="fas fa-calendar-alt"></i> Schedule
                </button>
                <button class="tab-btn" data-tab="cost" onclick="app.switchTab('cost')">
                    <i class="fas fa-money-bill-wave"></i> Cost
                </button>
                <button class="tab-btn" data-tab="risks" onclick="app.switchTab('risks')">
                    <i class="fas fa-exclamation-triangle"></i> Risks
                </button>
                <button class="tab-btn" data-tab="changes" onclick="app.switchTab('changes')">
                    <i class="fas fa-exchange-alt"></i> Changes
                </button>
            </div>
            
            <!-- Overview Tab -->
            <div id="overviewTab" class="tab-content active">
                ${this.renderOverviewTab(project, schedule, financial)}
            </div>
            
            <!-- Schedule Tab -->
            <div id="scheduleTab" class="tab-content">
                ${this.renderScheduleTab(project, schedule)}
            </div>
            
            <!-- Cost Tab -->
            <div id="costTab" class="tab-content">
                ${this.renderCostTab(project, financial)}
            </div>
            
            <!-- Risks Tab -->
            <div id="risksTab" class="tab-content">
                ${this.renderRisksTab(project)}
            </div>
            
            <!-- Changes Tab -->
            <div id="changesTab" class="tab-content">
                ${this.renderChangesTab(project)}
            </div>
        `;
        
        this.projectDetailView.innerHTML = detailHTML;
        this.currentTab = 'overview';
        this.updateTabDisplay();
    }

    renderOverviewTab(project, schedule, financial) {
        return `
            <div class="overview-grid">
                <div>
                    <div class="overview-card">
                        <h3><i class="fas fa-info-circle"></i> Project Information</h3>
                        <div class="info-grid">
                            <div><strong>Description:</strong></div>
                            <div>${project.description || 'No description provided.'}</div>
                            
                            <div><strong>Category:</strong></div>
                            <div>${project.category || 'Not specified'}</div>
                            
                            <div><strong>Project Type:</strong></div>
                            <div>${project.project_type || 'Not specified'}</div>
                            
                            <div><strong>Contractor:</strong></div>
                            <div>${project.contractor_name || 'None'} ${project.contractor_company ? `(${project.contractor_company})` : ''}</div>
                            
                            <div><strong>Team Members:</strong></div>
                            <div>${project.team_members?.length > 0 ? project.team_members.join(', ') : 'None assigned'}</div>
                            
                            <div><strong>Stakeholders:</strong></div>
                            <div>${project.stakeholders?.length > 0 ? project.stakeholders.join(', ') : 'None identified'}</div>
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <h3><i class="fas fa-tags"></i> Keywords & Tags</h3>
                        <div class="tags-container">
                            ${project.keywords?.map(keyword => 
                                `<span class="keyword-tag">${this.escapeHtml(keyword)}</span>`
                            ).join('') || '<p class="text-muted">No keywords added</p>'}
                        </div>
                        <div class="tags-container" style="margin-top: 1rem;">
                            ${project.tags?.map(tag => 
                                `<span class="tag">${this.escapeHtml(tag)}</span>`
                            ).join('') || '<p class="text-muted">No tags added</p>'}
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="overview-card">
                        <h3><i class="fas fa-chart-line"></i> Quick Stats</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-label">Schedule Status</div>
                                <div class="stat-value ${schedule.isBehindSchedule ? 'text-danger' : 'text-success'}">
                                    ${schedule.isBehindSchedule ? 'Behind' : schedule.isOnTrack ? 'On Track' : 'Planned'}
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Budget Status</div>
                                <div class="stat-value ${financial.isOverBudget ? 'text-danger' : financial.isUnderBudget ? 'text-success' : 'text-info'}">
                                    ${financial.isOverBudget ? 'Over Budget' : financial.isUnderBudget ? 'Under Budget' : 'On Budget'}
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Progress</div>
                                <div class="stat-value">${schedule.completionPercentage}%</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Extensions</div>
                                <div class="stat-value">${project.extension_count || 0}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <h3><i class="fas fa-history"></i> Timeline</h3>
                        <div class="timeline-mini">
                            <div class="timeline-item">
                                <div class="timeline-date">Proposed Start</div>
                                <div class="timeline-content">${this.formatDate(project.proposed_start_date)}</div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-date">Actual Start</div>
                                <div class="timeline-content ${schedule.hasDelayedStart ? 'text-danger' : ''}">
                                    ${this.formatDate(project.actual_start_date) || 'Not started'}
                                    ${schedule.hasDelayedStart ? ' (Delayed)' : ''}
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-date">Current Deadline</div>
                                <div class="timeline-content ${schedule.isBehindSchedule ? 'text-danger' : ''}">
                                    ${this.formatDate(project.current_deadline || project.proposed_end_date)}
                                    ${schedule.isBehindSchedule ? ` (${schedule.daysLate} days late)` : 
                                      schedule.daysRemaining ? ` (${schedule.daysRemaining} days left)` : ''}
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-date">Actual End</div>
                                <div class="timeline-content">
                                    ${this.formatDate(project.actual_end_date) || 'Not completed'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <h3><i class="fas fa-money-check-alt"></i> Budget Overview</h3>
                        <div class="budget-progress-container">
                            <div class="budget-labels">
                                <span>Estimated: $${project.estimated_budget?.toLocaleString() || 0}</span>
                                <span>Utilized: $${project.budget_utilized?.toLocaleString() || 0}</span>
                            </div>
                            <div class="budget-bar">
                                <div class="budget-allocated" style="width: ${financial.allocationPercentage}%"></div>
                                <div class="budget-utilized" style="width: ${financial.utilizationPercentage}%"></div>
                                ${financial.isOverBudget ? 
                                    `<div class="budget-overrun" style="width: ${financial.overrunPercentage}%"></div>` : ''}
                            </div>
                            <div class="budget-stats">
                                <div class="budget-stat">
                                    <span>Allocated: $${project.budget_allocated?.toLocaleString() || 0}</span>
                                    <span>${financial.allocationPercentage}%</span>
                                </div>
                                <div class="budget-stat">
                                    <span>Utilized: $${project.budget_utilized?.toLocaleString() || 0}</span>
                                    <span>${financial.utilizationPercentage}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderScheduleTab(project, schedule) {
        return `
            <div class="schedule-overview">
                <div class="schedule-stats">
                    <div class="schedule-stat">
                        <div class="stat-value">${schedule.completionPercentage}%</div>
                        <div class="stat-label">Completion</div>
                    </div>
                    <div class="schedule-stat ${schedule.isBehindSchedule ? 'behind' : 'ontrack'}">
                        <div class="stat-value">${schedule.daysRemaining !== null ? schedule.daysRemaining : schedule.daysLate || 0}</div>
                        <div class="stat-label">${schedule.isBehindSchedule ? 'Days Late' : 'Days Remaining'}</div>
                    </div>
                    <div class="schedule-stat">
                        <div class="stat-value">${project.extension_count || 0}</div>
                        <div class="stat-label">Extensions</div>
                    </div>
                    <div class="schedule-stat">
                        <div class="stat-value">${project.total_extension_days || 0}</div>
                        <div class="stat-label">Extension Days</div>
                    </div>
                </div>
                
                <div class="timeline-view">
                    <h3><i class="fas fa-timeline"></i> Project Timeline</h3>
                    <div class="timeline-detailed">
                        ${this.renderDetailedTimeline(project, schedule)}
                    </div>
                </div>
                
                <div class="gantt-view">
                    <h3><i class="fas fa-chart-gantt"></i> Gantt Chart</h3>
                    <div class="gantt-chart">
                        ${this.renderGanttChart(project, schedule)}
                    </div>
                </div>
                
                <div class="schedule-actions">
                    <button class="btn btn-warning" onclick="app.extendDeadline('${project.id}')">
                        <i class="fas fa-calendar-plus"></i> Extend Deadline
                    </button>
                    <button class="btn btn-primary" onclick="app.updateProjectDates('${project.id}')">
                        <i class="fas fa-calendar-edit"></i> Update Dates
                    </button>
                </div>
            </div>
        `;
    }

    renderCostTab(project, financial) {
        return `
            <div class="cost-overview">
                <div class="cost-summary">
                    <div class="cost-card ${financial.isOverBudget ? 'budget-over' : financial.isUnderBudget ? 'budget-under' : ''}">
                        <h4>Estimated Budget</h4>
                        <div class="cost-value">₦${project.estimated_budget?.toLocaleString() || 0}</div>
                        <div class="cost-trend">
                            ${financial.budgetVariance >= 0 ? 
                                `<i class="fas fa-arrow-up text-success"></i> ₦${financial.budgetVariance.toLocaleString()} under` :
                                `<i class="fas fa-arrow-down text-danger"></i> ₦${Math.abs(financial.budgetVariance).toLocaleString()} over`
                            }
                        </div>
                    </div>
                    
                    <div class="cost-card">
                        <h4>Budget Allocated</h4>
                        <div class="cost-value">₦${project.budget_allocated?.toLocaleString() || 0}</div>
                        <div class="cost-trend">
                            ${financial.allocationPercentage}% of estimated
                        </div>
                    </div>
                    
                    <div class="cost-card">
                        <h4>Budget Utilized</h4>
                        <div class="cost-value">₦${project.budget_utilized?.toLocaleString() || 0}</div>
                        <div class="cost-trend">
                            ${financial.utilizationPercentage}% utilization
                        </div>
                    </div>
                    
                    <div class="cost-card">
                        <h4>Available Funds</h4>
                        <div class="cost-value">₦${financial.availableFunds.toLocaleString()}</div>
                        <div class="cost-trend">
                            ${financial.availablePercentage}% remaining
                        </div>
                    </div>
                </div>
                
                <div class="cost-breakdown">
                    <h3><i class="fas fa-chart-pie"></i> Cost Breakdown</h3>
                    <div class="chart-container">
                        <canvas id="costChart"></canvas>
                    </div>
                </div>
                
                <div class="expense-tracking">
                    <h3><i class="fas fa-receipt"></i> Recent Expenses</h3>
                    <div class="expense-list">
                        ${this.renderExpenseList(project)}
                    </div>
                    <button class="btn btn-primary" onclick="app.addExpense('${project.id}')">
                        <i class="fas fa-plus"></i> Add Expense
                    </button>
                </div>
            </div>
        `;
    }

    renderRisksTab(project) {
        return `
            <div class="risks-overview">
                <div class="risk-matrix">
                    <h3><i class="fas fa-chess-board"></i> Risk Matrix</h3>
                    <div class="matrix-container">
                        <!-- Risk matrix visualization will go here -->
                        <p class="text-muted">Risk matrix visualization coming soon...</p>
                    </div>
                </div>
                
                <div class="risk-list">
                    <h3><i class="fas fa-list"></i> Identified Risks</h3>
                    <div class="risk-cards">
                        ${this.renderRiskCards(project)}
                    </div>
                    <button class="btn btn-primary" onclick="app.addRisk('${project.id}')">
                        <i class="fas fa-plus"></i> Add Risk
                    </button>
                </div>
            </div>
        `;
    }

    renderChangesTab(project) {
        return `
            <div class="changes-overview">
                <div class="change-stats">
                    <div class="change-stat">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Total Changes</div>
                    </div>
                    <div class="change-stat">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Pending</div>
                    </div>
                    <div class="change-stat">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Approved</div>
                    </div>
                    <div class="change-stat">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Implemented</div>
                    </div>
                </div>
                
                <div class="change-request-list">
                    <h3><i class="fas fa-exchange-alt"></i> Change Requests</h3>
                    <div class="change-cards">
                        ${this.renderChangeCards(project)}
                    </div>
                    <button class="btn btn-primary" onclick="app.addChangeRequest('${project.id}')">
                        <i class="fas fa-plus"></i> Add Change Request
                    </button>
                </div>
            </div>
        `;
    }

    // ==================== RENDER HELPER METHODS ====================
    
    renderDetailedTimeline(project, schedule) {
        const milestones = [
            { label: 'Project Start', date: project.actual_start_date || project.proposed_start_date, status: schedule.hasDelayedStart ? 'delayed' : 'completed' },
            { label: 'First Milestone', date: null, status: 'pending' },
            { label: 'Mid-point Review', date: null, status: 'pending' },
            { label: 'Final Review', date: null, status: 'pending' },
            { label: 'Project Completion', date: project.actual_end_date || project.current_deadline || project.proposed_end_date, status: schedule.isBehindSchedule ? 'delayed' : 'planned' }
        ];
        
        return `
            <div class="detailed-timeline">
                ${milestones.map((milestone, index) => `
                    <div class="timeline-item-detailed">
                        <div class="timeline-marker-detailed ${milestone.status}">
                            <div class="marker-icon">
                                ${index + 1}
                            </div>
                        </div>
                        <div class="timeline-content-detailed">
                            <div class="timeline-header-detailed">
                                <span class="milestone-label">${milestone.label}</span>
                                <span class="milestone-status ${milestone.status}">${milestone.status}</span>
                            </div>
                            <div class="timeline-date-detailed">
                                ${milestone.date ? this.formatDate(milestone.date) : 'Not scheduled'}
                            </div>
                            ${milestone.date && milestone.status === 'delayed' ? 
                                '<div class="timeline-alert"><i class="fas fa-exclamation-circle"></i> This milestone is delayed</div>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderGanttChart(project, schedule) {
        const startDate = schedule.proposedStart || new Date();
        const endDate = schedule.currentDeadline || schedule.proposedEnd || new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const actualEnd = schedule.actualEnd;
        
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const elapsedDays = schedule.actualStart ? Math.ceil((new Date() - schedule.actualStart) / (1000 * 60 * 60 * 24)) : 0;
        const progressPercentage = actualEnd ? 100 : totalDays > 0 ? Math.min(100, Math.round((elapsedDays / totalDays) * 100)) : 0;
        
        return `
            <div class="gantt-chart-container">
                <div class="gantt-header">
                    <div class="gantt-time-scale">
                        <span>Start: ${this.formatDate(startDate)}</span>
                        <span>End: ${this.formatDate(endDate)}</span>
                    </div>
                </div>
                <div class="gantt-body">
                    <div class="gantt-task">
                        <div class="task-label">${project.name}</div>
                        <div class="task-bar-container">
                            <div class="task-bar proposed" style="width: 100%;"></div>
                            <div class="task-bar actual" style="width: ${progressPercentage}%;"></div>
                            <div class="task-progress">${progressPercentage}%</div>
                        </div>
                    </div>
                </div>
                <div class="gantt-footer">
                    <div class="gantt-legend">
                        <span class="legend-item proposed"></span> Proposed Timeline
                        <span class="legend-item actual"></span> Actual Progress
                    </div>
                </div>
            </div>
        `;
    }

    renderExpenseList(project) {
        // This is a placeholder - you'll need to implement API calls for expenses
        return `
            <div class="expense-placeholder">
                <i class="fas fa-receipt fa-2x"></i>
                <p>Expense tracking will be available soon</p>
                <small class="text-muted">You'll be able to add and track individual expenses here</small>
            </div>
        `;
    }

    renderRiskCards(project) {
        // This is a placeholder - you'll need to implement API calls for risks
        return `
            <div class="risk-placeholder">
                <i class="fas fa-exclamation-triangle fa-2x"></i>
                <p>Risk management will be available soon</p>
                <small class="text-muted">You'll be able to identify and track project risks here</small>
            </div>
        `;
    }

    renderChangeCards(project) {
        // This is a placeholder - you'll need to implement API calls for changes
        return `
            <div class="change-placeholder">
                <i class="fas fa-exchange-alt fa-2x"></i>
                <p>Change management will be available soon</p>
                <small class="text-muted">You'll be able to track change requests here</small>
            </div>
        `;
    }

    // ==================== DASHBOARDS VIEW ====================
    
    async loadDashboards() {
        this.dashboardsView.innerHTML = `
            <div class="dashboards-header">
                <h2><i class="fas fa-chart-pie"></i> PMO Dashboards</h2>
                <button class="btn btn-outline" onclick="app.showProjectsList()">
                    <i class="fas fa-arrow-left"></i> Back to Projects
                </button>
            </div>
            
            <div class="dashboards-grid">
                <div class="dashboard-card">
                    <h3><i class="fas fa-chart-line"></i> Financial Dashboard</h3>
                    <div class="dashboard-content">
                        <p class="text-muted">Financial overview coming soon...</p>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <h3><i class="fas fa-calendar-alt"></i> Schedule Dashboard</h3>
                    <div class="dashboard-content">
                        <p class="text-muted">Schedule overview coming soon...</p>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <h3><i class="fas fa-exclamation-triangle"></i> Risk Dashboard</h3>
                    <div class="dashboard-content">
                        <p class="text-muted">Risk overview coming soon...</p>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <h3><i class="fas fa-tachometer-alt"></i> Performance Dashboard</h3>
                    <div class="dashboard-content">
                        <p class="text-muted">Performance metrics coming soon...</p>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== QUICK VIEW MODAL ====================
    
    showQuickView(projectId) {
        const project = this.allProjects.find(p => p.id === projectId);
        if (!project) return;
        
        this.quickViewProjectId = projectId;
        const schedule = this.calculateProjectSchedule(project);
        const financial = this.calculateProjectFinancials(project);
        
        const quickViewHTML = `
            <div class="quick-view-content">
                <h3>${this.escapeHtml(project.name)}</h3>
                <div class="quick-view-stats">
                    <div class="quick-stat">
                        <span class="stat-label">Status</span>
                        <span class="stat-value status-badge status-${project.status.toLowerCase().replace(' ', '-')}">
                            ${project.status}
                        </span>
                    </div>
                    <div class="quick-stat">
                        <span class="stat-label">Schedule</span>
                        <span class="stat-value ${schedule.isBehindSchedule ? 'text-danger' : 'text-success'}">
                            ${schedule.isBehindSchedule ? 'Behind' : 'On Track'}
                        </span>
                    </div>
                    <div class="quick-stat">
                        <span class="stat-label">Budget</span>
                        <span class="stat-value ${financial.isOverBudget ? 'text-danger' : 'text-success'}">
                            ${financial.isOverBudget ? 'Over' : 'On Budget'}
                        </span>
                    </div>
                </div>
                
                <div class="quick-view-details">
                    <div class="detail-row">
                        <span class="detail-label">Code:</span>
                        <span class="detail-value">${project.project_code || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Department:</span>
                        <span class="detail-value">${project.department || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Manager:</span>
                        <span class="detail-value">${project.project_manager || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Start Date:</span>
                        <span class="detail-value">${this.formatDate(project.proposed_start_date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Deadline:</span>
                        <span class="detail-value ${schedule.isBehindSchedule ? 'text-danger' : ''}">
                            ${this.formatDate(project.current_deadline || project.proposed_end_date)}
                            ${schedule.isBehindSchedule ? ` (${schedule.daysLate} days late)` : ''}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Budget:</span>
                        <span class="detail-value">₦${project.estimated_budget?.toLocaleString() || 0}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Utilized:</span>
                        <span class="detail-value">₦${project.budget_utilized?.toLocaleString() || 0} (${financial.utilizationPercentage}%)</span>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('quickViewContent').innerHTML = quickViewHTML;
        document.getElementById('viewDetailsBtn').onclick = () => {
            this.hideQuickView();
            this.showProjectDetail(projectId);
        };
        
        this.quickViewModal.style.display = 'block';
    }

    hideQuickView() {
        this.quickViewModal.style.display = 'none';
        this.quickViewProjectId = null;
    }

    viewDetailsFromQuickView() {
        this.hideQuickView();
        if (this.quickViewProjectId) {
            this.showProjectDetail(this.quickViewProjectId);
        }
    }

    // ==================== FORM HANDLING ====================
    
    showAddModal() {
        this.modalTitle.textContent = 'Add New Project';
        this.projectForm.reset();
        this.projectId.value = '';
        
        // Set defaults
        const today = new Date().toISOString().split('T')[0];
        console.log('here stop 2414')
        this.proposedStartInput.value = today;
        this.statusInput.value = 'Planning';
        this.priorityInput.value = 'Medium';
        this.uploadedByInput.value = 'admin';
        
        // Generate project code
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.projectCodeInput.value = `PRJ-${year}-${random}`;
        
        this.projectModal.style.display = 'block';
    }

    async editProject(projectId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/projects/${projectId}`);
            if (!response.ok) throw new Error('Failed to load project');
            
            const project = await response.json();
            this.populateForm(project);
            this.modalTitle.textContent = 'Edit Project';
            this.projectModal.style.display = 'block';
            
            // If we're in detail view, close it
            console.log('here')
            if (this.currentView === 'detail') {
                this.showProjectsList();
            }
        } catch (error) {
            console.error('Error loading project:', error);
            this.showToast('Error loading project: ' + error.message, 'error');
        }
    }

    populateForm(project) {
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
        this.proposedStartInput.value = formatDateForInput(project.proposed_start_date) || '';
        this.proposedEndInput.value = formatDateForInput(project.proposed_end_date) || '';
        this.actualStartInput.value = formatDateForInput(project.actual_start_date) || '';
        this.actualEndInput.value = formatDateForInput(project.actual_end_date) || '';
        this.currentDeadlineInput.value = formatDateForInput(project.current_deadline) || '';
        
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
            
            proposed_start_date: this.proposedStartInput.value || null,
            proposed_end_date: this.proposedEndInput.value || null,
            actual_start_date: this.actualStartInput.value || null,
            actual_end_date: this.actualEndInput.value || null,
            current_deadline: this.currentDeadlineInput.value || null,
            
            estimated_budget: parseFloat(this.estimatedBudgetInput.value) || 0,
            budget_allocated: parseFloat(this.budgetAllocatedInput.value) || 0,
            budget_utilized: parseFloat(this.budgetUtilizedInput.value) || 0,
            contingency_funds: parseFloat(this.contingencyFundsInput.value) || 0,
            
            project_manager: this.projectManagerInput.value.trim(),
            contractor_name: this.contractorNameInput.value.trim(),
            contractor_company: this.contractorCompanyInput.value.trim(),
            uploaded_by: this.uploadedByInput.value.trim() || 'admin',
            last_modified_by: this.uploadedByInput.value.trim() || 'admin',
            team_members: this.teamMembersInput.value.split(',').map(m => m.trim()).filter(m => m),
            stakeholders: this.stakeholdersInput.value.split(',').map(s => s.trim()).filter(s => s),
            
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
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const savedProject = await response.json();
            
            this.hideModal();
            this.loadProjects();
            this.showToast(`Project "${savedProject.name}" saved successfully!`);
            
            // If we were editing from detail view, go back to detail view
            if (this.currentView === 'detail' && projectId) {
                this.showProjectDetail(projectId);
            }
        } catch (error) {
            console.error('Error saving project:', error);
            this.showToast('Error saving project: ' + error.message, 'error');
        }
    }

    hideModal() {
        this.projectModal.style.display = 'none';
        this.projectForm.reset();
    }

    // ==================== DELETE FUNCTIONALITY ====================
    
    showDeleteModal(projectId, projectName) {
        this.deleteProjectId = projectId;
        document.getElementById('deleteProjectName').textContent = projectName;
        this.deleteModal.style.display = 'block';
    }

    hideDeleteModal() {
        this.deleteModal.style.display = 'none';
        this.deleteProjectId = null;
    }

    async handleDelete() {
        if (!this.deleteProjectId) return;
        
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
            this.showToast('Project deleted successfully!');
            
            // If we were in detail view, go back to list
            if (this.currentView === 'detail') {
                this.showProjectsList();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            this.showToast('Error deleting project: ' + error.message, 'error');
        }
    }

    // ==================== HELPER METHODS ====================
    
    calculateProjectSchedule(project) {
        const now = new Date();
        const proposedStart = project.proposed_start_date ? new Date(project.proposed_start_date) : null;
        const proposedEnd = project.proposed_end_date ? new Date(project.proposed_end_date) : null;
        const actualStart = project.actual_start_date ? new Date(project.actual_start_date) : null;
        const currentDeadline = project.current_deadline ? new Date(project.current_deadline) : proposedEnd;
        const actualEnd = project.actual_end_date ? new Date(project.actual_end_date) : null;
        
        let status = 'unknown';
        let isBehindSchedule = false;
        let isOnTrack = false;
        let hasDelayedStart = false;
        let completionPercentage = 0;
        let daysRemaining = null;
        let daysLate = 0;
        
        if (actualStart) {
            hasDelayedStart = proposedStart && actualStart > proposedStart;
            
            if (actualEnd) {
                status = 'completed';
                completionPercentage = 100;
                isBehindSchedule = proposedEnd && actualEnd > proposedEnd;
                daysLate = proposedEnd ? Math.ceil((actualEnd - proposedEnd) / (1000 * 60 * 60 * 24)) : 0;
            } else if (currentDeadline) {
                const totalDuration = Math.ceil((currentDeadline - actualStart) / (1000 * 60 * 60 * 24));
                const elapsedDays = Math.ceil((now - actualStart) / (1000 * 60 * 60 * 24));
                
                completionPercentage = totalDuration > 0 ? Math.min(100, Math.round((elapsedDays / totalDuration) * 100)) : 0;
                daysRemaining = Math.ceil((currentDeadline - now) / (1000 * 60 * 60 * 24));
                
                isBehindSchedule = now > currentDeadline;
                isOnTrack = !isBehindSchedule && completionPercentage <= 100;
                status = isBehindSchedule ? 'behind' : 'ontrack';
            }
        } else {
            if (proposedStart && now > proposedStart) {
                status = 'delayed';
                hasDelayedStart = true;
            } else {
                status = 'planned';
            }
        }
        
        return {
            status,
            isBehindSchedule,
            isOnTrack,
            hasDelayedStart,
            completionPercentage,
            daysRemaining,
            daysLate,
            proposedStart,
            proposedEnd,
            actualStart,
            currentDeadline,
            actualEnd
        };
    }

    calculateProjectFinancials(project) {
        const estimated = parseFloat(project.estimated_budget) || 0;
        const allocated = parseFloat(project.budget_allocated) || 0;
        const utilized = parseFloat(project.budget_utilized) || 0;
        const expenditure = parseFloat(project.total_expenditure) || 0;
        
        const allocationPercentage = estimated > 0 ? Math.round((allocated / estimated) * 100) : 0;
        const utilizationPercentage = estimated > 0 ? Math.round((utilized / estimated) * 100) : 0;
        const availableFunds = allocated - utilized;
        const availablePercentage = allocated > 0 ? Math.round((availableFunds / allocated) * 100) : 0;
        const budgetVariance = estimated - expenditure;
        const isOverBudget = utilized > estimated;
        const isUnderBudget = utilized < estimated;
        const overrunPercentage = isOverBudget && estimated > 0 ? Math.round(((utilized - estimated) / estimated) * 100) : 0;
        
        return {
            estimated,
            allocated,
            utilized,
            expenditure,
            allocationPercentage,
            utilizationPercentage,
            availableFunds,
            availablePercentage,
            budgetVariance,
            isOverBudget,
            isUnderBudget,
            overrunPercentage
        };
    }

    formatDate(dateString) {
        if (!dateString) return 'Not set';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Invalid date';
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    refreshData() {
        this.loadProjects();
        this.showToast('Data refreshed successfully!');
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

    // ==================== PLACEHOLDER METHODS FOR FUTURE IMPLEMENTATION ====================
    
    extendDeadline(projectId) {
        this.showToast('Extend deadline feature coming soon!', 'info');
        // TODO: Implement extend deadline functionality
    }

    updateProjectDates(projectId) {
        this.showToast('Update dates feature coming soon!', 'info');
        // TODO: Implement update dates functionality
    }

    addExpense(projectId) {
        this.showToast('Add expense feature coming soon!', 'info');
        // TODO: Implement add expense functionality
    }

    addRisk(projectId) {
        this.showToast('Add risk feature coming soon!', 'info');
        // TODO: Implement add risk functionality
    }

    addChangeRequest(projectId) {
        this.showToast('Add change request feature coming soon!', 'info');
        // TODO: Implement add change request functionality
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PMOApplication();
    window.app = app; // Make globally accessible
});

// Add CSS for new elements
const additionalStyles = `
    /* Add any additional styles needed */
`;
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);