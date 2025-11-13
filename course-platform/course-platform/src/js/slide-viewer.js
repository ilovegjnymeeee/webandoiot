class SlideViewer {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.init();
    }

    init() {
        this.attachEvents();
    }

    loadSlide(url) {
        const slideModal = document.getElementById('slideModal');
        const slideFrame = document.getElementById('slideFrame');
        
        slideFrame.src = url;
        slideModal.classList.add('active');
    }

    loadSlides(slides) {
        this.slides = slides;
        this.currentSlide = 0;
        if (slides.length > 0) {
            this.loadSlide(slides[0].url);
        }
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.loadSlide(this.slides[this.currentSlide].url);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.loadSlide(this.slides[this.currentSlide].url);
        }
    }

    attachEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const slideModal = document.getElementById('slideModal');
            if (!slideModal.classList.contains('active')) return;

            if (e.key === 'ArrowRight') {
                this.nextSlide();
            } else if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'Escape') {
                slideModal.classList.remove('active');
            }
        });
    }
}

// Initialize slide viewer
const slideViewer = new SlideViewer();