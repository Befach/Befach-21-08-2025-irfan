import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookUrl = 'https://flow.zoho.in/60033586716/flow/webhook/incoming?zapikey=1001.a51d4e573e71e6f3e1751dce2e27a291.66d442cca19d1b7de69a453368f0c022&isdebug=false';
    
    // Simple test payload
    const testPayload = {
      event_type: 'test',
      tracking_id: 'BEF-TEST-12345',
      client_email: 'test@example.com',
      message: 'This is a test webhook',
      timestamp: new Date().toISOString(),
      source: 'Befach Shipment Tracker - Test'
    };

    console.log('Testing Zoho Flow webhook URL...');
    console.log('URL:', webhookUrl);
    console.log('Payload:', JSON.stringify(testPayload, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Befach-Shipment-Tracker/1.0'
      },
      body: JSON.stringify(testPayload),
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response text:', responseText);

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : { success: true };
    } catch (parseError) {
      responseData = { rawResponse: responseText, parseError: parseError.message };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Zoho Flow returned status ${response.status}`,
        response: responseData,
        responseText: responseText
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Zoho Flow webhook test successful',
      response: responseData,
      responseText: responseText,
      status: response.status
    });

  } catch (error) {
    console.error('Zoho Flow webhook test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Zoho Flow webhook test failed',
      details: error.message
    });
  }
} 