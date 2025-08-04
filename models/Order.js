const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['bank', 'momo', 'zalopay', 'visa', 'paypal']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        email: String,
        address: String,
        city: String,
        country: {
            type: String,
            default: 'Vietnam'
        }
    },
    gameKeys: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        key: {
            type: String,
            required: true
        },
        sentAt: {
            type: Date,
            default: Date.now
        },
        isUsed: {
            type: Boolean,
            default: false
        }
    }],
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    trackingNumber: {
        type: String
    },
    estimatedDelivery: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    cancelledAt: {
        type: Date
    },
    cancelledBy: {
        type: String,
        enum: ['user', 'admin', 'system']
    },
    cancellationReason: {
        type: String
    }
}, {
    timestamps: true
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
    if (this.isModified('items')) {
        this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
        this.total = this.subtotal - this.discount;
    }
    next();
});

// Virtual for order summary
orderSchema.virtual('orderSummary').get(function() {
    return {
        itemCount: this.items.length,
        totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
        status: this.status,
        total: this.total
    };
});

// Method to add game key
orderSchema.methods.addGameKey = function(productId, key) {
    this.gameKeys.push({
        product: productId,
        key: key,
        sentAt: new Date()
    });
    return this.save();
};

// Method to mark key as used
orderSchema.methods.markKeyAsUsed = function(key) {
    const gameKey = this.gameKeys.find(gk => gk.key === key);
    if (gameKey) {
        gameKey.isUsed = true;
        return this.save();
    }
    throw new Error('Game key not found');
};

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, reason = null) {
    this.status = newStatus;
    
    if (newStatus === 'cancelled') {
        this.cancelledAt = new Date();
        this.cancellationReason = reason;
    } else if (newStatus === 'completed') {
        this.deliveredAt = new Date();
    }
    
    return this.save();
};

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema); 