const { createClient } = require('@supabase/supabase-js');

// You'll need to provide these values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error('❌ Please provide your Supabase URL');
  process.exit(1);
}

if (!supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('❌ Please provide your Supabase API key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseColumns() {
  try {
    console.log('🔍 Checking database columns...\n');

    // Check shipments table structure
    console.log('📦 SHIPMENTS TABLE:');
    const { data: shipmentsData, error: shipmentsError } = await supabase
      .from('shipments')
      .select('*')
      .limit(1);

    if (shipmentsError) {
      console.error('❌ Error accessing shipments table:', shipmentsError);
    } else {
      if (shipmentsData && shipmentsData.length > 0) {
        const columns = Object.keys(shipmentsData[0]);
        console.log('✅ Columns found:');
        columns.forEach((column, index) => {
          console.log(`   ${index + 1}. ${column}`);
        });
      } else {
        console.log('ℹ️  Shipments table exists but is empty');
      }
    }

    // Try to get table information using RPC (if available)
    console.log('\n🔍 Checking table information...');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'shipments' })
      .catch(() => ({ data: null, error: 'RPC function not available' }));

    if (tableError) {
      console.log('ℹ️  RPC method not available, using alternative approach...');
      
      // Alternative: Try to describe table structure by attempting to select specific columns
      const testColumns = [
        'id', 'tracking_number', 'status', 'client_email', 'client_phone',
        'created_at', 'updated_at', 'shipper_name', 'recipient_name',
        'origin', 'destination', 'weight', 'description'
      ];

      console.log('\n🧪 Testing column existence:');
      for (const column of testColumns) {
        try {
          const { error } = await supabase
            .from('shipments')
            .select(column)
            .limit(1);
          
          if (error && error.message.includes('column') && error.message.includes('does not exist')) {
            console.log(`   ❌ ${column} - NOT FOUND`);
          } else {
            console.log(`   ✅ ${column} - EXISTS`);
          }
        } catch (err) {
          console.log(`   ❓ ${column} - ERROR: ${err.message}`);
        }
      }
    } else {
      console.log('✅ Table structure from RPC:');
      console.log(tableInfo);
    }

    // Check if there are any other tables
    console.log('\n📋 Checking for other tables...');
    const { data: otherTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (!tablesError && otherTables) {
      console.log('✅ Tables in database:');
      otherTables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

// Run the check
checkDatabaseColumns().then(() => {
  console.log('\n✅ Database column check completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
