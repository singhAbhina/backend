const axios = require('axios');

console.log('🧪 Simple AI Chat Test');
console.log('=======================\n');

async function testAI() {
    try {
        console.log('1️⃣ Testing backend health...');
        const healthResponse = await axios.get('http://localhost:3000/user/health');
        console.log('✅ Backend health check passed:', healthResponse.data);
        
        console.log('\n2️⃣ Testing AI endpoint...');
        const testData = {
            messages: [{ role: "user", content: "Hello, can you help me?" }],
            title: "Test Problem",
            description: "This is a test",
            testCases: "Test case",
            startCode: "function test() {}"
        };
        
        console.log('📤 Sending test message...');
        const aiResponse = await axios.post('http://localhost:3000/ai/chat', testData);
        console.log('✅ AI response received:', aiResponse.data);
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Response:', error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            console.log('🔍 Connection refused. Backend might not be running or accessible.');
        }
    }
}

testAI();
