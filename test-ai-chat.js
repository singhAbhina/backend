const axios = require('axios');

// Test the AI chatbot endpoint
async function testAIChat() {
    try {
        console.log('🤖 Testing AI Chatbot...\n');
        
        const testMessage = {
            messages: [
                {
                    role: "user",
                    content: "Can you give me a hint for solving a binary search problem?"
                }
            ],
            title: "Binary Search",
            description: "Find a target element in a sorted array",
            testCases: "Input: [1,2,3,4,5], target: 3\nOutput: 2",
            startCode: "function binarySearch(nums, target) {\n  // Your code here\n}"
        };

        console.log('📤 Sending test message to AI chatbot...');
        console.log('Message:', JSON.stringify(testMessage, null, 2));
        console.log('');

        const response = await axios.post('http://localhost:3000/ai/chat', testMessage);
        
        console.log('✅ AI Response received!');
        console.log('Status:', response.status);
        console.log('Response:', response.data);
        
    } catch (error) {
        console.error('❌ AI Chat test failed:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        }
        
        console.error('\n💡 Troubleshooting tips:');
        console.error('1. Make sure your backend is running on port 3000');
        console.error('2. Check that GEMINI_KEY is set in your environment');
        console.error('3. Verify the AI endpoint is accessible');
        console.error('4. Check backend logs for detailed error messages');
    }
}

// Test the endpoint directly
async function testEndpoint() {
    try {
        console.log('🔍 Testing AI endpoint accessibility...\n');
        
        const response = await axios.get('http://localhost:3000/ai/chat');
        console.log('✅ Endpoint is accessible');
        console.log('Response:', response.data);
        
    } catch (error) {
        if (error.response?.status === 405) {
            console.log('✅ Endpoint exists (Method Not Allowed for GET is expected)');
        } else {
            console.error('❌ Endpoint test failed:', error.message);
        }
    }
}

// Run tests
async function runTests() {
    console.log('🧪 AI Chatbot Test Suite');
    console.log('========================\n');
    
    await testEndpoint();
    console.log('');
    await testAIChat();
}

runTests();
