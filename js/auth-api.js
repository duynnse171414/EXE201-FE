class AuthService {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user'));
    }

    /**
     * Login user
     * @param {string} phone 
     * @param {string} password 
     * @returns {Promise<Object>}
     */
    async login(phone, password) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            
            // Lưu token và user info
            this.saveAuthData(data.token, data.user);
            
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Signup new user
     * @param {Object} userData 
     * @returns {Promise<Object>}
     */
    async signup(userData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Signup failed');
            }

            const data = await response.json();
            
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            if (this.token) {
                await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuthData();
        }
    }

    /**
     * Verify token validity
     */
    async verifyToken() {
        if (!this.token) return false;

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_TOKEN}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    }

    /**
     * Save authentication data
     */
    saveAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Clear authentication data
     */
    clearAuthData() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * Get auth token
     */
    getToken() {
        return this.token;
    }
}

// Export singleton instance
const authService = new AuthService();

// Helper function để thêm Authorization header cho các API calls khác
function getAuthHeaders() {
    const token = authService.getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

// Interceptor để tự động refresh token nếu expired
async function authFetch(url, options = {}) {
    const headers = {
        ...getAuthHeaders(),
        ...options.headers
    };

    try {
        let response = await fetch(url, {
            ...options,
            headers
        });

        // Nếu token expired (401), logout và redirect
        if (response.status === 401) {
            authService.clearAuthData();
            window.location.href = '/login.html';
            throw new Error('Session expired. Please login again.');
        }

        return response;
    } catch (error) {
        console.error('Auth fetch error:', error);
        throw error;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { authService, authFetch, getAuthHeaders };
}