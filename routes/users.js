const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('sort').optional().isIn(['createdAt', '-createdAt', 'fullname', '-fullname', 'email', '-email']).withMessage('Invalid sort parameter')
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
        const filter = {};

        if (req.query.role) {
            filter.role = req.query.role;
        }

        if (req.query.search) {
            filter.$or = [
                { fullname: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sort = { createdAt: -1 };
        if (req.query.sort) {
            sort = {};
            sort[req.query.sort.replace('-', '')] = req.query.sort.startsWith('-') ? -1 : 1;
        }

        const users = await User.find(filter)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            count: users.length,
            total,
            pagination: {
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            },
            data: users
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get single user (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('wishlist', 'name price mainImage')
            .populate('cart.product', 'name price mainImage');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
    body('fullname')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Invalid role'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean')
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

        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if email is being changed and if it already exists
        if (req.body.email && req.body.email !== user.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-password');

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        await user.remove();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const productId = req.params.productId;

        // Check if product is already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }

        user.wishlist.push(productId);
        await user.save();

        res.json({
            success: true,
            message: 'Product added to wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const productId = req.params.productId;

        // Remove product from wishlist
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('wishlist', 'name price mainImage category platform');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            count: user.wishlist.length,
            data: user.wishlist
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Add to cart
// @route   POST /api/users/cart
// @access  Private
router.post('/cart', protect, [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required'),
    body('quantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer')
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

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { productId, quantity = 1 } = req.body;

        // Check if product is already in cart
        const existingItem = user.cart.find(item => item.product.toString() === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        res.json({
            success: true,
            message: 'Product added to cart',
            cart: user.cart
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Update cart item quantity
// @route   PUT /api/users/cart/:productId
// @access  Private
router.put('/cart/:productId', protect, [
    body('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer')
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

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const productId = req.params.productId;
        const { quantity } = req.body;

        const cartItem = user.cart.find(item => item.product.toString() === productId);
        
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        cartItem.quantity = quantity;
        await user.save();

        res.json({
            success: true,
            message: 'Cart updated',
            cart: user.cart
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Remove from cart
// @route   DELETE /api/users/cart/:productId
// @access  Private
router.delete('/cart/:productId', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const productId = req.params.productId;

        // Remove product from cart
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();

        res.json({
            success: true,
            message: 'Product removed from cart',
            cart: user.cart
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
router.get('/cart', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('cart.product', 'name price mainImage category platform');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            count: user.cart.length,
            data: user.cart
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Clear cart
// @route   DELETE /api/users/cart
// @access  Private
router.delete('/cart', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.cart = [];
        await user.save();

        res.json({
            success: true,
            message: 'Cart cleared',
            cart: user.cart
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router; 