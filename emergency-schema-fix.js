const mongoose = require('mongoose');

// 🔧 STEP 1: Replace this with your actual MongoDB connection string
const MONGODB_URI = 'mongodb+srv://your_username:your_password@your_cluster.mongodb.net/Leetcode?retryWrites=true&w=majority';

async function emergencySchemaFix() {
    try {
        console.log('🚨 EMERGENCY SCHEMA FIX - This will recreate the users collection!');
        console.log('==================================================================');
        console.log('');
        console.log('⚠️  WARNING: This script will:');
        console.log('   1. Backup existing users to a temporary collection');
        console.log('   2. Drop the current users collection');
        console.log('   3. Recreate it with the correct schema');
        console.log('   4. Restore user data with fixed schema');
        console.log('');
        
        // Check if MONGODB_URI is still the default
        if (MONGODB_URI.includes('your_username')) {
            console.log('❌ ERROR: You need to update the MONGODB_URI first!');
            console.log('');
            console.log('📋 How to get your MongoDB connection string:');
            console.log('   1. Go to your Render dashboard');
            console.log('   2. Click on your backend service');
            console.log('   3. Go to Environment variables');
            console.log('   4. Copy the MONGODB_URI value');
            console.log('   5. Replace the MONGODB_URI in this file');
            console.log('');
            return;
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');
        console.log('');

        const db = mongoose.connection.db;
        
        // Step 1: Backup existing users
        console.log('📦 Step 1: Backing up existing users...');
        const existingUsers = await db.collection('users').find({}).toArray();
        console.log(`   Found ${existingUsers.length} existing users`);
        
        if (existingUsers.length > 0) {
            await db.collection('users_backup_' + Date.now()).insertMany(existingUsers);
            console.log('   ✅ Users backed up to temporary collection');
        }
        console.log('');

        // Step 2: Drop the current users collection
        console.log('🗑️  Step 2: Dropping current users collection...');
        await db.collection('users').drop();
        console.log('   ✅ Users collection dropped');
        console.log('');

        // Step 3: Create new collection with correct schema
        console.log('🔧 Step 3: Creating new users collection with correct schema...');
        
        // Create the collection
        await db.createCollection('users');
        console.log('   ✅ New users collection created');
        
        // Create proper indexes
        await db.collection('users').createIndex({ emailId: 1 }, { unique: true });
        console.log('   ✅ Created emailId unique index');
        
        await db.collection('users').createIndex({ problemSolved: 1 });
        console.log('   ✅ Created problemSolved index (non-unique)');
        console.log('');

        // Step 4: Restore user data with fixed schema
        if (existingUsers.length > 0) {
            console.log('🔄 Step 4: Restoring user data with fixed schema...');
            
            const fixedUsers = existingUsers.map(user => ({
                ...user,
                problemSolved: user.problemSolved || [] // Ensure problemSolved is always an array
            }));
            
            await db.collection('users').insertMany(fixedUsers);
            console.log(`   ✅ Restored ${fixedUsers.length} users with fixed schema`);
        }
        console.log('');

        // Verify the fix
        console.log('🔍 Verifying the fix...');
        const finalIndexes = await db.collection('users').indexes();
        console.log('Final indexes:');
        finalIndexes.forEach(idx => {
            console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
        });
        
        const userCount = await db.collection('users').countDocuments();
        console.log(`Total users: ${userCount}`);
        console.log('');

        console.log('🎉 EMERGENCY SCHEMA FIX COMPLETED!');
        console.log('');
        console.log('💡 What was done:');
        console.log('   ✅ Backed up existing users');
        console.log('   ✅ Dropped problematic collection');
        console.log('   ✅ Created new collection with correct schema');
        console.log('   ✅ Restored user data with fixed schema');
        console.log('');
        console.log('🚀 Next steps:');
        console.log('   1. Deploy your updated code to Render');
        console.log('   2. Test user registration - it should work now!');
        console.log('   3. The duplicate key error should be completely resolved');
        console.log('');
        console.log('📦 Backup collection created with timestamp for safety');
        
    } catch (error) {
        console.error('❌ Error during emergency schema fix:', error.message);
        console.error('');
        console.error('💡 This is a serious error. Check:');
        console.error('   1. Your MongoDB connection string is correct');
        console.error('   2. You have proper permissions on the database');
        console.error('   3. Your MongoDB cluster is accessible');
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('🔌 Disconnected from MongoDB');
        }
    }
}

// Run the emergency fix
emergencySchemaFix();
