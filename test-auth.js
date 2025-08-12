const axios = require('axios');

const BASE_URL = 'https://proj-backend-un8b.onrender.com';

async function testAuth() {
    try {
        console.log('Testing backend authentication...\n');
        
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${BASE_URL}/user/health`);
        console.log('✅ Health check passed:', healthResponse.data);
        
        // Test registration
        console.log('\n2. Testing user registration...');
        const testUser = {
            firstName: 'TestUser',
            emailId: `test${Date.now()}@example.com`,
            password: 'testpassword123'
        };
        
        const registerResponse = await axios.post(`${BASE_URL}/user/register`, testUser);
        console.log('✅ Registration successful:', registerResponse.data.message);
        console.log('User created:', registerResponse.data.user);
        
        // Test login
        console.log('\n3. Testing user login...');
        const loginResponse = await axios.post(`${BASE_URL}/user/login`, {
            emailId: testUser.emailId,
            password: testUser.password
        });
        console.log('✅ Login successful:', loginResponse.data.message);
        console.log('User logged in:', loginResponse.data.user);
        
        console.log('\n🎉 All authentication tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

testAuth();
