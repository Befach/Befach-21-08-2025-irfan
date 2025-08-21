const { sendStatusOnlyWhatsApp } = require('./lib/watiWhatsAppService');

async function testEnhancedShipment() {
  console.log('🧪 Testing Enhanced Shipment WhatsApp...\n');
  
  // Test with comprehensive shipment data
  const shipmentData = {
    customerName: "John Smith",
    shipmentName: "Electronics Package",
    origin: "Mumbai, India",
    destination: "New York, USA"
  };
  
  try {
    console.log('📦 Testing with shipment data:');
    console.log('Customer:', shipmentData.customerName);
    console.log('Shipment:', shipmentData.shipmentName);
    console.log('Origin:', shipmentData.origin);
    console.log('Destination:', shipmentData.destination);
    console.log('');
    
    const result = await sendStatusOnlyWhatsApp(
      'SHIP-2024-001',
      'In Transit',
      '+91919182992530',
      shipmentData
    );
    
    console.log('📱 Test Result:');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.success) {
      console.log('🎉 Enhanced shipment WhatsApp sent successfully!');
      console.log('📱 Check your mobile for the detailed message');
    } else {
      console.log('❌ Error:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testEnhancedShipment();

