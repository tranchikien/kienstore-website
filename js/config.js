// API Configuration
const API_CONFIG = {
    development: {
        baseUrl: 'http://localhost:5000/api'
    },
    production: {
        baseUrl: 'https://kienstore-website-production.up.railway.app/api/health'  // Thay thế bằng URL Railway thực tế
    }
};

// Get current environment
const getCurrentEnvironment = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'development';
    }
    return 'production';
};

// Get API Base URL
const getApiBaseUrl = () => {
    const env = getCurrentEnvironment();
    return API_CONFIG[env].baseUrl;
};

// Export for use in other files
window.API_CONFIG = {
    getApiBaseUrl,
    getCurrentEnvironment
}; 