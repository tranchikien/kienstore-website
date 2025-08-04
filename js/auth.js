// ===== AUTH FUNCTIONS =====

// API Base URL - Dynamic based on environment
const getApiBaseUrl = () => {
    if (window.API_CONFIG && window.API_CONFIG.getApiBaseUrl) {
        return window.API_CONFIG.getApiBaseUrl();
    }
    
    // Fallback based on current environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    } else {
        return 'https://kienstore-website-production.up.railway.app/api';
    }
};

const API_BASE_URL = getApiBaseUrl();

// Debug: Log API URL
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌐 Current hostname:', window.location.hostname);

// Get auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 ký tự viết hoa');
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 ký tự viết thường');
    }
    
    if (!/\d/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 số');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Register new user
 */
async function registerUser(userData) {
    try {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                fullname: userData.fullname,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                address: userData.address,
                birthday: userData.birthday
            })
        });

        if (response.success) {
            // Store token and user data
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            return { success: true, message: 'Đăng ký thành công!' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

/**
 * Authenticate user login
 */
async function authenticateUser(email, password) {
    try {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.success) {
            // Store token and user data
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            return { success: true, user: response.user };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Email không hợp lệ!', 'error');
        return;
    }
    
    // Show loading
    const loginBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<span class="loading"></span> Đang đăng nhập...';
    loginBtn.disabled = true;
    
    try {
        // Authenticate user
        const result = await authenticateUser(email, password);
        
        if (result.success) {
            // Login successful
            const user = result.user;
            
            // Store remember me preference
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('rememberedEmail');
            }
            
            showToast('Đăng nhập thành công!', 'success');
            
            // Update UI immediately
            updateUserDropdown();
            updateAdminUI();
            
            // Update profile page
            const profileUsername = document.getElementById('profile-username');
            if (profileUsername) profileUsername.textContent = user.fullname;
            
            // Close modal
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) loginModal.hide();
            
            // Clear form
            document.getElementById('loginForm').reset();
            
            // Show home page
            showHomePage();
        } else {
            // Login failed
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('Có lỗi xảy ra khi đăng nhập!', 'error');
    } finally {
        // Reset button
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}

async function handleRegister() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const birthday = document.getElementById('registerBirthday').value;
    const address = document.getElementById('registerAddress').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!username || !email || !password || !confirmPassword) {
        showToast('Vui lòng nhập đầy đủ thông tin', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Email không hợp lệ', 'error');
        return;
    }
    
    // Kiểm tra độ mạnh mật khẩu
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
        showToast(passwordValidation.errors[0], 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Mật khẩu xác nhận không khớp', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Vui lòng đồng ý với điều khoản sử dụng', 'error');
        return;
    }
    
    // Optional validation for phone number
    if (phone && phone.length < 10) {
        showToast('Số điện thoại phải có ít nhất 10 số', 'error');
        return;
    }
    
    // Show loading
    const registerBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalText = registerBtn.innerHTML;
    registerBtn.innerHTML = '<span class="loading"></span> Đang đăng ký...';
    registerBtn.disabled = true;
    
    try {
        // Register new user
        const result = await registerUser({
            email: email,
            password: password,
            fullname: username,
            phone: phone,
            birthday: birthday,
            address: address
        });
        
        if (result.success) {
            // Registration successful
            showToast(result.message, 'success');
            
            // Update UI immediately
            updateUserDropdown();
            updateAdminUI();
            
            // Close modal
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (registerModal) registerModal.hide();
            
            // Clear form
            document.getElementById('registerForm').reset();
            
            // Show home page
            showHomePage();
        } else {
            // Registration failed
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('Có lỗi xảy ra khi đăng ký!', 'error');
    } finally {
        // Reset button
        registerBtn.innerHTML = originalText;
        registerBtn.disabled = false;
    }
}

// ===== FORM EVENT LISTENERS =====

document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    handleLogin();
});

document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    handleRegister();
});

// ===== INITIALIZATION =====

// Check login status when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateUserDropdown();
});

// ===== ADDITIONAL AUTH FUNCTIONS =====

/**
 * Logout function
 */
async function logout() {
    try {
        // Call logout API
        await apiRequest('/auth/logout', {
            method: 'POST'
        });
    } catch (error) {
        console.log('Logout API error (ignored):', error);
    }
    
    // Clear user session
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Update UI immediately
    updateUserDropdown();
    updateAdminUI();
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    saveCartToStorage();
    
    showToast('Đã đăng xuất thành công', 'success');
    
    // Ẩn modal tài khoản nếu đang mở
    const profileModal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    if (profileModal) profileModal.hide();
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

/**
 * Get current user
 */
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    const user = userData ? JSON.parse(userData) : null;
    console.log('getCurrentUser() called, result:', user);
    return user;
}

/**
 * Update user profile
 */
function updateUserProfile(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    showToast('Cập nhật thông tin thành công!', 'success');
} 

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}
/**
 * Update user dropdown visibility
 */
function updateUserDropdown() {
    const user = getCurrentUser();
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (user) {
        // User is logged in - show user dropdown, hide login/register
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (userDropdown) userDropdown.style.display = 'block';
        
        // Update user name in dropdown
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) userNameEl.textContent = user.fullname;
        
        // Update admin UI
        updateAdminUI();
    } else {
        // User is not logged in - show login/register, hide user dropdown
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (userDropdown) userDropdown.style.display = 'none';
        
        // Hide admin button
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) adminBtn.style.display = 'none';
    }
}

function updateAdminUI() {
    let adminBtn = document.getElementById('admin-btn');
    if (!adminBtn) {
        // Thêm nút vào navbar nếu chưa có
        const nav = document.querySelector('.navbar .d-flex.align-items-center');
        if (nav) {
            adminBtn = document.createElement('button');
            adminBtn.id = 'admin-btn';
            adminBtn.className = 'btn btn-outline-warning btn-sm me-2 hover-lift';
            adminBtn.innerHTML = '<i class="fas fa-cogs me-1"></i>Admin Panel';
            adminBtn.style.display = 'none';
            adminBtn.onclick = function() { showAdminPanel(); };
            nav.appendChild(adminBtn);
        }
    }
    if (isAdmin()) {
        if (adminBtn) adminBtn.style.display = 'inline-block';
    } else if (adminBtn) {
        adminBtn.style.display = 'none';
    }
} 

// ===== DEBUG FUNCTIONS =====

/**
 * Debug function to check localStorage
 */
function debugLocalStorage() {
    console.log('=== LOCAL STORAGE DEBUG ===');
    console.log('All localStorage:', localStorage);
    
    const user = getCurrentUser();
    if (user) {
        console.log('✅ User is logged in:');
        console.log('  - Email:', user.email);
        console.log('  - Name:', user.fullname);
        console.log('  - Phone:', user.phone);
        console.log('  - Address:', user.address);
        console.log('  - Birthday:', user.birthday);
    } else {
        console.log('❌ No user logged in');
    }
    
    // Check other stored data
    const cart = localStorage.getItem('cart');
    if (cart) {
        console.log('🛒 Cart data:', JSON.parse(cart));
    }
    
    const wishlist = localStorage.getItem('wishlist');
    if (wishlist) {
        console.log('❤️ Wishlist data:', JSON.parse(wishlist));
    }
    
    console.log('=== END DEBUG ===');
}

/**
 * Clear all localStorage data
 */
function clearAllData() {
    if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu? (Đăng xuất, xóa giỏ hàng, wishlist...)')) {
        localStorage.clear();
        console.log('🗑️ All localStorage data cleared');
        location.reload(); // Reload trang để cập nhật UI
    }
}

// Thêm vào global scope để có thể gọi từ console
window.debugLocalStorage = debugLocalStorage;
window.debugUI = debugUI;
window.testProfileModal = testProfileModal;
window.testWishlist = testWishlist;
window.testOrderHistory = testOrderHistory;
window.testAddToWishlist = testAddToWishlist;
window.testCoupon = testCoupon;
window.clearAllData = clearAllData;

