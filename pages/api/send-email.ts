import { NextApiRequest, NextApiResponse } from 'next';
import { sendShipmentCreationEmail, sendShipmentStatusUpdateEmail } from '../../lib/smtpEmailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emailType, email, shipmentData, previousStatus, newStatus } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    let result;

    if (emailType === 'shipment-creation') {
      // Send shipment creation email
      if (!shipmentData) {
        return res.status(400).json({ error: 'Shipment data is required for creation email' });
      }
      result = await sendShipmentCreationEmail(shipmentData, email);
    } else if (emailType === 'status-update') {
      // Send status update email
      if (!shipmentData || !previousStatus || !newStatus) {
        return res.status(400).json({ error: 'Shipment data, previous status, and new status are required for status update email' });
      }
      result = await sendShipmentStatusUpdateEmail(
        shipmentData,
        email,
        previousStatus,
        newStatus
      );
    } else {
      return res.status(400).json({ error: 'Invalid email type. Use "shipment-creation" or "status-update"' });
    }

    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Email sent successfully',
        emailType,
        recipient: email
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error,
        emailType,
        recipient: email
      });
    }
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send email' 
    });
  }
} 