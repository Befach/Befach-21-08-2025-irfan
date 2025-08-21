import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import ShipmentTimeline from '../components/ShipmentTimeline';
import { FaClock } from 'react-icons/fa';

const TrackPage: NextPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking number');
      return;
    }
    
    setLoading(true);
    setError('');
    setShipment(null);
    
    try {
      console.log('Searching for tracking ID:', trackingId);
      
      // Fetch shipment data
      const { data, error: shipmentError } = await supabase
        .from('shipments')
        .select('*') // Remove the join with shipment_media
        .eq('tracking_id', trackingId)
        .single();
      
      console.log('Query result:', { data, error: shipmentError });
      
      if (shipmentError) {
        console.error('Error fetching shipment:', shipmentError);
        setError(`Error: ${shipmentError.message}`);
        return;
      }
      
      if (!data) {
        setError('No shipment found with this tracking number');
        return;
      }
      
      console.log('Shipment found:', data);
      setShipment(data);
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to track shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatLastUpdated = (timestamp: string) => {
    if (!timestamp) return 'No updates yet';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <>
      <Head>
        <title>Track Your Shipment | ShipTrack</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Track Your Shipment
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Enter your tracking number to get real-time updates on your shipment.
            </p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking number"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Tracking...' : 'Track Shipment'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p>{error}</p>
              </div>
            )}
          </div>
          
          {shipment && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Shipment Details</h2>
                <p className="text-sm text-gray-500">Tracking ID: {shipment.tracking_id}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Origin</h3>
                  <p className="text-gray-600">{shipment.origin_city}, {shipment.origin_country}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Destination</h3>
                  <p className="text-gray-600">{shipment.destination_city}, {shipment.destination_country}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Current Location</h3>
                  <p className="text-gray-600">{shipment.current_location_city || ''}, {shipment.current_location_country || ''}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Transport Mode</h3>
                  <p className="text-gray-600">{shipment.transport_mode}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Estimated Delivery</h3>
                  <p className="text-gray-600">
                    {shipment.estimated_delivery ? (
                      <>
                        {new Date(shipment.estimated_delivery).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        <span className="block text-sm text-gray-500 mt-1">
                          {shipment.transport_mode?.toLowerCase().includes('air') ? '15 days from pickup (Air)' : 
                           shipment.transport_mode?.toLowerCase().includes('sea') ? '45 days from pickup (Sea)' : 
                           shipment.transport_mode ? '30 days from pickup (Default)' : 'Estimated delivery time'}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">Not specified</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Shipment Status</h3>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-800 font-medium">{shipment.status}</p>
                </div>
              </div>
              
              {/* Last Updated Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Last Updated</h3>
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center">
                    <FaClock className="h-6 w-6 text-blue-600 mr-4" />
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-blue-900 mb-2">
                        {formatLastUpdated(shipment.updated_at)}
                      </p>
                      <p className="text-base text-blue-700 font-medium mb-1">
                        {new Date(shipment.updated_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-base text-blue-600">
                        {new Date(shipment.updated_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <ShipmentTimeline 
                currentStage={shipment.status} 
                estimatedDelivery={shipment.estimated_delivery}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrackPage; 