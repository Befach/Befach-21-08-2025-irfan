import { ShipmentData } from './types';

/**
 * WhatsApp Service Interface
 */
export interface IWhatsAppService {
  sendMessage(phoneNumber: string, message: string): Promise<{ success: boolean; message?: string; error?: string }>;
  sendShipmentCreationMessage(shipment: ShipmentData): Promise<{ success: boolean; message?: string; error?: string }>;
  sendShipmentStatusUpdateMessage(shipment: ShipmentData, previousStatus: string): Promise<{ success: boolean; message?: string; error?: string }>;
}

/**
 * WhatsApp Service Implementation
 * This service handles sending WhatsApp messages for shipment notifications
 */
export class WhatsAppService implements IWhatsAppService {
  private apiKey: string;
  private instanceId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.WATI_API_KEY || '';
    this.instanceId = process.env.WATI_INSTANCE_ID || '';
    this.baseUrl = process.env.WATI_BASE_URL || 'https://api.wati.io';
  }

  /**
   * Send a simple WhatsApp message
   */
  async sendMessage(phoneNumber: string, message: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      if (!this.apiKey || !this.instanceId) {
        throw new Error('Missing WATI API credentials');
      }

      if (!phoneNumber) {
        throw new Error('Phone number is required');
      }

      // Format phone number (remove + if present and ensure it starts with country code)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // For now, we'll use a simple template approach
      // In a real implementation, you would call the WATI API here
      console.log(`📱 WhatsApp message would be sent to ${formattedPhone}: ${message}`);

      return {
        success: true,
        message: 'WhatsApp message sent successfully (mock)'
      };
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send shipment creation WhatsApp message
   */
  async sendShipmentCreationMessage(shipment: ShipmentData): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!shipment.client_phone) {
      return {
        success: false,
        error: 'No phone number available for WhatsApp notification'
      };
    }

    const message = this.generateCreationMessage(shipment);
    return this.sendMessage(shipment.client_phone, message);
  }

  /**
   * Send shipment status update WhatsApp message
   */
  async sendShipmentStatusUpdateMessage(shipment: ShipmentData, previousStatus: string): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!shipment.client_phone) {
      return {
        success: false,
        error: 'No phone number available for WhatsApp notification'
      };
    }

    const message = this.generateStatusUpdateMessage(shipment, previousStatus);
    return this.sendMessage(shipment.client_phone, message);
  }

  /**
   * Generate message for shipment creation
   */
  private generateCreationMessage(shipment: ShipmentData): string {
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track?tracking_id=${shipment.tracking_id}`;
    
    return `📦 New Shipment Created: ${shipment.tracking_id}

🏷️ Tracking ID: ${shipment.tracking_id}
🚚 Status: ${shipment.status}
🌍 Origin: ${shipment.origin_city}, ${shipment.origin_country}
🏁 Destination: ${shipment.destination_city}, ${shipment.destination_country}
🕒 Created: ${new Date(shipment.created_at).toLocaleString()}

Track your shipment: ${trackingUrl}

Best regards,
Befach Logistics Team`;
  }

  /**
   * Generate message for status update
   */
  private generateStatusUpdateMessage(shipment: ShipmentData, previousStatus: string): string {
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track?tracking_id=${shipment.tracking_id}`;
    
    return `🚚 Shipment Status Update: ${shipment.tracking_id}

🏷️ Tracking ID: ${shipment.tracking_id}
🚚 Previous Status: ${previousStatus}
🚚 New Status: ${shipment.status}
🕒 Updated: ${new Date(shipment.updated_at).toLocaleString()}

Track your shipment: ${trackingUrl}

Best regards,
Befach Logistics Team`;
  }

  /**
   * Format phone number for WATI API
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it starts with 0, replace with country code (assuming +91 for India)
    if (cleaned.startsWith('0')) {
      cleaned = '91' + cleaned.substring(1);
    }
    
    // If it doesn't start with country code, assume +91
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    return cleaned;
  }
}

// Export a default instance
export const whatsappService = new WhatsAppService();




