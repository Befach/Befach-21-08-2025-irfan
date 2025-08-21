import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookData = req.body;
    
    // Validate required fields
    if (!webhookData.tracking_id || !webhookData.client_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const webhookUrl = 'https://flow.zoho.in/60033586716/flow/webhook/incoming?zapikey=1001.a51d4e573e71e6f3e1751dce2e27a291.66d442cca19d1b7de69a453368f0c022&isdebug=false';
    
    console.log('Sending webhook to Zoho Flow from server:', {
      url: webhookUrl,
      payload: webhookData
    });

    const payload = {
      ...webhookData,
      timestamp: new Date().toISOString(),
      source: 'Befach Shipment Tracker'
    };

    console.log('Sending payload to Zoho Flow:', JSON.stringify(payload, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Befach-Shipment-Tracker/1.0'
      },
      body: JSON.stringify(payload),
    });

    // Get response text first to handle empty responses
    const responseText = await response.text();
    console.log('Zoho Flow response text:', responseText);
    console.log('Zoho Flow response status:', response.status);
    console.log('Zoho Flow response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('Zoho Flow webhook error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseText
      });
      throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
    }

    // Try to parse JSON response, but handle empty responses gracefully
    let result;
    try {
      result = responseText ? JSON.parse(responseText) : { success: true };
    } catch (parseError) {
      console.warn('Could not parse Zoho Flow response as JSON:', parseError);
      result = { rawResponse: responseText, success: true };
    }

    console.log('Zoho Flow webhook sent successfully:', result);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Webhook sent successfully',
      zohoResponse: result,
      responseStatus: response.status,
      responseText: responseText
    });

  } catch (error) {
    console.error('Error sending webhook to Zoho Flow:', error);
    return res.status(500).json({ 
      error: 'Failed to send webhook',
      details: error.message 
    });
  }
} 