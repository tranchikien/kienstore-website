const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: [
            'Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 
            'Simulation', 'Puzzle', 'Horror', 'FPS', 'MOBA', 'Battle Royale',
            'Sandbox', 'Entertainment'
        ]
    },
    platform: {
        type: String,
        required: [true, 'Product platform is required'],
        enum: [
            'Steam', 'Epic Games', 'Origin', 'Uplay', 'GOG', 
            'Battle.net', 'Riot Games', 'Multi-platform'
        ]
    },
    images: [{
        type: String,
        required: [true, 'At least one image is required']
    }],
    mainImage: {
        type: String,
        required: [true, 'Main image is required']
    },
    screenshots: [{
        type: String
    }],
    developer: {
        type: String,
        trim: true,
        maxlength: [100, 'Developer name cannot exceed 100 characters']
    },
    publisher: {
        type: String,
        trim: true,
        maxlength: [100, 'Publisher name cannot exceed 100 characters']
    },
    releaseDate: {
        type: Date
    },
    size: {
        type: String,
        trim: true
    },
    systemRequirements: {
        minimum: {
            os: String,
            processor: String,
            memory: String,
            graphics: String,
            storage: String
        },
        recommended: {
            os: String,
            processor: String,
            memory: String,
            graphics: String,
            storage: String
        }
    },
    features: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    isSale: {
        type: Boolean,
        default: false
    },
    salePercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isNewRelease: {
        type: Boolean,
        default: false
    },
    isComingSoon: {
        type: Boolean,
        default: false
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for sale price
productSchema.virtual('salePrice').get(function() {
    if (this.isSale && this.salePercentage > 0) {
        return this.price * (1 - this.salePercentage / 100);
    }
    return this.price;
});

// Virtual for current price
productSchema.virtual('currentPrice').get(function() {
    return this.isSale ? this.salePrice : this.price;
});

// Method to check if product is on sale
productSchema.methods.isOnSale = function() {
    return this.isSale && this.salePercentage > 0;
};

// Method to get current price
productSchema.methods.getCurrentPrice = function() {
    return this.isOnSale() ? this.salePrice : this.price;
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema); 