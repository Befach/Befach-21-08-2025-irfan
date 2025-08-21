const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials (replace with your actual values)
const supabaseUrl = 'https://wnlhuaksrmjjysbnzmvh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubGh1YWtzcm1qanlzYm56bXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNDYzNTEsImV4cCI6MjA2NTcyMjM1MX0.vXegBY6hgGem_MJfS4nNSn19n_C4PeviYzUtjvqWJbs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPhoneColumn() {
  try {
    console.log('🔍 Checking for client_phone column in shipments table...\n');

    // Test if client_phone column exists
    console.log('📞 Testing client_phone column...');
    const { data, error } = await supabase
      .from('shipments')
      .select('client_phone')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ client_phone column does NOT exist');
        console.log('');
        console.log('💡 To add the client_phone column, run this SQL in your Supabase dashboard:');
        console.log('');
        console.log('ALTER TABLE shipments ADD COLUMN client_phone VARCHAR(20);');
        console.log('');
        console.log('Or use the existing SQL file: add-client-phone-column.sql');
      } else {
        console.error('❌ Error:', error.message);
      }
    } else {
      console.log('✅ client_phone column EXISTS!');
    }

    // Check for other common columns
    console.log('\n🧪 Checking other common columns...');
    const commonColumns = [
      'id', 'tracking_number', 'status', 'client_email', 
      'created_at', 'updated_at', 'shipper_name', 'recipient_name',
      'origin', 'destination', 'weight', 'description'
    ];

    for (const column of commonColumns) {
      try {
        const { error: colError } = await supabase
          .from('shipments')
          .select(column)
          .limit(1);
        
        if (colError && colError.message.includes('does not exist')) {
          console.log(`   ❌ ${column} - NOT FOUND`);
        } else {
          console.log(`   ✅ ${column} - EXISTS`);
        }
      } catch (err) {
        console.log(`   ❓ ${column} - ERROR: ${err.message}`);
      }
    }

    // Check if shipments table exists at all
    console.log('\n📦 Checking if shipments table exists...');
    const { data: tableData, error: tableError } = await supabase
      .from('shipments')
      .select('*')
      .limit(1);

    if (tableError) {
      if (tableError.message.includes('does not exist')) {
        console.log('❌ shipments table does NOT exist');
        console.log('');
        console.log('💡 You need to create the shipments table first.');
      } else {
        console.log('❌ Error accessing shipments table:', tableError.message);
      }
    } else {
      console.log('✅ shipments table EXISTS');
      if (tableData && tableData.length > 0) {
        const columns = Object.keys(tableData[0]);
        console.log(`📊 Found ${columns.length} columns in shipments table:`);
        columns.forEach((column, index) => {
          console.log(`   ${index + 1}. ${column}`);
        });
      } else {
        console.log('ℹ️  Shipments table exists but is empty');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkPhoneColumn().then(() => {
  console.log('\n✅ Column check completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});



