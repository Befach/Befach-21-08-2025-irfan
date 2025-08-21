// Test WhatsApp Cloud API integration
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testWhatsAppCloud() {
  console.log('🧪 Testing WhatsApp Cloud API Integration\n');
  
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (!accessToken) {
    console.log('❌ Missing WHATSAPP_ACCESS_TOKEN');
    console.log('💡 Add this to your .env.local file');
    return;
  }
  
  if (!phoneNumberId) {
    console.log('❌ Missing WHATSAPP_PHONE_NUMBER_ID');
    console.log('💡 Add this to your .env.local file');
    return;
  }
  
  console.log('✅ WhatsApp Cloud API credentials found');
  console.log('📱 Phone Number ID:', phoneNumberId);
  
  // Test phone number (your number)
  const testPhone = '919182992530';
  
  try {
    console.log('\n🔍 Testing connection to WhatsApp Cloud API...');
    
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: testPhone,
        type: "text",
        text: {
          body: "🚚 Hello from WhatsApp Cloud API! This is a test message from Befach Logistics."
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCESS! Message sent via WhatsApp Cloud API');
    console.log('📱 Check your WhatsApp now!');
    console.log('Message ID:', response.data.messages?.[0]?.id || 'Unknown');
    
  } catch (error) {
    console.log('❌ Error sending message:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data?.error?.message || 'Unknown error');
      
      if (error.response.status === 401) {
        console.log('💡 Your access token might be invalid or expired');
      } else if (error.response.status === 400) {
        console.log('💡 Check your phone number format and phone number ID');
      }
    } else {
      console.log('Network error:', error.message);
    }
  }
}

// Run the test
testWhatsAppCloud();







