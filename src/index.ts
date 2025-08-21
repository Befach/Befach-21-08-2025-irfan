import { createEmailService } from './mailer';
import { ShipmentService } from './shipment';
import { ShipmentData } from './types';

/**
 * Main application entry point
 * Demonstrates shipment tracking and email notification system
 */
async function main() {
  console.log('🚀 Starting Shipment Tracking System...\n');

  try {
    // Initialize email service
    console.log('📧 Initializing email service...');
    const emailService = createEmailService();
    
    // Verify SMTP connection
    const isConnected = await emailService.verifyConnection();
    if (!isConnected) {
      console.error('❌ Failed to connect to SMTP server. Please check your credentials.');
      return;
    }
    console.log('✅ SMTP connection verified successfully\n');

    // Initialize shipment service
    const shipmentService = new ShipmentService(emailService);

    // Demo: Create a new shipment
    console.log('📦 Creating a new shipment...');
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
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      shipment_notes: 'Fragile items - handle with care',
      client_email: 'client@example.com' // Replace with actual client email
    };

    const shipment = await shipmentService.createShipment(newShipment);
    console.log(`✅ Shipment created: ${shipment.tracking_id}`);
    console.log(`📧 Creation email sent to: ${shipment.client_email}\n`);

    // Demo: Update shipment status
    console.log('🔄 Updating shipment status...');
    
    // Simulate status updates
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
        console.log(`📧 Status update email sent to: ${updatedShipment.client_email}`);
        
        // Add delay to simulate real-time updates
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('\n🎉 Demo completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Shipment ID: ${shipment.tracking_id}`);
    console.log(`   - Total status updates: ${statusUpdates.length}`);
    console.log(`   - Emails sent: ${statusUpdates.length + 1} (1 creation + ${statusUpdates.length} updates)`);

  } catch (error) {
    console.error('❌ Error in main application:', error);
  } finally {
    // Close email service connection
    const emailService = createEmailService();
    await emailService.close();
    console.log('\n🔌 Email service connection closed.');
  }
}

/**
 * Utility function to create a test shipment
 */
export async function createTestShipment(clientEmail: string): Promise<ShipmentData> {
  const emailService = createEmailService();
  const shipmentService = new ShipmentService(emailService);

  const testShipment: Omit<ShipmentData, 'created_at' | 'updated_at'> = {
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
    shipment_notes: 'Test shipment for email notifications',
    client_email: clientEmail
  };

  return await shipmentService.createShipment(testShipment);
}

/**
 * Utility function to update shipment status
 */
export async function updateTestShipmentStatus(
  trackingId: string, 
  newStatus: string, 
  _clientEmail: string,
  location?: { city: string; country: string }
): Promise<ShipmentData | null> {
  const emailService = createEmailService();
  const shipmentService = new ShipmentService(emailService);

  return await shipmentService.updateShipmentStatus(trackingId, newStatus, location);
}

// Run the demo if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { createEmailService, ShipmentService }; 