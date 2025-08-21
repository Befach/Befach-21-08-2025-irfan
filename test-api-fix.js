require('dotenv').config({ path: '.env.local' });

async function testAPIFix() {
  try {
    console.log('🔍 Testing Fixed API Endpoint...');
    console.log('================================');
    
    // Test the API endpoint with the same data the form sends
    const response = await fetch('http://localhost:3000/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whatsappType: 'status-only',
        phone: '919182992530',
        trackingId: 'TEST-API-FIX-001',
        status: 'Test Status',
        additionalData: {
          customerName: 'Test Customer',
          shipmentName: 'Test Shipment',
          origin: 'Mumbai, India',
          destination: 'New York, USA'
        }
      }),
    });
    
    console.log('📱 API Response Status:', response.status);
    
    const result = await response.json();
    console.log('📱 API Response:', result);
    
    if (result.success) {
      console.log('✅ API is now working correctly!');
      console.log('📱 WhatsApp message should be sent');
    } else {
      console.log('❌ API still has issues:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPIFix();
