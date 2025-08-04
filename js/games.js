// ===== GAME FUNCTIONS =====

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Global games data
let gamesData = [];

/**
 * Load games from API
 */
async function loadGamesFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        
        if (data.success) {
            gamesData = data.data;
            console.log('Loaded games from API:', gamesData.length);
            return gamesData;
        } else {
            console.error('Failed to load games:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error loading games:', error);
        return [];
    }
}

/**
 * Render danh sách game ra grid
 */
function renderGames(games = gamesData) {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!games || games.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center text-muted py-5">Không tìm thấy game phù hợp.</div>`;
        return;
    }
    games.forEach(game => {
        grid.innerHTML += createGameCard(game);
    });
}

/**
 * Hiển thị tất cả game
 */
async function showAllGames() {
    hideAllPages();
    document.getElementById('all-games').style.display = 'block';
    
    // Load games from API if not already loaded
    if (gamesData.length === 0) {
        await loadGamesFromAPI();
    }
    
    console.log('All Games Data:', gamesData); // Debug log
    renderGames(gamesData); // Render tất cả game
    scrollToTop();
    setActiveMenu('home');
}

/**
 * Lọc game theo thể loại/nền tảng
 */
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const platform = document.getElementById('platformFilter').value;
    let filtered = gamesData;
    if (category) {
        filtered = filtered.filter(game => game.category === category);
    }
    if (platform) {
        filtered = filtered.filter(game => game.platform === platform);
    }
    renderGames(filtered);
}

/**
 * Tìm kiếm game
 */
function searchGames(event) {
    if (event) event.preventDefault();
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!keyword) {
        renderGames();
        return;
    }
    const filtered = gamesData.filter(game =>
        game.name.toLowerCase().includes(keyword) ||
        game.description.toLowerCase().includes(keyword)
    );
    renderGames(filtered);
}

/**
 * Tạo card game
 */
function createGameCard(game, showFullCard = true) {
    const colClass = currentView === 'list' ? 'col-12' : 'col-lg-3 col-md-4 col-sm-6';
    
    // Tạo badges
    let badges = [];
    if (game.isSale && game.sale > 0) {
        badges.push(`<span class="card-badge badge-sale">-${game.sale}%</span>`);
    }
    badges.push(`<span class="badge bg-orange">${game.category}</span>`);
    
    // Hiển thị giá
    let priceDisplay = '';
    if (game.isSale && game.sale > 0) {
        const salePrice = game.price * (1 - game.sale / 100);
        priceDisplay = `
            <div class="price-section">
                                        <span class="price-old text-muted text-decoration-line-through" style="font-size: 0.9em;">${formatPrice(game.price)}</span>
                        <span class="price text-orange fw-bold">${formatPrice(salePrice)}</span>
                <span class="badge bg-danger" style="font-size: 0.7em;">-${game.sale}%</span>
            </div>
        `;
    } else {
        priceDisplay = `
            <div class="price-section">
                                        <span class="price text-orange fw-bold">${formatPrice(game.price)}</span>
            </div>
        `;
    }

    return `
        <div class="${colClass}">
            <div class="game-card card-hover">
                <div class="card-image-container">
                    <img src="${game.image}" alt="${game.name}" class="game-card-image">
                    <div class="card-badge">
                        ${badges.join('')}
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${game.name}</h5>
                    <p class="card-text">${game.description.substring(0, 80)}...</p>
                    ${priceDisplay}
                    ${showFullCard ? `
                    <div class="card-actions mt-3 d-flex gap-2">
                        <button class="btn btn-orange btn-sm me-2 hover-lift" onclick="showProductDetailPage(${game.id})">
                            <i class="fas fa-eye me-2"></i>Chi tiết
                        </button>
                        <button class="btn btn-outline-orange btn-sm hover-lift" onclick="addToCart({id: ${game.id}, name: '${game.name}', price: ${game.price}, image: '${game.image}'})">
                            <i class="fas fa-cart-plus me-2"></i>Thêm vào giỏ
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Hiển thị chi tiết game
 */
function showProductDetailPage(gameId) {
    hideAllPages();
    document.getElementById('product-detail-page').style.display = 'block';
    loadProductDetail(gameId);
    scrollToTop();
}

/**
 * Load chi tiết game vào trang chi tiết
 */
function loadProductDetail(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;
    
    // Update product information
    document.getElementById('product-title').textContent = game.name;
    document.getElementById('product-category').textContent = game.category;
    document.getElementById('product-platform').textContent = game.platform;
    // Hiển thị giá mới và giá cũ nếu có sale
    const priceElement = document.getElementById('product-price');
    if (game.isSale && game.sale > 0) {
        const newPrice = game.price * (1 - game.sale / 100);
        priceElement.innerHTML = `
            <div class="d-flex flex-column">
                <span class="text-orange fw-bold fs-2">${formatPrice(newPrice)}</span>
                <span class="text-muted text-decoration-line-through" style="font-size: 0.8em;">${formatPrice(game.price)}</span>
                <span class="badge bg-danger" style="font-size: 0.7em;">-${game.sale}%</span>
            </div>
        `;
    } else {
                    priceElement.textContent = formatPrice(game.price);
    }
    document.getElementById('product-description').textContent = game.description;
    const developerEl = document.getElementById('product-developer');
    const publisherEl = document.getElementById('product-publisher');
    const sizeEl = document.getElementById('product-size');
    
    if (developerEl) developerEl.textContent = game.developer || '';
    if (publisherEl) publisherEl.textContent = game.publisher || '';
    if (sizeEl) sizeEl.textContent = game.size || '';
    
    // Update images
    document.getElementById('product-main-image').src = game.image;
    (game.screenshots || []).forEach((src, idx) => {
        const thumb = document.getElementById('product-thumb-' + (idx + 1));
        if (thumb) thumb.src = src;
    });
    
    // Add data-game-id to buttons for event listeners
    const addToCartBtn = document.getElementById('product-add-to-cart');
    const addToWishlistBtn = document.getElementById('product-add-to-wishlist');
    const priceAlertBtn = document.getElementById('product-price-alert');
    
    if (addToCartBtn) addToCartBtn.setAttribute('data-game-id', game.id);
    if (addToWishlistBtn) addToWishlistBtn.setAttribute('data-game-id', game.id);
    if (priceAlertBtn) priceAlertBtn.setAttribute('data-game-id', game.id);
}



// ===== ADMIN PRODUCT CRUD =====
function getAllGamesData() {
    // Ưu tiên lấy từ gamesData API trước
    if (typeof gamesData !== 'undefined' && Array.isArray(gamesData) && gamesData.length > 0) {
        return gamesData;
    }
    
    // Nếu không có gamesData, thử lấy từ admin_products
    const data = localStorage.getItem('admin_products');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            console.error('Error parsing admin_products from localStorage:', e);
        }
    }
    
    return [];
}
function saveAdminProducts(products) {
    localStorage.setItem('admin_products', JSON.stringify(products));
}
function showProductAdminPage() {
    hideAllPages();
    document.getElementById('product-admin-page').style.display = 'block';
    renderProductAdminList();
}
// ===== ADMIN PRODUCT SEARCH & PAGINATION =====
let productAdminSearch = '';
let productAdminPage = 1;
const productAdminPageSize = 10;
const searchInput = document.getElementById('product-admin-search');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        productAdminSearch = e.target.value.trim().toLowerCase();
        productAdminPage = 1;
        renderProductAdminList();
    });
}
function renderProductAdminList() {
    const listEl = document.getElementById('product-admin-list');
    if (!listEl) return;
    let products = getAllGamesData();
    // Tìm kiếm
    if (productAdminSearch) {
        products = products.filter(p => p.name.toLowerCase().includes(productAdminSearch));
    }
    // Phân trang
    const total = products.length;
    const totalPages = Math.ceil(total / productAdminPageSize) || 1;
    if (productAdminPage > totalPages) productAdminPage = totalPages;
    const start = (productAdminPage - 1) * productAdminPageSize;
    const end = start + productAdminPageSize;
    const pageProducts = products.slice(start, end);
    listEl.innerHTML = '';
    pageProducts.forEach(product => {
        listEl.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" style="width:48px;height:32px;object-fit:cover;border-radius:6px;"></td>
                <td>${product.name}</td>
                <td>${formatPrice(product.price)}</td>
                <td>${product.category}</td>
                <td>${product.platform}</td>
                <td>
                    <button class="btn btn-sm btn-outline-info me-2" onclick="openProductEdit(${product.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="openProductDeleteModal(${product.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    renderProductAdminPagination(totalPages);
}
function renderProductAdminPagination(totalPages) {
    const pagEl = document.getElementById('product-admin-pagination');
    if (!pagEl) return;
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item${i === productAdminPage ? ' active' : ''}"><a class="page-link" href="#" onclick="gotoProductAdminPage(${i});return false;">${i}</a></li>`;
    }
    pagEl.innerHTML = html;
}
function gotoProductAdminPage(page) {
    productAdminPage = page;
    renderProductAdminList();
}
// Xử lý upload file và preview ảnh trong modal admin
const productImageInput = document.getElementById('product-image');
const productImageFile = document.getElementById('product-image-file');
const productImagePreview = document.getElementById('product-image-preview');
if (productImageFile) {
    productImageFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                productImagePreview.src = evt.target.result;
                productImagePreview.style.display = 'block';
                productImageInput.value = evt.target.result; // Lưu base64 vào input
            };
            reader.readAsDataURL(file);
        }
    });
}
if (productImageInput) {
    productImageInput.addEventListener('input', function(e) {
        const val = e.target.value;
        if (val && (val.startsWith('http') || val.startsWith('data:image'))) {
            productImagePreview.src = val;
            productImagePreview.style.display = 'block';
        } else {
            productImagePreview.style.display = 'none';
        }
    });
}
// Khi mở modal sửa, cũng preview ảnh
function openProductFormModal(editId) {
    const modal = new bootstrap.Modal(document.getElementById('productFormModal'));
    document.getElementById('productForm').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('productFormModalTitle').textContent = editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm';
    productImagePreview.style.display = 'none';
    if (editId) {
        const products = getAllGamesData();
        const product = products.find(p => p.id === editId);
        if (product) {
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-platform').value = product.platform;
            document.getElementById('product-image').value = product.image;
            document.getElementById('product-description').value = product.description;
            if (product.image && (product.image.startsWith('http') || product.image.startsWith('data:image'))) {
                productImagePreview.src = product.image;
                productImagePreview.style.display = 'block';
            }
        }
    }
    modal.show();
}
document.getElementById('productForm')?.addEventListener('submit', handleProductForm);
function handleProductForm(e) {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const price = parseInt(document.getElementById('product-price').value, 10);
    const category = document.getElementById('product-category').value.trim();
    const platform = document.getElementById('product-platform').value.trim();
    const image = document.getElementById('product-image').value.trim();
    const description = document.getElementById('product-description').value.trim();
    let products = getAllGamesData();
    if (id) {
        // Sửa
        products = products.map(p => p.id == id ? { ...p, name, price, category, platform, image, description } : p);
        showToast('Đã cập nhật sản phẩm!', 'success');
    } else {
        // Thêm mới
        const newId = products.length ? Math.max(...products.map(p => +p.id)) + 1 : 1;
        products.push({ id: newId, name, price, category, platform, image, description });
        showToast('Đã thêm sản phẩm mới!', 'success');
    }
    saveAdminProducts(products);
    renderProductAdminList();
    bootstrap.Modal.getInstance(document.getElementById('productFormModal')).hide();
}
function openProductEdit(id) {
    openProductFormModal(id);
}
let productDeletePendingId = null;
function openProductDeleteModal(id) {
    const products = getAllGamesData();
    const product = products.find(p => p.id === id);
    productDeletePendingId = id;
    const content = document.getElementById('product-delete-content');
    if (content && product) {
        content.innerHTML = `<div class='mb-2'>Bạn có chắc chắn muốn xóa <span class='text-orange fw-bold'>${product.name}</span>?</div>`;
    }
    var modal = new bootstrap.Modal(document.getElementById('productDeleteModal'));
    modal.show();
}
document.getElementById('product-delete-confirm-btn')?.addEventListener('click', handleProductDelete);
function handleProductDelete() {
    if (productDeletePendingId == null) return;
    let products = getAllGamesData();
    products = products.filter(p => p.id != productDeletePendingId);
    saveAdminProducts(products);
    renderProductAdminList();
    bootstrap.Modal.getInstance(document.getElementById('productDeleteModal')).hide();
    showToast('Đã xóa sản phẩm!', 'success');
    productDeletePendingId = null;
}

// Hiển thị game đang SALE
function showSaleGames() {
    hideAllPages();
    document.getElementById('all-games').style.display = 'block';
    const games = getAllGamesData().filter(g => g.isSale || (g.sale && g.sale > 0));
    renderGames(games);
    scrollToTop();
    setActiveMenu('sale');
}

// Hiển thị game HOT DEALS
function showHotDeals() {
    hideAllPages();
    document.getElementById('all-games').style.display = 'block';
    const games = getAllGamesData().filter(g => g.isHot || g.hotDeal === true);
    renderGames(games);
    scrollToTop();
    setActiveMenu('hotdeals');
}

// Hiển thị game SẮP RA MẮT
function showComingSoonGames() {
    hideAllPages();
    document.getElementById('all-games').style.display = 'block';
    const games = getAllGamesData().filter(g => g.comingSoon === true);
    renderGames(games);
    scrollToTop();
    setActiveMenu('comingsoon');
}

// Đặt trạng thái active cho menu
function setActiveMenu(menu) {
    document.querySelectorAll('.main-menu-link').forEach(el => el.classList.remove('active'));
    if(menu === 'sale') {
        document.querySelector('.main-menu-link:nth-child(2)')?.classList.add('active');
    } else if(menu === 'hotdeals') {
        // Hot deals không có trong main menu, chỉ có trong dropdown
        // Không set active cho main menu
    } else if(menu === 'comingsoon') {
        // Coming soon không có trong main menu, chỉ có trong dropdown
        // Không set active cho main menu
    } else if(menu === 'home') {
        document.querySelector('.main-menu-link:nth-child(1)')?.classList.add('active');
    } else if(menu === 'contact') {
        document.querySelector('.main-menu-link:nth-child(3)')?.classList.add('active');
    }
}

// Khi click LIÊN HỆ
function showContactPage() {
    hideAllPages();
    document.getElementById('contact-page').style.display = 'block';
    scrollToTop();
    setActiveMenu('contact');
}
