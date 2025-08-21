require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function testSimpleShipment() {
  console.log('🧪 Testing Simple Shipment Creation...\n');

  const simpleData = {
    tracking_id: 'BEF-SIMPLE-' + Date.now(),
    client_phone: '+918802308802',
    buyer_name: 'Test Customer',
    shipment_name: 'Test Package'
  };

  try {
    console.log('📱 Testing with minimal data...');
    console.log('Phone:', simpleData.client_phone);
    console.log('Name:', simpleData.buyer_name);

    const response = await fetch('http://localhost:3000/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whatsappType: 'shipment-creation',
        phone: simpleData.client_phone,
        clientName: simpleData.buyer_name,
        shipmentData: simpleData
      }),
    });

    console.log('Response Status:', response.status);
    const result = await response.json();
    console.log('Result:', result);

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testSimpleShipment();
