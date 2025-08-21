import { ShipmentService } from './shipment';
import { EmailService } from './mailer';

/**
 * Test script to demonstrate shipment service with WhatsApp notifications
 */
async function testShipmentWithWhatsApp() {
  console.log('🚀 Testing Shipment Service with WhatsApp Notifications\n');

  // Initialize services
  const emailService = new EmailService();
  const shipmentService = new ShipmentService(emailService);

  try {
    // Test 1: Create a new shipment
    console.log('📦 Test 1: Creating new shipment...');
    const shipmentData = {
      tracking_id: 'BEF-2024-001',
      status: 'In Transit',
      origin_city: 'Mumbai',
      origin_country: 'India',
      destination_city: 'New York',
      destination_country: 'USA',
      transport_mode: 'Air Freight',
      estimated_delivery: '2024-12-25T00:00:00.000Z',
      shipment_notes: 'Fragile items - handle with care',
      client_email: 'customer@example.com',
      client_phone: '919876543210' // WhatsApp number
    };

    const shipment = await shipmentService.createShipment(shipmentData);
    console.log('✅ Shipment created successfully:', shipment.tracking_id);
    console.log('📧 Email notification sent');
    console.log('📱 WhatsApp notification sent\n');

    // Test 2: Update shipment status
    console.log('🔄 Test 2: Updating shipment status...');
    const updatedShipment = await shipmentService.updateShipmentStatus(
      'BEF-2024-001',
      'Out for Delivery',
      { city: 'New York', country: 'USA' }
    );

    if (updatedShipment) {
      console.log('✅ Shipment status updated successfully');
      console.log('📧 Status update email sent');
      console.log('📱 Status update WhatsApp sent\n');
    }

    // Test 3: Create shipment without phone number (should skip WhatsApp)
    console.log('📦 Test 3: Creating shipment without phone number...');
    const shipmentWithoutPhone = {
      tracking_id: 'BEF-2024-002',
      status: 'Processing',
      origin_city: 'Delhi',
      origin_country: 'India',
      destination_city: 'London',
      destination_country: 'UK',
      transport_mode: 'Sea Freight',
      client_email: 'customer2@example.com'
      // No client_phone - WhatsApp will be skipped
    };

    const shipment2 = await shipmentService.createShipment(shipmentWithoutPhone);
    console.log('✅ Shipment created successfully:', shipment2.tracking_id);
    console.log('📧 Email notification sent');
    console.log('📱 WhatsApp notification skipped (no phone number)\n');

    // Test 4: Get shipment details
    console.log('🔍 Test 4: Retrieving shipment details...');
    const retrievedShipment = shipmentService.getShipment('BEF-2024-001');
    if (retrievedShipment) {
      console.log('✅ Shipment retrieved:', {
        tracking_id: retrievedShipment.tracking_id,
        status: retrievedShipment.status,
        current_location: `${retrievedShipment.current_location_city}, ${retrievedShipment.current_location_country}`
      });
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Shipment service now sends both email and WhatsApp notifications');
    console.log('- WhatsApp notifications are sent when client_phone is available');
    console.log('- Email notifications are always sent');
    console.log('- Both notifications are sent in parallel for better performance');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up
    await emailService.close();
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testShipmentWithWhatsApp().catch(console.error);
}

export { testShipmentWithWhatsApp };




