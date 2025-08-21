// Test date formatting logic
console.log('🧪 Testing date formatting...');

// Test with the actual date from database
const testDate = '2025-09-05';
console.log('Original date string:', testDate);

try {
  const dateObj = new Date(testDate);
  console.log('Date object:', dateObj);
  console.log('Is valid date?', !isNaN(dateObj.getTime()));
  
  if (!isNaN(dateObj.getTime())) {
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    console.log('Formatted date:', formattedDate);
    
    // Test the conditional logic
    const transportMode = 'Air Freight';
    const description = transportMode.toLowerCase().includes('air') ? '15 days from pickup (Air)' : 
                       transportMode.toLowerCase().includes('sea') ? '45 days from pickup (Sea)' : 
                       transportMode ? '30 days from pickup (Default)' : 'Estimated delivery time';
    
    console.log('Transport mode:', transportMode);
    console.log('Description:', description);
  } else {
    console.log('❌ Invalid date!');
  }
} catch (error) {
  console.error('❌ Error formatting date:', error);
}

// Test with null/undefined
console.log('\n🧪 Testing with null/undefined...');
const nullDate = null;
console.log('Null date:', nullDate);
console.log('Conditional check:', nullDate ? 'Has date' : 'No date');

const undefinedDate = undefined;
console.log('Undefined date:', undefinedDate);
console.log('Conditional check:', undefinedDate ? 'Has date' : 'No date');
