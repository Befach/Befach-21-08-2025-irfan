import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ClientOnlyAdmin from '../../../../components/ClientOnlyAdmin';
import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';

// Debug component
const DebugEstimatedDelivery = ({ shipment }) => {
  console.log('🔍 DebugEstimatedDelivery component rendered with shipment:', shipment);
  
  if (!shipment) {
    console.log('❌ No shipment data provided');
    return <div className="bg-red-100 p-4 rounded">❌ No shipment data</div>;
  }

  console.log('📅 estimated_delivery field:', shipment.estimated_delivery);
  console.log('📅 typeof estimated_delivery:', typeof shipment.estimated_delivery);
  console.log('📅 estimated_delivery truthy check:', !!shipment.estimated_delivery);
  
  const hasEstimatedDelivery = shipment.estimated_delivery && shipment.estimated_delivery !== '';
  console.log('📅 hasEstimatedDelivery:', hasEstimatedDelivery);

  if (hasEstimatedDelivery) {
    try {
      const dateObj = new Date(shipment.estimated_delivery);
      const isValidDate = !isNaN(dateObj.getTime());
      console.log('📅 Date object:', dateObj);
      console.log('📅 Is valid date:', isValidDate);
      
      if (isValidDate) {
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        console.log('📅 Formatted date:', formattedDate);
        
        return (
          <div className="bg-green-100 p-4 rounded border-l-4 border-green-400">
            <h3 className="text-lg font-medium text-green-800 mb-2">✅ Debug: Estimated Delivery Found</h3>
            <p className="text-green-700">Raw value: {shipment.estimated_delivery}</p>
            <p className="text-green-700">Formatted: {formattedDate}</p>
            <p className="text-green-700">Transport mode: {shipment.transport_mode || 'N/A'}</p>
          </div>
        );
      } else {
        return (
          <div className="bg-yellow-100 p-4 rounded border-l-4 border-yellow-400">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">⚠️ Debug: Invalid Date</h3>
            <p className="text-yellow-700">Raw value: {shipment.estimated_delivery}</p>
            <p className="text-yellow-700">Date object: {dateObj.toString()}</p>
          </div>
        );
      }
    } catch (error) {
      console.error('❌ Error processing estimated delivery date:', error);
      return (
        <div className="bg-red-100 p-4 rounded border-l-4 border-red-400">
          <h3 className="text-lg font-medium text-red-800 mb-2">❌ Debug: Date Processing Error</h3>
          <p className="text-red-700">Error: {error.message}</p>
          <p className="text-red-700">Raw value: {shipment.estimated_delivery}</p>
        </div>
      );
    }
  } else {
    return (
      <div className="bg-gray-100 p-4 rounded border-l-4 border-gray-400">
        <h3 className="text-lg font-medium text-gray-800 mb-2">❌ Debug: No Estimated Delivery</h3>
        <p className="text-gray-700">estimated_delivery field is: {shipment.estimated_delivery === null ? 'null' : shipment.estimated_delivery === '' ? 'empty string' : shipment.estimated_delivery}</p>
        <p className="text-gray-700">All shipment fields: {JSON.stringify(shipment, null, 2)}</p>
      </div>
    );
  }
};

export default function ViewShipment() {
  const router = useRouter();
  const { id } = router.query;
  
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchShipment();
    }
  }, [id]);

  const fetchShipment = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setShipment(data);
    } catch (error) {
      console.error('Error fetching shipment:', error);
      setError('Failed to load shipment data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientOnlyAdmin title="View Shipment">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Shipment Details</h1>
            <div className="flex space-x-4">
              <Link
                href={`/admin/shipments/${shipment.id}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Edit Shipment
              </Link>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {shipment && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {/* Debug Component - Add this at the top */}
              <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
                <DebugEstimatedDelivery shipment={shipment} />
              </div>
              
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Tracking ID: {shipment.tracking_id}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Created on {new Date(shipment.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    <p className="text-gray-600">
                      {shipment.current_location_city}, {shipment.current_location_country}
                    </p>
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
                    {/* Debug info */}
                    <p className="text-xs text-gray-400 mt-1">
                      Debug: estimated_delivery = "{shipment.estimated_delivery || 'null'}"
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Status</h3>
                  <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-blue-800 font-medium">{shipment.status}</p>
                  </div>
                </div>
                
                {/* Package Details Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Package Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Package Count</h4>
                      <p className="text-gray-800">{shipment.package_count || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Package Type</h4>
                      <p className="text-gray-800">{shipment.package_type || 'Standard'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Weight</h4>
                      <p className="text-gray-800">{shipment.weight || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Dimensions</h4>
                      <p className="text-gray-800">{shipment.dimensions || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">HS Code</h4>
                      <p className="text-gray-800">{shipment.hs_code || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Package Contents</h4>
                      <p className="text-gray-800">{shipment.contents || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Estimated Delivery Section - Prominent Display */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Estimated Delivery</h3>
                  <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-400">
                    {shipment.estimated_delivery ? (
                      <div>
                        <p className="text-green-800 font-medium text-lg">
                          {new Date(shipment.estimated_delivery).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-green-600 text-sm mt-1">
                          {shipment.transport_mode?.toLowerCase().includes('air') ? '15 days from pickup (Air)' : 
                           shipment.transport_mode?.toLowerCase().includes('sea') ? '45 days from pickup (Sea)' : 
                           shipment.transport_mode ? '30 days from pickup (Default)' : 'Estimated delivery time'}
                        </p>
                      </div>
                    ) : (
                      <p className="text-green-600">Estimated delivery date not set</p>
                    )}
                  </div>
                </div>
                
                {/* Contact Information Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Shipper</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-800 font-medium">{shipment.shipper_name || 'N/A'}</p>
                        <p className="text-gray-600 text-sm mt-1">{shipment.shipper_address || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Buyer</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-800 font-medium">{shipment.buyer_name || 'N/A'}</p>
                        <p className="text-gray-600 text-sm mt-1">{shipment.buyer_address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Delivery Address Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Delivery Address</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-800">{shipment.customer_delivery_address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </ClientOnlyAdmin>
  );
} 