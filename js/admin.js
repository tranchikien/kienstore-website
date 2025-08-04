// ===== ADMIN FUNCTIONS =====

// API Base URL - Dynamic based on environment
const API_BASE_URL = window.API_CONFIG ? window.API_CONFIG.getApiBaseUrl() : 'http://localhost:5000/api';

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
        showToast(error.message, 'error');
        throw error;
    }
}

// ===== PRODUCT MANAGEMENT =====

// Load products for admin
async function loadAdminProducts(page = 1, search = '') {
    try {
        const params = new URLSearchParams({
            page,
            limit: 10,
            ...(search && { search })
        });

        const response = await apiRequest(`/products?${params}`);
        
        if (response.success) {
            renderAdminProductList(response.data);
            renderAdminPagination(response.pagination);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render admin product list
function renderAdminProductList(products) {
    const tbody = document.getElementById('product-admin-list');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!products || products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-box-open fa-2x mb-2"></i>
                    <p>No products found</p>
                </td>
            </tr>
        `;
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product._id}</td>
            <td>
                <img src="${product.mainImage}" alt="${product.name}" 
                     style="width: 50px; height: 30px; object-fit: cover; border-radius: 4px;">
            </td>
            <td>
                <div>
                    <strong>${product.name}</strong>
                    <br>
                    <small class="text-muted">${product.description.substring(0, 50)}...</small>
                </div>
            </td>
            <td>
                <span class="text-orange fw-bold">${formatPrice(product.price)}</span>
                ${product.isSale ? `<br><small class="text-danger">-${product.salePercentage}%</small>` : ''}
            </td>
            <td>
                <span class="badge bg-secondary">${product.category}</span>
            </td>
            <td>
                <span class="badge bg-info">${product.platform}</span>
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary" onclick="editProduct('${product._id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteProduct('${product._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-outline-${product.isActive ? 'success' : 'warning'}" 
                            onclick="toggleProductStatus('${product._id}', ${product.isActive})" 
                            title="${product.isActive ? 'Deactivate' : 'Activate'}">
                        <i class="fas fa-${product.isActive ? 'eye' : 'eye-slash'}"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render admin pagination
function renderAdminPagination(pagination) {
    const paginationContainer = document.getElementById('product-admin-pagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${!pagination.hasPrev ? 'disabled' : ''}`;
    prevLi.innerHTML = `
        <a class="page-link" href="#" onclick="loadAdminProducts(${pagination.page - 1})" ${!pagination.hasPrev ? 'tabindex="-1"' : ''}>
            <i class="fas fa-chevron-left"></i>
        </a>
    `;
    paginationContainer.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= pagination.pages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === pagination.page ? 'active' : ''}`;
        li.innerHTML = `
            <a class="page-link" href="#" onclick="loadAdminProducts(${i})">${i}</a>
        `;
        paginationContainer.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${!pagination.hasNext ? 'disabled' : ''}`;
    nextLi.innerHTML = `
        <a class="page-link" href="#" onclick="loadAdminProducts(${pagination.page + 1})" ${!pagination.hasNext ? 'tabindex="-1"' : ''}>
            <i class="fas fa-chevron-right"></i>
        </a>
    `;
    paginationContainer.appendChild(nextLi);
}

// Open product form modal
function openProductFormModal(productId = null) {
    const modal = new bootstrap.Modal(document.getElementById('productFormModal'));
    const title = document.getElementById('productFormModalTitle');
    const form = document.getElementById('productForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (productId) {
        title.textContent = 'Edit Product';
        submitBtn.textContent = 'Update Product';
        loadProductForEdit(productId);
    } else {
        title.textContent = 'Add Product';
        submitBtn.textContent = 'Save Product';
        form.reset();
        document.getElementById('product-id').value = '';
        document.getElementById('product-image-preview').style.display = 'none';
    }

    modal.show();
}

// Load product for editing
async function loadProductForEdit(productId) {
    try {
        const response = await apiRequest(`/products/${productId}`);
        
        if (response.success) {
            const product = response.data;
            
            document.getElementById('product-id').value = product._id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-platform').value = product.platform;
            document.getElementById('product-image').value = product.mainImage;
            document.getElementById('product-description').value = product.description;
            
            // Show image preview
            const preview = document.getElementById('product-image-preview');
            preview.src = product.mainImage;
            preview.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading product for edit:', error);
    }
}

// Handle product form submission
async function handleProductFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productId = document.getElementById('product-id').value;
    
    const productData = {
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        platform: formData.get('platform'),
        mainImage: formData.get('image'),
        images: [formData.get('image')], // For now, just use main image
        description: formData.get('description')
    };

    try {
        let response;
        
        if (productId) {
            // Update existing product
            response = await apiRequest(`/products/${productId}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
        } else {
            // Create new product
            response = await apiRequest('/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });
        }

        if (response.success) {
            showToast(response.message, 'success');
            bootstrap.Modal.getInstance(document.getElementById('productFormModal')).hide();
            loadAdminProducts(); // Reload the list
        }
    } catch (error) {
        console.error('Error saving product:', error);
    }
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await apiRequest(`/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.success) {
            showToast(response.message, 'success');
            loadAdminProducts(); // Reload the list
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Toggle product status
async function toggleProductStatus(productId, currentStatus) {
    try {
        const response = await apiRequest(`/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify({
                isActive: !currentStatus
            })
        });

        if (response.success) {
            showToast(`Product ${currentStatus ? 'deactivated' : 'activated'} successfully`, 'success');
            loadAdminProducts(); // Reload the list
        }
    } catch (error) {
        console.error('Error toggling product status:', error);
    }
}

// ===== USER MANAGEMENT =====

// Load users for admin
async function loadAdminUsers(page = 1, search = '') {
    try {
        const params = new URLSearchParams({
            page,
            limit: 10,
            ...(search && { search })
        });

        const response = await apiRequest(`/users?${params}`);
        
        if (response.success) {
            renderAdminUserList(response.data);
            renderAdminUserPagination(response.pagination);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Render admin user list
function renderAdminUserList(users) {
    const tbody = document.getElementById('user-admin-list');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!users || users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-users fa-2x mb-2"></i>
                    <p>No users found</p>
                </td>
            </tr>
        `;
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${user.avatar}" alt="${user.fullname}" 
                         class="rounded-circle me-2" style="width: 32px; height: 32px;">
                    <div>
                        <strong>${user.fullname}</strong>
                        <br>
                        <small class="text-muted">${user.email}</small>
                    </div>
                </div>
            </td>
            <td>
                <span class="badge bg-${user.role === 'admin' ? 'danger' : 'primary'}">${user.role}</span>
            </td>
            <td>
                <span class="badge bg-${user.isActive ? 'success' : 'secondary'}">
                    ${user.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>${user.phone || 'N/A'}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary" onclick="viewUser('${user._id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-${user.isActive ? 'warning' : 'success'}" 
                            onclick="toggleUserStatus('${user._id}', ${user.isActive})" 
                            title="${user.isActive ? 'Deactivate' : 'Activate'}">
                        <i class="fas fa-${user.isActive ? 'ban' : 'check'}"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteUser('${user._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ===== ORDER MANAGEMENT =====

// Load orders for admin
async function loadAdminOrders(page = 1, status = '') {
    try {
        const params = new URLSearchParams({
            page,
            limit: 10,
            ...(status && { status })
        });

        const response = await apiRequest(`/orders/admin/all?${params}`);
        
        if (response.success) {
            renderAdminOrderList(response.data);
            renderAdminOrderPagination(response.pagination);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Render admin order list
function renderAdminOrderList(orders) {
    const tbody = document.getElementById('order-admin-list');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!orders || orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-shopping-cart fa-2x mb-2"></i>
                    <p>No orders found</p>
                </td>
            </tr>
        `;
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>#${order._id.slice(-8)}</strong>
                <br>
                <small class="text-muted">${new Date(order.createdAt).toLocaleDateString()}</small>
            </td>
            <td>
                <div>
                    <strong>${order.user.fullname}</strong>
                    <br>
                    <small class="text-muted">${order.user.email}</small>
                </div>
            </td>
            <td>
                <div>
                    ${order.items.map(item => `
                        <div class="d-flex align-items-center mb-1">
                            <img src="${item.product.mainImage}" alt="${item.product.name}" 
                                 style="width: 30px; height: 20px; object-fit: cover; border-radius: 2px;" class="me-2">
                            <span>${item.product.name} x${item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
            </td>
            <td>
                <span class="text-orange fw-bold">${formatPrice(order.total)}</span>
            </td>
            <td>
                <span class="badge bg-${getStatusBadgeColor(order.status)}">${order.status}</span>
            </td>
            <td>
                <span class="badge bg-${getPaymentStatusBadgeColor(order.paymentStatus)}">${order.paymentStatus}</span>
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary" onclick="viewOrder('${order._id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" onclick="updateOrderStatus('${order._id}')" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Helper functions for status colors
function getStatusBadgeColor(status) {
    const colors = {
        'pending': 'warning',
        'processing': 'info',
        'completed': 'success',
        'cancelled': 'danger',
        'refunded': 'secondary'
    };
    return colors[status] || 'secondary';
}

function getPaymentStatusBadgeColor(status) {
    const colors = {
        'pending': 'warning',
        'paid': 'success',
        'failed': 'danger',
        'refunded': 'secondary'
    };
    return colors[status] || 'secondary';
}

// ===== DASHBOARD STATISTICS =====

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // This would typically be a single API call that returns all stats
        // For now, we'll make separate calls
        const [productsRes, usersRes, ordersRes] = await Promise.all([
            apiRequest('/products?limit=1'),
            apiRequest('/users?limit=1'),
            apiRequest('/orders/admin/all?limit=1')
        ]);

        if (productsRes.success && usersRes.success && ordersRes.success) {
            updateDashboardStats({
                totalProducts: productsRes.total,
                totalUsers: usersRes.total,
                totalOrders: ordersRes.total
            });
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Update dashboard statistics display
function updateDashboardStats(stats) {
    const elements = {
        totalProducts: document.getElementById('dashboard-total-products'),
        totalUsers: document.getElementById('dashboard-total-users'),
        totalOrders: document.getElementById('dashboard-total-orders')
    };

    if (elements.totalProducts) elements.totalProducts.textContent = stats.totalProducts || 0;
    if (elements.totalUsers) elements.totalUsers.textContent = stats.totalUsers || 0;
    if (elements.totalOrders) elements.totalOrders.textContent = stats.totalOrders || 0;
}

// ===== INITIALIZATION =====

// Initialize admin panel
function initAdminPanel() {
    // Add event listeners
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductFormSubmit);
    }

    // Load initial data
    loadDashboardStats();
    loadAdminProducts();
}

// Show admin panel
function showAdminPanel() {
    hideAllPages();
    document.getElementById('admin-panel').style.display = 'block';
    initAdminPanel();
    scrollToTop();
}

// Admin panel navigation functions
function showAdminDashboard() {
    hideAdminSections();
    document.getElementById('admin-dashboard').style.display = 'block';
    loadDashboardStats();
}

function showAdminProducts() {
    hideAdminSections();
    document.getElementById('admin-products').style.display = 'block';
    loadAdminProducts();
}

function showAdminUsers() {
    hideAdminSections();
    document.getElementById('admin-users').style.display = 'block';
    loadAdminUsers();
}

function showAdminOrders() {
    hideAdminSections();
    document.getElementById('admin-orders').style.display = 'block';
    loadAdminOrders();
}

function hideAdminSections() {
    const sections = ['admin-dashboard', 'admin-products', 'admin-users', 'admin-orders'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) section.style.display = 'none';
    });
}

// Global functions for onclick handlers
window.editProduct = function(productId) {
    openProductFormModal(productId);
};

window.deleteProduct = deleteProduct;
window.toggleProductStatus = toggleProductStatus;
window.loadAdminProducts = loadAdminProducts;
window.openProductFormModal = openProductFormModal;
window.showAdminDashboard = showAdminDashboard;
window.showAdminProducts = showAdminProducts;
window.showAdminUsers = showAdminUsers;
window.showAdminOrders = showAdminOrders;

// Export functions for global access
window.adminFunctions = {
    loadAdminProducts,
    openProductFormModal,
    deleteProduct,
    toggleProductStatus,
    loadAdminUsers,
    loadAdminOrders,
    showAdminPanel,
    showAdminDashboard,
    showAdminProducts,
    showAdminUsers,
    showAdminOrders
}; 