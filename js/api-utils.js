// api-utils.js - Helper functions cho API calls

/**
 * Generic API call function with error handling
 */
async function apiCall(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        clearTimeout(timeoutId);
        
        // Parse response
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return {
            success: true,
            data: data
        };
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            return {
                success: false,
                error: 'Request timeout. Please try again.'
            };
        }
        
        return {
            success: false,
            error: error.message || 'An error occurred'
        };
    }
}

/**
 * Get auth headers with token
 */
function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

/**
 * Handle API errors consistently
 */
function handleApiError(error, defaultMessage = 'An error occurred') {
    console.error('API Error:', error);
    
    // Check for specific error types
    if (error.includes('401') || error.includes('Unauthorized')) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return 'Session expired. Please login again.';
    }
    
    if (error.includes('Network') || error.includes('Failed to fetch')) {
        return 'Network error. Please check your connection.';
    }
    
    if (error.includes('timeout')) {
        return 'Request timeout. Please try again.';
    }
    
    return error || defaultMessage;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
}

/**
 * Redirect if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Get current user from localStorage
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

/**
 * Format error message for display
 */
function formatErrorMessage(error) {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        apiCall,
        getAuthHeaders,
        handleApiError,
        isAuthenticated,
        requireAuth,
        getCurrentUser,
        logout,
        formatErrorMessage
    };
}