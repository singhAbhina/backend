const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get the database instance
        const db = mongoose.connection.db;
        
        // Check existing indexes on users collection
        console.log('\nChecking existing indexes on users collection...');
        const indexes = await db.collection('users').indexes();
        console.log('Current indexes:', indexes);

        // Remove problematic indexes if they exist
        console.log('\nRemoving problematic indexes...');
        
        try {
            // Remove the problematic problemSolved index if it exists
            await db.collection('users').dropIndex('problemSolved_1');
            console.log('✅ Removed problemSolved_1 index');
        } catch (err) {
            if (err.code === 26) {
                console.log('ℹ️  problemSolved_1 index does not exist');
            } else {
                console.log('⚠️  Error removing problemSolved_1 index:', err.message);
            }
        }

        // Check if there are any users with undefined problemSolved
        console.log('\nChecking for users with undefined problemSolved...');
        const usersWithUndefined = await db.collection('users').find({
            $or: [
                { problemSolved: undefined },
                { problemSolved: null }
            ]
        }).toArray();

        if (usersWithUndefined.length > 0) {
            console.log(`Found ${usersWithUndefined.length} users with undefined problemSolved`);
            
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
            console.log(`✅ Updated ${result.modifiedCount} users`);
        } else {
            console.log('✅ No users with undefined problemSolved found');
        }

        // Create proper indexes
        console.log('\nCreating proper indexes...');
        
        // Ensure emailId is unique
        await db.collection('users').createIndex({ emailId: 1 }, { unique: true });
        console.log('✅ Created emailId unique index');

        // Create index for problemSolved (without unique constraint)
        await db.collection('users').createIndex({ problemSolved: 1 });
        console.log('✅ Created problemSolved index (non-unique)');

        console.log('\n🎉 Database fixed successfully!');
        
    } catch (error) {
        console.error('❌ Error fixing database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the fix
fixDatabase();
