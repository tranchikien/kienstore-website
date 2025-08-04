// ===== GLOBAL VARIABLES =====
let currentView = 'grid'; // 'grid' or 'list'
let currentPage = 1;
const itemsPerPage = 12;

// ===== GAMES DATA =====
const gamesData = [
    {
        id: 1,
        name: "Cyberpunk 2077",
        description: "An open-world action RPG developed by CD Projekt Red. Set in Night City, a futuristic city full of violence and ambition.",
        price: 1200000,
        image: "images/cyberpunk-2077-he-lo-su-kien-cro-3340512c-image-578665117.jpg.webp",
        category: "RPG",
        platform: "Steam",
        isFeatured: true,
        isSale: true,
        sale: 30,
        sold: 1200,
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        releaseDate: "2020-12-10",
        size: "63 GB",
        configuration: "Intel Core i5-3570K / AMD FX-8310",
        screenshots: [
            "images/Cyberpunk_2077_box_art.jpg",
            "images/Cyberpunk_2077_gameplay.png",
        ]
    },
    {
        id: 2,
        name: "The Witcher 3: Wild Hunt",
        description: "An action RPG developed by CD Projekt Red. Play as Geralt of Rivia, a monster hunter on an epic journey.",
        price: 800000,
        image: "images/the-witcher-3-the-wild-hunt-review_wvw4.1024.webp",
        category: "RPG",
        platform: "Steam",
        isFeatured: true,
        isSale: true,
        sale: 50,
        sold: 950,
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        releaseDate: "2015-05-19",
        size: "50 GB",
        configuration: "Intel Core i5-2500K / AMD Phenom II X4 940",
        screenshots: [
            "images/8bfad8ae-5a24-4617-988e-ccafee83324f-1020x612.webp",
            "images/MV5BMjg3OTc3MTcxNl5BMl5BanBnXkFtZTgwMDg0Njk1NTM@._V1_.jpg",
        ]
    },
    {
        id: 3,
        name: "Red Dead Redemption 2",
        description: "An action-adventure game developed by Rockstar Games. Set in the American Wild West at the end of the 19th century.",
        price: 1500000,
        image: "images/RDR2476298253_Epic_Games_Wishlist_RDR2_2560x1440_V01-2560x1440-2a9ebe1f7ee202102555be202d5632ec.jpg",
        category: "Action",
        platform: "Steam",
        isFeatured: true,
        isSale: false,
        sale: 0,
        sold: 2000,
        developer: "Rockstar Games",
        publisher: "Rockstar Games",
        releaseDate: "2019-12-05",
        size: "150 GB",
        configuration: "Intel Core i5-2500K / AMD FX-6300",
        screenshots: [
            "images/download.jpg",
            "images/download (1).jpg",
        ]
    },
    {
        id: 4,
        name: "Grand Theft Auto V",
        description: "An action-adventure game developed by Rockstar Games. Engage in criminal activities in Los Santos.",
        price: 1000000,
        image: "images/130916121147-grand-theft-auto-v.jpg",
        category: "Action",
        platform: "Steam",
        isFeatured: false,
        isSale: true,
        sale: 20,
        sold: 3000,
        developer: "Rockstar Games",
        publisher: "Rockstar Games",
        releaseDate: "2015-04-14",
        size: "72 GB",
        configuration: "Intel Core 2 Quad CPU Q6600 / AMD Phenom 9850",
        screenshots: [
            "images/download (2).jpg",
            "images/download (3).jpg",
        ]
    },
    {
        id: 5,
        name: "FIFA 24",
        description: "A football sports game developed by EA Sports. Experience realistic football with improved graphics and gameplay.",
        price: 1800000,
        image: "images/ea-sports-fc-24-truoc-ngay-ra-mat-bia.jpg",
        category: "Sports",
        platform: "Origin",
        isFeatured: false,
        isSale: false,
        sale: 0,
        sold: 800,
        developer: "EA Sports",
        publisher: "Electronic Arts",
        releaseDate: "2023-09-29",
        size: "100 GB",
        configuration: "Intel Core i5-6600K / AMD Ryzen 5 1600",
        screenshots: [
            "images/download (4).jpg",
            "images/download (5).jpg",
        ]
    },
    {
        id: 6,
        name: "Call of Duty: Warzone",
        description: "A free-to-play battle royale FPS developed by Infinity Ward and Raven Software.",
        price: 0,
        image: "images/images.jpg",
        category: "FPS",
        platform: "Battle.net",
        isFeatured: false,
        developer: "Infinity Ward, Raven Software",
        publisher: "Activision",
        releaseDate: "2020-03-10",
        size: "175 GB",
        configuration: "Intel Core i3-4340 / AMD FX-6300",
        screenshots: [
            "images/download (6).jpg",
            "images/download (7).jpg",
        ]
    },
    {
        id: 7,
        name: "League of Legends",
        description: "A free-to-play MOBA developed by Riot Games. Players compete in 5v5 matches.",
        price: 0,
        image: "images/league-of-legends.webp",
        category: "MOBA",
        platform: "Riot Games",
        isFeatured: false,
        developer: "Riot Games",
        publisher: "Riot Games",
        releaseDate: "2009-10-27",
        size: "8 GB",
        configuration: "Intel Core i3-530 / AMD A6-3650",
        screenshots: [
            "images/download (8).jpg",
            "images/download (9).jpg",
        ]
    },
    {
        id: 8,
        name: "Minecraft",
        description: "A sandbox game developed by Mojang Studios. Players can build and explore a 3D world.",
        price: 500000,
        image: "images/minecraft-16789786596172117060425-0-0-393-750-crop-16939052207281820601075.webp",
        category: "Adventure",
        platform: "Minecraft Launcher",
        isFeatured: false,
        developer: "Mojang Studios",
        publisher: "Mojang Studios",
        releaseDate: "2011-11-18",
        size: "1 GB",
        configuration: "Intel Core i3-3210 / AMD A8-7600 APU",
        screenshots: [
            "images/download (10).jpg",
            "images/download (11).jpg",
        ]
    },
    {
        id: 9,
        name: "Fortnite",
        description: "A free-to-play battle royale game developed by Epic Games. Players compete to be the last one standing.",
        price: 0,
        image: "images/FNECO_36-10_ForbiddenFruit_EGS_Launcher_KeyArt_Blade_2560x1440_2560x1440-abce17aa0386b48069aa42c1ebf7b864.jpg",
        category: "Battle Royale",
        platform: "Epic Games",
        isFeatured: false,
        developer: "Epic Games",
        publisher: "Epic Games",
        releaseDate: "2017-07-25",
        size: "30 GB",
        configuration: "Intel Core i3-3225 / AMD A8-7600",
        screenshots: [
            "images/download (12).jpg",
            "images/download (13).jpg",
        ]
    },
    {
        id: 10,
        name: "Valorant",
        description: "A tactical 5v5 FPS developed by Riot Games. Combines precise shooting with unique abilities.",
        price: 0,
        image: "images/EGS_VALORANT_RiotGames_S1_2560x1440-7d279548324d3a3cbef40e1dc7e84994.webp",
        category: "FPS",
        platform: "Riot Games",
        isFeatured: false,
        developer: "Riot Games",
        publisher: "Riot Games",
        releaseDate: "2020-06-02",
        size: "15 GB",
        configuration: "Intel Core i3-370M / AMD A6-3620",
        screenshots: [
            "images/download (15).jpg",
            "images/download (14).jpg",
        ]
    },
    {
        id: 11,
        name: "Among Us",
        description: "A social game developed by InnerSloth. Players participate in tasks or pretend to be a traitor.",
        price: 150000,
        image: "images/758ab0b61205081da2466386940752c70e0e5ea43bd39e8b9b13eaa455c69b7e.avif",
        category: "Puzzle",
        platform: "Steam",
        isFeatured: false,
        developer: "InnerSloth",
        publisher: "InnerSloth",
        releaseDate: "2018-06-15",
        size: "250 MB",
        configuration: "Intel Pentium 4 / AMD equivalent",
        screenshots: [
            "images/download (17).jpg",
            "images/download (16).jpg",
        ]
    },
    {
        id: 12,
        name: "Fall Guys",
        description: "A party battle royale game developed by Mediatonic. Players participate in fun challenges.",
        price: 0,
        image: "images/download (19).jpg",
        category: "Puzzle",
        platform: "Epic Games",
        isFeatured: false,
        developer: "Mediatonic",
        publisher: "Devolver Digital",
        releaseDate: "2020-08-04",
        size: "2 GB",
        configuration: "Intel Core i5-2300 / AMD FX-6300",
        screenshots: [
            "images/download (18).jpg",
            "images/download (20).jpg",
        ]
    },
    {
        id: 13,
        name: "Elden Ring",
        description: "Elden Ring is an open-world action RPG with a challenging gameplay and mysterious story.",
        price: 1450000,
        image: "images/download (21).jpg",
        banner: "images/download (23).jpg",
        category: "RPG",
        platform: "Steam",
        isFeatured: true,
        developer: "FromSoftware",
        publisher: "Bandai Namco",
        releaseDate: "2022-02-25",
        size: "60 GB",
        configuration: "Intel Core i5-8400 / AMD Ryzen 3 3300X",
        screenshots: [
            "images/download (22).jpg",
            "images/download (23).jpg",
        ]
    },
    {
        id: 14,
        name: "Horizon Forbidden West",
        description: "Horizon Forbidden West is an open-world action RPG with a large and dynamic world.",
        price: 1200000,
        image: "images/723406-horizon-forbidden-west-le-jeu-s-expose-dans-une-galerie-ephemere-dans-le-metro-parisien.jpg",
        banner: "images/download (24).jpg",
        category: "Adventure",
        platform: "Steam",
        isFeatured: true,
        developer: "Guerrilla Games",
        publisher: "Sony Interactive Entertainment",
        releaseDate: "2022-08-18",
        size: "90 GB",
        configuration: "Intel Core i7-4770K / AMD Ryzen 5 1500X",
        screenshots: [
            "images/capsule_616x353.jpg",
            "images/download (24).jpg",
        ]
    },
    {
        id: 15,
        name: "God of War Ragnarök",
        description: "God of War Ragnarök continues Kratos and Atreus' journey in Norse mythology.",
        price: 1350000,
        image: "images/capsule_616x353 (1).jpg",
        banner: "images/download (25).jpg",
        category: "Action",
        platform: "Steam",
        isFeatured: true,
        developer: "Santa Monica Studio",
        publisher: "Sony Interactive Entertainment",
        releaseDate: "2022-11-09",
        size: "80 GB",
        configuration: "Intel Core i5-6600K / AMD Ryzen 5 2400G",
        screenshots: [
            "images/download (25).jpg",
            "images/download (26).jpg",
        ]
    },
    {
        id: 16,
        name: "Diablo IV",
        description: "Diablo IV is an open-world action RPG with a dark and engaging combat system.",
        price: 1300000,
        image: "images/images (1).jpg",
        banner: "images/images (2).jpg",
        category: "RPG",
        platform: "Battle.net",
        isFeatured: false,
        developer: "Blizzard Entertainment",
        publisher: "Blizzard Entertainment",
        releaseDate: "2023-06-06",
        size: "90 GB",
        configuration: "Intel Core i5-2500K / AMD FX-8100",
        screenshots: [
            "images/images (2).jpg",
            "images/images (3).jpg",
        ]
    },
    {
        id: 17,
        name: "PUBG: Battlegrounds",
        description: "PUBG is a famous battle royale game with an engaging survival gameplay.",
        price: 0,
        image: "images/PUBG_BG_EGS@1920x1080.jpg",
        banner: "images/pubg_2_1280x720-800-resize.jpg",
        category: "Battle Royale",
        platform: "Steam",
        isFeatured: false,
        developer: "KRAFTON",
        publisher: "KRAFTON",
        releaseDate: "2017-12-20",
        size: "40 GB",
        configuration: "Intel Core i5-4430 / AMD FX-6300",
        screenshots: [
            "images/download (27).jpg",
            "images/pubg_2_1280x720-800-resize.jpg",
        ]
    },
    {
        id: 18,
        name: "Đấu Trường Chân Lý Mobile",
        description: "Đấu Trường Chân Lý là game chiến thuật theo lượt thuộc vũ trụ Liên Minh Huyền Thoại.",
        price: 50000,
        image: "images/dau-truong-chan-ly-mobile-1.jpg",
        banner: "images/download (29).jpg",
        category: "Strategy",
        platform: "Mobile",
        isFeatured: false,
        developer: "Riot Games",
        publisher: "Riot Games",
        releaseDate: "2020-03-19",
        size: "2 GB",
        configuration: "Android 5.0+, iOS 10+",
        screenshots: [
            "images/download (28).jpg",
            "images/download (29).jpg",
        ]
    },
    {
        id: 22,
        name: "Resident Evil Village",
        description: "Resident Evil Village is the next installment in the famous survival horror series with a rural setting.",
        price: 400000,
        image: "images/1605_ResidentEvilVillage.jpg",
        banner: "images/1605_ResidentEvilVillage.jpg",
        category: "Horror",
        platform: "Battle.net",
        isFeatured: false,
        developer: "Capcom",
        publisher: "Capcom",
        releaseDate: "2021-05-07",
        size: "35 GB",
        configuration: "Intel Core i5-7500 / AMD Ryzen 3 1200",
        screenshots: [
            "images/download (30).jpg",
            "images/download (31).jpg",
        ]
    },
    {
        id: 23,
        name: "Forza Horizon 5",
        description: "Forza Horizon 5 is an open-world racing game with stunning graphics and hundreds of cars.",
        price: 1200000,
        image: "images/apps.33953.13806078025361171.9723cf5e-1e29-4d9d-ad0a-cc37a95bb75d.jpg",
        banner: "images/apps.33953.13806078025361171.9723cf5e-1e29-4d9d-ad0a-cc37a95bb75d.jpg",
        category: "Racing",
        platform: "PC, Xbox",
        isFeatured: false,
        developer: "Playground Games",
        publisher: "Xbox Game Studios",
        releaseDate: "2021-11-09",
        size: "110 GB",
        configuration: "Intel i5-4460 / AMD Ryzen 3 1200",
        screenshots: [
            "images/forza-horizon-5-for-xbox-series-s_k5zc.1920.webp",
            "images/download (32).jpg",
        ]
    },
    {
        id: 24,
        name: "The Sims 4",
        description: "The Sims 4 is a famous life simulation game, where you can build and control the lives of Sims.",
        price: 600000,
        image: "images/capsule_616x353 (2).jpg",
        banner: "images/capsule_616x353 (2).jpg",
        category: "Simulation",
        platform: "PC",
        isFeatured: false,
        developer: "Maxis",
        publisher: "Electronic Arts",
        releaseDate: "2014-09-02",
        size: "18 GB",
        configuration: "Intel Core i3-3220 / AMD Athlon 64 X2 6400+",
        screenshots: [
            "images/ss_2fc938d99a1e87893852cb2d2113478190607941.1920x1080.jpg",
            "images/images (4).jpg",
        ]
    },
    {
        id: 25,
        name: "Candy Crush Saga",
        description: "Candy Crush Saga is a famous puzzle game with thousands of fun levels.",
        price: 0,
        image: "images/candy-crush-saga-1.jpg",
        banner: "images/candy-crush-saga-1.jpg",
        category: "Puzzle",
        platform: "Mobile",
        isFeatured: false,
        developer: "King",
        publisher: "King",
        releaseDate: "2012-04-12",
        size: "200 MB",
        configuration: "Android/iOS",
        screenshots: [
            "images/download (33).jpg",
            "images/images (5).jpg",
        ]
    },
    {
        id: 26,
        name: "Spider-Man Remastered",
        description: "An action-adventure game with Spider-Man, beautiful graphics, and an engaging story.",
        price: 990000,
        image: "images/header.jpg",
        category: "Action",
        platform: "Steam",
        isSale: true,
        sale: 30,
        developer: "Insomniac Games",
        publisher: "Sony",
        releaseDate: "2022-08-12",
        size: "70 GB",
        configuration: "Intel Core i5-4670 / AMD Ryzen 5 1600",
        screenshots: [
            "images/download (34).jpg",
            "images/download (35).jpg",
        ]
    },
    {
        id: 27,
        name: "Street Fighter 6",
        description: "A famous fighting game with new characters, improved graphics, and gameplay.",
        price: 850000,
        image: "images/download (36).jpg",
        category: "Fighting",
        platform: "Steam",
        isSale: true,
        sale: 20,
        developer: "Capcom",
        publisher: "Capcom",
        releaseDate: "2023-06-02",
        size: "60 GB",
        configuration: "Intel Core i5-7500 / AMD Ryzen 3 1200",
        screenshots: [
            "images/mv_edition_bg.jpg",
            "images/download (37).jpg",
        ]
    },
    {
        id: 28,
        name: "Final Fantasy XVI",
        description: "A Japanese RPG with a deep story, beautiful graphics, and a new combat system.",
        price: 1450000,
        image: "images/final-fantasy-xvi-3285.webp",
        category: "RPG",
        platform: "PlayStation",
        isHot: true,
        developer: "Square Enix",
        publisher: "Square Enix",
        releaseDate: "2023-06-22",
        size: "90 GB",
        configuration: "PS5",
        screenshots: [
            "images/download (39).jpg",
            "images/download (38).jpg",
        ]
    },
    {
        id: 29,
        name: "Forza Motorsport",
        description: "A realistic car racing simulation game with hundreds of cars and famous tracks.",
        price: 1200000,
        image: "images/download (40).jpg",
        category: "Racing",
        platform: "Xbox",
        isHot: true,
        hotDeal: true,
        developer: "Turn 10 Studios",
        publisher: "Xbox Game Studios",
        releaseDate: "2023-10-10",
        size: "100 GB",
        configuration: "Xbox Series X|S",
        screenshots: [
            "images/download (41).jpg",
            "images/Forza-Motorsport-7.avif",
        ]
    },
    {
        id: 30,
        name: "Alan Wake II",
        description: "A survival horror game with a mysterious story, excellent graphics, and sound.",
        price: 1100000,
        image: "images/download (42).jpg",
        category: "Horror",
        platform: "Epic Games",
        comingSoon: true,
        developer: "Remedy Entertainment",
        publisher: "Epic Games",
        releaseDate: "2024-10-17",
        size: "80 GB",
        configuration: "Intel Core i5-7600K / AMD Ryzen 5 1600X",
        screenshots: [
            "images/download (43).jpg",
            "images/download (44).jpg",
        ]
    },
    {
        id: 31,
        name: "Hollow Knight: Silksong",
        description: "A 2D action-adventure game with challenging gameplay and a large world.",
        price: 350000,
        image: "images/Hollow_Knight_Silksong_cover_art.jpg",
        category: "Adventure",
        platform: "Steam",
        comingSoon: true,
        developer: "Team Cherry",
        publisher: "Team Cherry",
        releaseDate: "2024-12-01",
        size: "10 GB",
        configuration: "Intel Core i3-2100 / AMD FX-4300",
        screenshots: [
            "images/download (45).jpg",
            "images/hornet-fighting-a-giant-robot-boss-in-hollow-knight-silksong.avif",
        ]
    },
    {
        id: 32,
        name: "Dead Space Remake",
        description: "A horror game with a modern and improved graphics and gameplay.",
        price: 1250000,
        image: "images/download (46).jpg",
        category: "Horror",
        platform: "Origin",
        hotDeal: true,
        sale: 40,
        developer: "Motive Studio",
        publisher: "Electronic Arts",
        releaseDate: "2023-01-27",
        size: "50 GB",
        configuration: "Intel Core i5-8600 / AMD Ryzen 5 2600X",
        screenshots: [
            "images/download (47).jpg",
            "images/dead-space-remake-review.jpg",
        ]
    },
    {
        id: 33,
        name: "The Legend of Zelda: Tears of the Kingdom",
        description: "An open-world adventure game with creative gameplay and an engaging story.",
        price: 1400000,
        image: "images/zelda-16800558113671797143763.webp",
        category: "Adventure",
        platform: "Nintendo Switch",
        isFeatured: true,
        developer: "Nintendo",
        publisher: "Nintendo",
        releaseDate: "2023-05-12",
        size: "18 GB",
        configuration: "Nintendo Switch",
        screenshots: [
            "images/2_527e7d29c26844f2815db56d5b1d7779.jpg",
            "images/download (48).jpg"
        ]
    }
];

// ===== UTILITY FUNCTIONS =====

/**
 * Format price to Vietnamese currency
 */
function formatPrice(price) {
    if (price === 0) return 'Miễn phí';
    return price.toLocaleString('vi-VN') + ' VNĐ';
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toastId = 'toast-' + Date.now();
    
    const toastHTML = `
        <div id="${toastId}" class="toast toast-${type} show" role="alert">
            <div class="toast-header">
                <strong class="me-auto">
                    ${type === 'success' ? '<i class="fas fa-check-circle text-success"></i>' : ''}
                    ${type === 'error' ? '<i class="fas fa-exclamation-circle text-danger"></i>' : ''}
                    ${type === 'info' ? '<i class="fas fa-info-circle text-info"></i>' : ''}
                    ${type === 'warning' ? '<i class="fas fa-exclamation-triangle text-warning"></i>' : ''}
                    Thông báo
                </strong>
                <button type="button" class="btn-close btn-close-white" onclick="removeToast('${toastId}')"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeToast(toastId);
    }, 5000);
}

/**
 * Remove toast notification
 */
function removeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.remove();
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Initialize smooth scrolling
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize animations
 */
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all game cards and sections
    document.querySelectorAll('.game-card, .section-title, .filters-section').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize page
 */
function initializePage() {
    // Show home page by default
    showHomePage();
    
    // Load cart from storage
    loadCartFromStorage();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
    
    // Check login status
    checkLoginStatus();
    
    // Show toast notification
    showToast('Chào mừng đến với KIENSTORE!', 'success');
}

/**
 * Check login status and update UI
 */
function checkLoginStatus() {
    // Use the centralized updateUserDropdown function
    if (typeof updateUserDropdown === 'function') {
        updateUserDropdown();
    }
}

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
    openModal('profileModal');
    showToast('Đã mở trang thông tin cá nhân', 'info');
}

/**
 * Dynamic Parallax Hero Banner for Featured Games
 */
function renderParallaxHeroBanner() {
    const bannerEl = document.getElementById('parallaxHeroBanner');
    if (!bannerEl) return;
    const featuredGames = (typeof gamesData !== 'undefined' ? gamesData : (typeof allGames !== 'undefined' ? allGames : [])).filter(g => g.isFeatured);
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
                                          <span class="badge bg-orange fs-5 py-2 px-4">${formatPrice(game.price)}</span>
                </div>
                <p class="lead mb-4">${game.description.substring(0, 120)}...</p>
                <div class="d-flex gap-3">
                  <button class="btn btn-orange btn-lg px-4" onclick="showProductDetailPage(${game.id})"><i class="fas fa-info-circle me-2"></i>Chi tiết</button>
                  <button class="btn btn-outline-light btn-lg px-4" onclick="addToCart({id: ${game.id}, name: '${game.name}', price: ${game.price}, image: '${game.image}'})"><i class="fas fa-cart-plus me-2"></i>Thêm vào giỏ</button>
                </div>
            </div>
            <div class="parallax-controls position-absolute w-100 d-flex justify-content-between align-items-center px-3" style="top: 50%; left: 0; z-index: 10; pointer-events: none;">
                <button class="btn btn-outline-light btn-lg" style="pointer-events: all;" aria-label="Trước" id="parallaxPrevBtn"><i class="fas fa-chevron-left"></i></button>
                <button class="btn btn-outline-light btn-lg" style="pointer-events: all;" aria-label="Sau" id="parallaxNextBtn"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="parallax-indicators position-absolute w-100 d-flex justify-content-center" style="bottom: 24px; z-index: 10;">
                ${featuredGames.map((_, i) => `<span class="mx-1 rounded-circle" style="display:inline-block;width:12px;height:12px;background:${i===idx?'#f97316':'#fff3'};border:2px solid #fff;cursor:pointer;transition:background 0.3s;" data-idx="${i}"></span>`).join('')}
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

/**
 * Create enhanced game card with badges and ratings
 */
function createEnhancedGameCard(game) {
    const badges = [];
    if (game.isHot) badges.push('<span class="card-badge badge-hot">HOT</span>');
    if (game.isNew) badges.push('<span class="card-badge badge-new">NEW</span>');
    if (game.isSale) badges.push(`<span class="card-badge badge-sale">-${game.sale}%</span>`);
    
    const rating = Math.floor(Math.random() * 2) + 4; // Random rating 4-5
    const sold = Math.floor(Math.random() * 1000) + 100; // Random sold count
    
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
                    <div class="price-section">
                        ${game.price === 0 ? 
                            `<span class="price text-success fw-bold">Miễn phí</span>` :
                            game.isSale && game.sale > 0 ? 
                                `<div class="d-flex flex-column">
                                    <span class="price text-orange fw-bold">${formatPrice(game.price * (1 - game.sale / 100))}</span>
                                    <span class="price-old text-muted text-decoration-line-through" style="font-size: 0.9em;">${formatPrice(game.price)}</span>
                                    <span class="badge bg-danger" style="font-size: 0.7em;">-${game.sale}%</span>
                                </div>` : 
                                `<span class="price text-orange fw-bold">${formatPrice(game.price)}</span>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render cart dropdown
 */
function renderCartDropdown() {
    const itemsEl = document.getElementById('cart-dropdown-items');
    const totalEl = document.getElementById('cart-dropdown-total');
    if (!itemsEl || !totalEl) return;
    
    if (!cart || cart.length === 0) {
        itemsEl.innerHTML = '<div class="text-center text-muted py-3">Giỏ hàng trống</div>';
        totalEl.textContent = '0 VNĐ';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-dropdown-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">
                        ${item.sale > 0 ? 
                            `<div class="d-flex flex-column">
                                <span class="text-orange fw-bold">${formatPrice(item.price)}</span>
                                <span class="text-decoration-line-through" style="font-size: 0.7em;">${formatPrice(item.originalPrice)}</span>
                                <span class="badge bg-danger" style="font-size: 0.5em;">-${item.sale}%</span>
                            </div>` : 
                            `${formatPrice(item.price)}`
                        } x ${item.quantity}
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id}); renderCartDropdown(); event.stopPropagation();">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    itemsEl.innerHTML = html;
    totalEl.textContent = formatPrice(total);
}

// Call this after DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderParallaxHeroBanner);
} else {
    renderParallaxHeroBanner();
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
}); 

// Hiển thị dropdown tài khoản khi đăng nhập
function updateAccountDropdown() {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const accountGroup = document.getElementById('account-dropdown-group');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    if (user) {
        if (accountGroup) accountGroup.style.display = '';
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
    } else {
        if (accountGroup) accountGroup.style.display = 'none';
        if (loginBtn) loginBtn.style.display = '';
        if (registerBtn) registerBtn.style.display = '';
    }
}

// Gọi sau khi đăng nhập/đăng xuất
if (typeof updateAccountDropdown === 'function') {
    document.addEventListener('DOMContentLoaded', updateAccountDropdown);
}

// Call when cart dropdown is opened
const cartDropdownBtn = document.getElementById('cartDropdown');
if (cartDropdownBtn) {
    cartDropdownBtn.addEventListener('click', renderCartDropdown);
}

// Ensure cart dropdown is updated when items are added/removed
const oldAddToCart = typeof addToCart === 'function' ? addToCart : null;
window.addToCart = function() {
    if (oldAddToCart) oldAddToCart.apply(this, arguments);
    renderCartDropdown();
};

const oldRemoveFromCart = typeof removeFromCart === 'function' ? removeFromCart : null;
window.removeFromCart = function() {
    if (oldRemoveFromCart) oldRemoveFromCart.apply(this, arguments);
    renderCartDropdown();
};

const oldUpdateCartItemQuantity = typeof updateCartItemQuantity === 'function' ? updateCartItemQuantity : null;
window.updateCartItemQuantity = function() {
    if (oldUpdateCartItemQuantity) oldUpdateCartItemQuantity.apply(this, arguments);
    renderCartDropdown();
}; 