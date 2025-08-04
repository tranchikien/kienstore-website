const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');

const router = express.Router();

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
router.get('/', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().isString().withMessage('Category must be a string'),
    query('platform').optional().isString().withMessage('Platform must be a string'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('sort').optional().isIn(['price', '-price', 'name', '-name', 'createdAt', '-createdAt']).withMessage('Invalid sort parameter'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number')
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
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { isActive: true };

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.platform) {
            filter.platform = req.query.platform;
        }

        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Build sort object
        let sort = { createdAt: -1 };
        if (req.query.sort) {
            sort = {};
            sort[req.query.sort.replace('-', '')] = req.query.sort.startsWith('-') ? -1 : 1;
        }

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-__v');

        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            count: products.length,
            total,
            pagination: {
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            },
            data: products
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get single product (public)
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (!product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Increment views
        product.views += 1;
        await product.save();

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Create product (admin only)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .isIn(['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Simulation', 'Puzzle', 'Horror', 'FPS', 'MOBA', 'Battle Royale', 'Sandbox', 'Entertainment'])
        .withMessage('Invalid category'),
    body('platform')
        .isIn(['Steam', 'Epic Games', 'Origin', 'Uplay', 'GOG', 'Battle.net', 'Riot Games', 'Multi-platform'])
        .withMessage('Invalid platform'),
    body('mainImage')
        .isURL()
        .withMessage('Main image must be a valid URL'),
    body('images')
        .isArray({ min: 1 })
        .withMessage('At least one image is required'),
    body('images.*')
        .isURL()
        .withMessage('All images must be valid URLs')
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

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Update product (admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .optional()
        .isIn(['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Simulation', 'Puzzle', 'Horror', 'FPS', 'MOBA', 'Battle Royale', 'Sandbox', 'Entertainment'])
        .withMessage('Invalid category'),
    body('platform')
        .optional()
        .isIn(['Steam', 'Epic Games', 'Origin', 'Uplay', 'GOG', 'Battle.net', 'Riot Games', 'Multi-platform'])
        .withMessage('Invalid platform'),
    body('mainImage')
        .optional()
        .isURL()
        .withMessage('Main image must be a valid URL'),
    body('images')
        .optional()
        .isArray({ min: 1 })
        .withMessage('At least one image is required'),
    body('images.*')
        .optional()
        .isURL()
        .withMessage('All images must be valid URLs')
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

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Delete product (admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.remove();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get featured products
// @route   GET /api/products/featured/featured
// @access  Public
router.get('/featured/featured', async (req, res, next) => {
    try {
        const products = await Product.find({ 
            isActive: true, 
            isFeatured: true 
        })
        .limit(8)
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get sale products
// @route   GET /api/products/sale/sale
// @access  Public
router.get('/sale/sale', async (req, res, next) => {
    try {
        const products = await Product.find({ 
            isActive: true, 
            isSale: true,
            saleEndDate: { $gt: new Date() }
        })
        .limit(8)
        .sort({ salePercentage: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get new releases
// @route   GET /api/products/new/new
// @access  Public
router.get('/new/new', async (req, res, next) => {
    try {
        const products = await Product.find({ 
            isActive: true, 
            isNewRelease: true 
        })
        .limit(8)
        .sort({ releaseDate: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get coming soon products
// @route   GET /api/products/coming-soon/coming-soon
// @access  Public
router.get('/coming-soon/coming-soon', async (req, res, next) => {
    try {
        const products = await Product.find({ 
            isActive: true, 
            isComingSoon: true 
        })
        .limit(8)
        .sort({ releaseDate: 1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get best sellers
// @route   GET /api/products/best-sellers/best-sellers
// @access  Public
router.get('/best-sellers/best-sellers', async (req, res, next) => {
    try {
        const products = await Product.find({ 
            isActive: true 
        })
        .limit(8)
        .sort({ sales: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router; 