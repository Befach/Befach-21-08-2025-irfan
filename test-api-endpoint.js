require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function testAPIEndpoint() {
  console.log('🧪 Testing Next.js API Endpoint...\n');

  const shipmentData = {
    tracking_id: 'BEF-20250807-09991',
    shipment_name: 'Test Package',
    origin_country: 'India',
    destination_country: 'USA',
    estimated_delivery: '2024-12-20',
    contents: 'Test Contents'
  };

  try {
    console.log('📱 Testing /api/send-whatsapp endpoint...');
    console.log('Phone: +919182992530');
    console.log('Tracking ID:', shipmentData.tracking_id);

    const response = await fetch('http://localhost:3000/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whatsappType: 'shipment-creation',
        phone: '+919182992530',
        clientName: 'Test Customer',
        shipmentData: shipmentData
      }),
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! API endpoint working');
      console.log('Response:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ FAILED! API endpoint error');
      console.log('Error Status:', response.status);
      console.log('Error Text:', errorText);
    }

  } catch (error) {
    console.log('❌ ERROR occurred:');
    console.log('Error:', error.message);
  }
}

testAPIEndpoint();
