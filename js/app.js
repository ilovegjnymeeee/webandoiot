class CourseApp {
    constructor() {
        this.courses = [];
        this.currentPage = 1;
        this.coursesPerPage = 6;
        this.currentCourse = null;
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.videoPlayer = null;
        this.slideViewer = null;
        this.courseToDelete = null;
        this.adminPassword = '1000';
        this.pendingAction = null;
        this.init();
    }

    init() {
        this.loadCoursesFromStorage();
        this.renderCourses();
        this.attachEventListeners();
        console.log('🚀 CourseApp initialized!');
    }

    loadCoursesFromStorage() {
        const savedCourses = localStorage.getItem('appCourses');
        
        if (savedCourses) {
            try {
                this.courses = JSON.parse(savedCourses);
                console.log(`📂 Loaded ${this.courses.length} courses from localStorage`);
                this.loadProgress();
            } catch (e) {
                console.error('❌ Error loading courses:', e);
                this.initializeSampleCourses();
            }
        } else {
            console.log('🆕 First time, creating sample courses...');
            this.initializeSampleCourses();
        }
    }

    initializeSampleCourses() {
        this.courses = [
            {
                id: Date.now() + 1,
                title: 'Giải tích 2',
                instructor: 'Toán & Vật lý ĐH',
                progress: 0,
                thumbnail: '📚',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                description: 'Khóa học về tích phân và ứng dụng trong thực tế. Học cách tính tích phân xác định, bất định và ứng dụng vào giải quyết các bài toán thực tiễn.',
                category: 'Toán học',
                duration: '12 tuần',
                students: 1250,
                rating: 4.8,
                lessons: [
                    { 
                        title: 'Bài 1: Giới thiệu tích phân', 
                        duration: '15:30', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        description: 'Tổng quan về tích phân và ý nghĩa hình học'
                    },
                    { 
                        title: 'Bài 2: Tích phân xác định', 
                        duration: '22:45', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        description: 'Phương pháp tính tích phân xác định'
                    },
                    { 
                        title: 'Bài 3: Ứng dụng tích phân', 
                        duration: '18:20', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        description: 'Ứng dụng tích phân trong tính diện tích, thể tích'
                    }
                ],
                resources: [
                    { name: 'Slide bài giảng.pdf', size: '2.5 MB', type: 'pdf' },
                    { name: 'Bài tập thực hành.docx', size: '1.2 MB', type: 'doc' }
                ]
            },
            {
                id: Date.now() + 2,
                title: 'Giải tích 3',
                instructor: 'Toán cao cấp',
                progress: 0,
                thumbnail: '📐',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                description: 'Tích phân bội, tích phân đường và tích phân mặt. Nắm vững các phương pháp tính toán tích phân đa biến.',
                category: 'Toán học',
                duration: '14 tuần',
                students: 980,
                rating: 4.7,
                lessons: [
                    { 
                        title: 'Bài 1: Tích phân bội', 
                        duration: '20:15', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        description: 'Tích phân kép và tích phân bội ba'
                    },
                    { 
                        title: 'Bài 2: Tích phân đường', 
                        duration: '25:30', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                        description: 'Tích phân đường loại 1 và loại 2'
                    }
                ],
                resources: [
                    { name: 'Công thức tổng hợp.pdf', size: '1.8 MB', type: 'pdf' }
                ]
            },
            {
                id: Date.now() + 3,
                title: 'Vật lý đại cương 2 - Điện từ',
                instructor: 'Vật lý ĐH',
                progress: 0,
                thumbnail: '⚡',
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                description: 'Điện trường, từ trường và sóng điện từ. Nghiên cứu các hiện tượng điện từ và ứng dụng trong đời sống.',
                category: 'Vật lý',
                duration: '16 tuần',
                students: 1520,
                rating: 4.9,
                lessons: [
                    { 
                        title: 'Bài 1: Điện trường', 
                        duration: '30:00', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        description: 'Khái niệm điện trường, cường độ điện trường'
                    },
                    { 
                        title: 'Bài 2: Từ trường', 
                        duration: '28:15', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
                        description: 'Lực từ, cảm ứng từ và định luật Ampere'
                    }
                ],
                resources: [
                    { name: 'Thí nghiệm điện từ.pdf', size: '3.2 MB', type: 'pdf' },
                    { name: 'Video thí nghiệm.mp4', size: '45 MB', type: 'video' }
                ]
            },
            {
                id: Date.now() + 4,
                title: 'Xác suất thống kê 2025',
                instructor: 'Toán ứng dụng',
                progress: 0,
                thumbnail: '📊',
                gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                description: 'Biến cố ngẫu nhiên, phân phối xác suất và thống kê mô tả. Ứng dụng trong phân tích dữ liệu.',
                category: 'Toán học',
                duration: '10 tuần',
                students: 2100,
                rating: 4.6,
                lessons: [
                    { 
                        title: 'Bài 1: Biến cố và xác suất', 
                        duration: '22:00', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                        description: 'Không gian mẫu, biến cố và tính xác suất'
                    },
                    { 
                        title: 'Bài 2: Phân phối xác suất', 
                        duration: '26:30', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
                        description: 'Các loại phân phối xác suất thường gặp'
                    }
                ],
                resources: [
                    { name: 'Bảng phân phối.pdf', size: '800 KB', type: 'pdf' }
                ]
            },
            {
                id: Date.now() + 5,
                title: '[HUST] TIN HỌC ĐẠI CƯƠNG',
                instructor: 'CNTT HUST',
                progress: 0,
                thumbnail: '💻',
                gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                description: 'Lập trình C/C++ và cấu trúc dữ liệu cơ bản. Nền tảng lập trình cho sinh viên kỹ thuật.',
                category: 'Lập trình',
                duration: '15 tuần',
                students: 3200,
                rating: 4.8,
                lessons: [
                    { 
                        title: 'Bài 1: Giới thiệu lập trình', 
                        duration: '18:45', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                        description: 'Cú pháp cơ bản của C/C++'
                    },
                    { 
                        title: 'Bài 2: Cấu trúc dữ liệu', 
                        duration: '32:15', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
                        description: 'Mảng, danh sách liên kết, stack, queue'
                    }
                ],
                resources: [
                    { name: 'Code mẫu.zip', size: '5 MB', type: 'zip' },
                    { name: 'Đề thi giữa kỳ.pdf', size: '1.5 MB', type: 'pdf' }
                ]
            },
            {
                id: Date.now() + 6,
                title: '[HUST] Giải tích 1 - MT11X',
                instructor: 'Toán HUST',
                progress: 0,
                thumbnail: '📈',
                gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                description: 'Giới hạn, liên tục và đạo hàm. Khóa học toán cao cấp 1 dành cho sinh viên kỹ thuật.',
                category: 'Toán học',
                duration: '12 tuần',
                students: 2800,
                rating: 4.7,
                lessons: [
                    { 
                        title: 'Bài 1: Giới hạn dãy số', 
                        duration: '24:00', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
                        description: 'Định nghĩa và tính chất giới hạn'
                    },
                    { 
                        title: 'Bài 2: Đạo hàm', 
                        duration: '28:30', 
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
                        description: 'Quy tắc tính đạo hàm và ứng dụng'
                    }
                ],
                resources: [
                    { name: 'Bài giảng đầy đủ.pdf', size: '12 MB', type: 'pdf' },
                    { name: 'Bài tập lớn.docx', size: '2 MB', type: 'doc' }
                ]
            }
        ];

        this.saveCoursesToStorage();
        console.log('✅ Sample courses created and saved!');
    }

    saveCoursesToStorage() {
        try {
            localStorage.setItem('appCourses', JSON.stringify(this.courses));
            console.log(`💾 ${this.courses.length} courses saved to localStorage`);
        } catch (e) {
            console.error('❌ Error saving courses:', e);
        }
    }

    loadProgress() {
        const saved = localStorage.getItem('courseProgress');
        if (saved) {
            try {
                const progressData = JSON.parse(saved);
                progressData.forEach(p => {
                    const course = this.courses.find(c => c.id === p.id);
                    if (course) {
                        course.progress = p.progress || 0;
                        course.currentLessonIndex = p.lastWatched || 0;
                    }
                });
                console.log('📊 Progress loaded and applied');
            } catch (e) {
                console.error('❌ Error loading progress:', e);
            }
        }
    }

    saveProgress() {
        const progressData = this.courses.map(c => ({ 
            id: c.id, 
            progress: c.progress || 0,
            lastWatched: c.currentLessonIndex || 0
        }));
        localStorage.setItem('courseProgress', JSON.stringify(progressData));
        console.log('💾 Progress saved');
    }

    renderCourses() {
        const grid = document.getElementById('courseGrid');
        if (!grid) {
            console.warn('⚠️ courseGrid not found');
            return;
        }

        const filteredCourses = this.getFilteredCourses();
        const startIndex = (this.currentPage - 1) * this.coursesPerPage;
        const endIndex = startIndex + this.coursesPerPage;
        const coursesToShow = filteredCourses.slice(startIndex, endIndex);

        if (coursesToShow.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: rgba(255,255,255,0.5);">
                    <i class="fas fa-inbox" style="font-size: 80px; margin-bottom: 20px; display: block;"></i>
                    <h3>Không tìm thấy khóa học nào</h3>
                    <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = coursesToShow.map(course => `
            <div class="course-card" onclick="app.openCourse(${course.id})">
                <button class="btn-delete-course" onclick="event.stopPropagation(); app.confirmDeleteCourse(${course.id})" title="Xóa khóa học">
                    <i class="fas fa-trash-alt"></i>
                </button>
                
                <div class="course-thumbnail" style="background: ${course.gradient}">
                    <div class="course-icon">${course.thumbnail}</div>
                </div>
                
                <div class="course-body">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-instructor">
                        <i class="fas fa-user-graduate"></i> ${course.instructor}
                    </p>
                    
                    <div class="course-meta">
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                        <span><i class="fas fa-users"></i> ${course.students.toLocaleString()}</span>
                    </div>
                    
                    <div class="progress-section">
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: 0%" data-width="${course.progress}%"></div>
                        </div>
                        <p class="progress-text">${course.progress > 0 ? course.progress.toFixed(1) + '%' : '⏸️ Chưa học'}</p>
                    </div>
                    
                    <div class="course-actions">
                        <button class="btn-action btn-primary" onclick="event.stopPropagation(); app.openCourse(${course.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <span>Vào học</span>
                        </button>
                        <button class="btn-action btn-secondary" onclick="event.stopPropagation(); app.openCourse(${course.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <span>Chi tiết</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updatePagination(filteredCourses.length);
        this.updateCourseCount(filteredCourses.length);
        setTimeout(() => this.animateProgressBars(), 100);
    }

    getFilteredCourses() {
        let filtered = [...this.courses];

        switch(this.currentFilter) {
            case 'learning':
                filtered = filtered.filter(c => c.progress > 0 && c.progress < 100);
                break;
            case 'completed':
                filtered = filtered.filter(c => c.progress === 100);
                break;
            case 'notstarted':
                filtered = filtered.filter(c => c.progress === 0);
                break;
        }

        switch(this.currentSort) {
            case 'oldest':
                filtered.reverse();
                break;
            case 'name':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'progress':
                filtered.sort((a, b) => b.progress - a.progress);
                break;
        }

        return filtered;
    }

    updateCourseCount(count) {
        const countElement = document.getElementById('courseCount');
        if (countElement) {
            countElement.textContent = `(${count} khóa học)`;
        }
    }

    updatePagination(totalCourses) {
        const totalPages = Math.ceil(totalCourses / this.coursesPerPage);
        const paginationNumbers = document.getElementById('paginationNumbers');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (paginationNumbers) {
            let pagesHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                pagesHTML += `<span class="page-number ${i === this.currentPage ? 'active' : ''}" onclick="app.goToPage(${i})">${i}</span>`;
            }
            paginationNumbers.innerHTML = pagesHTML;
        }

        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderCourses();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    animateProgressBars() {
        document.querySelectorAll('.progress-bar-fill').forEach(bar => {
            const targetWidth = bar.dataset.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
        });
    }

    openCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) {
            console.error('❌ Course not found:', courseId);
            return;
        }

        this.currentCourse = course;
        console.log('📚 Opening course:', course.title);

        const modal = document.getElementById('courseModal');
        if (!modal) {
            console.error('❌ Course modal not found');
            return;
        }

        // Update modal content
        document.getElementById('modalCourseTitle').textContent = course.title;
        document.getElementById('modalCourseInstructor').textContent = course.instructor;
        document.getElementById('modalCourseDuration').textContent = course.duration;
        document.getElementById('modalCourseStudents').textContent = course.students.toLocaleString();

        // ✅ FIX: Handle video properly
        const video = document.getElementById('mainVideo');
        if (video) {
            // Stop any playing video first
            video.pause();
            video.currentTime = 0;
            
            // Remove old source
            video.removeAttribute('src');
            while (video.firstChild) {
                video.removeChild(video.firstChild);
            }

            // Add demo source (or real source if available)
            if (course.videoUrl) {
                video.src = course.videoUrl;
            } else {
                // Demo video - will trigger error but that's OK
                video.src = '';
            }

            // Initialize video player
            if (window.videoPlayer && !window.videoPlayer.isInitialized) {
                window.videoPlayer.init(video);
            }

            // Load video
            video.load();
            
            console.log('🎥 Video loaded');
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        this.renderLessons(course);
        this.updateCourseProgress();
    }

    renderLessons(course) {
        const lessonList = document.getElementById('lessonList');
        if (!lessonList) return;

        if (course.lessons && course.lessons.length > 0) {
            lessonList.innerHTML = course.lessons.map((lesson, index) => `
                <div class="lesson-item" onclick="app.playLesson(${index})">
                    <div class="lesson-icon">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="lesson-info">
                        <h4>${lesson.title}</h4>
                        <p><i class="fas fa-clock"></i> ${lesson.duration} • ${lesson.description}</p>
                    </div>
                </div>
            `).join('');

            this.playLesson(0);
        } else {
            lessonList.innerHTML = '<p style="text-align:center;padding:40px;color:rgba(255,255,255,0.5);">Chưa có bài học nào</p>';
        }
    }

    updateCourseProgress() {
        const progressElement = document.getElementById('courseProgress');
        if (!progressElement || !this.currentCourse) return;

        const { progress } = this.currentCourse;
        progressElement.style.width = `${progress}%`;
        progressElement.setAttribute('aria-valuenow', progress);

        const progressText = document.getElementById('courseProgressText');
        if (progressText) {
            progressText.textContent = progress > 0 ? `${progress.toFixed(1)}%` : '⏸️ Chưa học';
        }
    }

    playLesson(lessonIndex) {
        if (!this.currentCourse || !this.currentCourse.lessons) return;

        const lesson = this.currentCourse.lessons[lessonIndex];
        const video = document.getElementById('mainVideo');
        const videoTitle = document.getElementById('videoTitle');

        if (!video) {
            console.warn('⚠️ Video element not found');
            return;
        }

        if (lesson && lesson.videoUrl) {
            video.src = lesson.videoUrl;
            video.load();
            video.play().catch(err => {
                console.error('Video play error:', err);
                this.showNotification('⚠️ Không thể phát video', 'warning');
            });
            
            if (videoTitle) {
                videoTitle.textContent = lesson.title;
            }

            document.querySelectorAll('.lesson-item').forEach((item, idx) => {
                item.classList.toggle('active', idx === lessonIndex);
            });

            this.currentCourse.currentLessonIndex = lessonIndex;
        } else {
            this.showNotification('⚠️ Video chưa có sẵn', 'warning');
        }
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';

        const video = document.getElementById('mainVideo');
        if (video) {
            video.pause();
            video.src = '';
        }

        this.saveProgress();
        this.saveCoursesToStorage();
    }

    confirmDeleteCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        this.courseToDelete = course;
        this.pendingAction = 'delete';
        this.showAdminPasswordModal('Xóa khóa học', 'Nhập mật khẩu admin để xóa khóa học này');
    }

    openUploadModal() {
        this.pendingAction = 'upload';
        this.showAdminPasswordModal('Tạo khóa học mới', 'Nhập mật khẩu admin để tạo khóa học');
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
            
            // ✅ THÊM VÀO BODY NGAY LẬP TỨC
            document.body.appendChild(passwordModal);
            console.log('✅ Admin password modal created');

            // Event listeners
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

        // ✅ HIỆN MODAL VÀ LOCK BODY
        passwordModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        console.log('✅ Admin password modal shown');

        // Focus vào input
        setTimeout(() => {
            if (inputElement) inputElement.focus();
        }, 200);
    }

    closeAdminPasswordModal() {
        const passwordModal = document.getElementById('adminPasswordModal');
        if (passwordModal) {
            passwordModal.classList.remove('active');
        }
        
        // ✅ UNLOCK BODY
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        this.pendingAction = null;
        this.courseToDelete = null;
        
        console.log('✅ Admin password modal closed');
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
        const password = input ? input.value.trim() : '';
        const errorDiv = document.getElementById('passwordError');
        const successDiv = document.getElementById('passwordSuccess');
        const submitBtn = document.querySelector('.btn-admin-submit');

        if (!password) {
            if (input) input.focus();
            return;
        }

        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        setTimeout(() => {
            if (password === this.adminPassword) {
                if (errorDiv) errorDiv.classList.remove('active');
                if (successDiv) successDiv.classList.add('active');
                
                this.showNotification('✅ Xác thực thành công!', 'success');

                setTimeout(() => {
                    this.closeAdminPasswordModal();
                    
                    // ✅ FIX: Gọi đúng hàm theo pendingAction
                    if (this.pendingAction === 'delete' && this.courseToDelete) {
                        console.log('🗑️ Proceeding to delete:', this.courseToDelete.title);
                        this.proceedDeleteCourse();
                    } else if (this.pendingAction === 'upload') {
                        console.log('📤 Proceeding to upload');
                        this.proceedOpenUploadModal();
                    }
                    
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                }, 800);
            } else {
                if (errorDiv) errorDiv.classList.add('active');
                if (input) {
                    input.value = '';
                    input.focus();
                    input.style.animation = 'none';
                    setTimeout(() => {
                        input.style.animation = 'shake 0.5s ease';
                    }, 10);
                }

                this.showNotification('❌ Mật khẩu không đúng!', 'error');
                
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }
        }, 500);
    }

    proceedDeleteCourse() {
        console.log('🔵 proceedDeleteCourse called');
        console.log('🔵 courseToDelete:', this.courseToDelete);
        
        if (!this.courseToDelete) {
            console.error('❌ No course to delete in proceedDeleteCourse');
            this.showNotification('⚠️ Lỗi: Không tìm thấy khóa học', 'error');
            return;
        }

        console.log('⚠️ Showing final confirmation for:', this.courseToDelete.title);

        let confirmModal = document.getElementById('confirmDeleteModal');
        
        if (!confirmModal) {
            console.log('🆕 Creating confirm modal...');
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
            console.log('✅ Confirm modal created and added to DOM');
        }

        const courseNameElement = document.getElementById('confirmCourseName');
        if (courseNameElement) {
            courseNameElement.textContent = `"${this.courseToDelete.title}"`;
            console.log('✅ Course name set:', this.courseToDelete.title);
        }

        confirmModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Confirm modal shown');
    }

    proceedOpenUploadModal() {
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    cancelDelete() {
        const confirmModal = document.getElementById('confirmDeleteModal');
        if (confirmModal) {
            confirmModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        this.courseToDelete = null;
    }

    deleteCourse() {
        console.log('🔴 deleteCourse called');
        console.log('🔴 courseToDelete:', this.courseToDelete);
        
        if (!this.courseToDelete) {
            console.error('❌ No course to delete');
            this.showNotification('⚠️ Không tìm thấy khóa học cần xóa', 'warning');
            this.cancelDelete();
            return;
        }

        const courseId = this.courseToDelete.id;
        const courseName = this.courseToDelete.title;

        console.log(`🗑️ Deleting course: ${courseName} (ID: ${courseId})`);

        // Animate card
        const courseCards = document.querySelectorAll('.course-card');
        const filteredCourses = this.getFilteredCourses();
        const startIndex = (this.currentPage - 1) * this.coursesPerPage;
        const endIndex = startIndex + this.coursesPerPage;
        const coursesToShow = filteredCourses.slice(startIndex, endIndex);
        
        const cardIndex = coursesToShow.findIndex(c => c.id === courseId);
        console.log('📍 Card index:', cardIndex);

        if (cardIndex >= 0 && courseCards[cardIndex]) {
            courseCards[cardIndex].classList.add('deleting');
            console.log('✅ Card animation started');
        }

        setTimeout(() => {
            // XÓA KHỎI ARRAY
            const index = this.courses.findIndex(c => c.id === courseId);
            console.log('📍 Array index:', index);
            
            if (index !== -1) {
                this.courses.splice(index, 1);
                console.log(`✅ Course removed. Remaining: ${this.courses.length}`);
            } else {
                console.error('❌ Course not found in array');
            }

            // LƯU VÀO LOCALSTORAGE
            this.saveCoursesToStorage();
            this.saveProgress();

            // ĐÓNG MODAL
            this.cancelDelete();

            // RE-RENDER
            this.renderCourses();

            // THÔNG BÁO
            this.showNotification(`🗑️ Đã xóa "${courseName}"`, 'success');
            
            console.log(`📊 Final count: ${this.courses.length}`);
        }, 500);
    }

    searchCourses() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        const query = searchInput.value.toLowerCase().trim();

        if (!query) {
            this.renderCourses();
            return;
        }

        const originalCourses = [...this.courses];
        const filtered = originalCourses.filter(course => 
            course.title.toLowerCase().includes(query) ||
            course.instructor.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.category.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            const grid = document.getElementById('courseGrid');
            if (grid) {
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: rgba(255,255,255,0.5);">
                        <i class="fas fa-search" style="font-size: 80px; margin-bottom: 20px; display: block;"></i>
                        <h3>Không tìm thấy "${query}"</h3>
                        <p>Thử từ khóa khác hoặc xóa bộ lọc</p>
                    </div>
                `;
            }
            return;
        }

        const temp = this.courses;
        this.courses = filtered;
        this.currentPage = 1;
        this.renderCourses();
        this.courses = temp;

        this.showNotification(`✅ Tìm thấy ${filtered.length} khóa học`, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            padding: 20px 30px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 
                         type === 'warning' ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' : 
                         type === 'error' ? 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' :
                         'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
            color: white;
            border-radius: 15px;
            font-weight: 600;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 400px;
            font-size: 16px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    attachEventListeners() {
        // ✅ DELAY để đảm bảo DOM đã load xong
        setTimeout(() => {
            // Modal close buttons
            const modalCloseButtons = document.querySelectorAll('.modal-close');
            modalCloseButtons.forEach(btn => {
                btn.addEventListener('click', () => this.closeModal());
            });

            // Modal overlays  
            const modalOverlays = document.querySelectorAll('.modal-overlay');
            modalOverlays.forEach(overlay => {
                overlay.addEventListener('click', () => this.closeModal());
            });

            // ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeModal();
            });

            // Filter status
            const filterStatus = document.getElementById('filterStatus');
            if (filterStatus) {
                filterStatus.addEventListener('change', (e) => {
                    this.currentFilter = e.target.value;
                    this.currentPage = 1;
                    this.renderCourses();
                });
            }

            // Filter sort
            const filterSort = document.getElementById('filterSort');
            if (filterSort) {
                filterSort.addEventListener('change', (e) => {
                    this.currentSort = e.target.value;
                    this.currentPage = 1;
                    this.renderCourses();
                });
            }

            // Search input
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.searchCourses();
                });
            }

            // View buttons
            const viewButtons = document.querySelectorAll('.view-btn');
            viewButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    
                    const view = e.currentTarget.dataset.view;
                    const grid = document.getElementById('courseGrid');
                    if (grid) {
                        grid.className = view === 'list' ? 'course-list' : 'course-grid';
                    }
                });
            });

            // Pagination buttons
            const prevBtn = document.getElementById('prevBtn');
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
                });
            }

            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const totalPages = Math.ceil(this.getFilteredCourses().length / this.coursesPerPage);
                    if (this.currentPage < totalPages) this.goToPage(this.currentPage + 1);
                });
            }

            // Tab buttons
            const tabButtons = document.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tabName = e.currentTarget.dataset.tab;
                    
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    
                    e.currentTarget.classList.add('active');
                    
                    const content = document.getElementById(`tab-${tabName}`);
                    if content) content.classList.add('active');
                });
            });

            // Upload form
            this.setupUploadForm();

            // Video progress tracking
            const video = document.getElementById('mainVideo');
            if (video) {
                video.addEventListener('timeupdate', () => {
                    if (this.currentCourse && video.duration) {
                        const progress = (video.currentTime / video.duration) * 100;
                        this.currentCourse.progress = Math.min(Math.max(this.currentCourse.progress, progress), 100);
                    }
                });

                video.addEventListener('ended', () => {
                    this.showNotification('✅ Đã hoàn thành bài học!', 'success');
                    this.saveProgress();
                    this.saveCoursesToStorage();
                });
            }

            console.log('✅ Event listeners attached');
        }, 100); // ← DELAY 100ms
    }

    setupUploadForm() {
        const uploadForm = document.getElementById('uploadForm');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleUpload();
            });
        }

        this.setupFileUpload('videoFile', 'videoUploadArea', 'videoFileList');
        this.setupFileUpload('slideFile', 'slideUploadArea', 'slideFileList');
    }

    setupFileUpload(inputId, areaId, listId) {
        const input = document.getElementById(inputId);
        const area = document.getElementById(areaId);
        const list = document.getElementById(listId);

        if (!input || !area || !list) {
            console.warn(`⚠️ Upload element not found: ${inputId}, ${areaId}, or ${listId}`);
            return;
        }

        area.addEventListener('click', () => input.click());

        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.style.borderColor = '#6366f1';
            area.style.background = 'rgba(99, 102, 241, 0.1)';
        });

        area.addEventListener('dragleave', () => {
            area.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            area.style.background = 'rgba(255, 255, 255, 0.03)';
        });

        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            area.style.background = 'rgba(255, 255, 255, 0.03)';
            this.displayFiles(e.dataTransfer.files, list);
        });

        input.addEventListener('change', (e) => {
            this.displayFiles(e.target.files, list);
        });
    }

    displayFiles(files, listElement) {
        if (!listElement) return;
        
        const fileArray = Array.from(files);
        const html = fileArray.map((file) => `
            <div class="file-item">
                <span><i class="fas fa-file"></i> ${file.name} (${this.formatFileSize(file.size)})</span>
                <button type="button" onclick="this.closest('.file-item').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        listElement.innerHTML = html;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    handleUpload() {
        const courseName = document.getElementById('courseName');
        const courseDescription = document.getElementById('courseDescriptionInput');

        if (!courseName || !courseName.value.trim()) {
            this.showNotification('⚠️ Nhập tên khóa học', 'warning');
            return;
        }

        this.showNotification('🚀 Đang tải lên...', 'info');

        setTimeout(() => {
            const newCourse = {
                id: Date.now(),
                title: courseName.value.trim(),
                instructor: 'Admin',
                progress: 0,
                thumbnail: '📘',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                description: courseDescription ? courseDescription.value.trim() : 'Khóa học mới',
                category: 'Khác',
                duration: 'N/A',
                students: 0,
                rating: 5.0,
                lessons: [],
                resources: []
            };

            this.courses.push(newCourse);
            this.saveCoursesToStorage();
            this.showNotification('✅ Tải lên thành công!', 'success');
            this.closeModal();
            this.renderCourses();
            
            const uploadForm = document.getElementById('uploadForm');
            if (uploadForm) uploadForm.reset();
            
            document.querySelectorAll('.file-list').forEach(list => list.innerHTML = '');
        }, 2000);
    }

    resetToSampleCourses() {
        this.initializeSampleCourses();
        this.renderCourses();
        this.showNotification('🔄 Đã reset về khóa học mẫu', 'success');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new CourseApp();
    });
} else {
    window.app = new CourseApp();
}