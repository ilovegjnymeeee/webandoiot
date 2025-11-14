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
        // ✅ THAY ĐỔI: Load courses từ localStorage trước
        this.loadCoursesFromStorage();
        this.renderCourses();
        this.attachEventListeners();
        this.loadProgress();
        console.log('🚀 CourseApp initialized!');
    }

    // ✅ THÊM: Load courses từ localStorage
    loadCoursesFromStorage() {
        const savedCourses = localStorage.getItem('courses');
        
        if (savedCourses) {
            try {
                this.courses = JSON.parse(savedCourses);
                console.log(`📂 Loaded ${this.courses.length} courses from storage`);
            } catch (e) {
                console.error('Error loading courses:', e);
                this.loadSampleCourses();
            }
        } else {
            // Lần đầu tiên, load sample courses
            this.loadSampleCourses();
            this.saveCoursesToStorage();
        }
    }

    // ✅ THÊM: Lưu courses vào localStorage
    saveCoursesToStorage() {
        try {
            localStorage.setItem('courses', JSON.stringify(this.courses));
            console.log('💾 Courses saved to storage');
        } catch (e) {
            console.error('Error saving courses:', e);
        }
    }

    loadSampleCourses() {
        this.courses = [
            {
                id: 1,
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
                id: 2,
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
                id: 3,
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
                id: 4,
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
                id: 5,
                title: '[HUST] TIN HỌC ĐẠI CƯƠNG',
                instructor: 'CNTT HUST',
                progress: 8.95,
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
                id: 6,
                title: '[HUST] Giải tích 1 - MT11X',
                instructor: 'Toán HUST',
                progress: 4.12,
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
    }

    renderCourses() {
        const grid = document.getElementById('courseGrid');
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
                <!-- ✅ THÊM NÚT XÓA -->
                <button class="btn-delete-course" onclick="event.stopPropagation(); app.confirmDeleteCourse(${course.id})" title="Xóa khóa học">
                    <i class="fas fa-trash-alt"></i>
                </button>
                
                <div class="course-thumbnail" style="background: ${course.gradient}">
                    <div class="course-icon">${course.thumbnail}</div>
                </div>
                <div class="course-body">
                    <div class="progress-section">
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: 0%" data-width="${course.progress}%"></div>
                        </div>
                        <p class="progress-text">${course.progress > 0 ? '📈 ' + course.progress.toFixed(1) + '%' : '⏸️ Chưa học'}</p>
                    </div>
                    <div class="course-actions">
                        <button class="btn-action btn-join" onclick="event.stopPropagation(); app.openCourse(${course.id})">
                            <i class="fas fa-play-circle"></i> Vào học
                        </button>
                        <button class="btn-action btn-detail" onclick="event.stopPropagation(); app.openCourse(${course.id})">
                            <i class="fas fa-info-circle"></i> Chi tiết
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

        // Apply filter
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

        // Apply sort
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

        if (!paginationNumbers) return;

        let pagesHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            pagesHTML += `<span class="page-number ${i === this.currentPage ? 'active' : ''}" onclick="app.goToPage(${i})">${i}</span>`;
        }
        paginationNumbers.innerHTML = pagesHTML;

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
        this.currentCourse = this.courses.find(c => c.id === courseId);
        if (!this.currentCourse) return;

        const modal = document.getElementById('videoModal');
        const videoTitle = document.getElementById('videoTitle');
        const lessonList = document.getElementById('lessonList');
        const courseDescription = document.getElementById('courseDescription');
        const resourcesList = document.getElementById('resourcesList');

        // Set course info
        videoTitle.textContent = this.currentCourse.title;
        courseDescription.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px;">📚 ${this.currentCourse.title}</h3>
                <p style="color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 20px;">
                    ${this.currentCourse.description}
                </p>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px;">
                        <i class="fas fa-user-graduate" style="color: #6366f1;"></i>
                        <strong>Giảng viên:</strong> ${this.currentCourse.instructor}
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px;">
                        <i class="fas fa-clock" style="color: #10b981;"></i>
                        <strong>Thời lượng:</strong> ${this.currentCourse.duration}
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px;">
                        <i class="fas fa-users" style="color: #3b82f6;"></i>
                        <strong>Học viên:</strong> ${this.currentCourse.students.toLocaleString()}
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px;">
                        <i class="fas fa-star" style="color: #fbbf24;"></i>
                        <strong>Đánh giá:</strong> ${this.currentCourse.rating}/5.0
                    </div>
                </div>
            </div>
        `;

        // Render lessons
        if (this.currentCourse.lessons.length > 0) {
            lessonList.innerHTML = this.currentCourse.lessons.map((lesson, index) => `
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

            // Auto play first lesson
            this.playLesson(0);
        } else {
            lessonList.innerHTML = '<p style="text-align:center;padding:40px;color:rgba(255,255,255,0.5);">Chưa có bài học nào</p>';
        }

        // Render resources
        if (this.currentCourse.resources && this.currentCourse.resources.length > 0) {
            resourcesList.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    ${this.currentCourse.resources.map(resource => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-file-${resource.type === 'pdf' ? 'pdf' : resource.type === 'doc' ? 'word' : resource.type === 'video' ? 'video' : 'archive'}" style="font-size: 24px;"></i>
                                </div>
                                <div>
                                    <h4 style="margin-bottom: 5px;">${resource.name}</h4>
                                    <p style="color: rgba(255,255,255,0.6); font-size: 14px;">${resource.size}</p>
                                </div>
                            </div>
                            <button style="padding: 12px 25px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                <i class="fas fa-download"></i> Tải xuống
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            resourcesList.innerHTML = '<p style="text-align:center;padding:40px;color:rgba(255,255,255,0.5);">Chưa có tài nguyên nào</p>';
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Initialize video player if not exists
        if (!this.videoPlayer) {
            this.videoPlayer = new VideoPlayer('mainVideo');
        }
    }

    playLesson(lessonIndex) {
        if (!this.currentCourse) return;

        const lesson = this.currentCourse.lessons[lessonIndex];
        const video = document.getElementById('mainVideo');
        const videoTitle = document.getElementById('videoTitle');

        if (lesson && lesson.videoUrl) {
            video.src = lesson.videoUrl;
            video.load();
            video.play().catch(err => {
                console.error('Video play error:', err);
                this.showNotification('⚠️ Không thể phát video', 'warning');
            });
            videoTitle.textContent = lesson.title;

            // Highlight current lesson
            document.querySelectorAll('.lesson-item').forEach((item, idx) => {
                item.classList.toggle('active', idx === lessonIndex);
            });

            // Update progress
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

        // Stop video
        const video = document.getElementById('mainVideo');
        if (video) {
            video.pause();
            video.src = '';
        }

        // Save progress
        this.saveProgress();
    }

    openUploadModal() {
        const modal = document.getElementById('uploadModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    searchCourses() {
        const searchInput = document.getElementById('searchInput');
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
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: rgba(255,255,255,0.5);">
                    <i class="fas fa-search" style="font-size: 80px; margin-bottom: 20px; display: block;"></i>
                    <h3>Không tìm thấy "${query}"</h3>
                    <p>Thử từ khóa khác hoặc xóa bộ lọc</p>
                </div>
            `;
            return;
        }

        // Temporarily update courses for rendering
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

    // ✅ THÊM: Hiển thị modal xác nhận xóa
    confirmDeleteCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        this.courseToDelete = course;

        // Tạo modal nếu chưa có
        let confirmModal = document.getElementById('confirmDeleteModal');
        if (!confirmModal) {
            confirmModal = document.createElement('div');
            confirmModal.id = 'confirmDeleteModal';
            confirmModal.className = 'confirm-modal';
            confirmModal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <div class="confirm-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2 class="confirm-title">Xác nhận xóa khóa học?</h2>
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

            // Close on overlay click
            confirmModal.querySelector('.modal-overlay').addEventListener('click', () => {
                this.cancelDelete();
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && confirmModal.classList.contains('active')) {
                    this.cancelDelete();
                }
            });
        }

        // Update course name
        document.getElementById('confirmCourseName').textContent = course.title;

        // Show modal
        confirmModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // ✅ THÊM: Hủy xóa
    cancelDelete() {
        const confirmModal = document.getElementById('confirmDeleteModal');
        if (confirmModal) {
            confirmModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        this.courseToDelete = null;
    }

    // ✅ THÊM: Xóa khóa học
    deleteCourse() {
        if (!this.courseToDelete) return;

        const courseId = this.courseToDelete.id;
        const courseName = this.courseToDelete.title;

        const courseCards = document.querySelectorAll('.course-card');
        let cardIndex = -1;
        
        const filteredCourses = this.getFilteredCourses();
        const startIndex = (this.currentPage - 1) * this.coursesPerPage;
        const endIndex = startIndex + this.coursesPerPage;
        const coursesToShow = filteredCourses.slice(startIndex, endIndex);
        
        cardIndex = coursesToShow.findIndex(c => c.id === courseId);

        if (cardIndex >= 0 && courseCards[cardIndex]) {
            courseCards[cardIndex].classList.add('deleting');
        }

        setTimeout(() => {
            const index = this.courses.findIndex(c => c.id === courseId);
            if (index !== -1) {
                this.courses.splice(index, 1);
            }

            this.cancelDelete();
            this.renderCourses();
            
            // ✅ THÊM: Lưu courses sau khi xóa
            this.saveCoursesToStorage();
            this.saveProgress();

            this.showNotification(`🗑️ Đã xóa khóa học "${courseName}"`, 'success');
            console.log(`🗑️ Deleted course: ${courseName} (ID: ${courseId})`);
        }, 500);
    }

    // ✅ CẬP NHẬT: Lưu cả courses và progress
    saveProgress() {
        const progressData = this.courses.map(c => ({ 
            id: c.id, 
            progress: c.progress,
            lastWatched: c.currentLessonIndex || 0
        }));
        localStorage.setItem('courseProgress', JSON.stringify(progressData));
        
        // Lưu courses luôn
        this.saveCoursesToStorage();
        
        console.log('💾 Progress saved!');
    }

    loadProgress() {
        const saved = localStorage.getItem('courseProgress');
        if (saved) {
            try {
                const progressData = JSON.parse(saved);
                progressData.forEach(p => {
                    const course = this.courses.find(c => c.id === p.id);
                    if