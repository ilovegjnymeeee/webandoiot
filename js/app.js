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
        this.deleteTargetId = null;
        
        this.init();
    }

    async init() {
        try {
            const savedCourses = localStorage.getItem('webandoiot_courses');
            
            if (savedCourses) {
                console.log('📦 Loading from localStorage...');
                this.courses = JSON.parse(savedCourses);
            } else {
                console.log('📥 Loading from courses.json...');
                const response = await fetch('./courses.json');
                
                if (!response.ok) {
                    throw new Error('Không thể load courses.json');
                }
                
                const data = await response.json();
                this.courses = data.courses || [];
                this.saveCourses();
            }
            
            this.filteredCourses = [...this.courses];
            
            console.log('✅ Loaded courses:', this.courses.length);
            
            this.renderCourses();
            this.updateStats();
            this.renderPagination();
            
        } catch (error) {
            console.error('❌ Error loading courses:', error);
            this.showNotification('Không thể tải danh sách khóa học!', 'error');
            this.showEmptyState();
        }
    }

    saveCourses() {
        localStorage.setItem('webandoiot_courses', JSON.stringify(this.courses));
        console.log('💾 Courses saved to localStorage');
    }

    showEmptyState() {
        const coursesGrid = document.getElementById('coursesGrid');
        if (coursesGrid) {
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
        }
    }

    renderCourses() {
        const coursesGrid = document.getElementById('coursesGrid');
        const courseCount = document.getElementById('courseCount');
        
        if (!coursesGrid) return;

        if (!this.filteredCourses || this.filteredCourses.length === 0) {
            coursesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>Không tìm thấy khóa học</h3>
                    <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                    <button class="btn-secondary" onclick="courseApp.resetFilters()">
                        <i class="fas fa-redo"></i> Đặt lại bộ lọc
                    </button>
                </div>
            `;
            if (courseCount) {
                courseCount.textContent = 'Không có khóa học nào';
            }
            return;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedCourses = this.filteredCourses.slice(startIndex, endIndex);

        if (courseCount) {
            courseCount.textContent = `Hiển thị ${startIndex + 1}-${Math.min(endIndex, this.filteredCourses.length)} / ${this.filteredCourses.length} khóa học`;
        }

        coursesGrid.className = `courses-${this.viewMode}`;

        coursesGrid.innerHTML = paginatedCourses.map(course => {
            const progress = this.calculateProgress(course);
            const statusClass = this.getStatusClass(progress);
            const statusText = this.getStatusText(progress);
            const statusIcon = statusClass === 'completed' ? 'fa-check-circle' : 
                              statusClass === 'in-progress' ? 'fa-play-circle' : 'fa-clock';

            return `
                <div class="course-card ${statusClass}" data-course-id="${course.id}">
                    <div class="course-thumbnail">
                        <div class="course-icon">${course.thumbnail}</div>
                        <div class="course-overlay">
                            <button class="btn-play" onclick="courseApp.openCourse(${course.id})">
                                <i class="fas fa-play"></i>
                                Học ngay
                            </button>
                        </div>
                    </div>
                    
                    <div class="course-content">
                        <div class="course-header">
                            <h3 class="course-title">${course.title}</h3>
                            <div class="course-actions">
                                <button class="btn-icon btn-delete" onclick="courseApp.confirmDelete(${course.id})" title="Xóa khóa học">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="course-meta">
                            <span>
                                <i class="fas fa-user-tie"></i>
                                ${course.instructor}
                            </span>
                            <span>
                                <i class="fas fa-clock"></i>
                                ${course.duration}
                            </span>
                        </div>

                        <div class="course-stats">
                            <div class="stat-item">
                                <i class="fas fa-video"></i>
                                <span>${course.lessons?.length || 0} bài học</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <span>${course.students || 0} học viên</span>
                            </div>
                        </div>

                        <div class="course-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <span class="progress-text">${progress}% hoàn thành</span>
                        </div>

                        <div class="course-status ${statusClass}">
                            <i class="fas ${statusIcon}"></i>
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

    // ==========================================
    //  COURSE MODAL & VIDEO PLAYER
    // ==========================================

    openCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) {
            this.showNotification('Không tìm thấy khóa học!', 'error');
            return;
        }

        this.currentCourse = course;
        this.currentLesson = course.lessons && course.lessons.length > 0 ? course.lessons[0] : null;

        const modal = document.getElementById('courseModal');
        if (!modal) return;

        // Update modal header
        document.getElementById('modalCourseTitle').textContent = course.title;
        document.getElementById('modalInstructor').textContent = course.instructor;
        document.getElementById('modalDuration').textContent = course.duration;
        document.getElementById('modalStudents').textContent = course.students || 0;
        document.getElementById('courseDescription').textContent = course.description || 'Chưa có mô tả';

        // Load video or show empty state
        if (this.currentLesson && this.currentLesson.videoUrl) {
            this.loadVideo(this.currentLesson);
        } else {
            this.showNoVideo();
        }

        // Render lessons list
        this.renderLessonsList(course);

        // Show modal
        modal.style.display = 'block';
        
        // ✅ FIX: Switch to lessons tab
        this.switchTab('lessons');
    }

    loadVideo(lesson) {
        const videoContainer = document.querySelector('.video-container');
        
        if (!videoContainer) {
            console.error('❌ Video container not found');
            return;
        }

        // ✅ FIX: Remove leading './' from path
        let videoPath = lesson.videoUrl.replace(/^\.\//, '');
        
        console.log('🎬 Loading video:', videoPath);

        // Show loading
        videoContainer.innerHTML = `
            <div class="video-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Đang tải video...</p>
            </div>
        `;

        // Create video element
        const video = document.createElement('video');
        video.id = 'courseVideo';
        video.controls = true;
        video.preload = 'metadata';
        video.style.width = '100%';
        video.style.height = 'auto';
        video.style.backgroundColor = '#000';

        // Create source
        const source = document.createElement('source');
        source.src = videoPath;
        source.type = 'video/mp4';
        video.appendChild(source);

        // Success handler
        video.addEventListener('loadedmetadata', () => {
            console.log('✅ Video loaded:', lesson.title);
            videoContainer.innerHTML = '';
            videoContainer.appendChild(video);
            video.play().catch(err => console.warn('Auto-play blocked'));
        });

        // Error handler
        video.addEventListener('error', (e) => {
            console.error('❌ Video error:', videoPath);
            videoContainer.innerHTML = `
                <div class="video-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Không thể tải video</h3>
                    <p class="error-detail">File: ${videoPath}</p>
                    <p class="error-hint">
                        Video có thể chưa được upload hoặc đường dẫn không đúng.
                        <br><br>
                        <strong>Cách khắc phục:</strong>
                        <br>• Chạy: <code>git lfs pull</code>
                        <br>• Kiểm tra file tồn tại trong folder videos/
                        <br>• Verify LFS: <code>git lfs ls-files</code>
                    </p>
                    <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                        <button class="btn-secondary" onclick="courseApp.retryVideo()">
                            <i class="fas fa-redo"></i> Thử lại
                        </button>
                    </div>
                </div>
            `;
        });
    }

    showNoVideo() {
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.innerHTML = `
                <div class="no-video">
                    <i class="fas fa-video-slash"></i>
                    <h3>Chưa có video</h3>
                    <p>Khóa học này chưa có bài giảng video</p>
                </div>
            `;
        }
    }

    retryVideo() {
        if (this.currentLesson) {
            this.loadVideo(this.currentLesson);
        }
    }

    renderLessonsList(course) {
        const lessonsList = document.getElementById('lessonsList');
        if (!lessonsList) return;

        if (!course.lessons || course.lessons.length === 0) {
            lessonsList.innerHTML = `
                <div class="empty-lessons">
                    <i class="fas fa-inbox"></i>
                    <p>Chưa có bài học nào</p>
                </div>
            `;
            return;
        }

        lessonsList.innerHTML = `
            <div class="lessons-header">
                <h4>📚 Danh sách bài học (${course.lessons.length})</h4>
            </div>
            <div class="lessons-scroll">
                ${course.lessons.map((lesson, index) => `
                    <div class="lesson-item ${lesson.id === this.currentLesson?.id ? 'active' : ''} ${lesson.completed ? 'completed' : ''}" 
                         onclick="courseApp.selectLesson(${lesson.id})">
                        <div class="lesson-number">${index + 1}</div>
                        <div class="lesson-icon">
                            ${lesson.completed ? 
                                '<i class="fas fa-check-circle"></i>' : 
                                '<i class="fas fa-play-circle"></i>'
                            }
                        </div>
                        <div class="lesson-info">
                            <h5>${lesson.title}</h5>
                            <span class="lesson-duration">
                                <i class="fas fa-clock"></i> ${lesson.duration}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    selectLesson(lessonId) {
        if (!this.currentCourse) return;
        
        const lesson = this.currentCourse.lessons.find(l => l.id === lessonId);
        if (!lesson) return;

        this.currentLesson = lesson;
        this.loadVideo(lesson);
        this.renderLessonsList(this.currentCourse);
    }

    // ✅ FIX: Add switchTab function
    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Remove active from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        const selectedPane = document.getElementById(`tab-${tabName}`);
        if (selectedPane) {
            selectedPane.classList.add('active');
        }
        
        // Activate button
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes(tabName)) {
                btn.classList.add('active');
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('courseModal');
        if (modal) {
            modal.style.display = 'none';
        }

        const video = document.getElementById('courseVideo');
        if (video) {
            video.pause();
            video.src = '';
        }

        this.currentCourse = null;
        this.currentLesson = null;
    }

    // ==========================================
    //  SEARCH, FILTER, SORT
    // ==========================================

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

    resetFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterStatus').value = 'all';
        document.getElementById('filterStage').value = 'all';
        document.getElementById('sortSelect').value = 'newest';
        
        this.filteredCourses = [...this.courses];
        this.currentPage = 1;
        this.renderCourses();
        this.renderPagination();
    }

    toggleView(mode) {
        this.viewMode = mode;
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });
        
        this.renderCourses();
    }

    // ==========================================
    //  PAGINATION
    // ==========================================

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
        document.getElementById('courses-section').scrollIntoView({ behavior: 'smooth' });
    }

    // ==========================================
    //  DELETE COURSE
    // ==========================================

    confirmDelete(courseId) {
        this.deleteTargetId = courseId;
        const course = this.courses.find(c => c.id === courseId);
        
        if (!course) return;
        
        const modal = document.getElementById('confirmDeleteModal');
        if (modal) {
            const modalBody = modal.querySelector('.modal-body');
            modalBody.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 60px; margin-bottom: 15px;">${course.thumbnail}</div>
                    <h3 style="margin: 0 0 10px 0; color: #fff;">${course.title}</h3>
                    <p style="color: rgba(255, 255, 255, 0.7); margin: 0;">
                        <i class="fas fa-user"></i> ${course.instructor} • 
                        <i class="fas fa-video"></i> ${course.lessons?.length || 0} bài học
                    </p>
                </div>
                <p style="text-align: center; color: rgba(255, 255, 255, 0.9); margin-bottom: 10px;">
                    Bạn có chắc chắn muốn xóa khóa học này?
                </p>
                <p class="text-warning" style="text-align: center; color: #ff3b30; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> Hành động này không thể hoàn tác!
                </p>
                
                <div class="form-actions" style="margin-top: 30px;">
                    <button class="btn-secondary" onclick="courseApp.closeConfirmDeleteModal()">
                        <i class="fas fa-times"></i> Hủy
                    </button>
                    <button class="btn-danger" onclick="courseApp.deleteCourse()">
                        <i class="fas fa-trash-alt"></i> Xóa khóa học
                    </button>
                </div>
            `;
            
            modal.style.display = 'block';
        }
    }

    deleteCourse() {
        if (!this.deleteTargetId) return;
        
        this.courses = this.courses.filter(c => c.id !== this.deleteTargetId);
        this.filteredCourses = this.filteredCourses.filter(c => c.id !== this.deleteTargetId);
        
        this.saveCourses();
        this.renderCourses();
        this.updateStats();
        this.renderPagination();
        this.closeConfirmDeleteModal();
        this.showNotification('Đã xóa khóa học thành công!', 'success');
        
        this.deleteTargetId = null;
    }

    closeConfirmDeleteModal() {
        const modal = document.getElementById('confirmDeleteModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.deleteTargetId = null;
    }

    // ==========================================
    //  UPLOAD MODAL
    // ==========================================

    openUploadModal() {
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeUploadModal() {
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.getElementById('uploadForm').reset();
    }

    // ==========================================
    //  UTILITIES
    // ==========================================

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

    async refreshCourses() {
        this.showNotification('Đang làm mới...', 'info');
        await this.init();
    }
}

// Initialize app
let courseApp;
document.addEventListener('DOMContentLoaded', () => {
    courseApp = new CourseApp();
    console.log('✅ CourseApp initialized');
});