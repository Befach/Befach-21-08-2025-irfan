require('dotenv').config({ path: '.env.local' });

async function testShipmentCreation() {
  console.log('🧪 Testing Shipment Creation with WhatsApp...\n');

  // Simulate shipment data that would come from your form
  const shipmentData = {
    tracking_id: 'BEF-TEST-' + Date.now(),
    client_email: 'test@example.com',
    client_phone: '+918802308802', // Your test number
    origin_country: 'India',
    origin_city: 'Mumbai',
    destination_country: 'USA',
    destination_city: 'New York',
    current_city: 'Mumbai',
    current_country: 'India',
    status: 'Product Insurance Completed',
    transport_mode: 'Air',
    estimated_delivery: '2024-12-20',
    package_count: 1,
    package_type: 'Box',
    weight: '5.5',
    dimensions: '30×20×15',
    contents: 'Electronics Package',
    shipment_name: 'Test Electronics Package',
    buyer_name: 'John Doe'
  };

  try {
    console.log('📱 Sending WhatsApp notification for shipment creation...');
    console.log('Phone:', shipmentData.client_phone);
    console.log('Tracking ID:', shipmentData.tracking_id);
    console.log('Client Name:', shipmentData.buyer_name);

    // Call the API endpoint
    const response = await fetch('http://localhost:3000/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whatsappType: 'shipment-creation',
        phone: shipmentData.client_phone,
        clientName: shipmentData.buyer_name,
        shipmentData: shipmentData
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ SUCCESS! WhatsApp notification sent successfully');
      console.log('Response:', result);
    } else {
      console.log('❌ FAILED to send WhatsApp notification');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.log('❌ ERROR occurred:');
    console.log('Error:', error.message);
  }
}

testShipmentCreation();

