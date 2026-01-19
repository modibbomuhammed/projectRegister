// class PMOApplication {
//     constructor() {
//         // Auto-detect API URL based on environment
//         this.apiBaseUrl = this.detectApiUrl();
//         console.log('API Base URL:', this.apiBaseUrl);
        
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

//     detectApiUrl() {
//         // For local development
//         if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//             return 'http://localhost:3000/api';
//         }
        
//         // For Render deployment
//         if (window.location.hostname.includes('render.com') || window.location.hostname.includes('onrender.com')) {
//             return `${window.location.origin}/api`;
//         }
        
//         // Default to same origin
//         return '/api';
//     }

//     initializeElements() {
//         console.log('Initializing elements...');
        
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
        
//         // Form elements - ADD ALL THESE
//         this.modalTitle = document.getElementById('modalTitle');
//         this.projectId = document.getElementById('projectId');
//         this.projectCodeInput = document.getElementById('project_code'); // NEW
//         this.nameInput = document.getElementById('name');
//         this.descriptionInput = document.getElementById('description');
//         this.statusInput = document.getElementById('status');
//         this.priorityInput = document.getElementById('priority');
//         this.categoryInput = document.getElementById('category'); // NEW
//         this.departmentInput = document.getElementById('department');
//         this.projectTypeInput = document.getElementById('project_type'); // NEW
        
//         // Timeline elements - NEW
//         this.proposedStartInput = document.getElementById('proposed_start_date');
//         this.proposedEndInput = document.getElementById('proposed_end_date');
//         this.actualStartInput = document.getElementById('actual_start_date');
//         this.actualEndInput = document.getElementById('actual_end_date');
//         this.currentDeadlineInput = document.getElementById('current_deadline');
        
//         // Financial elements - NEW
//         this.estimatedBudgetInput = document.getElementById('estimated_budget');
//         this.budgetAllocatedInput = document.getElementById('budget_allocated');
//         this.budgetUtilizedInput = document.getElementById('budget_utilized');
//         this.contingencyFundsInput = document.getElementById('contingency_funds');
        
//         // People elements - NEW
//         this.projectManagerInput = document.getElementById('project_manager');
//         this.contractorNameInput = document.getElementById('contractor_name');
//         this.contractorCompanyInput = document.getElementById('contractor_company');
//         this.uploadedByInput = document.getElementById('uploaded_by');
//         this.teamMembersInput = document.getElementById('team_members');
//         this.stakeholdersInput = document.getElementById('stakeholders');
        
//         // Search elements
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
        
//         // Set default dates
//         const today = new Date().toISOString().split('T')[0];
//         this.proposedStartInput.value = today;
        
//         console.log('Elements initialized');
//     }

//     bindEvents() {
//         console.log('Binding events...');
        
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
//             console.log('Refresh clicked');
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

//         // Add timeline filter change
//         document.getElementById('timelineFilter')?.addEventListener('change', () => {
//             this.renderProjectTimeline();
//         });
        
//         // Close modals on outside click
//         window.addEventListener('click', (e) => {
//             if (e.target === this.projectModal) this.hideModal();
//             if (e.target === this.deleteModal) this.hideDeleteModal();
//         });
        
//         console.log('Events bound');
//     }

//     async loadProjects() {
//         console.log('Loading projects from:', `${this.apiBaseUrl}/projects`);
//         this.showLoading(true);
        
//         try {
//             const response = await fetch(`${this.apiBaseUrl}/projects`);
//             console.log('Response status:', response.status);
            
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`HTTP ${response.status}: ${errorText}`);
//             }
            
//             const data = await response.json();
//             console.log('Projects loaded:', data.length, 'items');
//             console.log('Sample project:', data.length > 0 ? data[0] : 'No projects');
            
//             this.allProjects = data;
//             this.filteredProjects = [...this.allProjects];
//             this.currentPage = 1;
//             this.renderProjects();
//             this.updatePagination();
//             // Load schedule overview
//             this.updateScheduleOverview();
//         } catch (error) {
//             console.error('Error loading projects:', error);
//             this.showToast('Error loading projects: ' + error.message, 'error');
//             this.projectsTableBody.innerHTML = `
//                 <tr>
//                     <td colspan="9" style="text-align: center; color: #dc3545; padding: 2rem;">
//                         <i class="fas fa-exclamation-triangle"></i> Error loading projects:<br>
//                         <small>${error.message}</small><br>
//                         <button onclick="app.loadProjects()" class="btn btn-sm btn-outline mt-2">
//                             <i class="fas fa-redo"></i> Retry
//                         </button>
//                     </td>
//                 </tr>
//             `;
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     updateScheduleOverview() {
//     if (this.allProjects.length === 0) {
//         document.getElementById('scheduleOverview').style.display = 'none';
//         return;
//     }
    
//     document.getElementById('scheduleOverview').style.display = 'block';
    
//     // Calculate schedule statistics
//     let behindSchedule = 0;
//     let onTrack = 0;
//     let completed = 0;
//     let delayedStart = 0;
    
//     this.allProjects.forEach(project => {
//         const schedule = this.calculateProjectSchedule(project);
        
//         if (project.status === 'Completed') {
//             completed++;
//         } else if (schedule.isBehindSchedule) {
//             behindSchedule++;
//         } else if (schedule.isOnTrack) {
//             onTrack++;
//         }
        
//         if (schedule.hasDelayedStart) {
//             delayedStart++;
//         }
//     });
    
//         // Update stats
//         document.getElementById('totalProjectsCount').textContent = this.allProjects.length;
//         document.getElementById('behindScheduleCount').textContent = behindSchedule;
//         document.getElementById('onTrackCount').textContent = onTrack;
//         document.getElementById('completedCount').textContent = completed;
        
//         // Update timeline
//         this.renderProjectTimeline();
//     }

    
//     calculateProjectSchedule(project) {
//         const now = new Date();
//         const proposedStart = project.proposed_start_date ? new Date(project.proposed_start_date) : null;
//         const proposedEnd = project.proposed_end_date ? new Date(project.proposed_end_date) : null;
//         const actualStart = project.actual_start_date ? new Date(project.actual_start_date) : null;
//         const currentDeadline = project.current_deadline ? new Date(project.current_deadline) : proposedEnd;
//         const actualEnd = project.actual_end_date ? new Date(project.actual_end_date) : null;
        
//         let status = 'unknown';
//         let isBehindSchedule = false;
//         let isOnTrack = false;
//         let hasDelayedStart = false;
//         let completionPercentage = 0;
//         let daysRemaining = null;
//         let daysLate = 0;
        
//         // Check if project has started
//         if (actualStart) {
//             hasDelayedStart = proposedStart && actualStart > proposedStart;
            
//             // Calculate progress
//             if (actualEnd) {
//                 // Project completed
//                 status = 'completed';
//                 completionPercentage = 100;
//                 isBehindSchedule = proposedEnd && actualEnd > proposedEnd;
//                 daysLate = proposedEnd ? Math.ceil((actualEnd - proposedEnd) / (1000 * 60 * 60 * 24)) : 0;
//             } else if (currentDeadline) {
//                 // Project in progress
//                 const totalDuration = Math.ceil((currentDeadline - actualStart) / (1000 * 60 * 60 * 24));
//                 const elapsedDays = Math.ceil((now - actualStart) / (1000 * 60 * 60 * 24));
                
//                 completionPercentage = Math.min(100, Math.round((elapsedDays / totalDuration) * 100));
//                 daysRemaining = Math.ceil((currentDeadline - now) / (1000 * 60 * 60 * 24));
                
//                 isBehindSchedule = now > currentDeadline;
//                 isOnTrack = !isBehindSchedule && completionPercentage <= 100;
//                 status = isBehindSchedule ? 'behind' : 'ontrack';
//             }
//         } else {
//             // Project not started
//             if (proposedStart && now > proposedStart) {
//                 status = 'delayed';
//                 hasDelayedStart = true;
//             } else {
//                 status = 'planned';
//             }
//         }
        
//         return {
//             status,
//             isBehindSchedule,
//             isOnTrack,
//             hasDelayedStart,
//             completionPercentage,
//             daysRemaining,
//             daysLate,
//             proposedStart,
//             proposedEnd,
//             actualStart,
//             currentDeadline,
//             actualEnd
//         };
//     }


//     renderProjectTimeline() {
//         const timeline = document.getElementById('projectTimeline');
//         const filter = document.getElementById('timelineFilter').value;
        
//         if (this.allProjects.length === 0) {
//             timeline.innerHTML = `
//                 <div class="no-data">
//                     <i class="fas fa-calendar-times"></i>
//                     <p>No projects to display on timeline</p>
//                 </div>
//             `;
//             return;
//         }
        
//         // Sort projects by deadline (closest first)
//         const sortedProjects = [...this.allProjects].sort((a, b) => {
//             const dateA = new Date(a.current_deadline || a.proposed_end_date || '9999-12-31');
//             const dateB = new Date(b.current_deadline || b.proposed_end_date || '9999-12-31');
//             return dateA - dateB;
//         });
        
//         let timelineHTML = '';
//         let projectCount = 0;
        
//         sortedProjects.forEach(project => {
//             const schedule = this.calculateProjectSchedule(project);
            
//             // Apply filter
//             if (filter === 'behind' && !schedule.isBehindSchedule) return;
//             if (filter === 'ontrack' && !schedule.isOnTrack) return;
//             if (filter === 'delayed' && !schedule.hasDelayedStart) return;
            
//             projectCount++;
            
//             // Determine icon and class based on status
//             let iconClass = '';
//             let contentClass = '';
//             let statusText = '';
            
//             switch(schedule.status) {
//                 case 'behind':
//                     iconClass = 'behind';
//                     contentClass = 'behind';
//                     statusText = 'Behind Schedule';
//                     break;
//                 case 'ontrack':
//                     iconClass = 'ontrack';
//                     contentClass = 'ontrack';
//                     statusText = 'On Track';
//                     break;
//                 case 'delayed':
//                     iconClass = 'delayed';
//                     contentClass = 'delayed';
//                     statusText = 'Delayed Start';
//                     break;
//                 case 'completed':
//                     iconClass = 'completed';
//                     contentClass = 'completed';
//                     statusText = 'Completed';
//                     break;
//                 default:
//                     iconClass = '';
//                     contentClass = '';
//                     statusText = 'Planned';
//             }
            
//             // Format dates
//             const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'Not set';
            
//             timelineHTML += `
//                 <div class="timeline-item">
//                     <div class="timeline-marker">
//                         <div class="timeline-icon ${iconClass}">
//                             <i class="fas fa-project-diagram"></i>
//                         </div>
//                         <div class="timeline-date">
//                             ${formatDate(schedule.currentDeadline || project.proposed_end_date)}
//                         </div>
//                     </div>
//                     <div class="timeline-content ${contentClass}">
//                         <div class="timeline-title">
//                             <span>${this.escapeHtml(project.name)}</span>
//                             <span class="timeline-code">${project.project_code || 'N/A'}</span>
//                         </div>
//                         <div class="timeline-details">
//                             <div class="timeline-detail">
//                                 <i class="fas fa-flag"></i>
//                                 <span>Status: <strong>${project.status}</strong></span>
//                             </div>
//                             <div class="timeline-detail">
//                                 <i class="fas fa-running"></i>
//                                 <span>Schedule: <strong>${statusText}</strong></span>
//                             </div>
//                             <div class="timeline-detail">
//                                 <i class="fas fa-calendar-day"></i>
//                                 <span>Start: ${formatDate(project.actual_start_date || project.proposed_start_date)}</span>
//                             </div>
//                             <div class="timeline-detail">
//                                 <i class="fas fa-calendar-check"></i>
//                                 <span>Deadline: ${formatDate(schedule.currentDeadline || project.proposed_end_date)}</span>
//                             </div>
//                         </div>
                        
//                         ${schedule.completionPercentage > 0 ? `
//                             <div class="progress-container">
//                                 <div class="progress-label">
//                                     <span>Progress: ${schedule.completionPercentage}%</span>
//                                     ${schedule.daysRemaining !== null ? 
//                                         `<span>${schedule.daysRemaining} days remaining</span>` : 
//                                         `<span>${schedule.daysLate > 0 ? `${schedule.daysLate} days late` : 'On time'}</span>`
//                                     }
//                                 </div>
//                                 <div class="progress-bar">
//                                     <div class="progress-fill" style="width: ${schedule.completionPercentage}%; background: ${schedule.isBehindSchedule ? '#f72585' : '#4cc9f0'};"></div>
//                                 </div>
//                             </div>
//                         ` : ''}
                        
//                         <div style="margin-top: 10px;">
//                             <button class="btn btn-sm btn-outline" onclick="app.viewProjectSchedule('${project.id}')">
//                                 <i class="fas fa-chart-gantt"></i> View Details
//                             </button>
//                             ${schedule.isBehindSchedule ? `
//                                 <button class="btn btn-sm btn-warning" onclick="app.extendDeadline('${project.id}')">
//                                     <i class="fas fa-calendar-plus"></i> Extend Deadline
//                                 </button>
//                             ` : ''}
//                         </div>
//                     </div>
//                 </div>
//             `;
//         });
        
//         if (projectCount === 0) {
//             timelineHTML = `
//                 <div class="no-data">
//                     <i class="fas fa-filter"></i>
//                     <p>No projects match the selected filter</p>
//                 </div>
//             `;
//         }
        
//         timeline.innerHTML = timelineHTML;
//     }


//     toggleScheduleView() {
//         const timelineView = document.getElementById('timelineView');
//         const ganttView = document.getElementById('ganttView');
        
//         if (!ganttView) {
//             // Create Gantt view if it doesn't exist
//             this.createGanttView();
//             return;
//         }
        
//         if (timelineView.style.display !== 'none') {
//             timelineView.style.display = 'none';
//             ganttView.style.display = 'block';
//             this.showToast('Switched to Gantt Chart view');
//         } else {
//             timelineView.style.display = 'block';
//             ganttView.style.display = 'none';
//             this.showToast('Switched to Timeline view');
//         }
//     }

//     createGanttView() {
//         const timelineContainer = document.querySelector('.timeline-container');
        
//         const ganttHTML = `
//             <div class="gantt-container" id="ganttView">
//                 <div class="gantt-header">
//                     <div class="gantt-project-header">Project</div>
//                     <div class="gantt-timeline-header">
//                         <div style="display: flex; justify-content: space-between;">
//                             <span>Timeline</span>
//                             <div>
//                                 <span class="legend-item" style="background: #6c757d;"></span> Proposed
//                                 <span class="legend-item" style="background: #4361ee; margin-left: 10px;"></span> Actual
//                                 <span class="legend-item" style="background: #f72585; margin-left: 10px;"></span> Delayed
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="gantt-body" id="ganttBody">
//                     <!-- Gantt rows will be added here -->
//                 </div>
//             </div>
//         `;
        
//         timelineContainer.insertAdjacentHTML('afterend', ganttHTML);
//         this.renderGanttChart();
//     }


//     renderGanttChart() {
//         const ganttBody = document.getElementById('ganttBody');
        
//         if (!ganttBody || this.allProjects.length === 0) return;
        
//         // Find date range for all projects
//         let minDate = new Date();
//         let maxDate = new Date();
        
//         this.allProjects.forEach(project => {
//             const dates = [
//                 project.proposed_start_date ? new Date(project.proposed_start_date) : null,
//                 project.proposed_end_date ? new Date(project.proposed_end_date) : null,
//                 project.actual_start_date ? new Date(project.actual_start_date) : null,
//                 project.actual_end_date ? new Date(project.actual_end_date) : null,
//                 project.current_deadline ? new Date(project.current_deadline) : null
//             ].filter(d => d);
            
//             dates.forEach(date => {
//                 if (date < minDate) minDate = date;
//                 if (date > maxDate) maxDate = date;
//             });
//         });
        
//         // Add buffer
//         minDate.setMonth(minDate.getMonth() - 1);
//         maxDate.setMonth(maxDate.getMonth() + 1);
        
//         const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
        
//         let ganttHTML = '';
        
//         this.allProjects.forEach(project => {
//             const schedule = this.calculateProjectSchedule(project);
            
//             // Calculate positions
//             const getPosition = (date) => {
//                 if (!date) return 0;
//                 const daysFromStart = Math.ceil((date - minDate) / (1000 * 60 * 60 * 24));
//                 return (daysFromStart / totalDays) * 100;
//             };
            
//             const proposedStartPos = getPosition(schedule.proposedStart);
//             const proposedEndPos = getPosition(schedule.proposedEnd);
//             const actualStartPos = getPosition(schedule.actualStart);
//             const actualEndPos = getPosition(schedule.actualEnd || schedule.currentDeadline);
            
//             ganttHTML += `
//                 <div class="gantt-row">
//                     <div class="gantt-project">
//                         <div style="font-weight: 500;">${this.escapeHtml(project.name)}</div>
//                         <div style="font-size: 0.8rem; color: #6c757d;">${project.project_code || ''}</div>
//                         <div style="font-size: 0.8rem;">
//                             <span class="schedule-badge ${schedule.isBehindSchedule ? 'badge-behind' : 'badge-ontrack'}">
//                                 ${schedule.status}
//                             </span>
//                         </div>
//                     </div>
//                     <div class="gantt-timeline">
//                         ${schedule.proposedStart && schedule.proposedEnd ? `
//                             <div class="gantt-bar proposed" 
//                                 style="left: ${proposedStartPos}%; width: ${proposedEndPos - proposedStartPos}%;">
//                                 Proposed
//                             </div>
//                         ` : ''}
                        
//                         ${schedule.actualStart && (schedule.actualEnd || schedule.currentDeadline) ? `
//                             <div class="gantt-bar ${schedule.isBehindSchedule ? 'delayed' : 'actual'}" 
//                                 style="left: ${actualStartPos}%; width: ${(actualEndPos - actualStartPos) || 5}%;">
//                                 ${schedule.actualEnd ? 'Completed' : 'In Progress'}
//                             </div>
//                         ` : ''}
//                     </div>
//                 </div>
//             `;
//         });
        
//         ganttBody.innerHTML = ganttHTML;
//     }

    
//     viewProjectSchedule(projectId) {
//         // Find the project
//         const project = this.allProjects.find(p => p.id === projectId);
//         if (!project) return;
        
//         const schedule = this.calculateProjectSchedule(project);
//         console.log({note: 'hereeeeeeeeeeeee line 1080 app.js',project, schedule})
        
//         const modalHTML = `
//             <div class="modal">
//                 <div class="modal-content" style="max-width: 700px;">
//                     <div class="modal-header">
//                         <h2>Schedule Details: ${this.escapeHtml(project.name)}</h2>
//                         <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
//                     </div>
//                     <div class="modal-body">
//                         <div class="schedule-details">
//                             <div class="detail-grid">
//                                 <div><strong>Project Code:</strong></div><div>${project.project_code || 'N/A'}</div>
//                                 <div><strong>Status:</strong></div><div>${project.status}</div>
//                                 <div><strong>Schedule Status:</strong></div><div>
//                                     <span class="schedule-badge ${schedule.isBehindSchedule ? 'badge-behind' : 'badge-ontrack'}">
//                                         ${schedule.status}
//                                     </span>
//                                 </div>
//                                 <div><strong>Completion:</strong></div><div>${schedule.completionPercentage}%</div>
//                             </div>
                            
//                             <h3 style="margin-top: 1.5rem; color: var(--primary);">Timeline</h3>
//                             <div class="timeline-detail-grid">
//                                 <div>
//                                     <strong>Proposed Start:</strong><br>
//                                     <span class="date-status ${schedule.hasDelayedStart ? 'late' : 'ontime'}">
//                                         ${this.formatProjectDate(project.proposed_start_date)}
//                                         ${schedule.hasDelayedStart ? ' ⚠️ Delayed' : ''}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <strong>Actual Start:</strong><br>
//                                     <span>${this.formatProjectDate(project.actual_start_date)}</span>
//                                 </div>
//                                 <div>
//                                     <strong>Proposed End:</strong><br>
//                                     <span>${this.formatProjectDate(project.proposed_end_date)}</span>
//                                 </div>
//                                 <div>
//                                     <strong>Current Deadline:</strong><br>
//                                     <span class="date-status ${schedule.isBehindSchedule ? 'late' : schedule.daysRemaining !== null && schedule.daysRemaining < 7 ? 'upcoming' : 'ontime'}">
//                                         ${this.formatProjectDate(project.current_deadline || project.proposed_end_date)}
//                                         ${schedule.isBehindSchedule ? ` (${schedule.daysLate} days late)` : 
//                                         schedule.daysRemaining !== null ? ` (${schedule.daysRemaining} days remaining)` : ''}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <strong>Actual End:</strong><br>
//                                     <span>${this.formatProjectDate(project.actual_end_date)}</span>
//                                 </div>
//                                 <div>
//                                     <strong>Extensions:</strong><br>
//                                     <span>${project.extension_count || 0} extensions (${project.total_extension_days || 0} total days)</span>
//                                 </div>
//                             </div>
                            
//                             <div class="progress-container" style="margin-top: 1.5rem;">
//                                 <div class="progress-label">
//                                     <span>Project Progress</span>
//                                     <span>${schedule.completionPercentage}%</span>
//                                 </div>
//                                 <div class="progress-bar">
//                                     <div class="progress-fill" style="width: ${schedule.completionPercentage}%; background: ${schedule.isBehindSchedule ? '#f72585' : '#4cc9f0'};"></div>
//                                 </div>
//                             </div>
                            
//                             <div style="margin-top: 1.5rem;">
//                                 <h3 style="color: var(--primary);">Schedule Summary</h3>
//                                 <p>
//                                     ${schedule.isBehindSchedule ? 
//                                         `⚠️ This project is <strong>${schedule.daysLate} days behind schedule</strong>.` :
//                                         schedule.daysRemaining !== null ?
//                                             `✅ Project is <strong>on track</strong> with ${schedule.daysRemaining} days remaining.` :
//                                             '📅 Project timeline details are being tracked.'
//                                     }
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="modal-footer">
//                         <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
//                         ${schedule.isBehindSchedule ? `
//                             <button class="btn btn-warning" onclick="app.extendDeadline('${project.id}')">
//                                 <i class="fas fa-calendar-plus"></i> Extend Deadline
//                             </button>
//                         ` : ''}
//                         <button class="btn btn-primary" onclick="app.editProject('${project.id}')">
//                             <i class="fas fa-edit"></i> Edit Project
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `;
//         console.log({modalHTML})
//         document.body.insertAdjacentHTML('beforeend', modalHTML);
//     }

//     formatProjectDate(dateString) {
//         if (!dateString) return 'Not set';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     }

//     extendDeadline(projectId) {
//         const project = this.allProjects.find(p => p.id === projectId);
//         if (!project) return;
        
//         const modalHTML = `
//             <div class="modal" id="extendModal">
//                 <div class="modal-content small-modal">
//                     <div class="modal-header">
//                         <h2>Extend Project Deadline</h2>
//                         <button class="close-btn" onclick="document.getElementById('extendModal').remove()">&times;</button>
//                     </div>
//                     <form id="extendForm" onsubmit="event.preventDefault(); app.submitExtension('${projectId}')">
//                         <div class="modal-body">
//                             <p>Extending deadline for: <strong>${this.escapeHtml(project.name)}</strong></p>
                            
//                             <div class="form-group">
//                                 <label for="extensionDays">Additional Days *</label>
//                                 <input type="number" id="extensionDays" min="1" max="365" value="7" required>
//                             </div>
                            
//                             <div class="form-group">
//                                 <label for="extensionReason">Reason for Extension *</label>
//                                 <textarea id="extensionReason" rows="3" required placeholder="Explain why the deadline needs to be extended..."></textarea>
//                             </div>
                            
//                             <div class="form-group">
//                                 <label for="extendedBy">Extended By *</label>
//                                 <input type="text" id="extendedBy" value="${this.uploadedByInput?.value || 'admin'}" required>
//                             </div>
                            
//                             <div class="info-box">
//                                 <i class="fas fa-info-circle"></i>
//                                 <small>Current deadline: ${this.formatProjectDate(project.current_deadline || project.proposed_end_date)}</small>
//                             </div>
//                         </div>
//                         <div class="modal-footer">
//                             <button type="button" class="btn btn-secondary" onclick="document.getElementById('extendModal').remove()">Cancel</button>
//                             <button type="submit" class="btn btn-warning">
//                                 <i class="fas fa-calendar-plus"></i> Extend Deadline
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         `;
        
//         document.body.insertAdjacentHTML('beforeend', modalHTML);
//     }

//     async submitExtension(projectId) {
//         const extensionDays = document.getElementById('extensionDays').value;
//         const extensionReason = document.getElementById('extensionReason').value;
//         const extendedBy = document.getElementById('extendedBy').value;
        
//         if (!extensionDays || !extensionReason || !extendedBy) {
//             this.showToast('Please fill all required fields', 'error');
//             return;
//         }
        
//         try {
//             const response = await fetch(`${this.apiBaseUrl}/projects/${projectId}/extend`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     extension_days: parseInt(extensionDays),
//                     reason: extensionReason,
//                     extended_by: extendedBy
//                 })
//             });
            
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`HTTP ${response.status}: ${errorText}`);
//             }
            
//             const result = await response.json();
//             this.showToast(result.message || 'Deadline extended successfully!');
            
//             // Remove modal
//             const modal = document.getElementById('extendModal');
//             if (modal) modal.remove();
            
//             // Refresh data
//             this.loadProjects();
            
//         } catch (error) {
//             console.error('Error extending deadline:', error);
//             this.showToast('Error: ' + error.message, 'error');
//         }
//     }



//     async loadStats() {
//         try {
//             const response = await fetch(`${this.apiBaseUrl}/projects/stats/summary`);
//             if (!response.ok) throw new Error('Failed to load stats');
            
//             const stats = await response.json();
//             console.log('Stats loaded:', stats);
//             this.updateStats(stats);
//         } catch (error) {
//             console.error('Error loading stats:', error);
//         }
//     }

//     updateStats(stats) {
//         this.totalProjectsEl.textContent = stats.total || 0;
//         this.completedProjectsEl.textContent = stats.completed || 0;
//         this.inProgressProjectsEl.textContent = stats.in_progress || 0;
        
//         const totalBudget = stats.total_estimated_budget || 0;
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
//                     project.project_code || '',
//                     project.name || '',
//                     project.description || '',
//                     project.project_manager || '',
//                     project.contractor_name || '',
//                     project.department || '',
//                     project.project_type || '',
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
//                 console.log('Search results:', data);
//                 this.filteredProjects = data.results;
//                 this.currentPage = 1;
//                 this.renderProjects();
//                 this.updatePagination();
//                 this.showToast(`Found ${data.count} projects for "${searchTerm}"`);
//             })
//             .catch(error => {
//                 console.error('Search error:', error);
//                 this.showToast('Search failed: ' + error.message, 'error');
//             })
//             .finally(() => this.showLoading(false));
//     }

//     renderProjects() {
//         console.log('Rendering projects:', this.filteredProjects.length);
        
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

//         this.projectsTableBody.innerHTML = projectsToShow.map(project => {
//             // Format dates
//             const startDate = project.proposed_start_date 
//                 ? new Date(project.proposed_start_date).toLocaleDateString() 
//                 : 'Not set';
            
//             // Calculate budget info
//             const budget = parseFloat(project.estimated_budget || 0);
//             const utilized = parseFloat(project.budget_utilized || 0);
//             const utilizationRate = budget > 0 ? Math.round((utilized / budget) * 100) : 0;
            
//             // Status badge class
//             const statusClass = `status-${project.status.toLowerCase().replace(' ', '-')}`;
            
//             // Priority badge class
//             const priorityClass = `priority-${project.priority.toLowerCase()}`;
            
//             return `
//                 <tr>
//                     <td>
//                         <strong class="project-code">${this.escapeHtml(project.project_code || 'N/A')}</strong>
//                     </td>
//                     <td>
//                         <strong>${this.escapeHtml(project.name)}</strong>
//                         <div class="keywords">
//                             ${(project.keywords || []).slice(0, 3).map(keyword => 
//                                 `<span class="keyword-tag">${this.escapeHtml(keyword)}</span>`
//                             ).join('')}
//                         </div>
//                     </td>
//                     <td>
//                         <span class="status-badge ${statusClass}">
//                             ${project.status}
//                         </span>
//                     </td>
//                     <td>
//                         <span class="priority-badge ${priorityClass}">
//                             ${project.priority}
//                         </span>
//                     </td>
//                     <td>${this.escapeHtml(project.department || '')}</td>
//                     <td>
//                         <strong>₦${budget.toLocaleString()}</strong>
//                         ${budget > 0 ? `
//                             <div class="budget-progress">
//                                 <div class="progress-bar">
//                                     <div class="progress-fill" style="width: ${utilizationRate}%"></div>
//                                 </div>
//                                 <small>${utilizationRate}% used</small>
//                             </div>
//                         ` : ''}
//                     </td>
//                     <td>${this.escapeHtml(project.project_manager || '')}</td>
//                     <td>${startDate}</td>
//                     <td>
//                         <div class="action-buttons">
//                             <button class="btn btn-sm btn-outline me-1" 
//                                     onclick="app.editProject('${project.id}')"
//                                     title="Edit">
//                                 <i class="fas fa-edit"></i>
//                             </button>
//                             <button class="btn btn-sm btn-outline me-1" 
//                                     onclick="app.viewProject('${project.id}')"
//                                     title="View Details">
//                                 <i class="fas fa-eye"></i>
//                             </button>
//                             <button class="btn btn-sm btn-danger" 
//                                     onclick="app.showDeleteModal('${project.id}', '${this.escapeHtml(project.name)}')"
//                                     title="Delete">
//                                 <i class="fas fa-trash"></i>
//                             </button>
//                         </div>
//                     </td>
//                 </tr>
//             `;
//         }).join('');
        
//         console.log('Projects rendered');
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
//         console.log('Showing add modal');
//         this.modalTitle.textContent = 'Add New Project';
//         this.projectForm.reset();
//         this.projectId.value = '';
        
//         // Set default values
//         const today = new Date().toISOString().split('T')[0];
//         this.proposedStartInput.value = today;
//         this.statusInput.value = 'Planning';
//         this.priorityInput.value = 'Medium';
//         this.uploadedByInput.value = 'admin'; // Default value
        
//         // Generate project code
//         const year = new Date().getFullYear();
//         const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//         this.projectCodeInput.value = `PRJ-${year}-${random}`;
        
//         this.projectModal.style.display = 'block';
//     }

//     async editProject(projectId) {
//         console.log('Editing project:', projectId);
//         try {
//             const response = await fetch(`${this.apiBaseUrl}/projects/${projectId}`);
//             if (!response.ok) throw new Error('Failed to load project');
            
//             const project = await response.json();
//             console.log('Project loaded for editing:', project);
//             this.populateForm(project);
//             this.modalTitle.textContent = 'Edit Project';
//             this.projectModal.style.display = 'block';
//         } catch (error) {
//             console.error('Error loading project:', error);
//             this.showToast('Error loading project: ' + error.message, 'error');
//         }
//     }

//     populateForm(project) {
//         console.log('Populating form with:', project);
        
//         this.projectId.value = project.id;
//         this.projectCodeInput.value = project.project_code || '';
//         this.nameInput.value = project.name || '';
//         this.descriptionInput.value = project.description || '';
//         this.statusInput.value = project.status || 'Planning';
//         this.priorityInput.value = project.priority || 'Medium';
//         this.categoryInput.value = project.category || '';
//         this.departmentInput.value = project.department || '';
//         this.projectTypeInput.value = project.project_type || '';
        
//         // Timeline
//         this.proposedStartInput.value = project.proposed_start_date || '';
//         this.proposedEndInput.value = project.proposed_end_date || '';
//         this.actualStartInput.value = project.actual_start_date || '';
//         this.actualEndInput.value = project.actual_end_date || '';
//         this.currentDeadlineInput.value = project.current_deadline || '';
        
//         // Financial
//         this.estimatedBudgetInput.value = project.estimated_budget || '';
//         this.budgetAllocatedInput.value = project.budget_allocated || '';
//         this.budgetUtilizedInput.value = project.budget_utilized || '';
//         this.contingencyFundsInput.value = project.contingency_funds || '';
        
//         // People
//         this.projectManagerInput.value = project.project_manager || '';
//         this.contractorNameInput.value = project.contractor_name || '';
//         this.contractorCompanyInput.value = project.contractor_company || '';
//         this.uploadedByInput.value = project.uploaded_by || '';
//         this.teamMembersInput.value = (project.team_members || []).join(', ');
//         this.stakeholdersInput.value = (project.stakeholders || []).join(', ');
        
//         // Search & Organization
//         this.keywordsInput.value = (project.keywords || []).join(', ');
//         this.tagsInput.value = (project.tags || []).join(', ');
//     }

//     async viewProject(projectId) {
//         try {
//             const response = await fetch(`${this.apiBaseUrl}/projects/${projectId}`);
//             if (!response.ok) throw new Error('Failed to load project');
            
//             const project = await response.json();
            
//             // Create a detailed view
//             const detailHtml = `
//                 <h3>${this.escapeHtml(project.name)}</h3>
//                 <p><strong>Code:</strong> ${project.project_code || 'N/A'}</p>
//                 <p><strong>Status:</strong> ${project.status}</p>
//                 <p><strong>Priority:</strong> ${project.priority}</p>
//                 <p><strong>Department:</strong> ${project.department || 'N/A'}</p>
//                 <p><strong>Manager:</strong> ${project.project_manager || 'N/A'}</p>
//                 <p><strong>Budget:</strong> $${parseFloat(project.estimated_budget || 0).toLocaleString()}</p>
//                 <p><strong>Description:</strong> ${this.escapeHtml(project.description || 'No description')}</p>
//             `;
            
//             // Show in alert (you can replace with a modal later)
//             alert('Project Details:\n\n' + detailHtml.replace(/<[^>]*>/g, ''));
//         } catch (error) {
//             console.error('Error viewing project:', error);
//             this.showToast('Error viewing project: ' + error.message, 'error');
//         }
//     }

//     async handleFormSubmit(e) {
//         e.preventDefault();
//         console.log('Form submitted');
        
//         const projectData = {
//             project_code: this.projectCodeInput.value.trim(),
//             name: this.nameInput.value.trim(),
//             description: this.descriptionInput.value.trim(),
//             status: this.statusInput.value,
//             priority: this.priorityInput.value,
//             category: this.categoryInput.value.trim(),
//             department: this.departmentInput.value.trim(),
//             project_type: this.projectTypeInput.value.trim(),
            
//             // Timeline
//             proposed_start_date: this.proposedStartInput.value || null,
//             proposed_end_date: this.proposedEndInput.value || null,
//             actual_start_date: this.actualStartInput.value || null,
//             actual_end_date: this.actualEndInput.value || null,
//             current_deadline: this.currentDeadlineInput.value || null,
            
//             // Financial
//             estimated_budget: parseFloat(this.estimatedBudgetInput.value) || 0,
//             budget_allocated: parseFloat(this.budgetAllocatedInput.value) || 0,
//             budget_utilized: parseFloat(this.budgetUtilizedInput.value) || 0,
//             contingency_funds: parseFloat(this.contingencyFundsInput.value) || 0,
            
//             // People
//             project_manager: this.projectManagerInput.value.trim(),
//             contractor_name: this.contractorNameInput.value.trim(),
//             contractor_company: this.contractorCompanyInput.value.trim(),
//             uploaded_by: this.uploadedByInput.value.trim() || 'admin',
//             last_modified_by: this.uploadedByInput.value.trim() || 'admin',
//             team_members: this.teamMembersInput.value.split(',').map(m => m.trim()).filter(m => m),
//             stakeholders: this.stakeholdersInput.value.split(',').map(s => s.trim()).filter(s => s),
            
//             // Search & Organization
//             keywords: this.keywordsInput.value.split(',').map(k => k.trim()).filter(k => k),
//             tags: this.tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
//         };

//         console.log('Project data to save:', projectData);

//         const projectId = this.projectId.value;
//         const url = projectId ? `${this.apiBaseUrl}/projects/${projectId}` : `${this.apiBaseUrl}/projects`;
//         const method = projectId ? 'PUT' : 'POST';

//         try {
//             console.log('Sending request to:', url, 'Method:', method);
//             const response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(projectData)
//             });

//             console.log('Response status:', response.status);
            
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`HTTP ${response.status}: ${errorText}`);
//             }

//             const savedProject = await response.json();
//             console.log('Project saved:', savedProject);
            
//             this.hideModal();
//             this.loadProjects();
//             this.loadStats();
//             this.showToast(`Project "${savedProject.name}" saved successfully!`);
//         } catch (error) {
//             console.error('Error saving project:', error);
//             this.showToast('Error saving project: ' + error.message, 'error');
//         }
//     }

//     showDeleteModal(projectId, projectName) {
//         console.log('Showing delete modal for:', projectId);
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
//                 const errorText = await response.text();
//                 throw new Error(`HTTP ${response.status}: ${errorText}`);
//             }

//             this.hideDeleteModal();
//             this.loadProjects();
//             this.loadStats();
//             this.showToast('Project deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting project:', error);
//             this.showToast('Error deleting project: ' + error.message, 'error');
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
//         if (!text) return '';
//         const div = document.createElement('div');
//         div.textContent = text;
//         return div.innerHTML;
//     }
// }

// // Initialize app when DOM is loaded
// let app;
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM loaded, initializing app...');
//     app = new PMOApplication();
// });

// // Bind delete confirmation
// document.getElementById('confirmDelete').addEventListener('click', () => {
//     console.log('Delete confirmed');
//     app.handleDelete();
// });

// // Add CSS for budget progress bar
// const style = document.createElement('style');
// style.textContent = `
//     .budget-progress {
//         margin-top: 5px;
//     }
//     .progress-bar {
//         height: 6px;
//         background: #e9ecef;
//         border-radius: 3px;
//         overflow: hidden;
//     }
//     .progress-fill {
//         height: 100%;
//         background: var(--primary);
//         transition: width 0.3s ease;
//     }
//     .project-code {
//         font-family: monospace;
//         background: #f8f9fa;
//         padding: 2px 6px;
//         border-radius: 4px;
//         font-size: 0.9em;
//     }
//     .keyword-tag {
//         display: inline-block;
//         background: #e9ecef;
//         padding: 2px 8px;
//         border-radius: 12px;
//         font-size: 0.8em;
//         margin-right: 4px;
//         margin-top: 4px;
//     }
//     .mt-2 {
//         margin-top: 0.5rem;
//     }
//     .me-1 {
//         margin-right: 0.25rem;
//     }
// `;
// document.head.appendChild(style);


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
                        <span class="status-badge status-${project.status.toLowerCase().replace(' ', '-')}">
                            ${project.status}
                        </span>
                        <span class="priority-badge priority-${project.priority.toLowerCase()}">
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
                        <div class="cost-value">$${project.estimated_budget?.toLocaleString() || 0}</div>
                        <div class="cost-trend">
                            ${financial.budgetVariance >= 0 ? 
                                `<i class="fas fa-arrow-up text-success"></i> ₦${financial.budgetVariance.toLocaleString()} under` :
                                `<i class="fas fa-arrow-down text-danger"></i> ₦${Math.abs(financial.budgetVariance).toLocaleString()} over`
                            }
                        </div>
                    </div>
                    
                    <div class="cost-card">
                        <h4>Budget Allocated</h4>
                        <div class="cost-value">$${project.budget_allocated?.toLocaleString() || 0}</div>
                        <div class="cost-trend">
                            ${financial.allocationPercentage}% of estimated
                        </div>
                    </div>
                    
                    <div class="cost-card">
                        <h4>Budget Utilized</h4>
                        <div class="cost-value">$${project.budget_utilized?.toLocaleString() || 0}</div>
                        <div class="cost-trend">
                            ${financial.utilizationPercentage}% utilization
                        </div>
                    </div>
                    
                    <div class="cost-card">
                        <h4>Available Funds</h4>
                        <div class="cost-value">$${financial.availableFunds.toLocaleString()}</div>
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
                        <span class="detail-value">$${project.estimated_budget?.toLocaleString() || 0}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Utilized:</span>
                        <span class="detail-value">$${project.budget_utilized?.toLocaleString() || 0} (${financial.utilizationPercentage}%)</span>
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