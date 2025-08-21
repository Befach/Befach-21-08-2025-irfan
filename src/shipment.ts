import { ShipmentData, EmailContent } from './types';
import { EmailService } from './mailer';

// Import WhatsApp service from src directory
import { whatsappService } from './whatsapp';

// Create a common interface for email services
interface IEmailService {
  sendEmail(to: string, subject: string, content: EmailContent): Promise<{ success: boolean; message?: string; error?: string; messageId?: string }>;
  verifyConnection(): Promise<boolean>;
  close(): Promise<void>;
}

/**
 * Shipment Management Service
 * Handles shipment creation, updates, and notifications (email + WhatsApp)
 */
export class ShipmentService {
  private emailService: IEmailService;
  private shipments: Map<string, ShipmentData> = new Map();

  constructor(emailService: IEmailService) {
    this.emailService = emailService;
  }

  /**
   * Create a new shipment
   */
  async createShipment(shipmentData: Omit<ShipmentData, 'created_at' | 'updated_at'>): Promise<ShipmentData> {
    const now = new Date().toISOString();
    const shipment: ShipmentData = {
      ...shipmentData,
      created_at: now,
      updated_at: now
    };

    // Store shipment
    this.shipments.set(shipment.tracking_id, shipment);

    // Send creation notifications (email + WhatsApp)
    await Promise.all([
      this.sendShipmentCreationEmail(shipment),
      this.sendShipmentCreationWhatsApp(shipment)
    ]);

    console.log(`Shipment created: ${shipment.tracking_id}`);
    return shipment;
  }

  /**
   * Update shipment status
   */
  async updateShipmentStatus(
    trackingId: string, 
    newStatus: string, 
    currentLocation?: { city: string; country: string }
  ): Promise<ShipmentData | null> {
    const shipment = this.shipments.get(trackingId);
    if (!shipment) {
      throw new Error(`Shipment not found: ${trackingId}`);
    }

    const previousStatus = shipment.status;
    const now = new Date().toISOString();

    // Update shipment
    const updatedShipment: ShipmentData = {
      ...shipment,
      status: newStatus,
      updated_at: now,
      ...(currentLocation && {
        current_location_city: currentLocation.city,
        current_location_country: currentLocation.country
      })
    };

    this.shipments.set(trackingId, updatedShipment);

    // Send status update notifications (email + WhatsApp)
    await Promise.all([
      this.sendShipmentStatusUpdateEmail(updatedShipment, previousStatus),
      this.sendShipmentStatusUpdateWhatsApp(updatedShipment, previousStatus)
    ]);

    console.log(`Shipment status updated: ${trackingId} - ${previousStatus} → ${newStatus}`);
    return updatedShipment;
  }

  /**
   * Get shipment by tracking ID
   */
  getShipment(trackingId: string): ShipmentData | null {
    return this.shipments.get(trackingId) || null;
  }

  /**
   * Get all shipments
   */
  getAllShipments(): ShipmentData[] {
    return Array.from(this.shipments.values());
  }

  /**
   * Send shipment creation email
   */
  private async sendShipmentCreationEmail(shipment: ShipmentData): Promise<void> {
    const subject = `New Shipment Created - ${shipment.tracking_id}`;
    const content = this.generateCreationEmailContent(shipment);

    const result = await this.emailService.sendEmail(shipment.client_email, subject, content);
    
    if (result.success) {
      console.log(`Creation email sent successfully to ${shipment.client_email}`);
    } else {
      console.error(`Failed to send creation email: ${result.error}`);
    }
  }

  /**
   * Send shipment creation WhatsApp message
   */
  private async sendShipmentCreationWhatsApp(shipment: ShipmentData): Promise<void> {
    if (!shipment.client_phone) {
      console.log('No phone number available for WhatsApp notification');
      return;
    }

    const result = await whatsappService.sendShipmentCreationMessage(shipment);
    
    if (result.success) {
      console.log(`Creation WhatsApp sent successfully to ${shipment.client_phone}`);
    } else {
      console.error(`Failed to send creation WhatsApp: ${result.error}`);
    }
  }

  /**
   * Send shipment status update email
   */
  private async sendShipmentStatusUpdateEmail(shipment: ShipmentData, previousStatus: string): Promise<void> {
    const subject = `Shipment Status Update - ${shipment.tracking_id}`;
    const content = this.generateStatusUpdateEmailContent(shipment, previousStatus);

    const result = await this.emailService.sendEmail(shipment.client_email, subject, content);
    
    if (result.success) {
      console.log(`Status update email sent successfully to ${shipment.client_email}`);
    } else {
      console.error(`Failed to send status update email: ${result.error}`);
    }
  }

  /**
   * Send shipment status update WhatsApp message
   */
  private async sendShipmentStatusUpdateWhatsApp(shipment: ShipmentData, previousStatus: string): Promise<void> {
    if (!shipment.client_phone) {
      console.log('No phone number available for WhatsApp notification');
      return;
    }

    const result = await whatsappService.sendShipmentStatusUpdateMessage(shipment, previousStatus);
    
    if (result.success) {
      console.log(`Status update WhatsApp sent successfully to ${shipment.client_phone}`);
    } else {
      console.error(`Failed to send status update WhatsApp: ${result.error}`);
    }
  }

  /**
   * Generate email content for shipment creation
   */
  private generateCreationEmailContent(shipment: ShipmentData): EmailContent {
    const trackingUrl = `${process.env['NEXT_PUBLIC_BASE_URL'] || 'http://localhost:3000'}/track?tracking_id=${shipment.tracking_id}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>New Shipment Created</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #059669; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .shipment-details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
              .tracking-button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>📦 New Shipment Created</h1>
              </div>
              
              <div class="content">
                  <p>Dear Valued Customer,</p>
                  
                  <p>Your shipment has been successfully created and is now being processed. Here are the details:</p>
                  
                  <div class="shipment-details">
                      <h3>Shipment Details</h3>
                      <p><strong>Tracking ID:</strong> ${shipment.tracking_id}</p>
                      <p><strong>Current Status:</strong> ${shipment.status}</p>
                      <p><strong>Origin:</strong> ${shipment.origin_city}, ${shipment.origin_country}</p>
                      <p><strong>Destination:</strong> ${shipment.destination_city}, ${shipment.destination_country}</p>
                      <p><strong>Current Location:</strong> ${shipment.current_location_city || shipment.current_city || 'N/A'}, ${shipment.current_location_country || shipment.current_country || 'N/A'}</p>
                      <p><strong>Transport Mode:</strong> ${shipment.transport_mode}</p>
                      ${shipment.estimated_delivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(shipment.estimated_delivery).toLocaleDateString()}</p>` : ''}
                      ${shipment.shipment_notes ? `<p><strong>Notes:</strong> ${shipment.shipment_notes}</p>` : ''}
                  </div>
                  
                  <div style="text-align: center;">
                      <a href="${trackingUrl}" class="tracking-button">Track Your Shipment</a>
                  </div>
                  
                  <p>You will receive email notifications whenever your shipment status is updated.</p>
                  
                  <p>If you have any questions about your shipment, please don't hesitate to contact us.</p>
                  
                  <p>Best regards,<br>Befach Logistics Team</p>
              </div>
              
              <div class="footer">
                  <p>This is an automated notification. Please do not reply to this email.</p>
                  <p>© 2024 Befach Logistics. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const text = `
New Shipment Created

Dear Valued Customer,

Your shipment has been successfully created and is now being processed.

Shipment Details:
- Tracking ID: ${shipment.tracking_id}
- Current Status: ${shipment.status}
- Origin: ${shipment.origin_city}, ${shipment.origin_country}
- Destination: ${shipment.destination_city}, ${shipment.destination_country}
- Current Location: ${shipment.current_location_city || shipment.current_city || 'N/A'}, ${shipment.current_location_country || shipment.current_country || 'N/A'}
- Transport Mode: ${shipment.transport_mode}
${shipment.estimated_delivery ? `- Estimated Delivery: ${new Date(shipment.estimated_delivery).toLocaleDateString()}` : ''}
${shipment.shipment_notes ? `- Notes: ${shipment.shipment_notes}` : ''}

Track your shipment: ${trackingUrl}

You will receive email notifications whenever your shipment status is updated.

If you have any questions about your shipment, please don't hesitate to contact us.

Best regards,
Befach Logistics Team

---
This is an automated notification. Please do not reply to this email.
© 2024 Befach Logistics. All rights reserved.
    `;

    return { html, text };
  }

  /**
   * Generate email content for status update
   */
  private generateStatusUpdateEmailContent(shipment: ShipmentData, previousStatus: string): EmailContent {
    const trackingUrl = `${process.env['NEXT_PUBLIC_BASE_URL'] || 'http://localhost:3000'}/track?tracking_id=${shipment.tracking_id}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Shipment Status Update</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .status-update { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
              .shipment-details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
              .tracking-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>🚚 Shipment Status Update</h1>
              </div>
              
              <div class="content">
                  <p>Dear Valued Customer,</p>
                  
                  <p>Your shipment status has been updated. Here are the details:</p>
                  
                  <div class="status-update">
                      <h3>Status Change</h3>
                      <p><strong>Previous Status:</strong> ${previousStatus}</p>
                      <p><strong>New Status:</strong> ${shipment.status}</p>
                      <p><strong>Updated:</strong> ${new Date(shipment.updated_at).toLocaleString()}</p>
                  </div>
                  
                  <div class="shipment-details">
                      <h3>Shipment Details</h3>
                      <p><strong>Tracking ID:</strong> ${shipment.tracking_id}</p>
                      <p><strong>Origin:</strong> ${shipment.origin_city}, ${shipment.origin_country}</p>
                      <p><strong>Destination:</strong> ${shipment.destination_city}, ${shipment.destination_country}</p>
                      <p><strong>Current Location:</strong> ${shipment.current_location_city || shipment.current_city || 'N/A'}, ${shipment.current_location_country || shipment.current_country || 'N/A'}</p>
                      <p><strong>Transport Mode:</strong> ${shipment.transport_mode}</p>
                      ${shipment.estimated_delivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(shipment.estimated_delivery).toLocaleDateString()}</p>` : ''}
                      ${shipment.shipment_notes ? `<p><strong>Notes:</strong> ${shipment.shipment_notes}</p>` : ''}
                  </div>
                  
                  <div style="text-align: center;">
                      <a href="${trackingUrl}" class="tracking-button">Track Your Shipment</a>
                  </div>
                  
                  <p>If you have any questions about your shipment, please don't hesitate to contact us.</p>
                  
                  <p>Best regards,<br>Befach Logistics Team</p>
              </div>
              
              <div class="footer">
                  <p>This is an automated notification. Please do not reply to this email.</p>
                  <p>© 2024 Befach Logistics. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const text = `
Shipment Status Update

Dear Valued Customer,

Your shipment status has been updated.

Status Change:
- Previous Status: ${previousStatus}
- New Status: ${shipment.status}
- Updated: ${new Date(shipment.updated_at).toLocaleString()}

Shipment Details:
- Tracking ID: ${shipment.tracking_id}
- Origin: ${shipment.origin_city}, ${shipment.origin_country}
- Destination: ${shipment.destination_city}, ${shipment.destination_country}
- Current Location: ${shipment.current_location_city || shipment.current_city || 'N/A'}, ${shipment.current_location_country || shipment.current_country || 'N/A'}
- Transport Mode: ${shipment.transport_mode}
${shipment.estimated_delivery ? `- Estimated Delivery: ${new Date(shipment.estimated_delivery).toLocaleDateString()}` : ''}
${shipment.shipment_notes ? `- Notes: ${shipment.shipment_notes}` : ''}

Track your shipment: ${trackingUrl}

If you have any questions about your shipment, please don't hesitate to contact us.

Best regards,
Befach Logistics Team

---
This is an automated notification. Please do not reply to this email.
© 2024 Befach Logistics. All rights reserved.
    `;

    return { html, text };
  }
} 