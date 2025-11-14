class VideoPlayer {
    constructor() {
        this.video = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.isInitialized = false;
        
        console.log('🎬 VideoPlayer initialized!');
    }

    init(videoElement) {
        if (!videoElement) {
            console.warn('⚠️ Video element not found');
            return;
        }

        this.video = videoElement;
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('✅ Video player ready');
    }

    setupEventListeners() {
        if (!this.video) return;

        // ✅ FIX: Remove conflicting play/pause listeners
        this.video.addEventListener('loadedmetadata', () => {
            this.duration = this.video.duration;
            console.log('📊 Video duration:', this.duration);
        });

        this.video.addEventListener('timeupdate', () => {
            this.currentTime = this.video.currentTime;
            // Save progress to app if available
            if (window.app && window.app.currentCourse && this.duration > 0) {
                const progress = (this.currentTime / this.duration) * 100;
                window.app.currentCourse.progress = Math.min(
                    Math.max(window.app.currentCourse.progress, progress),
                    100
                );
            }
        });

        this.video.addEventListener('ended', () => {
            this.isPlaying = false;
            console.log('✅ Video ended');
            if (window.app) {
                window.app.showNotification('✅ Đã hoàn thành bài học!', 'success');
                window.app.saveProgress();
                window.app.saveCoursesToStorage();
            }
        });

        this.video.addEventListener('play', () => {
            this.isPlaying = true;
        });

        this.video.addEventListener('pause', () => {
            this.isPlaying = false;
        });

        // ✅ Error handling without triggering pause
        this.video.addEventListener('error', (e) => {
            console.error('❌ Video error:', e);
            console.error('Error code:', this.video.error?.code);
            console.error('Error message:', this.video.error?.message);
            
            // Only show notification for real errors
            if (this.video.error?.code !== 4) { // 4 = MEDIA_ERR_SRC_NOT_SUPPORTED (expected for demo)
                if (window.app) {
                    window.app.showNotification('⚠️ Lỗi phát video', 'error');
                }
            }
        });

        console.log('✅ Video event listeners attached');
    }

    async play() {
        if (!this.video || !this.isInitialized) {
            console.warn('⚠️ Video not initialized');
            return;
        }

        try {
            // ✅ Wait for video to be ready
            if (this.video.readyState < 2) {
                console.log('⏳ Waiting for video to load...');
                await new Promise(resolve => {
                    this.video.addEventListener('loadeddata', resolve, { once: true });
                });
            }

            await this.video.play();
            this.isPlaying = true;
            console.log('▶️ Video playing');
        } catch (error) {
            // ✅ Only log real errors, ignore AbortError
            if (error.name !== 'AbortError') {
                console.error('❌ Play error:', error);
                if (window.app) {
                    window.app.showNotification('⚠️ Không thể phát video', 'warning');
                }
            }
        }
    }

    pause() {
        if (!this.video || !this.isInitialized) return;
        
        this.video.pause();
        this.isPlaying = false;
        console.log('⏸️ Video paused');
    }

    seek(time) {
        if (!this.video || !this.isInitialized) return;
        
        this.video.currentTime = time;
        console.log('⏩ Seeked to:', time);
    }

    setVolume(volume) {
        if (!this.video || !this.isInitialized) return;
        
        this.video.volume = Math.max(0, Math.min(1, volume));
        console.log('🔊 Volume:', this.video.volume);
    }

    toggleMute() {
        if (!this.video || !this.isInitialized) return;
        
        this.video.muted = !this.video.muted;
        console.log('🔇 Muted:', this.video.muted);
        return this.video.muted;
    }

    toggleFullscreen() {
        if (!this.video || !this.isInitialized) return;

        if (!document.fullscreenElement) {
            this.video.requestFullscreen().catch(err => {
                console.error('❌ Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    destroy() {
        if (this.video) {
            this.pause();
            this.video = null;
        }
        this.isInitialized = false;
        console.log('🗑️ Video player destroyed');
    }
}

// ✅ Initialize global instance
if (typeof window !== 'undefined') {
    window.videoPlayer = new VideoPlayer();
    console.log('✅ Global VideoPlayer ready!');
}