import React from 'react';

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

export default DebugEstimatedDelivery;
