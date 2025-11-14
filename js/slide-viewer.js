class SlideViewer {
    constructor(containerId = 'slideViewerContainer') {
        // ✅ TỰ ĐỘNG TẠO CONTAINER NẾU CHƯA CÓ
        let container = document.getElementById(containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            document.body.appendChild(container);
            console.log('✅ Created slide container automatically');
        }
        
        this.container = container;
        this.slides = [];
        this.currentSlide = 0;
        this.isFullscreen = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        
        this.init();
        console.log('📊 SlideViewer initialized successfully!');
    }

    init() {
        this.createSlideViewer();
        this.attachKeyboardEvents();
    }

    createSlideViewer() {
        const viewer = document.createElement('div');
        viewer.className = 'slide-viewer-container';
        viewer.innerHTML = `
            <div class="slide-viewer-header">
                <div class="slide-info">
                    <span class="slide-counter">1 / 1</span>
                    <span class="slide-title">Slide Title</span>
                </div>
                <div class="slide-actions">
                    <button class="slide-btn" id="autoPlayBtn" title="Tự động phát (A)">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="slide-btn" id="downloadSlideBtn" title="Tải xuống (D)">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="slide-btn" id="fullscreenSlideBtn" title="Toàn màn hình (F)">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="slide-btn close-btn" id="closeSlideBtn" title="Đóng (Esc)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="slide-content">
                <button class="slide-nav-btn prev-btn" id="prevSlideBtn" title="Trước (←)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                
                <div class="slide-display" id="slideDisplay">
                    <img src="" alt="Slide" class="slide-image">
                    <div class="slide-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Đang tải slide...</p>
                    </div>
                </div>
                
                <button class="slide-nav-btn next-btn" id="nextSlideBtn" title="Sau (→)">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <div class="slide-thumbnails" id="slideThumbnails">
                <!-- Thumbnails will be rendered here -->
            </div>
            
            <div class="slide-progress-bar">
                <div class="slide-progress-fill"></div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .slide-viewer-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.98);
                z-index: 3000;
                display: none;
                flex-direction: column;
            }
            .slide-viewer-container.active {
                display: flex;
            }
            .slide-viewer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
                background: rgba(255, 255, 255, 0.05);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .slide-info {
                display: flex;
                gap: 20px;
                align-items: center;
                color: white;
            }
            .slide-counter {
                font-weight: 700;
                font-size: 18px;
                color: #667eea;
            }
            .slide-title {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.8);
            }
            .slide-actions {
                display: flex;
                gap: 10px;
            }
            .slide-btn {
                width: 45px;
                height: 45px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                color: white;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
            }
            .slide-btn:hover {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                transform: translateY(-2px);
            }
            .slide-btn.close-btn:hover {
                background: #ff0000;
            }
            .slide-btn.active {
                background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            }
            .slide-content {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                padding: 20px;
            }
            .slide-nav-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 60px;
                height: 60px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                color: white;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }
            .slide-nav-btn:hover:not(:disabled) {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                transform: translateY(-50%) scale(1.1);
            }
            .slide-nav-btn:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            .prev-btn {
                left: 30px;
            }
            .next-btn {
                right: 30px;
            }
            .slide-display {
                width: 100%;
                max-width: 1200px;
                max-height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }
            .slide-image {
                max-width: 100%;
                max-height: 70vh;
                object-fit: contain;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                display: none;
            }
            .slide-image.loaded {
                display: block;
                animation: slideIn 0.5s ease;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            .slide-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                color: white;
                font-size: 40px;
            }
            .slide-loading.hidden {
                display: none;
            }
            .slide-thumbnails {
                display: flex;
                gap: 15px;
                padding: 20px 30px;
                overflow-x: auto;
                background: rgba(255, 255, 255, 0.03);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            .slide-thumbnails::-webkit-scrollbar {
                height: 8px;
            }
            .slide-thumbnails::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
            }
            .slide-thumbnails::-webkit-scrollbar-thumb {
                background: #667eea;
                border-radius: 4px;
            }
            .slide-thumb {
                min-width: 120px;
                height: 80px;
                border-radius: 10px;
                overflow: hidden;
                cursor: pointer;
                border: 3px solid transparent;
                transition: all 0.3s;
                position: relative;
            }
            .slide-thumb:hover {
                border-color: #667eea;
                transform: scale(1.05);
            }
            .slide-thumb.active {
                border-color: #43e97b;
            }
            .slide-thumb img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .slide-thumb-number {
                position: absolute;
                top: 5px;
                left: 5px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 2px 8px;
                border-radius: 5px;
                font-size: 12px;
                font-weight: 600;
            }
            .slide-progress-bar {
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                position: relative;
            }
            .slide-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 0%;
                transition: width 0.3s;
            }
        `;
        document.head.appendChild(style);

        this.container.appendChild(viewer);
        this.bindSlideEvents(viewer);
    }

    bindSlideEvents(viewer) {
        const prevBtn = viewer.querySelector('#prevSlideBtn');
        const nextBtn = viewer.querySelector('#nextSlideBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        const closeBtn = viewer.querySelector('#closeSlideBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        const autoPlayBtn = viewer.querySelector('#autoPlayBtn');
        if (autoPlayBtn) {
            autoPlayBtn.addEventListener('click', () => this.toggleAutoPlay());
        }

        const fullscreenBtn = viewer.querySelector('#fullscreenSlideBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        const downloadBtn = viewer.querySelector('#downloadSlideBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadCurrentSlide());
        }
    }

    attachKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.isActive()) return;

            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.close();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.toggleAutoPlay();
                    break;
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.downloadCurrentSlide();
                    break;
            }
        });
    }

    loadSlides(slideUrls, title = 'Slide bài giảng') {
        this.slides = slideUrls;
        this.currentSlide = 0;
        
        document.querySelector('.slide-title').textContent = title;
        this.renderThumbnails();
        this.showSlide(0);
        this.show();
        
        console.log(`📊 Loaded ${this.slides.length} slides`);
    }

    renderThumbnails() {
        const container = document.getElementById('slideThumbnails');
        if (!container) return;

        container.innerHTML = this.slides.map((url, index) => `
            <div class="slide-thumb ${index === 0 ? 'active' : ''}" onclick="window.slideViewer.goToSlide(${index})">
                <img src="${url}" alt="Slide ${index + 1}" loading="lazy">
                <div class="slide-thumb-number">${index + 1}</div>
            </div>
        `).join('');
    }

    showSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        this.currentSlide = index;
        const slideImage = document.querySelector('.slide-image');
        const slideLoading = document.querySelector('.slide-loading');
        
        slideImage.classList.remove('loaded');
        slideLoading.classList.remove('hidden');

        const img = new Image();
        img.onload = () => {
            slideImage.src = this.slides[index];
            slideImage.classList.add('loaded');
            slideLoading.classList.add('hidden');
        };
        img.onerror = () => {
            slideLoading.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Không thể tải slide</p>';
        };
        img.src = this.slides[index];

        this.updateUI();
    }

    updateUI() {
        document.querySelector('.slide-counter').textContent = 
            `${this.currentSlide + 1} / ${this.slides.length}`;

        const prevBtn = document.getElementById('prevSlideBtn');
        const nextBtn = document.getElementById('nextSlideBtn');
        
        if (prevBtn) prevBtn.disabled = this.currentSlide === 0;
        if (nextBtn) nextBtn.disabled = this.currentSlide === this.slides.length - 1;

        document.querySelectorAll('.slide-thumb').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentSlide);
        });

        const progress = ((this.currentSlide + 1) / this.slides.length) * 100;
        document.querySelector('.slide-progress-fill').style.width = progress + '%';

        const activeThumb = document.querySelector('.slide-thumb.active');
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.showSlide(this.currentSlide + 1);
        } else if (this.autoPlayInterval) {
            this.showSlide(0);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    toggleAutoPlay() {
        const autoPlayBtn = document.getElementById('autoPlayBtn');
        
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
            autoPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            autoPlayBtn.classList.remove('active');
            console.log('⏸️ Auto-play stopped');
        } else {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
            autoPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            autoPlayBtn.classList.add('active');
            console.log('▶️ Auto-play started');
        }
    }

    toggleFullscreen() {
        const viewer = document.querySelector('.slide-viewer-container');
        const fullscreenBtn = document.getElementById('fullscreenSlideBtn');
        
        if (!document.fullscreenElement) {
            viewer.requestFullscreen().then(() => {
                this.isFullscreen = true;
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            });
        } else {
            document.exitFullscreen().then(() => {
                this.isFullscreen = false;
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            });
        }
    }

    downloadCurrentSlide() {
        const currentSlideUrl = this.slides[this.currentSlide];
        const link = document.createElement('a');
        link.href = currentSlideUrl;
        link.download = `slide_${this.currentSlide + 1}.png`;
        link.click();
        
        if (window.app) {
            window.app.showNotification('📥 Đang tải slide...', 'info');
        }
    }

    show() {
        const viewer = document.querySelector('.slide-viewer-container');
        if (viewer) {
            viewer.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        const viewer = document.querySelector('.slide-viewer-container');
        if (viewer) {
            viewer.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }

        if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        console.log('👋 SlideViewer closed');
    }

    isActive() {
        const viewer = document.querySelector('.slide-viewer-container');
        return viewer && viewer.classList.contains('active');
    }

    destroy() {
        const viewer = document.querySelector('.slide-viewer-container');
        if (viewer) {
            viewer.remove();
        }
        console.log('🗑️ SlideViewer destroyed');
    }
}

// ✅ KHỞI TẠO AN TOÀN
function initSlideViewer() {
    try {
        window.slideViewer = new SlideViewer();
        console.log('✅ SlideViewer ready!');
    } catch (error) {
        console.error('❌ SlideViewer init error:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlideViewer);
} else {
    initSlideViewer();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SlideViewer;
}