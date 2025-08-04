const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'https://kienstore-website.vercel.app'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'KIENSTORE API is running',
        timestamp: new Date().toISOString()
    });
});

// Seed data endpoint (for development only)
app.post('/api/seed', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ 
                success: false, 
                message: 'Seed endpoint is disabled in production' 
            });
        }
        
        const { seedProducts } = require('./utils/seedData');
        const products = await seedProducts();
        
        res.json({ 
            success: true, 
            message: 'Database seeded successfully',
            data: { products: products.length }
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error seeding database',
            error: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.NODE_ENV === 'production' 
            ? process.env.MONGODB_URI_PROD 
            : process.env.MONGODB_URI;
            
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
        
        // Initialize admin user if not exists
        try {
            await require('./utils/initAdmin')();
        } catch (adminError) {
            console.log('ℹ️ Admin user already exists');
        }
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📱 Environment: ${process.env.NODE_ENV}`);
        console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    });
};

startServer(); 