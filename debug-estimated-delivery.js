require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugEstimatedDelivery() {
  try {
    console.log('🔍 Checking shipments table structure...');
    
    // First, let's check the table structure
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'shipments')
      .eq('table_schema', 'public');

    if (columnsError) {
      console.error('❌ Error checking table structure:', columnsError);
    } else {
      console.log('📋 Table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }

    console.log('\n🔍 Checking recent shipments for estimated_delivery...');
    
    // Check recent shipments
    const { data: shipments, error: shipmentsError } = await supabase
      .from('shipments')
      .select('id, tracking_id, estimated_delivery, transport_mode, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (shipmentsError) {
      console.error('❌ Error fetching shipments:', shipmentsError);
    } else {
      console.log('📦 Recent shipments:');
      shipments.forEach(shipment => {
        console.log(`  - ${shipment.tracking_id}:`);
        console.log(`    estimated_delivery: ${shipment.estimated_delivery || 'NULL'}`);
        console.log(`    transport_mode: ${shipment.transport_mode || 'NULL'}`);
        console.log(`    created_at: ${shipment.created_at}`);
        console.log('');
      });
    }

    // Check if there are any shipments with estimated_delivery
    const { data: withEstimated, error: withEstimatedError } = await supabase
      .from('shipments')
      .select('id, tracking_id, estimated_delivery')
      .not('estimated_delivery', 'is', null)
      .limit(3);

    if (withEstimatedError) {
      console.error('❌ Error checking shipments with estimated delivery:', withEstimatedError);
    } else {
      console.log(`✅ Found ${withEstimated.length} shipments with estimated delivery dates`);
      withEstimated.forEach(shipment => {
        console.log(`  - ${shipment.tracking_id}: ${shipment.estimated_delivery}`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugEstimatedDelivery();
