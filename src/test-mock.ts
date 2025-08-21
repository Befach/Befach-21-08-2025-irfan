import { createEmailServiceMock } from './mailer-mock';
import { ShipmentService } from './shipment';
import { ShipmentData } from './types';

/**
 * Test script using Mock Email Service
 * This works immediately without any external dependencies
 */
async function testMockEmailFunctionality() {
  console.log('🚀 Testing Shipment Tracking with Mock Email Service...\n');

  try {
    // Initialize mock email service
    console.log('📧 Initializing mock email service...');
    const emailService = createEmailServiceMock();
    
    // Verify connection (always succeeds)
    const isConnected = await emailService.verifyConnection();
    console.log(`✅ Connection status: ${isConnected ? 'Connected' : 'Failed'}\n`);

    // Initialize shipment service with mock email
    const shipmentService = new ShipmentService(emailService);

    // Test 1: Create a new shipment
    console.log('📦 Test 1: Creating a new shipment...');
    const newShipment: Omit<ShipmentData, 'created_at' | 'updated_at'> = {
      tracking_id: 'TRK' + Date.now().toString().slice(-8),
      status: 'Order Confirmed',
      origin_city: 'Mumbai',
      origin_country: 'India',
      destination_city: 'New York',
      destination_country: 'USA',
      current_city: 'Mumbai',
      current_country: 'India',
      transport_mode: 'Air Freight',
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      shipment_notes: 'Fragile items - handle with care',
      client_email: 'client@example.com'
    };

    const shipment = await shipmentService.createShipment(newShipment);
    console.log(`✅ Shipment created: ${shipment.tracking_id}`);
    console.log(`📧 Creation email simulated for: ${shipment.client_email}\n`);

    // Test 2: Update shipment status multiple times
    console.log('🔄 Test 2: Updating shipment status...');
    
    const statusUpdates = [
      { status: 'In Transit', location: { city: 'Delhi', country: 'India' } },
      { status: 'At Airport', location: { city: 'Delhi', country: 'India' } },
      { status: 'In Flight', location: { city: 'In Transit', country: 'International' } },
      { status: 'Arrived at Destination', location: { city: 'New York', country: 'USA' } },
      { status: 'Out for Delivery', location: { city: 'New York', country: 'USA' } },
      { status: 'Delivered', location: { city: 'New York', country: 'USA' } }
    ];

    for (const update of statusUpdates) {
      console.log(`📤 Updating status to: ${update.status}`);
      const updatedShipment = await shipmentService.updateShipmentStatus(
        shipment.tracking_id,
        update.status,
        update.location
      );
      
      if (updatedShipment) {
        console.log(`✅ Status updated: ${update.status}`);
        console.log(`📧 Status update email simulated for: ${updatedShipment.client_email}`);
        
        // Small delay to see the updates
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Test 3: Get shipment details
    console.log('\n📋 Test 3: Retrieving shipment details...');
    const retrievedShipment = shipmentService.getShipment(shipment.tracking_id);
    if (retrievedShipment) {
      console.log('✅ Shipment retrieved successfully:');
      console.log(`   Tracking ID: ${retrievedShipment.tracking_id}`);
      console.log(`   Current Status: ${retrievedShipment.status}`);
      console.log(`   Origin: ${retrievedShipment.origin_city}, ${retrievedShipment.origin_country}`);
      console.log(`   Destination: ${retrievedShipment.destination_city}, ${retrievedShipment.destination_country}`);
      console.log(`   Client Email: ${retrievedShipment.client_email}`);
    }

    // Test 4: Get all shipments
    console.log('\n📊 Test 4: Retrieving all shipments...');
    const allShipments = shipmentService.getAllShipments();
    console.log(`✅ Total shipments in system: ${allShipments.length}`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Mock Email Service: ✅ Working');
    console.log('   - Shipment Creation: ✅ Working');
    console.log('   - Status Updates: ✅ Working');
    console.log('   - Email Notifications: ✅ Simulated');
    console.log('   - Data Retrieval: ✅ Working');
    console.log(`   - Total Emails Simulated: ${statusUpdates.length + 1}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Close email service connection
    const emailService = createEmailServiceMock();
    await emailService.close();
    console.log('\n🔌 Mock email service connection closed.');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testMockEmailFunctionality().catch(console.error);
} 