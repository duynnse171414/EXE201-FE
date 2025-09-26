// Global utilities
const PawfectMatch = {
    // Smooth scrolling
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    // Initialize app
    init() {
        this.initSmoothScroll();
        console.log('Pawfect Match initialized');
    }
};

// Auto-initialize when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    PawfectMatch.init();
});