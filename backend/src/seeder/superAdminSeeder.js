const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Check if super admin role exists
    let superAdminRole = await Role.findOne({ name: 'super_admin' });
    
    if (!superAdminRole) {
      // Create super admin role if it doesn't exist
      superAdminRole = await Role.create({
        name: 'super_admin',
        permissions: [] // Add specific permissions if needed
      });
    }

    // Check if super admin user already exists
    const existingSuperAdmin = await User.findOne({ email: 'superadmin@webmanager.com' });
    
    if (!existingSuperAdmin) {
      // Create super admin user
      const hashedPassword = await bcrypt.hash('SuperAdmin@123', 10);
      
      await User.create({
        username: 'superadmin',
        email: 'superadmin@webmanager.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: superAdminRole._id,
        isEmailVerified: true,
        permissions: {
          all: true // Grant all permissions
        }
      });
      
      console.log('Super admin user created successfully');
    } else {
      console.log('Super admin user already exists');
    }
  } catch (error) {
    console.error('Error creating super admin:', error);
  }
};

// Connect to MongoDB and run the seeder
const runSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    await createSuperAdmin();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeder if this file is executed directly
if (require.main === module) {
  runSeeder();
}

module.exports = createSuperAdmin; 