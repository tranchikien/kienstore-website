const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, [
    body('items')
        .isArray({ min: 1 })
        .withMessage('At least one item is required'),
    body('items.*.productId')
        .notEmpty()
        .withMessage('Product ID is required'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    body('paymentMethod')
        .isIn(['bank', 'momo', 'zalopay', 'visa', 'paypal'])
        .withMessage('Invalid payment method'),
    body('shippingAddress.fullName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters'),
    body('shippingAddress.email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('shippingAddress.phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('shippingAddress.address')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Address must be between 5 and 200 characters')
], async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { items, paymentMethod, shippingAddress, notes } = req.body;

        // Validate products and calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.productId} not found`
                });
            }

            if (!product.isActive) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${product.name} is not available`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            const currentPrice = product.getCurrentPrice();
            const total = currentPrice * item.quantity;
            subtotal += total;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: currentPrice,
                total: total
            });

            // Update product stock
            product.stock -= item.quantity;
            product.sales += item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            subtotal,
            total: subtotal, // No discount for now
            paymentMethod,
            shippingAddress,
            notes
        });

        // Clear user's cart
        const user = await User.findById(req.user.id);
        user.cart = [];
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('status').optional().isIn(['pending', 'processing', 'completed', 'cancelled', 'refunded']).withMessage('Invalid status')
], async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { user: req.user.id };

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const orders = await Order.find(filter)
            .populate('items.product', 'name mainImage category platform')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            count: orders.length,
            total,
            pagination: {
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            },
            data: orders
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'fullname email')
            .populate('items.product', 'name mainImage category platform developer publisher');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, [
    body('reason')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Reason cannot exceed 200 characters')
], async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Check if order can be cancelled
        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
        }

        // Update order status
        await order.updateStatus('cancelled', req.body.reason);

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                product.sales -= item.quantity;
                await product.save();
            }
        }

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get all orders (admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'processing', 'completed', 'cancelled', 'refunded']).withMessage('Invalid status'),
    query('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status'),
    query('sort').optional().isIn(['createdAt', '-createdAt', 'total', '-total']).withMessage('Invalid sort parameter')
], async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.paymentStatus) {
            filter.paymentStatus = req.query.paymentStatus;
        }

        // Build sort object
        let sort = { createdAt: -1 };
        if (req.query.sort) {
            sort = {};
            sort[req.query.sort.replace('-', '')] = req.query.sort.startsWith('-') ? -1 : 1;
        }

        const orders = await Order.find(filter)
            .populate('user', 'fullname email')
            .populate('items.product', 'name mainImage')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            count: orders.length,
            total,
            pagination: {
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            },
            data: orders
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), [
    body('status')
        .isIn(['pending', 'processing', 'completed', 'cancelled', 'refunded'])
        .withMessage('Invalid status'),
    body('paymentStatus')
        .optional()
        .isIn(['pending', 'paid', 'failed', 'refunded'])
        .withMessage('Invalid payment status'),
    body('reason')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Reason cannot exceed 200 characters')
], async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const { status, paymentStatus, reason } = req.body;

        // Update order status
        await order.updateStatus(status, reason);

        // Update payment status if provided
        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
            await order.save();
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Add game key to order (admin only)
// @route   POST /api/orders/:id/game-keys
// @access  Private/Admin
router.post('/:id/game-keys', protect, authorize('admin'), [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required'),
    body('key')
        .notEmpty()
        .withMessage('Game key is required')
], async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const { productId, key } = req.body;

        // Check if product exists in order
        const orderItem = order.items.find(item => item.product.toString() === productId);
        if (!orderItem) {
            return res.status(400).json({
                success: false,
                message: 'Product not found in order'
            });
        }

        // Add game key
        await order.addGameKey(productId, key);

        res.json({
            success: true,
            message: 'Game key added successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router; 