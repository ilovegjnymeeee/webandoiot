class VideoPlayer {
    constructor(videoId) {
        this.video = document.getElementById(videoId);
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 1;
        this.playbackRate = 1;
        
        if (this.video) {
            this.init();
            console.log('🎬 VideoPlayer initialized!');
        } else {
            console.error('❌ Video element not found!');
        }
    }

    init() {
        this.attachVideoEvents();
        this.createCustomControls();
    }

    attachVideoEvents() {
        // Play/Pause
        this.video.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton(true);
            console.log('▶️ Video playing');
        });

        this.video.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton(false);
            console.log('⏸️ Video paused');
        });

        // Time update
        this.video.addEventListener('timeupdate', () => {
            this.currentTime = this.video.currentTime;
            this.updateProgressBar();
            this.updateTimeDisplay();
        });

        // Duration change
        this.video.addEventListener('loadedmetadata', () => {
            this.duration = this.video.duration;
            this.updateTimeDisplay();
            console.log(`⏱️ Video duration: ${this.formatTime(this.duration)}`);
        });

        // Volume change
        this.video.addEventListener('volumechange', () => {
            this.volume = this.video.volume;
            this.updateVolumeDisplay();
        });

        // Ended
        this.video.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton(false);
            this.onVideoEnded();
            console.log('✅ Video ended');
        });

        // Error handling
        this.video.addEventListener('error', (e) => {
            console.error('❌ Video error:', e);
            this.showError('Không thể tải video. Vui lòng thử lại!');
        });

        // Buffering
        this.video.addEventListener('waiting', () => {
            this.showBuffering(true);
        });

        this.video.addEventListener('canplay', () => {
            this.showBuffering(false);
        });

        // Fullscreen
        this.video.addEventListener('fullscreenchange', () => {
            this.updateFullscreenButton();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isVideoFocused()) {
                this.handleKeyboard(e);
            }
        });
    }

    createCustomControls() {
        // Kiểm tra nếu controls đã tồn tại
        const existingControls = this.video.parentElement.querySelector('.custom-video-controls');
        if (existingControls) return;

        const controls = document.createElement('div');
        controls.className = 'custom-video-controls';
        controls.innerHTML = `
            <div class="video-progress-container">
                <div class="video-progress-bar">
                    <div class="video-progress-filled"></div>
                    <div class="video-progress-handle"></div>
                </div>
            </div>
            <div class="video-controls-bottom">
                <button class="video-btn play-pause-btn">
                    <i class="fas fa-play"></i>
                </button>
                <div class="video-time">
                    <span class="current-time">0:00</span>
                    <span>/</span>
                    <span class="total-time">0:00</span>
                </div>
                <div class="volume-control">
                    <button class="video-btn volume-btn">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <input type="range" class="volume-slider" min="0" max="100" value="100">
                </div>
                <div class="playback-rate">
                    <select class="speed-select">
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1" selected>1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                    </select>
                </div>
                <button class="video-btn settings-btn">
                    <i class="fas fa-cog"></i>
                </button>
                <button class="video-btn fullscreen-btn">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        `;

        // Thêm styles cho custom controls
        const style = document.createElement('style');
        style.textContent = `
            .custom-video-controls {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
                padding: 20px;
                opacity: 0;
                transition: opacity 0.3s;
                z-index: 10;
            }
            .video-wrapper:hover .custom-video-controls {
                opacity: 1;
            }
            .video-progress-container {
                margin-bottom: 15px;
                cursor: pointer;
            }
            .video-progress-bar {
                height: 5px;
                background: rgba(255,255,255,0.3);
                border-radius: 10px;
                position: relative;
                overflow: visible;
            }
            .video-progress-filled {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                border-radius: 10px;
                width: 0%;
                transition: width 0.1s;
            }
            .video-progress-handle {
                position: absolute;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 15px;
                height: 15px;
                background: white;
                border-radius: 50%;
                left: 0%;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                opacity: 0;
                transition: opacity 0.3s;
            }
            .video-progress-container:hover .video-progress-handle {
                opacity: 1;
            }
            .video-controls-bottom {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .video-btn {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 8px;
                transition: all 0.3s;
                border-radius: 5px;
            }
            .video-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }
            .video-time {
                color: white;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                gap: 5px;
            }
            .volume-control {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .volume-slider {
                width: 80px;
                cursor: pointer;
            }
            .speed-select {
                background: rgba(255,255,255,0.1);
                color: white;
                border: 1px solid rgba(255,255,255,0.2);
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
            }
            .speed-select:focus {
                outline: none;
                border-color: #667eea;
            }
            .video-buffering {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 50px;
                color: white;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Đảm bảo video wrapper có position relative
        this.video.parentElement.style.position = 'relative';
        this.video.parentElement.appendChild(controls);

        this.bindCustomControls(controls);
    }

    bindCustomControls(controls) {
        // Play/Pause button
        const playBtn = controls.querySelector('.play-pause-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }

        // Progress bar
        const progressContainer = controls.querySelector('.video-progress-container');
        const progressBar = controls.querySelector('.video-progress-bar');
        if (progressContainer && progressBar) {
            progressContainer.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.seek(percent * this.duration);
            });
        }

        // Volume
        const volumeSlider = controls.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }

        const volumeBtn = controls.querySelector('.volume-btn');
        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => this.toggleMute());
        }

        // Playback rate
        const speedSelect = controls.querySelector('.speed-select');
        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                this.setPlaybackRate(parseFloat(e.target.value));
            });
        }

        // Fullscreen
        const fullscreenBtn = controls.querySelector('.fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        const promise = this.video.play();
        if (promise !== undefined) {
            promise.catch(error => {
                console.error('Play error:', error);
                this.showError('Không thể phát video');
            });
        }
    }

    pause() {
        this.video.pause();
    }

    seek(time) {
        if (isFinite(time) && time >= 0 && time <= this.duration) {
            this.video.currentTime = time;
            console.log(`⏩ Seeked to ${this.formatTime(time)}`);
        }
    }

    setVolume(volume) {
        if (volume >= 0 && volume <= 1) {
            this.video.volume = volume;
            this.volume = volume;
        }
    }

    toggleMute() {
        this.video.muted = !this.video.muted;
        this.updateVolumeDisplay();
    }

    setPlaybackRate(rate) {
        this.video.playbackRate = rate;
        this.playbackRate = rate;
        console.log(`⚡ Playback rate: ${rate}x`);
    }

    toggleFullscreen() {
        const videoContainer = this.video.parentElement;
        
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    updatePlayButton(playing) {
        const playBtn = document.querySelector('.play-pause-btn i');
        if (playBtn) {
            playBtn.className = playing ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    updateProgressBar() {
        const progressFilled = document.querySelector('.video-progress-filled');
        const progressHandle = document.querySelector('.video-progress-handle');
        
        if (progressFilled && progressHandle && this.duration > 0) {
            const percent = (this.currentTime / this.duration) * 100;
            progressFilled.style.width = percent + '%';
            progressHandle.style.left = percent + '%';
        }
    }

    updateTimeDisplay() {
        const currentTimeEl = document.querySelector('.current-time');
        const totalTimeEl = document.querySelector('.total-time');
        
        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(this.currentTime);
        }
        if (totalTimeEl) {
            totalTimeEl.textContent = this.formatTime(this.duration);
        }
    }

    updateVolumeDisplay() {
        const volumeBtn = document.querySelector('.volume-btn i');
        const volumeSlider = document.querySelector('.volume-slider');
        
        if (volumeBtn) {
            if (this.video.muted || this.volume === 0) {
                volumeBtn.className = 'fas fa-volume-mute';
            } else if (this.volume < 0.5) {
                volumeBtn.className = 'fas fa-volume-down';
            } else {
                volumeBtn.className = 'fas fa-volume-up';
            }
        }
        
        if (volumeSlider) {
            volumeSlider.value = this.video.muted ? 0 : this.volume * 100;
        }
    }

    updateFullscreenButton() {
        const fullscreenBtn = document.querySelector('.fullscreen-btn i');
        if (fullscreenBtn) {
            fullscreenBtn.className = document.fullscreenElement ? 'fas fa-compress' : 'fas fa-expand';
        }
    }

    showBuffering(show) {
        let buffering = document.querySelector('.video-buffering');
        
        if (show && !buffering) {
            buffering = document.createElement('div');
            buffering.className = 'video-buffering';
            buffering.innerHTML = '<i class="fas fa-spinner"></i>';
            this.video.parentElement.appendChild(buffering);
        } else if (!show && buffering) {
            buffering.remove();
        }
    }

    showError(message) {
        if (window.app && typeof window.app.showNotification === 'function') {
            window.app.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    isVideoFocused() {
        const modal = document.getElementById('videoModal');
        return modal && modal.classList.contains('active');
    }

    handleKeyboard(e) {
        switch(e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.seek(this.currentTime - 5);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.seek(this.currentTime + 5);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.setVolume(Math.min(this.volume + 0.1, 1));
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.setVolume(Math.max(this.volume - 0.1, 0));
                break;
            case 'm':
                e.preventDefault();
                this.toggleMute();
                break;
            case 'f':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case '0':
            case 'Home':
                e.preventDefault();
                this.seek(0);
                break;
            case 'End':
                e.preventDefault();
                this.seek(this.duration);
                break;
        }
    }

    onVideoEnded() {
        // Hook for app to handle video end
        if (window.app && typeof window.app.onVideoEnded === 'function') {
            window.app.onVideoEnded();
        }
    }

    // Public methods for external control
    getCurrentTime() {
        return this.currentTime;
    }

    getDuration() {
        return this.duration;
    }

    getProgress() {
        return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    }

    destroy() {
        // Cleanup
        const controls = document.querySelector('.custom-video-controls');
        if (controls) {
            controls.remove();
        }
        console.log('🗑️ VideoPlayer destroyed');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoPlayer;
}