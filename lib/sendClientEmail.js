const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendClientEmail(shipmentDetails, clientEmail) {
  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY in environment variables.');
    return false;
  }
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev', // Use this for testing, or set up your own domain in Resend
    to: clientEmail,
    subject: 'Your Shipment Details',
    text: `Thank you for your shipment!\n\nHere are your details:\n${JSON.stringify(shipmentDetails, null, 2)}`
  });

  if (error) {
    console.error('Error sending email:', error);
    return false;
  }
  return true;
}

module.exports = sendClientEmail;