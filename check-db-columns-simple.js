const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from command line arguments
const args = process.argv.slice(2);
const supabaseUrl = args[0];
const supabaseKey = args[1];

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Usage: node check-db-columns-simple.js <SUPABASE_URL> <SUPABASE_ANON_KEY>');
  console.log('');
  console.log('Example:');
  console.log('node check-db-columns-simple.js https://your-project.supabase.co your-anon-key-here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  try {
    console.log('🔍 Checking Supabase database columns...\n');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseKey.substring(0, 10) + '...\n');

    // Test connection and get shipments table structure
    console.log('📦 Checking SHIPMENTS table...');
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error accessing shipments table:', error.message);
      
      // Try to get more specific error information
      if (error.message.includes('does not exist')) {
        console.log('💡 The shipments table might not exist yet.');
      } else if (error.message.includes('permission')) {
        console.log('💡 Check your RLS (Row Level Security) policies.');
      }
      return;
    }

    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(`✅ Found ${columns.length} columns in shipments table:`);
      columns.forEach((column, index) => {
        console.log(`   ${index + 1}. ${column}`);
      });
    } else {
      console.log('ℹ️  Shipments table exists but is empty');
      
      // Try to get column information by attempting to select common columns
      const commonColumns = [
        'id', 'tracking_number', 'status', 'client_email', 'client_phone',
        'created_at', 'updated_at', 'shipper_name', 'recipient_name',
        'origin', 'destination', 'weight', 'description', 'notes'
      ];

      console.log('\n🧪 Testing for common columns:');
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
    }

    // Check for other tables
    console.log('\n📋 Checking for other tables...');
    try {
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (!tablesError && tables) {
        console.log('✅ Tables in database:');
        tables.forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      }
    } catch (err) {
      console.log('ℹ️  Could not list tables (this is normal for some setups)');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkColumns().then(() => {
  console.log('\n✅ Database check completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
