// Type definitions for shipment tracking and email system

export interface ShipmentData {
  tracking_id: string;
  status: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  current_location_city?: string;
  current_location_country?: string;
  current_city?: string;
  current_country?: string;
  transport_mode: string;
  estimated_delivery?: string;
  shipment_notes?: string;
  client_email: string;
  client_phone?: string; // Optional phone number for WhatsApp notifications
  created_at: string;
  updated_at: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailContent {
  html: string;
  text: string;
}

export interface EmailResult {
  success: boolean;
  message?: string;
  error?: string;
  messageId?: string;
}

export interface ShipmentStatusUpdate {
  tracking_id: string;
  previous_status: string;
  new_status: string;
  update_time: string;
  client_email: string;
}

export type EmailType = 'creation' | 'status-update' | 'delivery' | 'custom'; 