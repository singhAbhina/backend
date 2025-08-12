const axios = require('axios');

console.log('🔍 AI Chatbot Debug Script');
console.log('============================\n');

async function debugAIChat() {
    try {
        console.log('1️⃣ Testing if backend is accessible...');
        
        // Test 1: Check if backend is running
        try {
            const healthResponse = await axios.get('http://localhost:3000/user/health');
            console.log('✅ Backend is running and accessible');
            console.log('   Health check response:', healthResponse.data);
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log('❌ Backend is not running on port 3000');
                console.log('   Start your backend with: npm start');
                return;
            } else {
                console.log('⚠️  Backend health check failed:', error.message);
            }
        }

        console.log('\n2️⃣ Testing AI endpoint accessibility...');
        
        // Test 2: Check if AI endpoint exists
        try {
            const aiResponse = await axios.get('http://localhost:3000/ai/chat');
            console.log('✅ AI endpoint is accessible (GET method)');
        } catch (error) {
            if (error.response?.status === 405) {
                console.log('✅ AI endpoint exists (Method Not Allowed for GET is expected)');
            } else {
                console.log('❌ AI endpoint test failed:', error.message);
                if (error.response) {
                    console.log('   Status:', error.response.status);
                    console.log('   Response:', error.response.data);
                }
            }
        }

        console.log('\n3️⃣ Testing AI endpoint with POST request...');
        
        // Test 3: Test actual AI functionality
        const testMessage = {
            messages: [
                {
                    role: "user",
                    content: "Hello, can you help me?"
                }
            ],
            title: "Test Problem",
            description: "This is a test problem",
            testCases: "Test case",
            startCode: "function test() {}"
        };

        console.log('📤 Sending test message:', JSON.stringify(testMessage, null, 2));
        
        const aiPostResponse = await axios.post('http://localhost:3000/ai/chat', testMessage);
        
        console.log('✅ AI endpoint responded successfully!');
        console.log('   Status:', aiPostResponse.status);
        console.log('   Response:', aiPostResponse.data);
        
    } catch (error) {
        console.log('\n❌ AI Chat test failed!');
        console.log('Error:', error.message);
        
        if (error.response) {
            console.log('\n📋 Response Details:');
            console.log('   Status:', error.response.status);
            console.log('   Status Text:', error.response.statusText);
            console.log('   Headers:', error.response.headers);
            console.log('   Data:', error.response.data);
            
            // Analyze the error
            if (error.response.status === 500) {
                console.log('\n🔍 This is a server error. Check your backend logs for:');
                console.log('   - "❌ AI Chat Error:" messages');
                console.log('   - GEMINI_KEY environment variable');
                console.log('   - Google AI API connection issues');
            } else if (error.response.status === 400) {
                console.log('\n🔍 This is a bad request error. Check:');
                console.log('   - Request format is correct');
                console.log('   - All required fields are present');
            } else if (error.response.status === 401) {
                console.log('\n🔍 This is an authentication error. Check:');
                console.log('   - GEMINI_KEY is set correctly');
                console.log('   - API key is valid');
            }
        } else if (error.code === 'ECONNREFUSED') {
            console.log('\n🔍 Connection refused. Make sure:');
            console.log('   - Backend is running on port 3000');
            console.log('   - No firewall blocking the connection');
        } else if (error.code === 'ENOTFOUND') {
            console.log('\n🔍 Host not found. Check:');
            console.log('   - Backend URL is correct');
            console.log('   - Backend is accessible from this machine');
        }
        
        console.log('\n💡 Next steps:');
        console.log('1. Check your backend console for error messages');
        console.log('2. Verify GEMINI_KEY is set in your environment');
        console.log('3. Check if Google AI API is accessible');
        console.log('4. Look for "🤖 AI Chat Request" logs in backend');
    }
}

// Run the debug
debugAIChat();
