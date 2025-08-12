require('dotenv').config();

console.log('🔧 Environment Configuration Check');
console.log('==================================\n');

// Check essential environment variables
const requiredVars = {
    'GEMINI_KEY': process.env.GEMINI_KEY,
    'NODE_ENV': process.env.NODE_ENV,
    'PORT': process.env.PORT
};

console.log('📋 Environment Variables Status:');
Object.entries(requiredVars).forEach(([key, value]) => {
    if (value) {
        if (key === 'GEMINI_KEY') {
            // Don't show the full API key, just indicate it's set
            const maskedValue = value.substring(0, 8) + '...' + value.substring(value.length - 4);
            console.log(`   ✅ ${key}: ${maskedValue}`);
        } else {
            console.log(`   ✅ ${key}: ${value}`);
        }
    } else {
        console.log(`   ❌ ${key}: NOT SET`);
    }
});

console.log('\n🔍 Detailed Analysis:');

// Check GEMINI_KEY
if (!process.env.GEMINI_KEY) {
    console.log('\n❌ GEMINI_KEY is missing!');
    console.log('   This is why your AI chatbot is failing.');
    console.log('   Get your API key from: https://makersuite.google.com/app/apikey');
    console.log('   Then set it in your .env file or Render environment variables');
} else if (process.env.GEMINI_KEY.includes('your_')) {
    console.log('\n⚠️  GEMINI_KEY appears to be a placeholder value');
    console.log('   Please replace it with your actual API key');
} else {
    console.log('\n✅ GEMINI_KEY is properly configured');
}

// Check NODE_ENV
if (!process.env.NODE_ENV) {
    console.log('\n⚠️  NODE_ENV is not set (defaults to development)');
} else {
    console.log(`\n✅ NODE_ENV is set to: ${process.env.NODE_ENV}`);
}

// Check PORT
if (!process.env.PORT) {
    console.log('\n⚠️  PORT is not set (defaults to 3000)');
} else {
    console.log(`\n✅ PORT is set to: ${process.env.PORT}`);
}

console.log('\n🔧 Next Steps:');
if (!process.env.GEMINI_KEY) {
    console.log('1. Get your Gemini API key from Google AI Studio');
    console.log('2. Add it to your .env file: GEMINI_KEY=your_actual_key');
    console.log('3. Or set it in Render environment variables');
    console.log('4. Restart your backend');
} else {
    console.log('1. Your environment looks good!');
    console.log('2. Try running the debug script: node debug-ai-chat.js');
    console.log('3. Check backend logs for any runtime errors');
}

console.log('\n💡 Troubleshooting Tips:');
console.log('- Make sure you restart your backend after changing environment variables');
console.log('- Check that your .env file is in the backend directory');
console.log('- Verify your API key is valid and not expired');
console.log('- Check backend console for "🤖 AI Chat Request" logs');
