const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing Both WhatsApp and Email Notifications');
console.log('================================================');

// Check environment variables
console.log('\n🔑 Environment Variables Check:');
console.log('WATI_API_KEY:', process.env.WATI_API_KEY ? '✅ Present' : '❌ Missing');
console.log('WATI_INSTANCE_ID:', process.env.WATI_INSTANCE_ID ? '✅ Present' : '❌ Missing');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Present' : '❌ Missing');

if (!process.env.WATI_API_KEY) {
  console.log('❌ WATI_API_KEY not found - WhatsApp tests will fail');
}

if (!process.env.RESEND_API_KEY) {
  console.log('❌ RESEND_API_KEY not found - Email tests will fail');
}

// Test WhatsApp
async function testWhatsApp() {
  console.log('\n📱 Testing WhatsApp Notification:');
  
  try {
    const response = await axios.post('http://localhost:3000/api/send-whatsapp', {
      whatsappType: 'status-only',
      phone: '919876543210', // Replace with your test number
      trackingId: 'TEST-2024-001',
      status: 'Test Status Update',
      additionalData: {
        customerName: 'Test Customer',
        shipmentName: 'Test Shipment',
        origin: 'Mumbai, India',
        destination: 'New York, USA'
      }
    });
    
    console.log('✅ WhatsApp test successful:', response.data);
  } catch (error) {
    console.log('❌ WhatsApp test failed:', error.response?.data || error.message);
  }
}

// Test Email
async function testEmail() {
  console.log('\n📧 Testing Email Notification:');
  
  try {
    const response = await axios.post('http://localhost:3000/api/send-email', {
      emailType: 'shipment-creation',
      email: 'test@example.com', // Replace with your test email
      shipmentData: {
        tracking_id: 'TEST-2024-001',
        status: 'Test Status',
        origin_city: 'Mumbai',
        origin_country: 'India',
        destination_city: 'New York',
        destination_country: 'USA',
        transport_mode: 'Air'
      }
    });
    
    console.log('✅ Email test successful:', response.data);
  } catch (error) {
    console.log('❌ Email test failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('\n🚀 Starting tests...');
  
  await testWhatsApp();
  await testEmail();
  
  console.log('\n✨ Tests completed!');
}

runTests().catch(console.error);


