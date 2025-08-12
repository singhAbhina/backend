const mongoose = require('mongoose');

// 🔧 STEP 1: Replace this with your actual MongoDB connection string
const MONGODB_URI = 'mongodb+srv://your_username:your_password@your_cluster.mongodb.net/Leetcode?retryWrites=true&w=majority';

async function forceFixSchema() {
    try {
        console.log('🚀 Force Fix Database Schema Script');
        console.log('====================================');
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
        
        // Check current indexes
        console.log('📋 Current indexes on users collection:');
        const indexes = await db.collection('users').indexes();
        indexes.forEach(idx => {
            console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
        });
        console.log('');

        // Force remove ALL indexes except _id
        console.log('🗑️  Force removing all problematic indexes...');
        for (const index of indexes) {
            if (index.name !== '_id_') {
                try {
                    await db.collection('users').dropIndex(index.name);
                    console.log(`   ✅ Removed index: ${index.name}`);
                } catch (err) {
                    console.log(`   ⚠️  Could not remove ${index.name}: ${err.message}`);
                }
            }
        }
        console.log('');

        // Check for users with undefined problemSolved
        console.log('🔍 Checking for problematic user data...');
        const problematicUsers = await db.collection('users').find({
            $or: [
                { problemSolved: undefined },
                { problemSolved: null }
            ]
        }).toArray();

        if (problematicUsers.length > 0) {
            console.log(`⚠️  Found ${problematicUsers.length} users with undefined problemSolved`);
            console.log('   Fixing these users...');
            
            const result = await db.collection('users').updateMany(
                {
                    $or: [
                        { problemSolved: undefined },
                        { problemSolved: null }
                    ]
                },
                {
                    $set: { problemSolved: [] }
                }
            );
            console.log(`✅ Fixed ${result.modifiedCount} users`);
        } else {
            console.log('✅ No problematic users found');
        }
        console.log('');

        // Create proper indexes
        console.log('🔧 Creating proper indexes...');
        
        // Email index (unique)
        await db.collection('users').createIndex({ emailId: 1 }, { unique: true });
        console.log('   ✅ Created emailId unique index');
        
        // Problem solved index (non-unique)
        await db.collection('users').createIndex({ problemSolved: 1 });
        console.log('   ✅ Created problemSolved index (non-unique)');
        
        console.log('');

        // Verify the fix
        console.log('🔍 Verifying the fix...');
        const finalIndexes = await db.collection('users').indexes();
        console.log('Final indexes:');
        finalIndexes.forEach(idx => {
            console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
        });
        console.log('');

        console.log('🎉 Schema force-fixed successfully!');
        console.log('');
        console.log('💡 What was done:');
        console.log('   ✅ Removed ALL problematic indexes');
        console.log('   ✅ Fixed existing user data');
        console.log('   ✅ Created proper new indexes');
        console.log('');
        console.log('🚀 Next steps:');
        console.log('   1. Deploy your updated code to Render');
        console.log('   2. Test user registration - it should work now!');
        console.log('   3. The duplicate key error should be resolved');
        
    } catch (error) {
        console.error('❌ Error force-fixing schema:', error.message);
        console.error('');
        console.error('💡 This might be a connection issue. Check:');
        console.error('   1. Your MongoDB connection string is correct');
        console.error('   2. Your IP is whitelisted in MongoDB Atlas');
        console.error('   3. Your MongoDB cluster is running');
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('🔌 Disconnected from MongoDB');
        }
    }
}

// Run the force fix
forceFixSchema();
