// config.js - Cấu hình API cho toàn bộ ứng dụng

const API_CONFIG = {
    // Thay đổi URL này theo backend của bạn
    BASE_URL: 'http://localhost:8080/api',
    
    // API Endpoints
    ENDPOINTS: {
        // Authentication
        LOGIN: '/login',
        SIGNUP: '/register', 
        LOGOUT: '/logout',
        VERIFY_TOKEN: '/verify',
        REFRESH_TOKEN: '/refresh',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
        
        // User
        GET_USER: '/user/profile',
        UPDATE_USER: '/user/profile',
        CHANGE_PASSWORD: '/user/change-password',
        
        // Pet
        GET_PETS: '/pets',
        GET_PET: '/pets/:id',
        CREATE_PET: '/pets',
        UPDATE_PET: '/pets/:id',
        DELETE_PET: '/pets/:id',
        
        // Products
        GET_PRODUCTS: '/products',
        GET_PRODUCT: '/products/:id',
        SEARCH_PRODUCTS: '/products/search',
        
        // Orders
        CREATE_ORDER: '/orders',
        GET_ORDERS: '/orders',
        GET_ORDER: '/orders/:id',
        
        // Recommendations
        GET_RECOMMENDATIONS: '/recommendations',
    },
    
    // Request timeout (milliseconds)
    TIMEOUT: 10000,
    
    // Retry configuration
    RETRY: {
        MAX_RETRIES: 3,
        DELAY: 1000
    }
};

// Helper function để build URL với parameters
function buildUrl(endpoint, params = {}) {
    let url = API_CONFIG.BASE_URL + endpoint;
    
    // Replace path parameters
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });
    
    return url;
}

// Helper function để thêm query string
function addQueryParams(url, queryParams = {}) {
    const params = new URLSearchParams(queryParams);
    const queryString = params.toString();
    
    if (queryString) {
        return `${url}?${queryString}`;
    }
    
    return url;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, buildUrl, addQueryParams };
}