// ===================================
//    COURSE APP - MAIN CLASS
// ===================================

class CourseApp {
    constructor() {
        this.courses = [];
        this.filteredCourses = [];
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.viewMode = 'grid';
        this.currentCourse = null;
        this.currentLesson = null;
        
        // ✅ FIX: Load courses khi khởi tạo
        this.init();
    }

    async init() {
        try {
            // ✅ FIX: Load từ courses.json
            const response = await fetch('./courses.json');
            
            if (!response.ok) {
                throw new Error('Không thể load courses.json');
            }
            
            const data = await response.json();
            this.courses = data.courses || [];
            this.filteredCourses = [...this.courses];
            
            console.log('✅ Loaded courses:', this.courses.length);
            
            // Render courses
            this.renderCourses();
            this.updateStats();
            this.renderPagination();
            
        } catch (error) {
            console.error('❌ Error loading courses:', error);
            this.showNotification('Không thể tải danh sách khóa học!', 'error');
            
            // Hiển thị thông báo trên UI
            const coursesGrid = document.getElementById('coursesGrid');
            if (coursesGrid) {
                coursesGrid.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Không thể tải khóa học</h3>
                        <p>Vui lòng kiểm tra file courses.json</p>
                        <button class="btn-primary" onclick="location.reload()">
                            <i class="fas fa-sync-alt"></i> Thử lại
                        </button>
                    </div>
                `;
            }
        }
    }

    renderCourses() {
        const coursesGrid = document.getElementById('coursesGrid');
        const courseCount = document.getElementById('courseCount');
        
        if (!coursesGrid) return;

        // ✅ FIX: Kiểm tra có courses không
        if (!this.filteredCourses || this.filteredCourses.length === 0) {
            coursesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Chưa có khóa học nào</h3>
                    <p>Thêm khóa học mới để bắt đầu học tập</p>
                    <button class="btn-primary" onclick="courseApp.openUploadModal()">
                        <i class="fas fa-plus"></i> Thêm khóa học đầu tiên
                    </button>
                </div>
            `;
            if (courseCount) {
                courseCount.textContent = 'Không có khóa học nào';
            }
            return;
        }

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedCourses = this.filteredCourses.slice(startIndex, endIndex);

        // Update course count
        if (courseCount) {
            courseCount.textContent = `Hiển thị ${startIndex + 1}-${Math.min(endIndex, this.filteredCourses.length)} / ${this.filteredCourses.length} khóa học`;
        }

        // Set grid/list view class
        coursesGrid.className = `courses-${this.viewMode}`;

        // Render course cards
        coursesGrid.innerHTML = paginatedCourses.map(course => {
            const progress = this.calculateProgress(course);
            const statusClass = this.getStatusClass(progress);
            const statusText = this.getStatusText(progress);

            return `
                <div class="course-card ${statusClass}" data-course-id="${course.id}">
                    <div class="course-thumbnail">
                        <div class="course-icon">${course.thumbnail || '🎓'}</div>
                        <div class="course-overlay">
                            <button class="btn-play" onclick="courseApp.openCourse(${course.id})">
                                <i class="fas fa-play"></i> Học ngay
                            </button>
                        </div>
                    </div>
                    
                    <div class="course-content">
                        <div class="course-header">
                            <h3 class="course-title">${course.title}</h3>
                            <div class="course-actions">
                                <button class="btn-icon" onclick="courseApp.editCourse(${course.id})" title="Chỉnh sửa">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon btn-delete" onclick="courseApp.confirmDelete(${course.id})" title="Xóa">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="course-meta">
                            <span><i class="fas fa-user"></i> ${course.instructor}</span>
                            <span><i class="fas fa-clock"></i> ${course.duration}</span>
                            <span><i class="fas fa-layer-group"></i> ${course.category}</span>
                        </div>

                        <div class="course-stats">
                            <div class="stat-item">
                                <i class="fas fa-video"></i>
                                <span>${course.lessons?.length || 0} bài</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <span>${course.students || 0}</span>
                            </div>
                        </div>

                        <div class="course-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <span class="progress-text">${progress}% hoàn thành</span>
                        </div>

                        <div class="course-status ${statusClass}">
                            <i class="fas ${statusClass === 'completed' ? 'fa-check-circle' : statusClass === 'in-progress' ? 'fa-play-circle' : 'fa-clock'}"></i>
                            ${statusText}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    calculateProgress(course) {
        if (!course.lessons || course.lessons.length === 0) return 0;
        const completedLessons = course.lessons.filter(l => l.completed).length;
        return Math.round((completedLessons / course.lessons.length) * 100);
    }

    getStatusClass(progress) {
        if (progress === 100) return 'completed';
        if (progress > 0) return 'in-progress';
        return 'not-started';
    }

    getStatusText(progress) {
        if (progress === 100) return 'Đã hoàn thành';
        if (progress > 0) return 'Đang học';
        return 'Chưa bắt đầu';
    }

    updateStats() {
        const total = this.courses.length;
        const completed = this.courses.filter(c => this.calculateProgress(c) === 100).length;
        const inProgress = this.courses.filter(c => {
            const p = this.calculateProgress(c);
            return p > 0 && p < 100;
        }).length;
        const notStarted = total - completed - inProgress;

        document.getElementById('totalCourses').textContent = total;
        document.getElementById('completedCourses').textContent = completed;
        document.getElementById('inProgressCourses').textContent = inProgress;
        document.getElementById('notStartedCourses').textContent = notStarted;
    }

    // Search
    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredCourses = [...this.courses];
        } else {
            this.filteredCourses = this.courses.filter(course => 
                course.title.toLowerCase().includes(searchTerm) ||
                course.instructor.toLowerCase().includes(searchTerm) ||
                course.category.toLowerCase().includes(searchTerm)
            );
        }
        
        this.currentPage = 1;
        this.renderCourses();
        this.renderPagination();
    }

    // Filter by status
    handleFilterStatus(status) {
        if (status === 'all') {
            this.filteredCourses = [...this.courses];
        } else {
            this.filteredCourses = this.courses.filter(course => {
                const progress = this.calculateProgress(course);
                const courseStatus = this.getStatusClass(progress);
                return courseStatus === status;
            });
        }
        
        this.currentPage = 1;
        this.renderCourses();
        this.renderPagination();
    }

    // Filter by stage
    handleFilterStage(stage) {
        if (stage === 'all') {
            this.filteredCourses = [...this.courses];
        } else {
            this.filteredCourses = this.courses.filter(course => 
                course.category.includes(stage)
            );
        }
        
        this.currentPage = 1;
        this.renderCourses();
        this.renderPagination();
    }

    // Sort
    handleSort(sortBy) {
        switch(sortBy) {
            case 'newest':
                this.filteredCourses.sort((a, b) => b.id - a.id);
                break;
            case 'oldest':
                this.filteredCourses.sort((a, b) => a.id - b.id);
                break;
            case 'name-asc':
                this.filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                this.filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'progress':
                this.filteredCourses.sort((a, b) => 
                    this.calculateProgress(b) - this.calculateProgress(a)
                );
                break;
        }
        
        this.renderCourses();
    }

    // Toggle view
    toggleView(mode) {
        this.viewMode = mode;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });
        
        this.renderCourses();
    }

    // Pagination
    renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="courseApp.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || 
                i === totalPages || 
                (i >= this.currentPage - 1 && i <= this.currentPage + 1)
            ) {
                paginationHTML += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                            onclick="courseApp.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }

        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="courseApp.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderCourses();
        this.renderPagination();
        
        // Scroll to top
        document.getElementById('courses-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Notification
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    // Refresh courses
    async refreshCourses() {
        this.showNotification('Đang làm mới...', 'info');
        await this.init();
    }

    // Modal methods (giữ nguyên code cũ)
    openCourse(courseId) {
        // ... existing code ...
    }

    closeModal() {
        // ... existing code ...
    }

    openUploadModal() {
        // ... existing code ...
    }

    closeUploadModal() {
        // ... existing code ...
    }
}

// ✅ Initialize app when DOM is loaded
let courseApp;
document.addEventListener('DOMContentLoaded', () => {
    courseApp = new CourseApp();
    console.log('✅ CourseApp initialized');
});