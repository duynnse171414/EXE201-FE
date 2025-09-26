// Authentication utilities
const AuthManager = {
    // Validate email
    validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    },

    // Validate password
    validatePassword(password) {
        const minLength = password.length >= 8;
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>0-9A-Z]/.test(password);
        return minLength && hasSpecial;
    },

    // Handle login
    async login(email, password) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email && this.validatePassword(password)) {
                    resolve({ success: true, user: { email } });
                } else {
                    resolve({ success: false, error: 'Invalid credentials' });
                }
            }, 2000);
        });
    },

    // Handle signup
    async signup(userData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, user: userData });
            }, 2500);
        });
    }
};