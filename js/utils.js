// ===== UTILITY FUNCTIONS =====

/**
 * Switch between modals
 */
function switchModal(fromModalId, toModalId) {
    const fromModal = bootstrap.Modal.getInstance(document.getElementById(fromModalId));
    const toModal = new bootstrap.Modal(document.getElementById(toModalId));
    
    fromModal.hide();
    setTimeout(() => {
        toModal.show();
    }, 300);
}

/**
 * Open modal
 */
function openModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

/**
 * Open checkout modal with auto-fill user data
 */
function openCheckoutModal() {
    // Auto-fill user data if logged in
    const user = getCurrentUser();
    if (user) {
        fillFromProfile();
        showToast('Thông tin đã được tự động điền từ profile!', 'success');
    } else {
        showToast('Vui lòng nhập thông tin thanh toán', 'info');
    }
    
    // Populate order summary
    populateCheckoutOrderSummary();
    
    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
}

/**
 * Fill checkout form from user profile
 */
function fillFromProfile() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Vui lòng đăng nhập để sử dụng tính năng này', 'error');
        return;
    }
    
    // Fill form fields
    const nameEl = document.getElementById('checkout-name');
    const emailEl = document.getElementById('checkout-email');
    const phoneEl = document.getElementById('checkout-phone');
    
    if (nameEl) nameEl.value = user.fullname || '';
    if (emailEl) emailEl.value = user.email || '';
    if (phoneEl) phoneEl.value = user.phone || '';
    
    // Show auto-fill notice
    const noticeEl = document.getElementById('checkout-auto-fill-notice');
    if (noticeEl) {
        noticeEl.style.display = 'block';
        setTimeout(() => {
            noticeEl.style.display = 'none';
        }, 5000);
    }
    
    showToast('Đã điền thông tin từ profile!', 'success');
}

/**
 * Populate checkout order summary
 */
function populateCheckoutOrderSummary() {
    const orderItemsEl = document.getElementById('checkout-order-items');
    const totalEl = document.getElementById('checkout-total');
    
    if (!orderItemsEl || !totalEl) return;
    
    if (cart.length === 0) {
        orderItemsEl.innerHTML = '<p class="text-muted text-center">Giỏ hàng trống</p>';
        totalEl.textContent = '0 VNĐ';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" 
                         style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px; margin-right: 10px;">
                    <div>
                        <div class="fw-bold">${item.name}</div>
                        <small class="text-muted">Số lượng: ${item.quantity}</small>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold">${formatPrice(itemTotal)} VNĐ</div>
                    ${item.sale > 0 ? `<small class="text-decoration-line-through text-muted">${formatPrice(item.originalPrice * item.quantity)} VNĐ</small>` : ''}
                </div>
            </div>
        `;
    });
    
    orderItemsEl.innerHTML = html;
    totalEl.textContent = `${formatPrice(total)} VNĐ`;
}

/**
 * Buy now function
 */
function buyNow(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (game) {
        showToast(`Đang chuyển đến trang thanh toán cho ${game.name}`, 'info');
        openCheckoutModal();
    }
}

/**
 * Open image modal
 */
function openImageModal(imageSrc) {
    // Create modal for image viewing
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content bg-dark">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title text-white">Hình ảnh game</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="${imageSrc}" alt="Game Screenshot" class="img-fluid">
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

/**
 * Show toast message
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    let icon = '';
    switch(type) {
        case 'success': icon = '<span class="toast-icon"><i class="fas fa-check-circle"></i></span>'; break;
        case 'error': icon = '<span class="toast-icon"><i class="fas fa-times-circle"></i></span>'; break;
        case 'warning': icon = '<span class="toast-icon"><i class="fas fa-exclamation-triangle"></i></span>'; break;
        default: icon = '<span class="toast-icon"><i class="fas fa-info-circle"></i></span>';
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

// ===== PAGE NAVIGATION FUNCTIONS =====

/**
 * Show Profile Page (mở modal thay vì section)
 */
function showProfilePage() {
    try {
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) loginModal.hide();
        const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        if (registerModal) registerModal.hide();
    } catch {}
    
    // Lấy user từ localStorage['user']
    const user = getCurrentUser();
    
    console.log('Current user:', user); // Debug log
    
    // Update profile display elements
    const displayNameEl = document.getElementById('profile-display-name');
    const displayEmailEl = document.getElementById('profile-display-email');
    const fullnameEl = document.getElementById('modal-profile-fullname');
    const emailEl = document.getElementById('modal-profile-email');
    const phoneEl = document.getElementById('modal-profile-phone');
    const addressEl = document.getElementById('modal-profile-address');
    const birthdayEl = document.getElementById('modal-profile-birthday');
    const locationEl = document.getElementById('modal-profile-location');
    
    console.log('Found elements:', {
        displayNameEl: !!displayNameEl,
        displayEmailEl: !!displayEmailEl,
        fullnameEl: !!fullnameEl,
        emailEl: !!emailEl,
        phoneEl: !!phoneEl,
        addressEl: !!addressEl,
        birthdayEl: !!birthdayEl,
        locationEl: !!locationEl
    });
    
    if (user) {
        console.log('Filling user data:', user);
        
        // Update display info
        if (displayNameEl) {
            displayNameEl.textContent = user.fullname || 'User Name';
            console.log('Set display name to:', user.fullname);
        }
        if (displayEmailEl) {
            displayEmailEl.textContent = user.email || 'user@email.com';
            console.log('Set display email to:', user.email);
        }
        
        // Update form fields
        if (fullnameEl) {
            fullnameEl.value = user.fullname || '';
            console.log('Set fullname field to:', user.fullname);
        }
        if (emailEl) {
            emailEl.value = user.email || '';
            console.log('Set email field to:', user.email);
        }
        if (phoneEl) {
            phoneEl.value = user.phone || '';
            console.log('Set phone field to:', user.phone);
        }
        if (addressEl) {
            addressEl.value = user.address || '';
            console.log('Set address field to:', user.address);
        }
        if (birthdayEl) {
            birthdayEl.value = user.birthday || '';
            console.log('Set birthday field to:', user.birthday);
        }
        if (locationEl) {
            locationEl.value = user.location || '';
            console.log('Set location field to:', user.location);
        }
        
        // Update last updated time
        const lastUpdatedEl = document.getElementById('last-updated');
        if (lastUpdatedEl) {
            const lastUpdated = user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never';
            lastUpdatedEl.textContent = lastUpdated;
            console.log('Set last updated to:', lastUpdated);
        }
    } else {
        console.log('No user found, resetting fields');
        
        // Reset all fields
        if (displayNameEl) displayNameEl.textContent = 'User Name';
        if (displayEmailEl) displayEmailEl.textContent = 'user@email.com';
        if (fullnameEl) fullnameEl.value = '';
        if (emailEl) emailEl.value = '';
        if (phoneEl) phoneEl.value = '';
        if (addressEl) addressEl.value = '';
        if (birthdayEl) birthdayEl.value = '';
        if (locationEl) locationEl.value = '';
    }
    
    openModal('profileModal');
    showToast('Profile page opened', 'info');
}

/**
 * Show Contact Page
 */
function showContactPage() {
    hideAllPages();
    document.getElementById('contact-page').style.display = 'block';
    updateBreadcrumbForPage('Contact');
    scrollToTop();
    showToast('Đã mở trang liên hệ', 'info');
}

/**
 * Show Cart Page
 */
function showCartPage() {
    hideAllPages();
    // Ẩn modal giỏ hàng nếu đang mở
    try {
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (cartModal) cartModal.hide();
    } catch {}
    document.getElementById('cart-page').style.display = 'block';
    updateCartPage();
    updateBreadcrumbForPage('Shopping Cart');
    scrollToTop();
    showToast('Đã mở trang giỏ hàng', 'info');
}

/**
 * Show Product Detail Page
 */
function showProductDetailPage(gameId) {
    hideAllPages();
    document.getElementById('product-detail-page').style.display = 'block';
    loadProductDetail(gameId);
    const game = gamesData.find(g => g.id === gameId);
    if (game) {
        updateBreadcrumbForPage(game.name, [
            { text: 'Games', onclick: 'showAllGames()' }
        ]);
    }
    scrollToTop();
}

/**
 * Show Home Page
 */
function showHomePage() {
    hideAllPages();
    document.getElementById('home').style.display = 'block';
    document.getElementById('featured-games').style.display = 'block';
    document.getElementById('all-games').style.display = 'block';
    updateBreadcrumbForPage('Home');
    scrollToTop();
    showToast('Đã về trang chủ', 'info');
}

/**
 * Hide all pages
 */
function hideAllPages() {
    const pages = [
        'home', 'all-games', 'filtered-games-section', 'featured-games',
        'profile-page', 'contact-page', 'cart-page', 'product-detail-page',
        'wishlist-page', 'order-history-page'
    ];
    
    pages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            page.style.display = 'none';
        }
    });
}

/**
 * Scroll to top
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== PROFILE PAGE FUNCTIONS =====

/**
 * Handle profile form submission (both modal and page forms)
 */
function handleProfileFormSubmit(e) {
    e.preventDefault();
    
    // Get form data from modal or page
    const fullname = document.getElementById('modal-profile-fullname')?.value || document.getElementById('profile-fullname')?.value;
    const phone = document.getElementById('modal-profile-phone')?.value || document.getElementById('profile-phone')?.value;
    const address = document.getElementById('modal-profile-address')?.value || document.getElementById('profile-address')?.value;
    const birthday = document.getElementById('modal-profile-birthday')?.value || document.getElementById('profile-birthday')?.value;
    const location = document.getElementById('modal-profile-location')?.value;

    // Validate form
    if (!fullname.trim()) {
        showToast('Please enter your full name', 'error');
        return;
    }

    if (!phone.trim()) {
        showToast('Please enter your phone number', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Saving...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Update user data
        const currentUser = getCurrentUser();
        const updatedUser = {
            ...currentUser,
            fullname: fullname,
            phone: phone,
            address: address,
            birthday: birthday,
            location: location,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update registered users
        let users = getRegisteredUsers();
        const idx = users.findIndex(u => u.email === updatedUser.email);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...updatedUser };
            localStorage.setItem('registered_users', JSON.stringify(users));
        }
        
        // Update UI
        updateUserDropdown();
        
        // Update profile display
        const displayNameEl = document.getElementById('profile-display-name');
        if (displayNameEl) displayNameEl.textContent = fullname;
        
        // Update profile page if exists
        const profileUsername = document.getElementById('profile-username');
        if (profileUsername) profileUsername.textContent = fullname;
        
        // Update last updated time
        const lastUpdatedEl = document.getElementById('last-updated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = new Date().toLocaleDateString();
        }
        
        showToast('Profile updated successfully!', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Close modal if it's open
        const profileModal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
        if (profileModal) profileModal.hide();
    }, 1000);
}

// Add event listeners for both forms
document.getElementById('profile-form')?.addEventListener('submit', handleProfileFormSubmit);
document.getElementById('profileInfoForm')?.addEventListener('submit', handleProfileFormSubmit);

// Add password strength indicator
document.getElementById('modal-new-password')?.addEventListener('input', function() {
    const password = this.value;
    const strengthEl = document.getElementById('password-strength');
    if (strengthEl) {
        const strength = validatePasswordStrength(password);
        if (strength.isValid) {
            strengthEl.className = 'password-strength very-strong';
        } else if (password.length >= 6) {
            strengthEl.className = 'password-strength strong';
        } else if (password.length >= 4) {
            strengthEl.className = 'password-strength medium';
        } else {
            strengthEl.className = 'password-strength weak';
        }
    }
});

// Add avatar upload functionality
document.getElementById('modal-profile-avatar')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const avatarImg = document.getElementById('modal-profile-avatar-img');
            if (avatarImg) {
                avatarImg.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
});

// Add card number formatting
document.getElementById('modal-visa-card')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
});

// Add expiry date formatting
document.getElementById('modal-visa-expiry')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// Add profile modal event listener to auto-fill data when modal opens
document.getElementById('profileModal')?.addEventListener('shown.bs.modal', function() {
    console.log('Profile modal opened, filling data...');
    const user = getCurrentUser();
    
    if (user) {
        // Update display info
        const displayNameEl = document.getElementById('profile-display-name');
        const displayEmailEl = document.getElementById('profile-display-email');
        
        if (displayNameEl) displayNameEl.textContent = user.fullname || 'User Name';
        if (displayEmailEl) displayEmailEl.textContent = user.email || 'user@email.com';
        
        // Update form fields
        const fullnameEl = document.getElementById('modal-profile-fullname');
        const emailEl = document.getElementById('modal-profile-email');
        const phoneEl = document.getElementById('modal-profile-phone');
        const addressEl = document.getElementById('modal-profile-address');
        const birthdayEl = document.getElementById('modal-profile-birthday');
        const locationEl = document.getElementById('modal-profile-location');
        
        if (fullnameEl) fullnameEl.value = user.fullname || '';
        if (emailEl) emailEl.value = user.email || '';
        if (phoneEl) phoneEl.value = user.phone || '';
        if (addressEl) addressEl.value = user.address || '';
        if (birthdayEl) birthdayEl.value = user.birthday || '';
        if (locationEl) locationEl.value = user.location || '';
        
        // Update last updated time
        const lastUpdatedEl = document.getElementById('last-updated');
        if (lastUpdatedEl) {
            const lastUpdated = user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never';
            lastUpdatedEl.textContent = lastUpdated;
        }
        
        console.log('Profile data filled successfully');
    }
});

/**
 * Handle password change form submission
 */
document.getElementById('change-password-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;

    // Validate form
    if (!currentPassword) {
        showToast('Please enter your current password', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast('New password must be at least 6 characters', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Password confirmation does not match', 'error');
        return;
    }

    // Simulate API call
    setTimeout(() => {
        showToast('Password changed successfully!', 'success');
        e.target.reset();
    }, 1000);
});

// ===== CONTACT PAGE FUNCTIONS =====

/**
 * Handle contact form submission
 */
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    // Validate form
    if (!name.trim()) {
        showToast('Please enter your full name', 'error');
        return;
    }

    if (!email.trim()) {
        showToast('Please enter your email', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Invalid email address', 'error');
        return;
    }

    if (!message.trim()) {
        showToast('Please enter your message content', 'error');
        return;
    }

    // Simulate API call
    setTimeout(() => {
        showToast('Message sent successfully! We will respond as soon as possible.', 'success');
        e.target.reset();
    }, 1000);
});

// ===== GAME DETAIL MODAL FUNCTIONS =====

/**
 * Show game detail modal
 */
function showGameDetail(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;

    const modal = document.getElementById('gameDetailModal');
    const title = document.getElementById('gameDetailTitle');
    const content = document.getElementById('gameDetailContent');

    title.innerHTML = `<i class="fas fa-gamepad text-orange me-2"></i>${game.name}`;

    content.innerHTML = `
        <div class="row">
            <div class="col-lg-6">
                <div class="game-detail-image">
                    <img src="${game.image}" alt="${game.name}" class="img-fluid rounded-3 mb-3" id="main-game-image">
                    <div class="row g-2">
                        ${(game.screenshots || []).map(screenshot => `
                            <div class="col-6">
                                <img src="${screenshot}" alt="Screenshot" class="img-fluid rounded screenshot-thumb" 
                                     onclick="changeMainImage('${screenshot}')">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="game-detail-info">
                    <h3 class="text-white mb-3">${game.name}</h3>
                    <div class="game-meta mb-3">
                        <p class="mb-2"><i class="fas fa-tag text-orange me-2"></i><strong>Category:</strong> ${game.category}</p>
                        <p class="mb-2"><i class="fas fa-desktop text-orange me-2"></i><strong>Platform:</strong> ${game.platform}</p>
                        <p class="mb-2"><i class="fas fa-cog text-orange me-2"></i><strong>Configuration:</strong> ${game.configuration || 'Updating'}</p>
                    </div>
                    <div class="price-section mb-4 text-center">
                        <div class="price-container bg-dark p-3 rounded">
                            ${game.isSale && game.sale > 0 ? 
                                `<div class="d-flex flex-column align-items-center">
                                                            <span class="current-price text-orange fw-bold fs-2">${formatPrice(game.price * (1 - game.sale / 100))}</span>
                        <span class="text-muted text-decoration-line-through" style="font-size: 0.9em;">${formatPrice(game.price)}</span>
                                    <span class="badge bg-danger mt-2" style="font-size: 0.8em;">-${game.sale}%</span>
                                </div>` : 
                                `<span class="current-price text-orange fw-bold fs-2">${formatPrice(game.price)}</span>`
                            }
                            <div class="price-badges mt-2">
                                <span class="badge bg-success me-2">
                                    <i class="fas fa-check me-1"></i>Available
                                </span>
                                <span class="badge bg-orange">
                                    <i class="fas fa-shield-alt me-1"></i>Authentic Key
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="action-buttons mb-4">
                        <button class="btn btn-orange btn-lg me-3 hover-lift w-100 mb-2" 
                                onclick="addToCart({id: ${game.id}, name: '${game.name}', price: ${game.price}, image: '${game.image}'})">
                            <i class="fas fa-cart-plus me-2"></i>Add to Cart
                        </button>
                        <button class="btn btn-outline-light btn-lg hover-lift w-100">
                            <i class="fas fa-heart me-2"></i>Wishlist
                        </button>
                    </div>
                    <div class="game-description">
                        <h6 class="text-orange mb-3">
                            <i class="fas fa-info-circle me-2"></i>Description
                        </h6>
                        <p class="text-light">${game.description}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const bootstrapModal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
    bootstrapModal.show();
}

/**
 * Change main image in game detail modal
 */
function changeMainImage(src) {
    const mainImage = document.getElementById('main-game-image');
    if (mainImage) {
        mainImage.src = src;
        mainImage.style.opacity = '0.7';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 150);
    }
}

// ===== FILTERED GAMES FUNCTIONS =====

/**
 * Render filtered games
 */
function renderFilteredGames(games, title, desc) {
    console.log('Rendering filtered games:', games); // Debug log
    console.log('Title:', title); // Debug log
    console.log('Desc:', desc); // Debug log
    
    // Ẩn các section khác, chỉ hiện filtered section
    const allGamesEl = document.getElementById('all-games');
    const featuredGamesEl = document.getElementById('featured-games');
    const filteredGamesEl = document.getElementById('filtered-games-section');
    
    if (allGamesEl) allGamesEl.style.display = 'none';
    if (featuredGamesEl) featuredGamesEl.style.display = 'none';
    if (filteredGamesEl) filteredGamesEl.style.display = 'block';

    // Cập nhật tiêu đề và mô tả
    const titleEl = document.getElementById('filtered-games-title');
    const descEl = document.getElementById('filtered-games-desc');
    if (titleEl) titleEl.innerHTML = title;
    if (descEl) descEl.innerText = desc || '';

    // Render danh sách game
    const listEl = document.getElementById('filtered-games-list');
    if (!listEl) {
        console.error('filtered-games-list element not found!');
        return;
    }
    
    listEl.innerHTML = '';
    if (!games || games.length === 0) {
        listEl.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
                <i class="fas fa-search mb-3" style="font-size: 3rem;"></i>
                <h5>No games found matching your criteria</h5>
                <p>Please try searching with different keywords or select a different category</p>
                <button class="btn btn-orange" onclick="showAllGames()">
                    <i class="fas fa-th-large me-2"></i>View all games
                </button>
            </div>
        `;
        return;
    }
    
    games.forEach(game => {
        listEl.innerHTML += createEnhancedGameCard(game);
    });
}

/**
 * Filter by category
 */
function filterByCategory(category) {
    console.log('Filtering by category:', category); // Debug log
    console.log('Available gamesData:', gamesData); // Debug log
    
    const filtered = gamesData.filter(game => game.category && game.category.toLowerCase() === category.toLowerCase());
    console.log('Filtered games:', filtered); // Debug log
    
    // Thêm scroll to top để đảm bảo người dùng thấy kết quả
    scrollToTop();
    
    renderFilteredGames(
        filtered,
        `<i class="fas fa-th-large text-orange me-2"></i>Game by Category: ${category}`,
        `There are ${filtered.length} games in the "${category}" category`
    );
}

// ===== FEATURED GAMES FUNCTIONS =====

/**
 * Populate featured games section
 */
function populateFeaturedGames() {
    const featuredGamesGrid = document.getElementById('featured-games-grid');
    if (!featuredGamesGrid) return;
    
    const featuredGames = gamesData.filter(game => game.isFeatured);
    let gamesHTML = '';
    
    featuredGames.forEach(game => {
        gamesHTML += createEnhancedGameCard(game);
    });
    
    featuredGamesGrid.innerHTML = gamesHTML;
}

// ===== SEARCH FUNCTIONS =====

/**
 * Search games with Enter key
 */
document.getElementById('searchInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchGames(e);
    }
});

// ===== PARALLAX HERO BANNER FUNCTIONS =====

/**
 * Render parallax hero banner with featured games
 */
function renderParallaxHeroBanner() {
    const bannerEl = document.getElementById('parallaxHeroBanner');
    if (!bannerEl) return;
    
    const featuredGames = gamesData.filter(game => game.isFeatured);
    if (!featuredGames.length) return;

    let current = 0;
    let intervalId = null;

    function renderSlide(idx) {
        const game = featuredGames[idx];
        bannerEl.innerHTML = `
            <div class="parallax-bg position-absolute w-100 h-100" style="background-image: url('${game.banner || game.image}'); background-size: cover; background-position: center; filter: brightness(0.6); transition: background 0.8s; will-change: background;"></div>
            <div class="parallax-fg position-absolute d-none d-lg-block" style="right: 5%; top: 50%; transform: translateY(-50%); z-index: 2; pointer-events: none;">
                <img src="${game.image}" alt="${game.name}" class="floating-img" style="width: 420px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); transition: transform 0.5s; will-change: transform;" />
            </div>
            <div class="hero-content position-relative z-3 text-white" style="max-width: 600px; margin-left: 5%; top: 25%;">
                <h1 class="display-3 fw-bold mb-3">${game.name}</h1>
                <div class="mb-3">
                    ${game.isSale && game.sale > 0 ? 
                        `<div class="d-flex flex-column align-items-start">
                            <span class="badge bg-orange fs-5 py-2 px-4">${formatPrice(game.price * (1 - game.sale / 100))}</span>
                            <span class="text-muted text-decoration-line-through" style="font-size: 0.8em;">${formatPrice(game.price)}</span>
                            <span class="badge bg-danger" style="font-size: 0.7em;">-${game.sale}%</span>
                        </div>` : 
                                                    `<span class="badge bg-orange fs-5 py-2 px-4">${formatPrice(game.price)}</span>`
                    }
                </div>
                <p class="lead mb-4">${game.description.substring(0, 120)}...</p>
                <div class="d-flex gap-3">
                    <button class="btn btn-orange btn-lg px-4" onclick="showProductDetailPage(${game.id})">
                        <i class="fas fa-info-circle me-2"></i>Details
                    </button>
                    <button class="btn btn-outline-light btn-lg px-4" onclick="addToCart({id: ${game.id}, name: '${game.name}', price: ${game.price}, image: '${game.image}'})">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
            <div class="parallax-controls position-absolute w-100 d-flex justify-content-between align-items-center px-3" style="top: 50%; left: 0; z-index: 10; pointer-events: none;">
                <button class="btn btn-outline-light btn-lg" style="pointer-events: all;" aria-label="Previous" id="parallaxPrevBtn">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="btn btn-outline-light btn-lg" style="pointer-events: all;" aria-label="Next" id="parallaxNextBtn">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="parallax-indicators position-absolute w-100 d-flex justify-content-center" style="bottom: 24px; z-index: 10;">
                ${featuredGames.map((_, i) => `
                    <span class="mx-1 rounded-circle" style="display:inline-block;width:12px;height:12px;background:${i===idx?'#f97316':'#fff3'};border:2px solid #fff;cursor:pointer;transition:background 0.3s;" data-idx="${i}"></span>
                `).join('')}
            </div>
        `;
    }

    function goTo(idx) {
        current = (idx + featuredGames.length) % featuredGames.length;
        renderSlide(current);
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(next, 6000);
    }

    function stopAuto() {
        if (intervalId) clearInterval(intervalId);
    }

    // Parallax effect
    function handleParallax(e) {
        const bg = bannerEl.querySelector('.parallax-bg');
        const fg = bannerEl.querySelector('.parallax-fg img');
        const rect = bannerEl.getBoundingClientRect();
        let x = 0, y = 0;
        
        if (e.type.startsWith('mouse')) {
            x = (e.clientX - rect.left) / rect.width - 0.5;
            y = (e.clientY - rect.top) / rect.height - 0.5;
        } else if (e.type.startsWith('touch')) {
            const touch = e.touches[0];
            x = (touch.clientX - rect.left) / rect.width - 0.5;
            y = (touch.clientY - rect.top) / rect.height - 0.5;
        } else if (e.type === 'scroll') {
            y = window.scrollY / window.innerHeight - 0.5;
        }
        
        if (bg) bg.style.transform = `scale(1.08) translate(${x * 30}px, ${y * 30}px)`;
        if (fg) fg.style.transform = `translateY(${y * 30}px) translateX(${x * 30}px) scale(1.04)`;
    }

    // Initial render
    renderSlide(current);
    startAuto();

    // Event listeners
    bannerEl.addEventListener('mousemove', handleParallax);
    bannerEl.addEventListener('touchmove', handleParallax);
    window.addEventListener('scroll', handleParallax);

    bannerEl.addEventListener('mouseleave', () => {
        const bg = bannerEl.querySelector('.parallax-bg');
        const fg = bannerEl.querySelector('.parallax-fg img');
        if (bg) bg.style.transform = '';
        if (fg) fg.style.transform = '';
    });

    bannerEl.addEventListener('mouseenter', stopAuto);
    bannerEl.addEventListener('mouseleave', startAuto);

    // Navigation
    bannerEl.addEventListener('click', function(e) {
        if (e.target.closest('#parallaxPrevBtn')) {
            prev(); startAuto();
        } else if (e.target.closest('#parallaxNextBtn')) {
            next(); startAuto();
        } else if (e.target.matches('.parallax-indicators span')) {
            const idx = Number(e.target.getAttribute('data-idx'));
            goTo(idx); startAuto();
        }
    });
}

// ===== SEARCH SUGGESTIONS FUNCTIONS =====

/**
 * Show search suggestions
 */
function showSearchSuggestions(query) {
    const suggestionsEl = document.getElementById('searchSuggestions');
    if (!suggestionsEl || !query.trim()) {
        suggestionsEl.style.display = 'none';
        return;
    }

    const filteredGames = gamesData.filter(game => 
        game.name.toLowerCase().includes(query.toLowerCase()) ||
        game.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (filteredGames.length === 0) {
        suggestionsEl.style.display = 'none';
        return;
    }

    suggestionsEl.innerHTML = filteredGames.map(game => `
        <div class="search-suggestion-item" onclick="selectSearchSuggestion('${game.name}')">
            <img src="${game.image}" alt="${game.name}">
            <div class="suggestion-info">
                <div class="suggestion-name">${game.name}</div>
                <div class="suggestion-price">
                    ${game.isSale && game.sale > 0 ? 
                        `<div class="d-flex flex-column">
                                                    <span class="text-orange fw-bold">${formatPrice(game.price * (1 - game.sale / 100))}</span>
                        <span class="text-decoration-line-through" style="font-size: 0.8em;">${formatPrice(game.price)}</span>
                        </div>` : 
                        `${formatPrice(game.price)}`
                    }
                </div>
            </div>
        </div>
    `).join('');

    suggestionsEl.style.display = 'block';
}

/**
 * Select search suggestion
 */
function selectSearchSuggestion(gameName) {
    document.getElementById('searchInput').value = gameName;
    document.getElementById('searchSuggestions').style.display = 'none';
    searchGames({ preventDefault: () => {} });
}

// ===== WISHLIST FUNCTIONS =====

/**
 * Add game to wishlist
 */
function addToWishlist(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;

    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (wishlist.find(item => item.id === gameId)) {
        showToast('Game is already in your wishlist!', 'warning');
        return;
    }

    // Tính toán giá mới và lưu thông tin sale
    const originalPrice = game.price;
    const salePrice = game.isSale && game.sale > 0 ? game.price * (1 - game.sale / 100) : game.price;
    
    wishlist.push({
        id: game.id,
        name: game.name,
        price: salePrice, // Giá sau khi giảm
        originalPrice: originalPrice, // Giá gốc
        sale: game.isSale && game.sale > 0 ? game.sale : 0, // Phần trăm giảm giá
        image: game.image,
        category: game.category,
        addedAt: new Date().toISOString()
    });

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showToast(`Added ${game.name} to your wishlist!`, 'success');
    updateWishlistCount();
}

/**
 * Remove game from wishlist
 */
function removeFromWishlist(gameId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(item => item.id !== gameId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    showToast('Game removed from wishlist!', 'info');
    updateWishlistCount();
    
    if (document.getElementById('wishlist-page').style.display !== 'none') {
        renderWishlist();
    }
}

/**
 * Show wishlist page
 */
function showWishlist() {
    hideAllPages();
    document.getElementById('wishlist-page').style.display = 'block';
    renderWishlist();
    updateBreadcrumbForPage('Wishlist');
    scrollToTop();
    showToast('Đã mở trang wishlist', 'info');
}

/**
 * Render wishlist
 */
function renderWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const emptyEl = document.getElementById('wishlist-empty');
    const itemsEl = document.getElementById('wishlist-items');

    if (wishlist.length === 0) {
        emptyEl.style.display = 'block';
        itemsEl.style.display = 'none';
        return;
    }

    emptyEl.style.display = 'none';
    itemsEl.style.display = 'block';

    itemsEl.innerHTML = wishlist.map(item => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="wishlist-item d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info ms-3">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">
                        ${item.sale > 0 ? 
                            `<div class="d-flex flex-column">
                                                    <span class="text-orange fw-bold">${formatPrice(item.price)}</span>
                    <span class="text-decoration-line-through" style="font-size: 0.8em;">${formatPrice(item.originalPrice)}</span>
                                <span class="badge bg-danger" style="font-size: 0.6em;">-${item.sale}%</span>
                            </div>` : 
                            `${formatPrice(item.price)}`
                        }
                    </div>
                    <div class="item-actions mt-2">
                        <button class="btn btn-orange btn-sm" onclick="addToCart({id: ${item.id}, name: '${item.name}', price: ${item.originalPrice}, image: '${item.image}'})">
                            <i class="fas fa-cart-plus me-1"></i>Add to Cart
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="removeFromWishlist(${item.id})">
                            <i class="fas fa-trash me-1"></i>Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Update wishlist count
 */
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const countEl = document.getElementById('wishlist-count');
    if (countEl) {
        countEl.textContent = wishlist.length;
        countEl.style.display = wishlist.length > 0 ? 'block' : 'none';
    }
}

// ===== ORDER HISTORY FUNCTIONS =====

/**
 * Show order history page
 */
function showOrderHistory() {
    hideAllPages();
    document.getElementById('order-history-page').style.display = 'block';
    renderOrderHistory();
    updateBreadcrumbForPage('Order History');
    scrollToTop();
    showToast('Đã mở trang lịch sử đơn hàng', 'info');
}

/**
 * Render order history
 */
function renderOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const listEl = document.getElementById('order-history-list');

    if (orders.length === 0) {
        listEl.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="fas fa-box text-muted mb-3" style="font-size: 2rem;"></i>
                    <p class="text-muted">No orders yet</p>
                </td>
            </tr>
        `;
        return;
    }

    listEl.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString('vi-VN')}</td>
            <td>${order.items.map(item => item.name).join(', ')}</td>
                                    <td>${formatPrice(order.total)}</td>
            <td><span class="badge bg-success">${order.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-orange" onclick="viewOrderDetail(${order.id})">
                    <i class="fas fa-eye me-1"></i>View
                </button>
            </td>
        </tr>
    `).join('');
}

// ===== BACK TO TOP FUNCTION =====

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
}

// ===== ENHANCED GAME CARD FUNCTIONS =====

/**
 * Create enhanced game card with badges and ratings
 */
function createEnhancedGameCard(game) {
    const badges = [];
    if (game.isHot) badges.push('<span class="card-badge badge-hot">HOT</span>');
    if (game.isNew) badges.push('<span class="card-badge badge-new">NEW</span>');
    if (game.isSale && game.sale > 0) badges.push(`<span class="card-badge badge-sale">-${game.sale}%</span>`);
    const rating = Math.floor(Math.random() * 2) + 4; // Random rating 4-5
    const sold = Math.floor(Math.random() * 1000) + 100; // Random sold count
    // Hiển thị giá cũ và giá mới nếu có sale
    let priceHTML = '';
    if (game.isSale && game.sale > 0) {
        const newPrice = game.price * (1 - game.sale / 100);
        priceHTML = `
            <div class="d-flex flex-column">
                                        <span class="price text-orange fw-bold">${formatPrice(newPrice)}</span>
                        <span class="price-old text-muted text-decoration-line-through" style="font-size: 0.9em;">${formatPrice(game.price)}</span>
                <span class="badge bg-danger" style="font-size: 0.7em;">-${game.sale}%</span>
            </div>`;
    } else {
                    priceHTML = `<span class="price text-orange fw-bold">${formatPrice(game.price)}</span>`;
    }
    return `
        <div class="col-md-3 col-sm-6 mb-4">
            <div class="game-card card-hover h-100" onclick="showGameDetail(${game.id})">
                ${badges.join('')}
                <div class="game-rating">
                    <i class="fas fa-star"></i> ${rating}.0
                </div>
                <div class="game-sold">
                    <i class="fas fa-users"></i> ${sold}
                </div>
                <div class="card-image-container">
                    <img src="${game.image}" class="game-card-image" alt="${game.name}">
                    <div class="card-overlay">
                        <div class="overlay-content">
                            <button class="btn btn-orange btn-sm mb-2" onclick="event.stopPropagation(); addToCart({id: ${game.id}, name: '${game.name}', price: ${game.price}, image: '${game.image}'})">
                                <i class="fas fa-cart-plus me-1"></i>Add to Cart
                            </button>
                            <button class="btn btn-outline-light btn-sm" onclick="event.stopPropagation(); addToWishlist(${game.id})">
                                <i class="fas fa-heart me-1"></i>Wishlist
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${game.name}</h5>
                    <p class="card-text">${game.description.substring(0, 80)}...</p>
                    <div class="price-section">${priceHTML}</div>
                </div>
            </div>
        </div>
    `;
}

// ===== PRICE ALERT FUNCTIONS =====

/**
 * Set price alert for a game
 */
function setPriceAlert(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;
    
    const currentPrice = game.isSale && game.sale > 0 ? game.price * (1 - game.sale / 100) : game.price;
    const originalPrice = game.price;
    const alertPrice = Math.floor(currentPrice * 0.8); // 20% discount
    
    const alertMessage = `
        <div class="text-center">
            <h6 class="mb-3">Price Alert for ${game.name}</h6>
            ${game.isSale && game.sale > 0 ? 
                `<div class="mb-3">
                                            <p class="text-muted mb-1">Current Price: <span class="text-orange fw-bold">${formatPrice(currentPrice)}</span></p>
                        <p class="text-muted" style="font-size: 0.9em;">Original Price: <span class="text-decoration-line-through">${formatPrice(originalPrice)}</span></p>
                    <span class="badge bg-danger">-${game.sale}%</span>
                </div>` : 
                                    `<p class="text-muted mb-3">Current Price: ${formatPrice(currentPrice)}</p>`
            }
            <div class="mb-3">
                <label class="form-label">Notify when price drops to:</label>
                <input type="number" class="form-control" id="alert-price-input" value="${alertPrice}" min="0" max="${currentPrice}">
            </div>
            <div class="mb-3">
                <label class="form-label">Email for notifications:</label>
                <input type="email" class="form-control" id="alert-email-input" placeholder="your@email.com">
            </div>
        </div>
    `;
    
    // Show modal with price alert form
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content bg-dark text-white">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title"><i class="fas fa-bell text-orange me-2"></i>Price Alert</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${alertMessage}
                </div>
                <div class="modal-footer border-secondary">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-orange" onclick="savePriceAlert(${gameId})">Save Alert</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

/**
 * Save price alert
 */
function savePriceAlert(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    const alertPrice = document.getElementById('alert-price-input').value;
    const alertEmail = document.getElementById('alert-email-input').value;
    
    if (!alertPrice || !alertEmail) {
        showToast('Please enter all information', 'error');
        return;
    }
    
    if (!isValidEmail(alertEmail)) {
        showToast('Invalid email address', 'error');
        return;
    }
    
    let priceAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    
    // Check if alert already exists
    const existingAlert = priceAlerts.find(alert => alert.gameId === gameId && alert.email === alertEmail);
    if (existingAlert) {
        existingAlert.alertPrice = parseInt(alertPrice);
        existingAlert.createdAt = new Date().toISOString();
    } else {
        priceAlerts.push({
            gameId: gameId,
            gameName: game.name,
            gameImage: game.image,
            currentPrice: game.price,
            alertPrice: parseInt(alertPrice),
            email: alertEmail,
            createdAt: new Date().toISOString(),
            isActive: true
        });
    }
    
    localStorage.setItem('priceAlerts', JSON.stringify(priceAlerts));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.querySelector('.modal'));
    if (modal) modal.hide();
    
    showToast(`Price alert created for ${game.name}!`, 'success');
}

/**
 * Check price alerts (simulate price changes)
 */
function checkPriceAlerts() {
    const priceAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    const activeAlerts = priceAlerts.filter(alert => alert.isActive);
    
    activeAlerts.forEach(alert => {
        const game = gamesData.find(g => g.id === alert.gameId);
        if (game && game.price <= alert.alertPrice) {
            // Price dropped, send notification
            showPriceAlertNotification(alert, game);
            alert.isActive = false; // Deactivate alert
        }
    });
    
    localStorage.setItem('priceAlerts', JSON.stringify(priceAlerts));
}

/**
 * Show price alert notification
 */
function showPriceAlertNotification(alert, game) {
    const notification = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <div class="d-flex align-items-center">
                <img src="${game.image}" alt="${game.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                <div>
                    <h6 class="mb-1">${game.name} price dropped!</h6>
                    <p class="mb-1">
                        ${game.isSale && game.sale > 0 ? 
                                                     `Current Price: <span class="text-orange fw-bold">${formatPrice(game.price * (1 - game.sale / 100))}</span>
                         <span class="text-decoration-line-through" style="font-size: 0.8em;">${formatPrice(game.price)}</span>
                         <span class="badge bg-danger" style="font-size: 0.6em;">-${game.sale}%</span>` :
                         `Current Price: ${formatPrice(game.price)}`
                        }
                    </p>
                                            <small>Desired Price: ${formatPrice(alert.alertPrice)}</small>
                </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Add notification to page
    const container = document.createElement('div');
    container.innerHTML = notification;
    document.body.appendChild(container.firstElementChild);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        const alertEl = document.querySelector('.alert');
        if (alertEl) {
            alertEl.remove();
        }
    }, 10000);
}

// Check price alerts periodically (every 30 seconds)
setInterval(checkPriceAlerts, 30000);

// ===== COUPON SYSTEM FUNCTIONS =====

/**
 * Available coupons
 */
const availableCoupons = {
    'WELCOME10': { discount: 10, type: 'percentage', minAmount: 100000 },
    'SAVE20': { discount: 20, type: 'percentage', minAmount: 200000 },
    'FREESHIP': { discount: 50000, type: 'fixed', minAmount: 500000 },
    'GAMER50': { discount: 50, type: 'percentage', minAmount: 1000000 }
};

/**
 * Apply coupon code
 */
function applyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    const couponMessage = document.getElementById('coupon-message');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        couponMessage.innerHTML = '<span class="text-warning">Please enter a coupon code</span>';
        return;
    }
    
    const coupon = availableCoupons[couponCode];
    if (!coupon) {
        couponMessage.innerHTML = '<span class="text-danger">Invalid coupon code</span>';
        return;
    }
    
    // Calculate cart total
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (subtotal < coupon.minAmount) {
                        couponMessage.innerHTML = `<span class="text-warning">Minimum order amount ${formatPrice(coupon.minAmount)} to use this coupon</span>`;
        return;
    }
    
    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
        discount = subtotal * (coupon.discount / 100);
    } else {
        discount = coupon.discount;
    }
    
    // Apply coupon
    localStorage.setItem('appliedCoupon', JSON.stringify({
        code: couponCode,
        discount: discount,
        type: coupon.type
    }));
    
                    couponMessage.innerHTML = `<span class="text-success">Coupon applied successfully! Discount ${formatPrice(discount)}</span>`;
    couponInput.disabled = true;
    
    // Update cart display
    updateCartDisplay();
}

/**
 * Remove applied coupon
 */
function removeCoupon() {
    localStorage.removeItem('appliedCoupon');
    const couponInput = document.getElementById('coupon-input');
    const couponMessage = document.getElementById('coupon-message');
    
    couponInput.value = '';
    couponInput.disabled = false;
    couponMessage.innerHTML = '';
    
    updateCartDisplay();
}

/**
 * Update cart display with coupon
 */
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null');
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = subtotal - discount;
    
    // Update cart page
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-page-total');
    
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (discountEl) discountEl.textContent = formatPrice(discount);
    if (totalEl) totalEl.textContent = formatPrice(total);
    
    // Update cart modal
    const cartTotalEl = document.getElementById('cart-total');
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);
}

// ===== LOADING SKELETON FUNCTIONS =====

/**
 * Show loading skeleton for game cards
 */
function showGameCardsSkeleton(containerId, count = 8) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let skeletonHTML = '';
    for (let i = 0; i < count; i++) {
        skeletonHTML += `
            <div class="col-md-3 col-sm-6 mb-4">
                <div class="skeleton-card skeleton"></div>
            </div>
        `;
    }
    
    container.innerHTML = skeletonHTML;
}

/**
 * Hide loading skeleton
 */
function hideGameCardsSkeleton(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

// ===== INITIALIZATION =====

// Initialize all new features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize parallax hero banner
    renderParallaxHeroBanner();
    
    // Initialize search suggestions
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            showSearchSuggestions(e.target.value);
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                document.getElementById('searchSuggestions').style.display = 'none';
            }
        });
    }
    
    // Initialize back to top button
    initBackToTop();
    
    // Update wishlist count
    updateWishlistCount();
    
    // Initialize product detail page buttons
    initializeProductDetailButtons();
    renderHomeBgDecor();
    renderTodayDeals();
    renderBestSellers();
    renderHomeFeedback();
});

/**
 * Initialize product detail page buttons
 */
function initializeProductDetailButtons() {
    // Add to cart button
    const addToCartBtn = document.getElementById('product-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game-id');
            if (gameId) {
                const game = gamesData.find(g => g.id === parseInt(gameId));
                if (game) {
                    addToCart({
                        id: game.id,
                        name: game.name,
                        price: game.price,
                        image: game.image
                    });
                    showToast(`Added ${game.name} to cart!`, 'success');
                }
            }
        });
    }
    
    // Add to wishlist button
    const addToWishlistBtn = document.getElementById('product-add-to-wishlist');
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game-id');
            if (gameId) {
                addToWishlist(parseInt(gameId));
            }
        });
    }
    
    // Price alert button
    const priceAlertBtn = document.getElementById('product-price-alert');
    if (priceAlertBtn) {
        priceAlertBtn.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game-id');
            if (gameId) {
                setPriceAlert(parseInt(gameId));
            }
        });
    }
    
    // Product thumbnail images
    const thumb1 = document.getElementById('product-thumb-1');
    const thumb2 = document.getElementById('product-thumb-2');
    const thumb3 = document.getElementById('product-thumb-3');
    const mainImage = document.getElementById('product-main-image');
    
    if (thumb1 && mainImage) {
        thumb1.addEventListener('click', function() {
            mainImage.src = this.src;
        });
    }
    
    if (thumb2 && mainImage) {
        thumb2.addEventListener('click', function() {
            mainImage.src = this.src;
        });
    }
    
    if (thumb3 && mainImage) {
        thumb3.addEventListener('click', function() {
            mainImage.src = this.src;
        });
    }
}

/**
 * Render home background decorations
 */
function renderHomeBgDecor() {
    const decor = document.getElementById('home-bg-decor');
    if (!decor) return;
    decor.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png" class="bg-decor-icon icon1" alt="decor1">
        <img src="https://cdn-icons-png.flaticon.com/512/732/732212.png" class="bg-decor-icon icon2" alt="decor2">
        <img src="https://cdn-icons-png.flaticon.com/512/1055/1055672.png" class="bg-decor-icon icon3" alt="decor3">
        <img src="https://cdn-icons-png.flaticon.com/512/732/732228.png" class="bg-decor-icon icon4" alt="decor4">
        <img src="https://cdn-icons-png.flaticon.com/512/1055/1055676.png" class="bg-decor-icon icon5" alt="decor5">
    `;
}

// ===== UTILITY FUNCTIONS =====



/**
 * Show new releases
 */
function showNewReleases() {
    const newGames = gamesData.filter(game => game.isNew || game.releaseDate > '2024-01-01');
    renderFilteredGames(
        newGames,
        '<i class="fas fa-star text-orange me-2"></i>New Releases',
        `There are ${newGames.length} new releases`
    );
}

/**
 * Show hot deals
 */
function showHotDeals() {
    const hotGames = gamesData.filter(game => game.isHot || game.hotDeal);
    renderFilteredGames(
        hotGames,
        '<i class="fas fa-fire text-orange me-2"></i>Hot Deals',
        `There are ${hotGames.length} hot games`
    );
}

/**
 * Show sale games
 */
function showSaleGames() {
    const saleGames = gamesData.filter(game => game.isSale || game.sale);
    renderFilteredGames(
        saleGames,
        '<i class="fas fa-percentage text-orange me-2"></i>Sale Games',
        `There are ${saleGames.length} games on sale`
    );
}

/**
 * Show coming soon games
 */
function showComingSoonGames() {
    const comingGames = gamesData.filter(game => game.comingSoon);
    renderFilteredGames(
        comingGames,
        '<i class="fas fa-clock text-orange me-2"></i>Coming Soon',
        `There are ${comingGames.length} games coming soon`
    );
}

// ===== BREADCRUMB FUNCTIONS =====

/**
 * Update breadcrumb navigation
 */
function updateBreadcrumb(items) {
    const breadcrumbEl = document.getElementById('breadcrumb-nav');
    if (!breadcrumbEl) return;
    
    let html = `
        <li class="breadcrumb-item">
            <a href="#" class="text-orange text-decoration-none" onclick="showHomePage()">
                <i class="fas fa-home me-1"></i>Home
            </a>
        </li>
    `;
    
    items.forEach((item, index) => {
        if (index === items.length - 1) {
            html += `<li class="breadcrumb-item active" aria-current="page">${item.text}</li>`;
        } else {
            html += `<li class="breadcrumb-item"><a href="#" class="text-orange text-decoration-none" onclick="${item.onclick}">${item.text}</a></li>`;
        }
    });
    
    breadcrumbEl.innerHTML = html;
}

// Update breadcrumb for different pages
function updateBreadcrumbForPage(pageName, items = []) {
    const breadcrumbItems = [
        { text: pageName, onclick: '' }
    ];
    
    if (items.length > 0) {
        breadcrumbItems.unshift(...items);
    }
    
    updateBreadcrumb(breadcrumbItems);
}

// ===== LIVE CHAT FUNCTIONS =====

/**
 * Toggle chat window
 */
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const chatToggle = document.getElementById('chat-toggle');
    
    if (chatWindow.style.display === 'none') {
        chatWindow.style.display = 'block';
        chatToggle.innerHTML = '<i class="fas fa-times" style="font-size: 1.5rem;"></i>';
        chatToggle.classList.remove('btn-orange');
        chatToggle.classList.add('btn-danger');
    } else {
        chatWindow.style.display = 'none';
        chatToggle.innerHTML = '<i class="fas fa-comments" style="font-size: 1.5rem;"></i>';
        chatToggle.classList.remove('btn-danger');
        chatToggle.classList.add('btn-orange');
    }
}

/**
 * Send chat message
 */
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const messagesEl = document.getElementById('chat-messages');
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    messagesEl.innerHTML += `
        <div class="d-flex justify-content-end mb-2">
            <div class="bg-orange text-white p-2 rounded" style="max-width: 80%;">
                <div class="small">${message}</div>
                <div class="small opacity-75">${timestamp}</div>
            </div>
        </div>
    `;
    
    input.value = '';
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    // Simulate bot response
    setTimeout(() => {
        const responses = [
            'Thank you for contacting us! We will respond as soon as possible.',
            'Can I help you with anything else?',
            'We are processing your request.',
            'You can check our FAQ for quick answers.',
            'Thank you for using our service!'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const botTimestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        
        messagesEl.innerHTML += `
            <div class="d-flex justify-content-start mb-2">
                <div class="bg-secondary text-white p-2 rounded" style="max-width: 80%;">
                    <div class="small">${randomResponse}</div>
                    <div class="small opacity-75">${botTimestamp}</div>
                </div>
            </div>
        `;
        
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 1000);
}

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    if (chatToggle) {
        chatToggle.addEventListener('click', toggleChat);
    }
    
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});

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
 * Debug function to check UI elements and functions
 */
function debugUI() {
    console.log('=== UI DEBUG ===');
    
    // Check if Bootstrap is loaded
    console.log('Bootstrap loaded:', typeof bootstrap !== 'undefined');
    
    // Check if gamesData is available
    console.log('gamesData available:', typeof gamesData !== 'undefined');
    if (typeof gamesData !== 'undefined') {
        console.log('gamesData length:', gamesData.length);
        console.log('Sample game:', gamesData[0]);
    }
    
    // Check if elements exist
    console.log('Profile modal exists:', !!document.getElementById('profileModal'));
    console.log('Wishlist page exists:', !!document.getElementById('wishlist-page'));
    console.log('Order history page exists:', !!document.getElementById('order-history-page'));
    
    // Check if functions exist
    console.log('openModal function exists:', typeof openModal === 'function');
    console.log('showWishlist function exists:', typeof showWishlist === 'function');
    console.log('showOrderHistory function exists:', typeof showOrderHistory === 'function');
    console.log('addToWishlist function exists:', typeof addToWishlist === 'function');
    
    // Check user dropdown state
    const userDropdown = document.getElementById('user-dropdown');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    console.log('User dropdown display:', userDropdown?.style.display);
    console.log('Login btn display:', loginBtn?.style.display);
    console.log('Register btn display:', registerBtn?.style.display);
    
    console.log('=== END UI DEBUG ===');
}

/**
 * Test function to open profile modal
 */
function testProfileModal() {
    console.log('Testing profile modal...');
    try {
        const modal = document.getElementById('profileModal');
        if (modal) {
            console.log('✅ Profile modal found');
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
            console.log('✅ Profile modal opened');
        } else {
            console.log('❌ Profile modal not found');
        }
    } catch (error) {
        console.log('❌ Error opening profile modal:', error);
    }
}

/**
 * Test function to show wishlist
 */
function testWishlist() {
    console.log('Testing wishlist...');
    try {
        const wishlistPage = document.getElementById('wishlist-page');
        if (wishlistPage) {
            console.log('✅ Wishlist page found');
            hideAllPages();
            wishlistPage.style.display = 'block';
            renderWishlist();
            console.log('✅ Wishlist page shown');
        } else {
            console.log('❌ Wishlist page not found');
        }
    } catch (error) {
        console.log('❌ Error showing wishlist:', error);
    }
}

/**
 * Test function to show order history
 */
function testOrderHistory() {
    console.log('Testing order history...');
    try {
        const orderHistoryPage = document.getElementById('order-history-page');
        if (orderHistoryPage) {
            console.log('✅ Order history page found');
            hideAllPages();
            orderHistoryPage.style.display = 'block';
            renderOrderHistory();
            console.log('✅ Order history page shown');
        } else {
            console.log('❌ Order history page not found');
        }
    } catch (error) {
        console.log('❌ Error showing order history:', error);
    }
}

/**
 * Test function to show product detail page
 */
function testProductDetail() {
    console.log('Testing product detail page...');
    try {
        if (typeof gamesData === 'undefined' || !gamesData.length) {
            console.log('❌ gamesData not available');
            return;
        }
        
        const firstGame = gamesData[0];
        console.log('✅ Showing product detail for:', firstGame.name);
        
        showProductDetailPage(firstGame.id);
        console.log('✅ Product detail page shown');
    } catch (error) {
        console.log('❌ Error showing product detail:', error);
    }
}

/**
 * Test function to add to wishlist
 */
function testAddToWishlist() {
    console.log('Testing add to wishlist...');
    try {
        if (typeof gamesData === 'undefined' || !gamesData.length) {
            console.log('❌ gamesData not available');
            return;
        }
        
        const firstGame = gamesData[0];
        console.log('✅ Adding game to wishlist:', firstGame.name);
        addToWishlist(firstGame.id);
        console.log('✅ Wishlist function called');
    } catch (error) {
        console.log('❌ Error adding to wishlist:', error);
    }
}

/**
 * Test function to apply coupon
 */
function testCoupon() {
    console.log('Testing coupon system...');
    try {
        // Add a game to cart first
        if (typeof gamesData === 'undefined' || !gamesData.length) {
            console.log('❌ gamesData not available');
            return;
        }
        
        const firstGame = gamesData[0];
        addToCart({id: firstGame.id, name: firstGame.name, price: firstGame.price, image: firstGame.image});
        console.log('✅ Added game to cart');
        
        // Test coupon
        const couponInput = document.getElementById('coupon-input');
        if (couponInput) {
            couponInput.value = 'WELCOME10';
            applyCoupon();
            console.log('✅ Coupon applied');
        } else {
            console.log('❌ Coupon input not found');
        }
    } catch (error) {
        console.log('❌ Error testing coupon:', error);
    }
}

/**
 * Clear all localStorage data
 */
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? (Logout, clear cart, wishlist...)')) {
        localStorage.clear();
        console.log('🗑️ All localStorage data cleared');
        location.reload(); // Reload page to update UI
    }
}

// Thêm vào global scope để có thể gọi từ console
window.debugLocalStorage = debugLocalStorage;
window.debugUI = debugUI;
window.testProfileModal = testProfileModal;
window.testWishlist = testWishlist;
window.testOrderHistory = testOrderHistory;
window.testProductDetail = testProductDetail;
window.testAddToWishlist = testAddToWishlist;
window.testCoupon = testCoupon;
window.clearAllData = clearAllData;

// Test function to check user data
window.testUserData = function() {
    console.log('=== TESTING USER DATA ===');
    const user = getCurrentUser();
    console.log('Current user:', user);
    
    if (user) {
        console.log('User details:');
        console.log('- Fullname:', user.fullname);
        console.log('- Email:', user.email);
        console.log('- Phone:', user.phone);
        console.log('- Address:', user.address);
        console.log('- Birthday:', user.birthday);
        console.log('- Location:', user.location);
    } else {
        console.log('No user logged in');
    }
    
    // Test localStorage
    console.log('localStorage user:', localStorage.getItem('user'));
    console.log('localStorage registeredUsers:', localStorage.getItem('registeredUsers'));
    console.log('=== END TEST ===');
};

// Xử lý submit form demo checkout
if (document.getElementById('demoCheckoutForm')) {
    document.getElementById('demoCheckoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Demo payment successful! (No actual transaction)', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        if (modal) modal.hide();
    });
}

// ===== HOME SECTIONS RENDER =====
function renderTodayDeals() {
    const list = document.getElementById('today-deals-list');
    if (!list) return;
    const saleGames = (typeof gamesData !== 'undefined' ? gamesData : []).filter(g => g.isSale || g.sale);
    list.innerHTML = saleGames.length ? saleGames.slice(0, 4).map(createEnhancedGameCard).join('') : '<div class="col-12 text-center text-muted py-4">No deals today.</div>';
}

function renderBestSellers() {
    const list = document.getElementById('best-sellers-list');
    if (!list) return;
    const sorted = [...(typeof gamesData !== 'undefined' ? gamesData : [])].sort((a, b) => (b.sold || 0) - (a.sold || 0));
    list.innerHTML = sorted.slice(0, 4).map(createEnhancedGameCard).join('');
}

function renderHomeFeedback() {
    const list = document.getElementById('feedback-list');
    if (!list) return;
    const feedbacks = [
        { name: 'Nguyen Van A', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 5, text: 'Trustworthy shop, key received immediately after payment. Will support for a long time!' },
        { name: 'Tran Thi B', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 4, text: 'Support service is very good, a variety of games, reasonable price.' },
        { name: 'Le Van C', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', rating: 5, text: 'First time buying games a bit worried, but the shop is very professional, key standard.' },
        { name: 'Pham Thi D', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', rating: 5, text: 'Fast transaction, many deals, will recommend to friends.' }
    ];
    list.innerHTML = feedbacks.map(f => `
        <div class=\"col-md-6 col-lg-4 mb-4\">
            <div class=\"card bg-dark text-white h-100 shadow-sm border-secondary\">
                <div class=\"card-body d-flex flex-column align-items-center text-center\">
                    <img src=\"${f.avatar}\" alt=\"${f.name}\" class=\"rounded-circle mb-3\" style=\"width:64px;height:64px;object-fit:cover;\">
                    <h6 class=\"mb-1 text-orange\">${f.name}</h6>
                    <div class=\"mb-2\">${'★'.repeat(f.rating)}${'☆'.repeat(5-f.rating)}</div>
                    <p class=\"text-light small\">${f.text}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Test function để kiểm tra filter
function testFilterByCategory() {
    console.log('Testing filter by category...');
    filterByCategory('Action');
}