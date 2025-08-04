const Product = require('../models/Product');

const sampleProducts = [
    {
        name: "Cyberpunk 2077",
        description: "An open-world action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
        price: 59.99,
        originalPrice: 59.99,
        category: "RPG",
        platform: "Steam",
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        releaseDate: "2020-12-10",
        mainImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
        ],
        systemRequirements: {
            minimum: {
                os: "Windows 10",
                processor: "Intel Core i5-3570K",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 970",
                storage: "70 GB"
            },
            recommended: {
                os: "Windows 10",
                processor: "Intel Core i7-4790",
                memory: "12 GB RAM",
                graphics: "NVIDIA GeForce GTX 1060",
                storage: "70 GB"
            }
        },
        isSale: false,
        salePercentage: 0,
        isFeatured: true,
        isNewRelease: false,
        isComingSoon: false,
        isBestSeller: true,
        rating: 4.5,
        reviews: 1250,
        stock: 50
    },
    {
        name: "The Witcher 3: Wild Hunt",
        description: "A story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.",
        price: 39.99,
        originalPrice: 59.99,
        category: "RPG",
        platform: "Steam",
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        releaseDate: "2015-05-19",
        mainImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
        ],
        systemRequirements: {
            minimum: {
                os: "Windows 7/8/10",
                processor: "Intel CPU Core i5-2500K 3.3GHz",
                memory: "6 GB RAM",
                graphics: "Nvidia GPU GeForce GTX 660",
                storage: "50 GB"
            },
            recommended: {
                os: "Windows 7/8/10",
                processor: "Intel CPU Core i7-3770 3.4 GHz",
                memory: "8 GB RAM",
                graphics: "Nvidia GPU GeForce GTX 1060",
                storage: "50 GB"
            }
        },
        isSale: true,
        salePercentage: 33,
        isFeatured: true,
        isNewRelease: false,
        isComingSoon: false,
        isBestSeller: true,
        rating: 4.8,
        reviews: 2100,
        stock: 75
    },
    {
        name: "Red Dead Redemption 2",
        description: "America, 1899. The end of the wild west era has begun. After a robbery goes badly wrong in the western town of Blackwater.",
        price: 49.99,
        originalPrice: 59.99,
        category: "Action",
        platform: "Steam",
        developer: "Rockstar Games",
        publisher: "Rockstar Games",
        releaseDate: "2019-12-05",
        mainImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
        ],
        systemRequirements: {
            minimum: {
                os: "Windows 10",
                processor: "Intel Core i5-2500K",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 770",
                storage: "150 GB"
            },
            recommended: {
                os: "Windows 10",
                processor: "Intel Core i7-4770K",
                memory: "12 GB RAM",
                graphics: "NVIDIA GeForce GTX 1060",
                storage: "150 GB"
            }
        },
        isSale: true,
        salePercentage: 17,
        isFeatured: true,
        isNewRelease: false,
        isComingSoon: false,
        isBestSeller: true,
        rating: 4.7,
        reviews: 1800,
        stock: 30
    },
    {
        name: "Elden Ring",
        description: "A new fantasy action RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.",
        price: 59.99,
        originalPrice: 59.99,
        category: "RPG",
        platform: "Steam",
        developer: "FromSoftware",
        publisher: "Bandai Namco",
        releaseDate: "2022-02-25",
        mainImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
        ],
        systemRequirements: {
            minimum: {
                os: "Windows 10",
                processor: "Intel Core i5-8400",
                memory: "12 GB RAM",
                graphics: "NVIDIA GeForce GTX 1060",
                storage: "60 GB"
            },
            recommended: {
                os: "Windows 10/11",
                processor: "Intel Core i7-8700K",
                memory: "16 GB RAM",
                graphics: "NVIDIA GeForce GTX 1070",
                storage: "60 GB"
            }
        },
        isSale: false,
        salePercentage: 0,
        isFeatured: true,
        isNewRelease: true,
        isComingSoon: false,
        isBestSeller: true,
        rating: 4.9,
        reviews: 3200,
        stock: 25
    },
    {
        name: "God of War Ragnarök",
        description: "From Santa Monica Studio comes the sequel to the critically acclaimed God of War (2018).",
        price: 69.99,
        originalPrice: 69.99,
        category: "Action",
        platform: "Steam",
        developer: "Santa Monica Studio",
        publisher: "Sony Interactive Entertainment",
        releaseDate: "2024-09-19",
        mainImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
        ],
        systemRequirements: {
            minimum: {
                os: "Windows 10",
                processor: "Intel i5-6600k",
                memory: "8 GB RAM",
                graphics: "NVIDIA GTX 1060",
                storage: "170 GB"
            },
            recommended: {
                os: "Windows 10",
                processor: "Intel i7-8700",
                memory: "16 GB RAM",
                graphics: "NVIDIA RTX 3070",
                storage: "170 GB"
            }
        },
        isSale: false,
        salePercentage: 0,
        isFeatured: true,
        isNewRelease: true,
        isComingSoon: false,
        isBestSeller: false,
        rating: 4.8,
        reviews: 950,
        stock: 40
    }
];

async function seedProducts() {
    try {
        console.log('🌱 Seeding products...');
        
        // Clear existing products
        await Product.deleteMany({});
        
        // Insert sample products
        const insertedProducts = await Product.insertMany(sampleProducts);
        
        console.log(`✅ Successfully seeded ${insertedProducts.length} products`);
        return insertedProducts;
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        throw error;
    }
}

module.exports = { seedProducts }; 