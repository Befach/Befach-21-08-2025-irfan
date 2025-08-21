import React, { useState } from 'react';
import Head from 'next/head';

export default function TestWhatsAppCloud() {
  const [phone, setPhone] = useState('9182992530');
  const [message, setMessage] = useState('Hello from WhatsApp Cloud API! 🚀');
  const [status, setStatus] = useState('In Transit');
  const [trackingId, setTrackingId] = useState('BEF-2024-001');
  const [clientName, setClientName] = useState('John Doe');
  const [shipmentName, setShipmentName] = useState('Electronics Package');
  const [originCountry, setOriginCountry] = useState('India');
  const [destinationCountry, setDestinationCountry] = useState('USA');
  const [estimatedDelivery, setEstimatedDelivery] = useState('2024-12-20');
  const [previousStatus, setPreviousStatus] = useState('Pending');
  const [newStatus, setNewStatus] = useState('In Transit');
  
  const [connectionResult, setConnectionResult] = useState('');
  const [sendResult, setSendResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setConnectionResult('');
    
    try {
      const response = await fetch('/api/send-whatsapp-cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test-connection'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setConnectionResult(`✅ ${result.message}\n📱 Phone: ${result.phoneNumber}\n🏢 Business: ${result.verifiedName}`);
      } else {
        setConnectionResult(`❌ ${result.error}`);
      }
    } catch (error) {
      setConnectionResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendTextMessage = async () => {
    setLoading(true);
    setSendResult('');
    
    try {
      const response = await fetch('/api/send-whatsapp-cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-text',
          phone,
          message
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSendResult(`✅ ${result.message}\n📱 To: ${result.phoneNumber}\n🆔 Message ID: ${result.messageId}`);
      } else {
        setSendResult(`❌ ${result.error}`);
      }
    } catch (error) {
      setSendResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendShipmentCreation = async () => {
    setLoading(true);
    setSendResult('');
    
    try {
      const response = await fetch('/api/send-whatsapp-cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'shipment-creation',
          phone,
          clientName,
          shipmentData: {
            tracking_id: trackingId,
            shipment_name: shipmentName,
            origin_country: originCountry,
            destination_country: destinationCountry,
            estimated_delivery: estimatedDelivery
          }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSendResult(`✅ ${result.message}\n📱 To: ${result.phoneNumber}\n🆔 Message ID: ${result.messageId}`);
      } else {
        setSendResult(`❌ ${result.error}`);
      }
    } catch (error) {
      setSendResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendStatusUpdate = async () => {
    setLoading(true);
    setSendResult('');
    
    try {
      const response = await fetch('/api/send-whatsapp-cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'status-update',
          phone,
          clientName,
          shipmentData: {
            tracking_id: trackingId,
            shipment_name: shipmentName,
            origin_country: originCountry,
            destination_country: destinationCountry,
            estimated_delivery: estimatedDelivery
          },
          previousStatus,
          newStatus
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSendResult(`✅ ${result.message}\n📱 To: ${result.phoneNumber}\n🆔 Message ID: ${result.messageId}`);
      } else {
        setSendResult(`❌ ${result.error}`);
      }
    } catch (error) {
      setSendResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendQuickStatus = async () => {
    setLoading(true);
    setSendResult('');
    
    try {
      const response = await fetch('/api/send-whatsapp-cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'status-only',
          phone,
          trackingId,
          status
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSendResult(`✅ ${result.message}\n📱 To: ${result.phoneNumber}\n🆔 Message ID: ${result.messageId}`);
      } else {
        setSendResult(`❌ ${result.error}`);
      }
    } catch (error) {
      setSendResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>WhatsApp Cloud API Test - Befach Logistics</title>
        <meta name="description" content="Test WhatsApp Cloud API integration" />
      </Head>

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 WhatsApp Cloud API Test
          </h1>
          <p className="text-xl text-gray-600">
            Test your WhatsApp Cloud API integration for shipment notifications
          </p>
        </div>

        {/* Connection Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔌 Test Connection</h2>
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
          {connectionResult && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{connectionResult}</pre>
            </div>
          )}
        </div>

        {/* Basic Message Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">📱 Send Text Message</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="9182992530"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your message here"
              />
            </div>
          </div>
          <button
            onClick={sendTextMessage}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Text Message'}
          </button>
        </div>

        {/* Shipment Creation Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🚚 Shipment Creation Message</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking ID
              </label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipment Name
              </label>
              <input
                type="text"
                value={shipmentName}
                onChange={(e) => setShipmentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin Country
              </label>
              <input
                type="text"
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Country
              </label>
              <input
                type="text"
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Delivery
              </label>
              <input
                type="text"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={sendShipmentCreation}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Shipment Creation Message'}
          </button>
        </div>

        {/* Status Update Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">📊 Status Update Message</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Status
              </label>
              <input
                type="text"
                value={previousStatus}
                onChange={(e) => setPreviousStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <input
                type="text"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={sendStatusUpdate}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Status Update Message'}
          </button>
        </div>

        {/* Quick Status Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">⚡ Quick Status Message</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={sendQuickStatus}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Quick Status Message'}
          </button>
        </div>

        {/* Results */}
        {sendResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">📋 Results</h2>
            <div className="p-4 bg-gray-100 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{sendResult}</pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 How to Use</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-2">
            <li><strong>Test Connection:</strong> Verify your WhatsApp Cloud API credentials</li>
            <li><strong>Send Text Message:</strong> Test basic text messaging</li>
            <li><strong>Shipment Creation:</strong> Send new shipment notifications</li>
            <li><strong>Status Update:</strong> Send shipment status change notifications</li>
            <li><strong>Quick Status:</strong> Send simple status updates</li>
          </ol>
          <p className="text-blue-700 mt-4">
            <strong>Note:</strong> Make sure you have set up your WhatsApp Cloud API credentials in your environment variables!
          </p>
        </div>
      </div>
    </div>
  );
}
