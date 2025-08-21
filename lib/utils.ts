// Utility functions for shipment tracking

// Generate a unique tracking ID with format: BEF-YYYYMMDD-XXXXX
export function generateTrackingId(): string {
  const today = new Date();
  const dateStr = today.getFullYear().toString() + 
                  (today.getMonth() + 1).toString().padStart(2, '0') + 
                  today.getDate().toString().padStart(2, '0');
  
  // Generate a random 5-digit number
  const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  
  return `BEF-${dateStr}-${randomNum}`;
}

// Send notification to Zoho Flow webhook via server-side API
export async function sendZohoFlowNotification(data: {
  event_type: 'shipment_created' | 'shipment_updated' | 'stage_changed';
  tracking_id: string;
  client_email: string;
  shipment_name?: string;
  current_stage?: string;
  previous_stage?: string;
  origin_country?: string;
  destination_country?: string;
  estimated_delivery?: string;
  notes?: string;
}) {
  try {
    console.log('Sending webhook to Zoho Flow:', {
      url: '/api/webhook/zoho-flow',
      payload: data
    });

    const response = await fetch('/api/webhook/zoho-flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Server error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Zoho Flow notification sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending Zoho Flow notification:', error);
    throw error;
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Format tracking ID for display
export function formatTrackingId(trackingId: string): string {
  return trackingId.toUpperCase();
} 