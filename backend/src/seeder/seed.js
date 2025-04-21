const mongoose = require('mongoose');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');
require('dotenv').config();
const bcrypt = require('bcrypt');
const Domain = require('../models/Domain');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Function to seed domains
const seedDomains = async () => {
    try {
        // Check if domains already exist
        const existingDomains = await Domain.find();

        if (existingDomains.length === 0) {
            // Create sample domains
            const domains = [
                { name: 'he_group', title: "He-GROUP", href: 'http://contentlocker.com' },
                { name: 'the_logician', title: "THE-LOGICIAN", href: 'http://logician.com' },
                { name: 'x_wear', title: "X-WEAR", href: 'http://xwear.com' },
            ];

            // Save domains to the database
            await Domain.create(domains);
            console.log('Domains seeded successfully');
            return domains;
        } else {
            console.log('Domains already exist. Skipping seeding.');
            return existingDomains;
        }
    } catch (error) {
        console.error('Error seeding domains:', error.message);
        throw error;
    }
};

// Function to seed permissions
const seedPermissions = async (domains) => {
    try {
        // Check if permissions already exist
        const existingPermissions = await Permission.find();

        if (existingPermissions.length === 0) {
            // Create permissions for each domain
            const permissions = domains.flatMap(domain => [
                { name: 'create_user', module: 'user', domain: domain.name },
                { name: 'edit_user', module: 'user', domain: domain.name },
                { name: 'delete_user', module: 'user', domain: domain.name },
                { name: 'edit_article', module: 'article', domain: domain.name },
                { name: 'delete_article', module: 'article', domain: domain.name },
            ]);

            // Save permissions to the database
            await Permission.create(permissions);
            console.log('Permissions seeded successfully');
            return permissions;
        } else {
            console.log('Permissions already exist. Skipping seeding.');
            return existingPermissions;
        }
    } catch (error) {
        console.error('Error seeding permissions:', error.message);
        throw error;
    }
};

// Function to seed roles
const seedRoles = async () => {
    try {
        // Check if roles already exist
        const existingRoles = await Role.find();

        if (existingRoles.length === 0) {
            // Create roles
            const roles = [
                { name: 'admin' },
                { name: 'editor' },
                { name: 'user' },
            ];

            // Save roles to the database
            await Role.create(roles);
            console.log('Roles seeded successfully');
            return roles;
        } else {
            console.log('Roles already exist. Skipping seeding.');
            return existingRoles;
        }
    } catch (error) {
        console.error('Error seeding roles:', error.message);
        throw error;
    }
};

// Function to seed users
const seedUsers = async (roles, permissions) => {
    try {
        // Check if users already exist
        const existingUsers = await User.find();

        if (existingUsers.length === 0) {
            const adminRole = roles.find(role => role.name === 'admin');
            const adminPermissions = permissions.filter(perm => 
                perm.domain === 'he_group' && ['create_user', 'edit_user'].includes(perm.name)
            );

            // Create sample users
            const users = [
                {
                    username: 'adminUser',
                    password: await bcrypt.hash('adminPassword', 10),
                    email: 'admin@example.com',
                    firstName: 'Admin',
                    lastName: 'User',
                    role: adminRole._id,
                    permissions: adminPermissions.map(p => p._id),
                    domain: 'he_group'
                },
            ];

            // Save users to the database
            await User.create(users);
            console.log('Users seeded successfully');
        } else {
            console.log('Users already exist. Skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding users:', error.message);
        throw error;
    }
};

// Main function to run all seeders in sequence
const runSeeders = async () => {
    try {
        await connectDB();
        const domains = await seedDomains();
        const permissions = await seedPermissions(domains);
        const roles = await seedRoles();
        await seedUsers(roles, permissions);
        console.log('All seeding completed successfully');
    } catch (error) {
        console.error('Seeding failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run all seeders
runSeeders();