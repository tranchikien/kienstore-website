const User = require('../models/User');

const initAdmin = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ role: 'admin' });
        
        if (!adminExists) {
            // Create admin user
            const adminUser = new User({
                fullname: 'KIENSTORE Admin',
                email: process.env.ADMIN_EMAIL || 'admin@kienstore.com',
                password: process.env.ADMIN_PASSWORD || 'admin123456',
                role: 'admin',
                emailVerified: true,
                isActive: true
            });

            await adminUser.save();
            console.log('✅ Admin user created successfully');
            console.log(`📧 Admin Email: ${adminUser.email}`);
            console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123456'}`);
        } else {
            console.log('✅ Admin user already exists');
        }
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
    }
};

module.exports = initAdmin; 