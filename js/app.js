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
            this.attachEventListeners();
            
        } catch (error) {
            console.error('❌ Error loading courses:', error);
            this.showNotification('Không thể tải danh sách khóa học!', 'error');
            this.showEmptyState();
        }
    }

    attachEventListeners() {
        // Close modals on overlay click
        document.querySelectorAll('.modal').forEach(modal => {
            const overlay = modal.querySelector('.modal-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => {
                    modal.style.display = 'none';
                    if (modal.id === 'courseModal') {
                        const video = document.getElementById('courseVideo');
                        if (video) {
                            video.pause();
                            video.currentTime = 0;
                        }
                    }
                });
            }
        });

        // Close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    if (modal.id === 'courseModal') {
                        const video = document.getElementById('courseVideo');
                        if (video) {
                            video.pause();
                            video.currentTime = 0;
                        }
                    }
                }
            });
        });

        console.log('✅ Event listeners attached');
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

        coursesGrid.className = this.viewMode === 'grid' ? 'courses-grid' : 'courses-list';

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

        document.getElementById('modalCourseTitle').textContent = course.title;
        document.getElementById('modalInstructor').textContent = course.instructor;
        document.getElementById('modalDuration').textContent = course.duration;
        document.getElementById('modalStudents').textContent = course.students || 0;
        document.getElementById('courseDescription').textContent = course.description || 'Chưa có mô tả';

        if (this.currentLesson && this.currentLesson.videoUrl) {
            this.loadVideo(this.currentLesson);
        } else {
            this.showNoVideo();
        }

        this.renderLessonsList(course);
        modal.style.display = 'flex';
        this.switchTab('lessons');
    }

    loadVideo(lesson) {
        const container = document.querySelector('.video-container');
        if (!container) return;

        // Clean path
        let path = lesson.videoUrl.replace(/^\.\//, '').replace(/\/+/g, '/');
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        
        // ✅ FIX: Encode each path segment to handle Unicode/spaces
        const segments = path.split('/').filter(s => s);
        const encodedPath = '/' + segments.map(seg => encodeURIComponent(seg)).join('/');
        
        console.log('🎬 Loading video:', encodedPath);
        
        container.innerHTML = `
            <div class="video-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Đang tải video...</p>
            </div>`;

        const video = document.createElement('video');
        video.id = 'courseVideo';
        video.controls = true;
        video.preload = 'metadata';
        video.style.width = '100%';
        video.style.backgroundColor = '#000';

        const source = document.createElement('source');
        source.src = encodedPath;
        source.type = 'video/mp4';
        video.appendChild(source);

        video.addEventListener('loadedmetadata', () => {
            console.log('✅ Video loaded successfully');
            container.innerHTML = '';
            container.appendChild(video);
            video.play().catch(err => {
                console.log('⚠️ Autoplay blocked (normal)');
            });
        });

        video.addEventListener('error', (e) => {
            console.error('❌ Video error:', {
                originalPath: lesson.videoUrl,
                encodedPath: encodedPath,
                error: e
            });
            
            container.innerHTML = `
                <div class="video-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Không thể tải video</h3>
                    <p><strong>File:</strong> <code>${lesson.videoUrl}</code></p>
                    <p><strong>Encoded:</strong> <code>${encodedPath}</code></p>
                    <button class="btn-secondary" onclick="courseApp.retryVideo()">
                        <i class="fas fa-redo"></i> Thử lại
                    </button>
                </div>`;
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

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            const btnText = btn.textContent.toLowerCase();
            if ((tabName === 'lessons' && btnText.includes('bài học')) ||
                (tabName === 'info' && btnText.includes('thông tin')) ||
                (tabName === 'slides' && btnText.includes('slides'))) {
                btn.classList.add('active');
            }
        });
        
        const selectedPane = document.getElementById(`tab-${tabName}`);
        if