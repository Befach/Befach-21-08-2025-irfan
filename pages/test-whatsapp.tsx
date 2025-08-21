import React, { useState } from 'react';
import Head from 'next/head';

export default function TestWhatsApp() {
  const [phone, setPhone] = useState('9182992530');
  const [trackingId, setTrackingId] = useState('TEST-123');
  const [status, setStatus] = useState('In Transit');
  const [customStatus, setCustomStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const finalStatus = status === 'Custom' ? customStatus : status;
      
      if (status === 'Custom' && !finalStatus.trim()) {
        throw new Error('Please enter a custom status');
      }

      // Ensure proper phone number format
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      
      console.log('📱 Starting shipment status WhatsApp test...');
      console.log('📞 Formatted Phone:', formattedPhone);
      console.log('📦 Tracking ID:', trackingId);
      console.log('📋 Status:', finalStatus);
      
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsappType: 'status-only',
          phone: formattedPhone,
          trackingId: trackingId,
          status: finalStatus
        }),
      });
      
      console.log('Response Status:', response.status);
      
      const result = await response.json();
      console.log('Response:', result);
      
      if (result.success) {
        setResult({
          type: 'success',
          message: '✅ SUCCESS! Status WhatsApp sent successfully\n\n💡 Check your mobile device. If not received, check the troubleshooting guide.'
        });
        
        if (result.data) {
          console.log('📊 Message Details:', result.data);
          if (result.data.validWhatsAppNumber !== undefined) {
            console.log('✅ Valid WhatsApp Number:', result.data.validWhatsAppNumber);
          }
        }
      } else {
        setResult({
          type: 'error',
          message: `❌ FAILED: ${result.error || 'Unknown error'}\n\n💡 Check console for detailed error information.`
        });
      }
    } catch (error: any) {
      console.error('❌ Error:', error);
      setResult({
        type: 'error',
        message: `❌ ERROR: ${error.message}\n\n💡 Check console for detailed error information.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Test WhatsApp - Shipment Status</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
              📱 Send Shipment Status via WhatsApp
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  📞 Phone Number:
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                  📦 Tracking ID:
                </label>
                <input
                  type="text"
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter tracking ID"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  📋 Shipment Status:
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="In Transit">🚚 In Transit</option>
                  <option value="Out for Delivery">🚛 Out for Delivery</option>
                  <option value="Delivered">✅ Delivered</option>
                  <option value="Pending">⏳ Pending</option>
                  <option value="Custom">✏️ Custom Status</option>
                </select>
              </div>
              
              {status === 'Custom' && (
                <div>
                  <label htmlFor="customStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    ✏️ Custom Status:
                  </label>
                  <input
                    type="text"
                    id="customStatus"
                    value={customStatus}
                    onChange={(e) => setCustomStatus(e.target.value)}
                    placeholder="Enter custom status"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? '📤 Sending...' : '📤 Send Status WhatsApp'}
              </button>
            </form>

            {result && (
              <div className={`mt-4 p-4 rounded-md ${
                result.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <pre className="whitespace-pre-line text-sm">{result.message}</pre>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <h3 className="font-medium text-blue-900 mb-2">💡 Testing Instructions:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                <li>Fill in the phone number (with or without +91)</li>
                <li>Enter a tracking ID</li>
                <li>Select or enter a custom status</li>
                <li>Click "Send Status WhatsApp"</li>
                <li>Check your mobile device for the message</li>
                <li>Check browser console for detailed logs</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

