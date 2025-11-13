class VideoPlayer {
    constructor() {
        this.video = null;
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.attachVideoEvents();
    }

    attachVideoEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            const video = document.getElementById('mainVideo');
            if (!video) return;

            this.video = video;

            // Play/Pause
            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    this.isPlaying = true;
                } else {
                    video.pause();
                    this.isPlaying = false;
                }
            });

            // Update progress
            video.addEventListener('timeupdate', () => {
                this.updateProgress();
            });

            // Video ended
            video.addEventListener('ended', () => {
                this.isPlaying = false;
            });
        });
    }

    updateProgress() {
        if (!this.video) return;
        
        const percent = (this.video.currentTime / this.video.duration) * 100;
        // Update progress bar if exists
        const progressBar = document.querySelector('.progress-filled');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }

    play() {
        if (this.video) {
            this.video.play();
            this.isPlaying = true;
        }
    }

    pause() {
        if (this.video) {
            this.video.pause();
            this.isPlaying = false;
        }
    }

    setTime(seconds) {
        if (this.video) {
            this.video.currentTime = seconds;
        }
    }
}

// Initialize video player
const videoPlayer = new VideoPlayer();