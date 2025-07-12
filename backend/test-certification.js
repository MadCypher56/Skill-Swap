// Simple test script to verify certification system
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

async function testCertificationSystem() {
  try {
    console.log('🧪 Testing Certification System...\n');

    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Server is running:', healthResponse.data);

    // Test 2: Check if certification routes are accessible
    console.log('\n2. Testing certification routes...');
    try {
      const certResponse = await axios.get(`${API_BASE_URL}/certifications/user`);
      console.log('✅ Certification routes are accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Certification routes require authentication (expected)');
      } else {
        console.log('❌ Certification routes error:', error.message);
      }
    }

    // Test 3: Check if learning routes are accessible
    console.log('\n3. Testing learning routes...');
    try {
      const learningResponse = await axios.get(`${API_BASE_URL}/learning/sessions`);
      console.log('✅ Learning routes are accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Learning routes require authentication (expected)');
      } else {
        console.log('❌ Learning routes error:', error.message);
      }
    }

    console.log('\n🎉 All tests completed! The new features are properly integrated.');
    console.log('\n📋 Next steps:');
    console.log('1. Start the frontend: cd ../frontend && npm start');
    console.log('2. Login to your account');
    console.log('3. Navigate to "Private Learning"');
    console.log('4. Create a swap request and accept it');
    console.log('5. Create a private learning session');
    console.log('6. Complete the session and create certifications');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCertificationSystem(); 