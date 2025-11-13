class CourseApp {
    constructor() {
        this.courses = [];
        this.currentPage = 1;
        this.coursesPerPage = 6;
        this.currentCourse = null;
        this.init();
    }

    init() {
        this.loadSampleCourses();
        this.renderCourses();
        this.attachEventListeners();
    }

    loadSampleCourses() {
        this.courses = [
            {
                id: 1,
                title: 'Giải tích 2',
                instructor: 'ĐH/GĐT - Toán cao cấp & Vật lý đại cương',
                progress: 0,
                thumbnail: '📚',
                lessons: [
                    { title: 'Bài 1: Giới thiệu', duration: '15:30', videoUrl: '' },
                    { title: 'Bài 2: Tích phân', duration: '22:45', videoUrl: '' }
                ]
            },
            {
                id: 2,
                title: 'Giải tích 3',
                instructor: 'ĐH/GĐT - Toán cao cấp & Vật lý đại cương',
                progress: 0,
                thumbnail: '📐',
                lessons: []
            },
            {
                id: 3,
                title: 'Vật lý đại cương 2 - Điện từ',
                instructor: 'ĐH/GĐT - Toán cao cấp & Vật lý đại cương',
                progress: 0,
                thumbnail: '⚡',
                lessons: []
            },
            {
                id: 4,
                title: 'Xác suất thống kê 2025',
                instructor: 'ĐH/GĐT - Toán cao cấp & Vật lý đại cương',
                progress: 0,
                thumbnail: '📊',
                lessons: []
            },
            {
                id: 5,
                title: '[HUST] TIN HỌC ĐẠI CƯƠNG',
                instructor: 'ĐH/GĐT - Toán cao cấp & Vật lý đại cương',
                progress: 8.95,
                thumbnail: '💻',
                lessons: []
            },
            {
                id: 6,
                title: '[HUST] Giải tích 1 - MT11X',
                instructor: 'ĐH/GĐT - Toán cao cấp & Vật lý đại cương',
                progress: 4.12,
                thumbnail: '📈',
                lessons: [
                    { title: 'Hàm số chẵn - lẻ', duration: '08:43', videoUrl: '' },
                    { title: 'Hàm số tuần hoàn', duration: '18:41', videoUrl: '' },
                    { title: 'Hàm hợp', duration: '07:52', videoUrl: '' },
                    { title: 'Hàm Hyperbolic', duration: '12:42', videoUrl: '' },
                    { title: 'Hàm ngược', duration: '13:43', videoUrl: '' },
                    { title: 'Hàm lượng giác ngược', duration: '22:02', videoUrl: '' }
                ]
            }
        ];
    }

    renderCourses() {
        const courseGrid = document.getElementById('courseGrid');
        const startIndex = (this.currentPage - 1) * this.coursesPerPage;
        const endIndex = startIndex + this.coursesPerPage;
        const coursesToShow = this.courses.slice(startIndex, endIndex);

        courseGrid.innerHTML = coursesToShow.map(course => `
            <div class="course-card" data-id="${course.id}">
                <div class="course-thumbnail">
                    <div class="course-thumbnail-icon">${course.thumbnail}</div>
                </div>
                <div class="course-body">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-instructor">${course.instructor}</p>
                    <div class="course-progress">
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${course.progress}%"></div>
                        </div>
                        <p class="progress-text">${course.progress}%</p>
                    </div>
                    <div class="course-actions">
                        <button class="btn-join" onclick="app.openCourse(${course.id})">▶ Vào học</button>
                        <button class="btn-info" onclick="app.showCourseInfo(${course.id})">Chi tiết</button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.courses.length / this.coursesPerPage);
        const paginationNumbers = document.getElementById('paginationNumbers');
        
        paginationNumbers.innerHTML = Array.from({length: totalPages}, (_, i) => i + 1)
            .map(page => `
                <span class="page-number ${page === this.currentPage ? 'active' : ''}" 
                      onclick="app.goToPage(${page})">${page}</span>
            `).join('');

        document.getElementById('prevBtn').disabled = this.currentPage === 1;
        document.getElementById('nextBtn').disabled = this.currentPage === totalPages;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderCourses();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    openCourse(courseId) {
        this.currentCourse = this.courses.find(c => c.id === courseId);
        const modal = document.getElementById('videoModal');
        const videoTitle = document.getElementById('videoTitle');
        const lessonList = document.getElementById('lessonList');

        videoTitle.textContent = this.currentCourse.title;
        
        if (this.currentCourse.lessons.length > 0) {
            lessonList.innerHTML = this.currentCourse.lessons.map((lesson, index) => `
                <div class="lesson-item" onclick="app.playLesson(${index})">
                    <div class="lesson-icon">▶</div>
                    <div class="lesson-info">
                        <div class="lesson-title">${lesson.title}</div>
                        <div class="lesson-duration">${lesson.duration}</div>
                    </div>
                </div>
            `).join('');
        } else {
            lessonList.innerHTML = '<p style="color: #8b8ea8; text-align: center; padding: 20px;">Chưa có bài học nào</p>';
        }

        modal.classList.add('active');
    }

    playLesson(lessonIndex) {
        const lesson = this.currentCourse.lessons[lessonIndex];
        const video = document.getElementById('mainVideo');
        
        if (lesson.videoUrl) {
            video.src = lesson.videoUrl;
            video.play();
        } else {
            alert('Video chưa được upload cho bài học này');
        }
    }

    showCourseInfo(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        alert(`📚 ${course.title}\n\n👨‍🏫 Giảng viên: ${course.instructor}\n📊 Tiến độ: ${course.progress}%\n📝 Số bài học: ${course.lessons.length}`);
    }

    openUploadModal() {
        document.getElementById('uploadModal').classList.add('active');
    }

    attachEventListeners() {
        // Close modals
        document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el) {
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.classList.remove('active');
                    });
                }
            });
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Navigation tabs
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Pagination
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.goToPage(this.currentPage - 1);
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            const totalPages = Math.ceil(this.courses.length / this.coursesPerPage);
            if (this.currentPage < totalPages) {
                this.goToPage(this.currentPage + 1);
            }
        });

        // Upload button
        document.querySelector('.btn-create').addEventListener('click', () => {
            this.openUploadModal();
        });

        // File uploads
        this.setupFileUpload('videoFile', 'videoFileList', 'videoUploadArea');
        this.setupFileUpload('slideFile', 'slideFileList', 'slideUploadArea');

        // Form submit
        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCourseUpload();
        });
    }

    setupFileUpload(inputId, listId, areaId) {
        const input = document.getElementById(inputId);
        const area = document.getElementById(areaId);
        
        area.addEventListener('click', () => input.click());
        
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            const list = document.getElementById(listId);
            
            list.innerHTML = files.map((file, index) => `
                <div class="file-item">
                    <span>📎 ${file.name}</span>
                    <button type="button" onclick="this.parentElement.remove()">×</button>
                </div>
            `).join('');
        });
    }

    handleCourseUpload() {
        const title = document.getElementById('courseName').value;
        const instructor = document.getElementById('instructorName').value;
        
        const newCourse = {
            id: this.courses.length + 1,
            title: title,
            instructor: instructor,
            progress: 0,
            thumbnail: '📚',
            lessons: []
        };

        this.courses.push(newCourse);
        this.renderCourses();
        
        document.getElementById('uploadModal').classList.remove('active');
        document.getElementById('uploadForm').reset();
        
        alert('✅ Đã đăng khóa học thành công!');
    }
}

// Initialize app
const app = new CourseApp();