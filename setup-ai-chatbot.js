const fs = require('fs');
const path = require('path');

console.log('🤖 AI Chatbot Setup Script');
console.log('============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file...');
    
    const envContent = `# AI Chatbot Configuration
GEMINI_KEY=your_gemini_api_key_here

# Other environment variables (if needed)
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database and Redis (if you have them)
# MONGODB_URI=your_mongodb_connection_string
# REDIS_URL=your_redis_connection_string
# JWT_KEY=your_jwt_secret_key
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('   Please edit it and add your actual GEMINI_KEY');
} else {
    console.log('✅ .env file already exists');
}

// Check package.json for correct dependency
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    if (packageJson.dependencies && packageJson.dependencies['@google/generative-ai']) {
        console.log('✅ @google/generative-ai dependency is correctly configured');
    } else {
        console.log('❌ @google/generative-ai dependency is missing');
        console.log('   Run: npm install @google/generative-ai');
    }
} else {
    console.log('❌ package.json not found');
}

console.log('\n🔧 Setup Steps:');
console.log('1. Edit the .env file and add your GEMINI_KEY');
console.log('2. Install dependencies: npm install');
console.log('3. Start your backend: npm start');
console.log('4. Test the AI chatbot: node test-ai-chat.js');
console.log('5. Or test from your frontend application');

console.log('\n🔑 How to get GEMINI_KEY:');
console.log('1. Go to: https://makersuite.google.com/app/apikey');
console.log('2. Create a new API key');
console.log('3. Copy the key and paste it in your .env file');

console.log('\n🧪 Testing:');
console.log('- Backend test: node test-ai-chat.js');
console.log('- Frontend test: Use the AI chat component in your app');
console.log('- Check backend logs for "🤖 AI Chat Request" messages');

console.log('\n💡 Troubleshooting:');
console.log('- Make sure GEMINI_KEY is set in .env file');
console.log('- Check that your backend is running on port 3000');
console.log('- Verify the AI endpoint is accessible at /ai/chat');
console.log('- Check backend console for error messages');

console.log('\n🎉 Your AI chatbot should now work!');
