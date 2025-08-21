// Email Service for Shipment Status Updates using Resend
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email using Resend
 */
async function sendEmailResend(to, subject, htmlContent, textContent) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY in environment variables.');
    }
    const { data, error } = await resend.emails.send({
      from: 'logistics@befach.com', // Using verified domain
      to,
      subject,
      html: htmlContent,
      text: textContent,
    });
    if (error) {
      console.error('Resend API error details:', error); // Log full error
      throw new Error(error.message || 'Failed to send email via Resend');
    }
    return { success: true, message: 'Email sent successfully via Resend', data };
  } catch (error) {
    console.error('Resend email sending failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate HTML email content for shipment creation
 */
function generateCreationEmailHTML(shipmentData, clientEmail) {
  const trackingUrl = `https://track.befach.com/track-new?tracking_id=${shipmentData.tracking_id}`;
  
  return `
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
                    <p><strong>Tracking ID:</strong> ${shipmentData.tracking_id}</p>
                    <p><strong>Current Status:</strong> ${shipmentData.status}</p>
                    <p><strong>Origin:</strong> ${shipmentData.origin_city}, ${shipmentData.origin_country}</p>
                    <p><strong>Destination:</strong> ${shipmentData.destination_city}, ${shipmentData.destination_country}</p>
                    <p><strong>Current Location:</strong> ${shipmentData.current_location_city || shipmentData.current_city}, ${shipmentData.current_location_country || shipmentData.current_country}</p>
                    <p><strong>Transport Mode:</strong> ${shipmentData.transport_mode}</p>
                    ${shipmentData.estimated_delivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(shipmentData.estimated_delivery).toLocaleDateString()}</p>` : ''}
                    ${shipmentData.shipment_notes ? `<p><strong>Notes:</strong> ${shipmentData.shipment_notes}</p>` : ''}
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
}

/**
 * Generate plain text email content for shipment creation
 */
function generateCreationEmailText(shipmentData, clientEmail) {
  const trackingUrl = `https://track.befach.com/track-new?tracking_id=${shipmentData.tracking_id}`;
  
  return `
New Shipment Created

Dear Valued Customer,

Your shipment has been successfully created and is now being processed.

Shipment Details:
- Tracking ID: ${shipmentData.tracking_id}
- Current Status: ${shipmentData.status}
- Origin: ${shipmentData.origin_city}, ${shipmentData.origin_country}
- Destination: ${shipmentData.destination_city}, ${shipmentData.destination_country}
- Current Location: ${shipmentData.current_location_city || shipmentData.current_city}, ${shipmentData.current_location_country || shipmentData.current_country}
- Transport Mode: ${shipmentData.transport_mode}
${shipmentData.estimated_delivery ? `- Estimated Delivery: ${new Date(shipmentData.estimated_delivery).toLocaleDateString()}` : ''}
${shipmentData.shipment_notes ? `- Notes: ${shipmentData.shipment_notes}` : ''}

Track your shipment: ${trackingUrl}

You will receive email notifications whenever your shipment status is updated.

If you have any questions about your shipment, please don't hesitate to contact us.

Best regards,
Befach Logistics Team

---
This is an automated notification. Please do not reply to this email.
© 2024 Befach Logistics. All rights reserved.
  `;
}

/**
 * Generate HTML email content for status update
 */
function generateStatusUpdateEmailHTML(shipmentData, clientEmail, previousStatus, newStatus) {
  const trackingUrl = `https://track.befach.com/track-new?tracking_id=${shipmentData.tracking_id}`;
  
  return `
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
                    <p><strong>Previous Status:</strong> ${previousStatus || 'N/A'}</p>
                    <p><strong>New Status:</strong> ${newStatus}</p>
                    <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="shipment-details">
                    <h3>Shipment Details</h3>
                    <p><strong>Tracking ID:</strong> ${shipmentData.tracking_id}</p>
                    <p><strong>Origin:</strong> ${shipmentData.origin_city}, ${shipmentData.origin_country}</p>
                    <p><strong>Destination:</strong> ${shipmentData.destination_city}, ${shipmentData.destination_country}</p>
                    <p><strong>Current Location:</strong> ${shipmentData.current_location_city || shipmentData.current_city}, ${shipmentData.current_location_country || shipmentData.current_country}</p>
                    <p><strong>Transport Mode:</strong> ${shipmentData.transport_mode}</p>
                    ${shipmentData.estimated_delivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(shipmentData.estimated_delivery).toLocaleDateString()}</p>` : ''}
                    ${shipmentData.shipment_notes ? `<p><strong>Notes:</strong> ${shipmentData.shipment_notes}</p>` : ''}
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
}

/**
 * Generate plain text email content for status update
 */
function generateStatusUpdateEmailText(shipmentData, clientEmail, previousStatus, newStatus) {
  const trackingUrl = `https://track.befach.com/track-new?tracking_id=${shipmentData.tracking_id}`;
  
  return `
Shipment Status Update

Dear Valued Customer,

Your shipment status has been updated.

Status Change:
- Previous Status: ${previousStatus || 'N/A'}
- New Status: ${newStatus}
- Updated: ${new Date().toLocaleString()}

Shipment Details:
- Tracking ID: ${shipmentData.tracking_id}
- Origin: ${shipmentData.origin_city}, ${shipmentData.origin_country}
- Destination: ${shipmentData.destination_city}, ${shipmentData.destination_country}
- Current Location: ${shipmentData.current_location_city || shipmentData.current_city}, ${shipmentData.current_location_country || shipmentData.current_country}
- Transport Mode: ${shipmentData.transport_mode}
${shipmentData.estimated_delivery ? `- Estimated Delivery: ${new Date(shipmentData.estimated_delivery).toLocaleDateString()}` : ''}
${shipmentData.shipment_notes ? `- Notes: ${shipmentData.shipment_notes}` : ''}

Track your shipment: ${trackingUrl}

If you have any questions about your shipment, please don't hesitate to contact us.

Best regards,
Befach Logistics Team

---
This is an automated notification. Please do not reply to this email.
© 2024 Befach Logistics. All rights reserved.
  `;
}

/**
 * Send shipment status update email to client
 * @param {Object} shipmentData - Shipment information
 * @param {string} clientEmail - Client's email address
 * @param {string} previousStatus - Previous shipment status
 * @param {string} newStatus - New shipment status
 */
async function sendShipmentStatusUpdateEmail(shipmentData, clientEmail, previousStatus, newStatus) {
  try {
    const subject = `Shipment Status Update - ${shipmentData.tracking_id}`;
    const htmlContent = generateStatusUpdateEmailHTML(shipmentData, clientEmail, previousStatus, newStatus);
    const textContent = generateStatusUpdateEmailText(shipmentData, clientEmail, previousStatus, newStatus);

    const result = await sendEmailResend(clientEmail, subject, htmlContent, textContent);
    
    console.log('Status update email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send status update email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send initial shipment creation email
 */
async function sendShipmentCreationEmail(shipmentData, clientEmail) {
  try {
    const subject = `New Shipment Created - ${shipmentData.tracking_id}`;
    const htmlContent = generateCreationEmailHTML(shipmentData, clientEmail);
    const textContent = generateCreationEmailText(shipmentData, clientEmail);

    const result = await sendEmailResend(clientEmail, subject, htmlContent, textContent);
    
    console.log('Shipment creation email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send shipment creation email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Alternative method using fetch API to send emails via a serverless function
 */
async function sendEmailViaAPI(emailData) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();
    
    if (result.success) {
      return { success: true, message: 'Email sent successfully' };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Failed to send email via API:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send shipment status update email using API fallback
 */
async function sendShipmentStatusUpdateEmailAPI(shipmentData, clientEmail, previousStatus, newStatus) {
  const emailData = {
    type: 'status-update',
    to: clientEmail,
    subject: `Shipment Status Update - ${shipmentData.tracking_id}`,
    data: {
      tracking_id: shipmentData.tracking_id,
      previous_status: previousStatus || 'N/A',
      new_status: newStatus,
      origin: `${shipmentData.origin_city}, ${shipmentData.origin_country}`,
      destination: `${shipmentData.destination_city}, ${shipmentData.destination_country}`,
      current_location: `${shipmentData.current_location_city || shipmentData.current_city}, ${shipmentData.current_location_country || shipmentData.current_country}`,
      transport_mode: shipmentData.transport_mode,
      estimated_delivery: shipmentData.estimated_delivery ? new Date(shipmentData.estimated_delivery).toLocaleDateString() : 'TBD',
      shipment_notes: shipmentData.shipment_notes || '',
      tracking_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track?tracking_id=${shipmentData.tracking_id}`,
      update_time: new Date().toLocaleString()
    }
  };

  return await sendEmailViaAPI(emailData);
}

/**
 * Send shipment creation email using API fallback
 */
async function sendShipmentCreationEmailAPI(shipmentData, clientEmail) {
  const emailData = {
    type: 'creation',
    to: clientEmail,
    subject: `New Shipment Created - ${shipmentData.tracking_id}`,
    data: {
      tracking_id: shipmentData.tracking_id,
      current_status: shipmentData.status,
      origin: `${shipmentData.origin_city}, ${shipmentData.origin_country}`,
      destination: `${shipmentData.destination_city}, ${shipmentData.destination_country}`,
      current_location: `${shipmentData.current_location_city || shipmentData.current_city}, ${shipmentData.current_location_country || shipmentData.current_country}`,
      transport_mode: shipmentData.transport_mode,
      estimated_delivery: shipmentData.estimated_delivery ? new Date(shipmentData.estimated_delivery).toLocaleDateString() : 'TBD',
      shipment_notes: shipmentData.shipment_notes || '',
      tracking_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track?tracking_id=${shipmentData.tracking_id}`,
      creation_time: new Date().toLocaleString()
    }
  };

  return await sendEmailViaAPI(emailData);
}

module.exports = {
  sendShipmentStatusUpdateEmail,
  sendShipmentCreationEmail,
  sendShipmentStatusUpdateEmailAPI,
  sendShipmentCreationEmailAPI
}; 