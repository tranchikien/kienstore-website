// ===== CART FUNCTIONS =====
let cart = [];
let cartRemovePendingId = null;

function addToCart(gameData) {
    console.log('Adding to cart:', gameData); // Debug log
    
    if (!gameData) {
        showToast('Thông tin game không hợp lệ', 'error');
        return;
    }
    
    if (!gameData.name || gameData.name.trim() === '') {
        showToast('Tên game không hợp lệ', 'error');
        return;
    }
    
    if (gameData.price === undefined || gameData.price === null || gameData.price < 0) {
        showToast('Giá game không hợp lệ', 'error');
        return;
    }
    
    // Cho phép giá 0 (game miễn phí)
    if (gameData.price === 0) {
        gameData.price = 0; // Đảm bảo giá là 0
    }
    const existingItemIndex = cart.findIndex(item => item.id === gameData.id);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
        showToast(`Đã cập nhật số lượng ${gameData.name}`, 'success');
    } else {
        // Tìm thông tin game từ gamesData để lấy thông tin sale
        const game = typeof gamesData !== 'undefined' ? gamesData.find(g => g.id === gameData.id) : null;
        const originalPrice = game && game.isSale && game.sale > 0 ? game.price : gameData.price;
        const salePrice = game && game.isSale && game.sale > 0 ? game.price * (1 - game.sale / 100) : gameData.price;
        
        cart.push({
            id: gameData.id,
            name: gameData.name,
            price: salePrice, // Giá sau khi giảm
            originalPrice: originalPrice, // Giá gốc
            sale: game ? game.sale : 0, // Phần trăm giảm giá
            quantity: 1,
            image: gameData.image || 'https://via.placeholder.com/60x60?text=Game'
        });
        showToast(`Đã thêm ${gameData.name} vào giỏ hàng`, 'success');
    }
    updateCartDisplay();
    saveCartToStorage();
}

function removeFromCart(gameId) {
    const itemIndex = cart.findIndex(item => item.id === gameId);
    if (itemIndex > -1) {
        const gameName = cart[itemIndex].name;
        // Hiệu ứng fade-out
        const itemEl = document.getElementById('cart-item-' + gameId);
        if (itemEl) {
            itemEl.classList.remove('cart-fade-in');
            itemEl.classList.add('cart-fade-out');
            setTimeout(() => {
                cart.splice(itemIndex, 1);
                updateCartDisplay();
                saveCartToStorage();
                updateCartModal();
                showToast(`Đã xóa ${gameName} khỏi giỏ hàng`, 'success');
            }, 350);
        } else {
            cart.splice(itemIndex, 1);
            updateCartDisplay();
            saveCartToStorage();
            updateCartModal();
            showToast(`Đã xóa ${gameName} khỏi giỏ hàng`, 'success');
        }
    }
}

function updateCartItemQuantity(gameId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(gameId);
        return;
    }
    const itemIndex = cart.findIndex(item => item.id === gameId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity;
        updateCartDisplay();
        saveCartToStorage();
        updateCartPage();
        updateCartModal();
        showToast('Đã cập nhật số lượng', 'success');
    }
}

function saveCartToStorage() {
    localStorage.setItem('wongstore_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const data = localStorage.getItem('wongstore_cart');
    cart = data ? JSON.parse(data) : [];
    updateCartDisplay();
}

function updateCartDisplay() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'inline-block' : 'none';
}

function updateCartModal() {
    const container = document.getElementById('cart-items-container');
    const empty = document.getElementById('cart-empty');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!container || !empty || !totalEl) return;
    
    if (cart.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        totalEl.textContent = '0 VNĐ';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    empty.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item d-flex align-items-center justify-content-between mb-3 cart-fade-in" id="cart-item-${item.id}">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" class="cart-item-image me-3 cursor-pointer" alt="${item.name}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;" onclick="showProductDetailPage(${item.id})" title="Xem chi tiết sản phẩm">
                    <div>
                        <div class="fw-bold text-white cursor-pointer" onclick="showProductDetailPage(${item.id})" title="Xem chi tiết sản phẩm">${item.name}</div>
                        <div class="text-muted">
                            ${item.sale > 0 ? 
                                `<div class="d-flex flex-column">
                                    <span class="text-orange fw-bold">${formatPrice(item.price)}</span>
                                    <span class="text-decoration-line-through" style="font-size: 0.8em;">${formatPrice(item.originalPrice)}</span>
                                    <span class="badge bg-danger" style="font-size: 0.6em;">-${item.sale}%</span>
                                </div>` : 
                                `${formatPrice(item.price)}`
                            }
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <div class="quantity-controls me-3">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})" title="Giảm số lượng">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartItemQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})" title="Tăng số lượng">+</button>
                    </div>
                    <div class="text-end me-3">
                        <div class="fw-bold text-orange">${formatPrice(itemTotal)}</div>
                    </div>
                    <button class="btn btn-outline-info btn-sm me-2" onclick="showCartOrderDetailModal(${item.id})" title="Xem chi tiết đơn hàng"><i class="fas fa-receipt"></i></button>
                    <button class="btn btn-outline-danger btn-sm" onclick="showCartRemoveConfirmModal(${item.id})" title="Xóa khỏi giỏ hàng"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    totalEl.textContent = formatPrice(total);
}

function showCartOrderDetailModal(gameId) {
    const item = cart.find(i => i.id === gameId);
    if (!item) return;
    const modalContent = document.getElementById('cart-order-detail-content');
    if (!modalContent) return;
    modalContent.innerHTML = `
        <div class='text-center mb-3'>
            <img src='${item.image}' alt='${item.name}' style='width:80px;height:80px;object-fit:cover;border-radius:12px;'>
            <h5 class='mt-2 mb-1 text-orange'>${item.name}</h5>
        </div>
        <div class='mb-2'>
            <strong>Giá:</strong> 
            ${item.sale > 0 ? 
                `<div class="d-flex flex-column">
                    <span class="text-orange fw-bold">${formatPrice(item.price)} VNĐ</span>
                    <span class="text-decoration-line-through" style="font-size: 0.8em;">${formatPrice(item.originalPrice)} VNĐ</span>
                    <span class="badge bg-danger" style="font-size: 0.6em;">-${item.sale}%</span>
                </div>` : 
                `${formatPrice(item.price)} VNĐ`
            }
        </div>
        <div class='mb-2'><strong>Số lượng:</strong> ${item.quantity}</div>
        <div class='mb-2'><strong>Tổng cộng:</strong> <span class='text-orange fw-bold'>${formatPrice(item.price * item.quantity)}</span></div>
        <div class='mb-2'><strong>Mã sản phẩm:</strong> #${item.id}</div>
        <div class='mb-2'><strong>Trạng thái:</strong> <span class='badge bg-warning text-dark'>Chưa thanh toán</span></div>
        <div class='form-text mt-2'>(Đây là thông tin mẫu, có thể mở rộng thêm chi tiết đơn hàng thực tế)</div>
    `;
    var modal = new bootstrap.Modal(document.getElementById('cartOrderDetailModal'));
    modal.show();
}

function showCartRemoveConfirmModal(gameId) {
    const item = cart.find(i => i.id === gameId);
    if (!item) return;
    cartRemovePendingId = gameId;
    const modalContent = document.getElementById('cart-remove-confirm-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class='text-center mb-3'>
                <img src='${item.image}' alt='${item.name}' style='width:60px;height:60px;object-fit:cover;border-radius:8px;'>
                <div class='fw-bold mt-2 mb-1 text-orange'>${item.name}</div>
                <div>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</div>
            </div>
        `;
    }
    var modal = new bootstrap.Modal(document.getElementById('cartRemoveConfirmModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
    var removeBtn = document.getElementById('cart-remove-confirm-btn');
    if (removeBtn) {
        removeBtn.onclick = function() {
            if (cartRemovePendingId !== null) {
                removeFromCart(cartRemovePendingId);
                cartRemovePendingId = null;
                var modal = bootstrap.Modal.getInstance(document.getElementById('cartRemoveConfirmModal'));
                if (modal) modal.hide();
            }
        };
    }
});

function updateCartPage() {
    const itemsEl = document.getElementById('cart-page-items');
    const emptyEl = document.getElementById('cart-page-empty');
    const summaryEl = document.getElementById('cart-summary');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-page-total');
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    
    if (!itemsEl || !emptyEl || !summaryEl || !subtotalEl || !totalEl) return;
    
    if (cart.length === 0) {
        itemsEl.innerHTML = '';
        emptyEl.style.display = 'block';
        summaryEl.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    emptyEl.style.display = 'none';
    summaryEl.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" class="cart-item-image me-3" alt="${item.name}">
                    <div>
                        <div class="fw-bold text-white">${item.name}</div>
                        <div class="text-muted">
                            ${item.sale > 0 ? 
                                `<div class="d-flex flex-column">
                                    <span class="text-orange fw-bold">${formatPrice(item.price)}</span>
                                    <span class="text-decoration-line-through" style="font-size: 0.8em;">${formatPrice(item.originalPrice)}</span>
                                    <span class="badge bg-danger" style="font-size: 0.6em;">-${item.sale}%</span>
                                </div>` : 
                                `${formatPrice(item.price)}`
                            }
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <div class="quantity-controls me-3">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="updateCartItemQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="text-end me-3">
                        <div class="fw-bold text-orange">${formatPrice(itemTotal)}</div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    itemsEl.innerHTML = html;
    subtotalEl.textContent = formatPrice(total);
    totalEl.textContent = formatPrice(total);
}

function clearCart() {
    cart = [];
    updateCartDisplay();
    saveCartToStorage();
    updateCartModal();
    updateCartPage();
    showToast('Đã xóa toàn bộ giỏ hàng', 'success');
}

function handleCheckout() {
    if (cart.length === 0) {
        showToast('Giỏ hàng trống', 'error');
        return;
    }
    
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
        showToast('Vui lòng đăng nhập để thanh toán', 'warning');
        // Optionally redirect to login
        setTimeout(() => {
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        }, 1500);
        return;
    }
    
    showToast('Đang chuyển đến trang thanh toán...', 'info');
    openCheckoutModal();
} 

// Đảm bảo cập nhật giỏ hàng khi mở modal
if (typeof bootstrap !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        var cartModalEl = document.getElementById('cartModal');
        if (cartModalEl) {
            cartModalEl.addEventListener('show.bs.modal', function () {
                updateCartModal();
            });
        }
    });
} 