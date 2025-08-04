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
        }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer', 'crypto'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    gameKeys: [{
        key: {
            type: String,
            required: true
        },
        platform: String,
        isUsed: {
            type: Boolean,
            default: false
        },
        usedAt: Date
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
    }
}, {
    timestamps: true
});

// Calculate total before saving
orderSchema.pre('save', function(next) {
    if (this.items && this.items.length > 0) {
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }
    next();
});

// Method to add game keys
orderSchema.methods.addGameKeys = function(keys) {
    if (!this.gameKeys) {
        this.gameKeys = [];
    }
    this.gameKeys.push(...keys);
    return this.save();
};

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus) {
    this.status = newStatus;
    if (newStatus === 'completed') {
        this.paymentStatus = 'paid';
    }
    return this.save();
};

module.exports = mongoose.model('Order', orderSchema); 