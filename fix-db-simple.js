const mongoose = require('mongoose');

// 🔧 STEP 1: Replace this with your actual MongoDB connection string
// Get this from your Render dashboard → Environment variables → MONGODB_URI
const MONGODB_URI = 'mongodb+srv://your_username:your_password@your_cluster.mongodb.net/Leetcode?retryWrites=true&w=majority';

async function fixDatabase() {
    try {
        console.log('🔧 Database Fix Script for Authentication Issues');
        console.log('================================================');
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
            console.log('💡 Example connection string format:');
            console.log('   mongodb+srv://username:password@cluster.mongodb.net/Leetcode?retryWrites=true&w=majority');
            console.log('');
            return;
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');
        console.log('');

        // Get the database instance
        const db = mongoose.connection.db;
        
        // Check existing indexes on users collection
        console.log('📋 Checking existing indexes on users collection...');
        const indexes = await db.collection('users').indexes();
        console.log('Current indexes:', indexes.map(idx => `${idx.name} (${Object.keys(idx.key).join(', ')})`));
        console.log('');

        // Remove problematic indexes if they exist
        console.log('🗑️  Removing problematic indexes...');
        
        try {
            // Remove the problematic problemSolved index if it exists
            await db.collection('users').dropIndex('problemSolved_1');
            console.log('✅ Removed problemSolved_1 index (this was causing the duplicate key error)');
        } catch (err) {
            if (err.code === 26) {
                console.log('ℹ️  problemSolved_1 index does not exist (already removed)');
            } else {
                console.log('⚠️  Error removing problemSolved_1 index:', err.message);
            }
        }
        console.log('');

        // Check if there are any users with undefined problemSolved
        console.log('🔍 Checking for users with undefined problemSolved...');
        const usersWithUndefined = await db.collection('users').find({
            $or: [
                { problemSolved: undefined },
                { problemSolved: null }
            ]
        }).toArray();

        if (usersWithUndefined.length > 0) {
            console.log(`⚠️  Found ${usersWithUndefined.length} users with undefined problemSolved`);
            console.log('   This was causing the duplicate key error during registration');
            
            // Update these users to have empty array
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
            console.log(`✅ Updated ${result.modifiedCount} users to have empty problemSolved array`);
        } else {
            console.log('✅ No users with undefined problemSolved found');
        }
        console.log('');

        // Create proper indexes
        console.log('🔧 Creating proper indexes...');
        
        // Ensure emailId is unique
        await db.collection('users').createIndex({ emailId: 1 }, { unique: true });
        console.log('✅ Created emailId unique index (for user authentication)');

        // Create index for problemSolved (without unique constraint)
        await db.collection('users').createIndex({ problemSolved: 1 });
        console.log('✅ Created problemSolved index (non-unique, for performance)');

        console.log('');
        console.log('🎉 Database fixed successfully!');
        console.log('');
        console.log('📝 What was fixed:');
        console.log('   ✅ Removed problematic unique index on problemSolved array');
        console.log('   ✅ Fixed existing users with undefined problemSolved');
        console.log('   ✅ Created proper indexes for performance');
        console.log('');
        console.log('💡 Next steps:');
        console.log('   1. Deploy your updated code to Render');
        console.log('   2. Test user registration - it should work now!');
        console.log('   3. The schema changes will prevent this issue from happening again');
        console.log('');
        
    } catch (error) {
        console.error('❌ Error fixing database:', error.message);
        console.error('');
        console.error('💡 Troubleshooting tips:');
        console.error('   1. Make sure you replaced the MONGODB_URI with your actual connection string');
        console.error('   2. Check that your MongoDB cluster is accessible from your current location');
        console.error('   3. Verify your MongoDB username and password are correct');
        console.error('   4. Ensure your IP address is whitelisted in MongoDB Atlas');
        console.error('');
        console.error('🔗 Need help? Check:');
        console.error('   - MongoDB Atlas Network Access settings');
        console.error('   - Your Render environment variables');
        console.error('   - Your MongoDB connection string format');
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('🔌 Disconnected from MongoDB');
        }
    }
}

// Run the fix
fixDatabase();
