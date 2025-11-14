// ===================================
//    COURSE APP - MAIN CLASS
// ===================================

class CourseApp {
    constructor() {
        this.courses = [];
        this.currentPage = 1;
        this.coursesPerPage = 6;
        this.currentCourse = null;
        this.currentView = 'grid';
        this.searchQuery = '';
        this.filterStatus = 'all';
        this.filterSort = 'newest';
        this.courseToDelete = null;
        this.pendingAction = null;
        
        this.init();
    }

    init() {
        this.loadCoursesFromStorage();
        
        if (this.courses.length === 0) {
            this.initializeSampleCourses();
            this.saveCoursesToStorage();
        }
        
        this.loadProgress();
        this.renderCourses();
        this.attachEventListeners();
        this.setupUploadForm();
        
        console.log('🚀 CourseApp initialized!');
    }

    loadCoursesFromStorage() {
        const stored = localStorage.getItem('courses');
        if (stored) {
            this.courses = JSON.parse(stored);
            console.log(`📂 Loaded ${this.courses.length} courses from localStorage`);
        }
    }

    initializeSampleCourses() {
        this.courses = [
            {
                id: Date.now() + 1,
                title: 'Giải tích 2',
                instructor: 'Toán & Vật lý ĐH',
                duration: '12 tuần',
                students: 1250,
                progress: 0,
                thumbnail: '📚',
                color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                lessons: [
                    { id: 1, title: 'Bài 1: Giới thiệu', duration: '15:00', completed: false },
                    { id: 2, title: 'Bài 2: Đạo hàm', duration: '20:00', completed: false }
                ]
            },
            {
                id: Date.now() + 2,
                title: 'Giải tích 3',
                instructor: 'Toán cao cấp',
                duration: '14 tuần',
                students: 980,
                progress: 33,
                thumbnail: '📐',
                color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                lessons: [
                    { id: 1, title: 'Bài 1: Tích phân', duration: '25:00', completed: true },
                    { id: 2, title: 'Bài 2: Chuỗi', duration: '30:00', completed: false }
                ]
            },
            {
                id: Date.now() + 3,
                title: 'Vật lý đại cương 2 - Điện từ',
                instructor: 'Vật lý ĐH',
                duration: '16 tuần',
                students: 1500,
                progress: 0,
                thumbnail: '⚡',
                color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                lessons: [
                    { id: 1, title: 'Bài 1: Điện trường', duration: '18:00', completed: false },
                    { id: 2, title: 'Bài 2: Từ trường', duration: '22:00', completed: false }
                ]
            },
            {
                id: Date.now() + 4,
                title: 'Xác suất thống kê 2025',
                instructor: 'Toán ứng dụng',
                duration: '10 tuần',
                students: 2100,
                progress: 0,
                thumbnail: '📊',
                color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                lessons: [
                    { id: 1, title: 'Bài 1: Xác suất', duration: '20:00', completed: false },
                    { id: 2, title: 'Bài 2: Thống kê', duration: '25:00', completed: false }
                ]
            },
            {
                id: Date.now() + 5,
                title: '[HUST] TIN HỌC ĐẠI CƯƠNG',
                instructor: 'CNTT HUST',
                duration: '15 tuần',
                students: 3200,
                progress: 0,
                thumbnail: '💻',
                color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                lessons: [
                    { id: 1, title: 'Bài 1: Lập trình C', duration: '30:00', completed: false },
                    { id: 2, title: 'Bài 2: Cấu trúc dữ liệu', duration: '35:00', completed: false }
                ]
            },
            {
                id: Date.now() + 6,
                title: '[HUST] Giải tích 1 - MT11X',
                instructor: 'Toán HUST',
                duration: '12 tuần',
                students: 2800,
                progress: 0,
                thumbnail: '📈',
                color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                lessons: [
                    { id: 1, title: 'Bài 1: Hàm số', duration: '20:00', completed: false },
                    { id: 2, title: 'Bài 2: Giới hạn', duration: '25:00', completed: false }
                ]
            }
        ];
        
        console.log('✅ Sample courses initialized');
    }

    saveCoursesToStorage() {
        localStorage.setItem('courses', JSON.stringify(this.courses));
        console.log(`💾 ${this.courses.length} courses saved to localStorage`);
    }

    loadProgress() {
        const stored = localStorage.getItem('courseProgress');
        if (stored) {
            const progress = JSON.parse(stored);
            this.courses.forEach(course => {
                if (progress[course.id] !== undefined) {
                    course.progress = progress[course.id];
                }
            });
            console.log('📊 Progress loaded and applied');
        }
    }

    saveProgress() {
        const progress = {};
        this.courses.forEach(course => {
            progress[course.id] = course.progress;
        });
        localStorage.setItem('courseProgress', JSON.stringify(progress));
        console.log('💾 Progress saved');
    }

    renderCourses() {
        const grid = document.getElementById('courseGrid');
        if (!grid) return;

        const filteredCourses = this.getFilteredCourses();
        const startIndex = (this.currentPage - 1) * this.coursesPerPage;
        const endIndex = startIndex + this.coursesPerPage;
        const coursesToShow = filteredCourses.slice(startIndex, endIndex);

        if (coursesToShow.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 64px; color: rgba(255,255,255,0.3); margin-bottom: 20px;"></i>
                    <h3 style="color: rgba(255,255,255,0.7); font-size: 20px;">Không tìm thấy khóa học nào</h3>
                    <p style="color: rgba(255,255,255,0.5);">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
                </div>
            `;
            return;
        }

        grid.className = this.currentView === 'grid' ? 'course-grid' : 'course-list';
        
        grid.innerHTML = coursesToShow.map(course => `
            <div class="course-card" onclick="app.openCourse(${course.id})">
                <button class="btn-delete-course" onclick="event.stopPropagation(); app.confirmDeleteCourse(${course.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
                
                <div class="course-thumbnail" style="background: ${course.color}">
                    <div class="course-icon">${course.thumbnail}</div>
                </div>
                
                <div class="course-body">
                    <h3 class="course-title">${course.title}</h3>
                    
                    <div class="course-instructor">
                        <i class="fas fa-user-graduate"></i>
                        <span>${course.instructor}</span>
                    </div>
                    
                    <div class="course-meta">
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                        <span><i class="fas fa-users"></i> ${course.students.toLocaleString()}</span>
                    </div>
                    
                    <div class="progress-section">
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
                        </div>
                        <div class="progress-text">${course.progress}% hoàn thành</div>
                    </div>
                    
                    <div class="course-actions">
                        <button class="btn-action btn-primary">
                            <i class="fas fa-play"></i>
                            <span>${course.progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}</span>
                        </button>
                        <button class="btn-action btn-secondary" onclick="event.stopPropagation()">
                            <i class="fas fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updatePagination(filteredCourses.length);
        this.updateCourseCount(filteredCourses.length);
        this.updateStats();
        setTimeout(() => this.animateProgressBars(), 100);
    }

    getFilteredCourses() {
        let filtered = [...this.courses];

        if (this.searchQuery) {
            filtered = filtered.filter(c => 
                c.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                c.instructor.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        if (this.filterStatus !== 'all') {
            filtered = filtered.filter(c => {
                if (this.filterStatus === 'completed') return c.progress >= 100;
                if (this.filterStatus === 'in-progress') return c.progress > 0 && c.progress < 100;
                if (this.filterStatus === 'not-started') return c.progress === 0;
                return true;
            });
        }

        filtered.sort((a, b) => {
            switch (this.filterSort) {
                case 'newest': return b.id - a.id;
                case 'oldest': return a.id - b.id;
                case 'name-asc': return a.title.localeCompare(b.title);
                case 'name-desc': return b.title.localeCompare(a.title);
                case 'progress-high': return b.progress - a.progress;
                case 'progress-low': return a.progress - b.progress;
                default: return 0;
            }
        });

        return filtered;
    }

    updateCourseCount(count) {
        const countEl = document.querySelector('.course-count');
        if (countEl) {
            countEl.innerHTML = `
                Tìm thấy <span>${count}</span> khóa học
            `;
        }
    }

    updatePagination(totalCourses) {
        const totalPages = Math.ceil(totalCourses / this.coursesPerPage);
        
        const currentPageEl = document.getElementById('currentPage');
        const totalPagesEl = document.getElementById('totalPages');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (currentPageEl) currentPageEl.textContent = this.currentPage;
        if (totalPagesEl) totalPagesEl.textContent = totalPages;
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;
    }

    goToPage(direction) {
        const totalCourses = this.getFilteredCourses().length;
        const totalPages = Math.ceil(totalCourses / this.coursesPerPage);

        if (direction === 'prev' && this.currentPage > 1) {
            this.currentPage--;
        } else if (direction === 'next' && this.currentPage < totalPages) {
            this.currentPage++;
        }

        this.renderCourses();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    animateProgressBars() {
        document.querySelectorAll('.progress-bar-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 50);
        });
    }

    openCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        this.currentCourse = course;
        console.log('📚 Opening course:', course.title);

        const modal = document.getElementById('courseModal');
        if (!modal) return;

        document.getElementById('modalCourseTitle').textContent = course.title;
        document.getElementById('modalCourseInstructor').textContent = course.instructor;
        document.getElementById('modalCourseDuration').textContent = course.duration;
        document.getElementById('modalCourseStudents').textContent = course.students.toLocaleString();

        const video = document.getElementById('mainVideo');
        if (video) {
            video.pause();
            video.currentTime = 0;
            video.removeAttribute('src');
            video.src = '';
            video.load();
            
            if (window.videoPlayer && !window.videoPlayer.isInitialized) {
                window.videoPlayer.init(video);
            }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        this.renderLessons(course);
        this.updateCourseProgress();
    }

    renderLessons(course) {
        const lessonsList = document.getElementById('lessonsList');
        if (!lessonsList || !course.lessons) return;

        lessonsList.innerHTML = course.lessons.map((lesson, index) => `
            <div class="lesson-item ${lesson.completed ? 'completed' : ''}" onclick="app.playLesson(${lesson.id})">
                <div class="lesson-number">${index + 1}</div>
                <div class="lesson-info">
                    <h4>${lesson.title}</h4>
                    <span>${lesson.duration}</span>
                </div>
                <div class="lesson-status">
                    ${lesson.completed ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-play-circle"></i>'}
                </div>
            </div>
        `).join('');
    }

    playLesson(lessonId) {
        console.log('▶️ Playing lesson:', lessonId);
        this.showNotification('📺 Đang phát bài học...', 'success');
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.remove('active'));
        document.body.style.overflow = '';
        
        const video = document.getElementById('mainVideo');
        if (video) {
            video.pause();
        }
        
        console.log('✅ Modal closed');
    }

    updateCourseProgress() {
        const progressBar = document.getElementById('modalProgressBar');
        const progressText = document.getElementById('modalProgressText');
        
        if (progressBar && this.currentCourse) {
            progressBar.style.width = `${this.currentCourse.progress}%`;
        }
        if (progressText && this.currentCourse) {
            progressText.textContent = `${this.currentCourse.progress}% hoàn thành`;
        }
    }

    confirmDeleteCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        this.courseToDelete = course;
        this.pendingAction = 'delete';
        
        console.log('🔐 Confirming delete for:', course.title);
        
        this.showAdminPasswordModal(
            '🗑️ Xóa khóa học',
            `Nhập mật khẩu admin để xóa khóa học "${course.title}"`
        );
    }

    showAdminPasswordModal(title, subtitle) {
        let passwordModal = document.getElementById('adminPasswordModal');
        
        if (!passwordModal) {
            passwordModal = document.createElement('div');
            passwordModal.id = 'adminPasswordModal';
            passwordModal.className = 'admin-password-modal';
            passwordModal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <div class="admin-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h2 class="admin-title" id="adminModalTitle">Xác thực Admin</h2>
                    <p class="admin-subtitle" id="adminModalSubtitle">Nhập mật khẩu để tiếp tục</p>
                    
                    <div class="password-error" id="passwordError">
                        <i class="fas fa-exclamation-circle"></i>
                        <span>Mật khẩu không đúng! Vui lòng thử lại.</span>
                    </div>
                    
                    <div class="password-success" id="passwordSuccess">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    
                    <div class="password-input-group">
                        <input 
                            type="password" 
                            id="adminPasswordInput" 
                            placeholder="Nhập mật khẩu admin"
                            maxlength="10"
                            autocomplete="off"
                        >
                        <button class="toggle-password-btn" onclick="app.togglePasswordVisibility()">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    
                    <div class="admin-actions">
                        <button class="btn-admin-cancel" onclick="app.closeAdminPasswordModal()">
                            <i class="fas fa-times"></i> Hủy
                        </button>
                        <button class="btn-admin-submit" onclick="app.verifyAdminPassword()">
                            <i class="fas fa-unlock"></i> Xác nhận
                        </button>
                    </div>
                    
                    <div class="admin-hint">
                        <i class="fas fa-info-circle"></i>
                        Chỉ admin mới có thể tạo hoặc xóa khóa học
                    </div>
                </div>
            `;
            
            document.body.appendChild(passwordModal);

            const passwordInput = passwordModal.querySelector('#adminPasswordInput');
            const overlay = passwordModal.querySelector('.modal-overlay');

            if (passwordInput) {
                passwordInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.verifyAdminPassword();
                });
            }

            if (overlay) {
                overlay.addEventListener('click', () => this.closeAdminPasswordModal());
            }
        }

        const titleElement = document.getElementById('adminModalTitle');
        const subtitleElement = document.getElementById('adminModalSubtitle');
        const inputElement = document.getElementById('adminPasswordInput');
        const errorElement = document.getElementById('passwordError');
        const successElement = document.getElementById('passwordSuccess');

        if (titleElement) titleElement.textContent = title;
        if (subtitleElement) subtitleElement.textContent = subtitle;
        if (inputElement) inputElement.value = '';
        if (errorElement) errorElement.classList.remove('active');
        if (successElement) successElement.classList.remove('active');

        passwordModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            if (inputElement) inputElement.focus();
        }, 200);
    }

    closeAdminPasswordModal() {
        const passwordModal = document.getElementById('adminPasswordModal');
        if (passwordModal) {
            passwordModal.classList.remove('active');
        }
        
        document.body.style.overflow = '';
        this.pendingAction = null;
        this.courseToDelete = null;
    }

    togglePasswordVisibility() {
        const input = document.getElementById('adminPasswordInput');
        const icon = document.querySelector('.toggle-password-btn i');
        
        if (input && icon) {
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        }
    }

    verifyAdminPassword() {
        const input = document.getElementById('adminPasswordInput');
        const errorElement = document.getElementById('passwordError');
        const successElement = document.getElementById('passwordSuccess');
        
        if (!input) return;

        const password = input.value;
        const correctPassword = '1000';

        if (password === correctPassword) {
            console.log('✅ Xác thực thành công!');
            
            if (errorElement) errorElement.classList.remove('active');
            if (successElement) successElement.classList.add('active');

            setTimeout(() => {
                this.closeAdminPasswordModal();
                
                if (this.pendingAction === 'delete') {
                    this.proceedDeleteCourse();
                } else if (this.pendingAction === 'upload') {
                    this.proceedOpenUploadModal();
                }
            }, 800);
        } else {
            console.log('❌ Mật khẩu không đúng');
            
            if (errorElement) {
                errorElement.classList.add('active');
                setTimeout(() => errorElement.classList.remove('active'), 3000);
            }
            
            input.value = '';
            input.focus();
        }
    }

    proceedDeleteCourse() {
        if (!this.courseToDelete) return;

        let confirmModal = document.getElementById('confirmDeleteModal');
        
        if (!confirmModal) {
            confirmModal = document.createElement('div');
            confirmModal.id = 'confirmDeleteModal';
            confirmModal.className = 'confirm-modal';
            confirmModal.innerHTML = `
                <div class="modal-overlay" onclick="app.cancelDelete()"></div>
                <div class="modal-container">
                    <div class="confirm-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2 class="confirm-title">⚠️ Xác nhận xóa khóa học?</h2>
                    <p class="confirm-message">
                        Hành động này không thể hoàn tác. Tất cả dữ liệu và tiến độ học tập sẽ bị xóa vĩnh viễn.
                    </p>
                    <div class="confirm-course-name" id="confirmCourseName"></div>
                    <div class="confirm-actions">
                        <button class="btn-cancel-delete" onclick="app.cancelDelete()">
                            <i class="fas fa-times"></i> Hủy bỏ
                        </button>
                        <button class="btn-confirm-delete" onclick="app.deleteCourse()">
                            <i class="fas fa-trash-alt"></i> Xóa khóa học
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(confirmModal);
        }

        const courseNameElement = document.getElementById('confirmCourseName');
        if (courseNameElement) {
            courseNameElement.textContent = `"${this.courseToDelete.title}"`;
        }

        confirmModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    cancelDelete() {
        const confirmModal = document.getElementById('confirmDeleteModal');
        if (confirmModal) {
            confirmModal.classList.remove('active');
        }
        
        document.body.style.overflow = '';
        this.courseToDelete = null;
        this.pendingAction = null;
    }

    deleteCourse() {
        if (!this.courseToDelete) return;

        const courseId = this.courseToDelete.id;
        const courseName = this.courseToDelete.title;

        const courseCards = document.querySelectorAll('.course-card');
        const filteredCourses = this.getFilteredCourses();
        const startIndex = (this.currentPage - 1) * this.coursesPerPage;
        const endIndex = startIndex + this.coursesPerPage;
        const coursesToShow = filteredCourses.slice(startIndex, endIndex);
        
        const cardIndex = coursesToShow.findIndex(c => c.id === courseId);

        if (cardIndex >= 0 && courseCards[cardIndex]) {
            courseCards[cardIndex].classList.add('deleting');
        }

        setTimeout(() => {
            const index = this.courses.findIndex(c => c.id === courseId);
            
            if (index !== -1) {
                this.courses.splice(index, 1);
            }

            this.saveCoursesToStorage();
            this.saveProgress();
            this.cancelDelete();
            this.renderCourses();
            this.showNotification(`🗑️ Đã xóa "${courseName}"`, 'success');
        }, 500);
    }

    openUploadModal() {
        this.pendingAction = 'upload';
        this.showAdminPasswordModal(
            '➕ Thêm khóa học',
            'Nhập mật khẩu admin để thêm khóa học mới'
        );
    }

    proceedOpenUploadModal() {
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    searchCourses() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            this.searchQuery = searchInput.value;
            this.currentPage = 1;
            this.renderCourses();
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    attachEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.currentPage = 1;
                this.renderCourses();
            });
        }

        const filterStatus = document.getElementById('filterStatus');
        if (filterStatus) {
            filterStatus.addEventListener('change', (e) => {
                this.filterStatus = e.target.value;
                this.currentPage = 1;
                this.renderCourses();
            });
        }

        const filterSort = document.getElementById('filterSort');
        if (filterSort) {
            filterSort.addEventListener('change', (e) => {
                this.filterSort = e.target.value;
                this.currentPage = 1;
                this.renderCourses();
            });
        }

        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.goToPage('prev'));
        }

        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.goToPage('next'));
        }

        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                this.renderCourses();
            });
        });

        const modalOverlays = document.querySelectorAll('.modal-overlay');
        modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', () => this.closeModal());
        });

        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const targetTab = document.getElementById(`tab-${tabId}`);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });

        console.log('✅ Event listeners attached');
    }

    setupUploadForm() {
        const form = document.getElementById('uploadForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUpload();
        });

        this.setupFileUpload();
    }

    setupFileUpload() {
        const videoUpload = document.getElementById('videoUpload');
        const videoFile = document.getElementById('videoFile');
        
        if (videoUpload && videoFile) {
            videoUpload.addEventListener('click', () => videoFile.click());
            videoFile.addEventListener('change', () => this.displayFiles('video'));
        }

        const slideUpload = document.getElementById('slideUpload');
        const slideFiles = document.getElementById('slideFiles');
        
        if (slideUpload && slideFiles) {
            slideUpload.addEventListener('click', () => slideFiles.click());
            slideFiles.addEventListener('change', () => this.displayFiles('slide'));
        }
    }

    displayFiles(type) {
        const input = document.getElementById(type === 'video' ? 'videoFile' : 'slideFiles');
        const listContainer = document.getElementById(type === 'video' ? 'videoFileList' : 'slideFileList');
        
        if (!input || !listContainer) return;

        const files = Array.from(input.files);
        
        listContainer.innerHTML = files.map(file => `
            <div class="file-item">
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <span>${this.formatFileSize(file.size)}</span>
            </div>
        `).join('');
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    handleUpload() {
        const courseName = document.getElementById('courseName').value;
        const instructorName = document.getElementById('instructorName').value;
        const courseDuration = document.getElementById('courseDuration').value;
        const studentCount = document.getElementById('studentCount').value;

        const newCourse = {
            id: Date.now(),
            title: courseName,
            instructor: instructorName,
            duration: courseDuration,
            students: parseInt(studentCount) || 0,
            progress: 0,
            thumbnail: '📚',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            lessons: [
                { id: 1, title: 'Bài 1: Giới thiệu', duration: '15:00', completed: false }
            ]
        };

        this.courses.unshift(newCourse);
        this.saveCoursesToStorage();
        this.renderCourses();
        this.closeModal();
        this.showNotification('✅ Đã thêm khóa học mới!', 'success');

        document.getElementById('uploadForm').reset();
        document.getElementById('videoFileList').innerHTML = '';
        document.getElementById('slideFileList').innerHTML = '';
    }

    resetToSampleCourses() {
        if (confirm('⚠️ Bạn có chắc muốn xóa tất cả khóa học và khôi phục dữ liệu mẫu?')) {
            localStorage.removeItem('courses');
            localStorage.removeItem('courseProgress');
            
            this.courses = [];
            this.initializeSampleCourses();
            this.saveCoursesToStorage();
            this.saveProgress();
            this.renderCourses();
            
            this.showNotification('✅ Đã khôi phục dữ liệu mẫu!', 'success');
        }
    }

    updateStats() {
        const total = this.courses.length;
        const completed = this.courses.filter(c => c.progress >= 100).length;
        const inProgress = this.courses.filter(c => c.progress > 0 && c.progress < 100).length;
        const notStarted = this.courses.filter(c => c.progress === 0).length;

        const totalEl = document.getElementById('totalCourses');
        const completedEl = document.getElementById('completedCourses');
        const inProgressEl = document.getElementById('inProgressCourses');
        const notStartedEl = document.getElementById('notStartedCourses');

        if (totalEl) totalEl.textContent = total;
        if (completedEl) completedEl.textContent = completed;
        if (inProgressEl) inProgressEl.textContent = inProgress;
        if (notStartedEl) notStartedEl.textContent = notStarted;
    }
}

// ===================================
//    INITIALIZE APP
// ===================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new CourseApp();
        console.log('✅ App initialized on DOMContentLoaded');
    });
} else {
    window.app = new CourseApp();
    console.log('✅ App initialized immediately');
}