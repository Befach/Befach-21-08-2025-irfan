import { EmailContent, EmailResult } from './types';

/**
 * Mock Email Service for Shipment Status Updates
 * This service simulates email sending for testing purposes
 */
export class EmailServiceMock {
  private fromEmail: string;

  constructor(fromEmail: string = 'noreply@befachlogistics.com') {
    this.fromEmail = fromEmail;
  }

  /**
   * Simulate sending email
   */
  async sendEmail(to: string, subject: string, content: EmailContent): Promise<EmailResult> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate mock message ID
      const messageId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('📧 Mock Email Sent Successfully:');
      console.log(`   From: ${this.fromEmail}`);
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Message ID: ${messageId}`);
      console.log(`   HTML Content Length: ${content.html.length} characters`);
      console.log(`   Text Content Length: ${content.text.length} characters`);
      console.log('');

      return { 
        success: true, 
        message: 'Email sent successfully (simulated)', 
        messageId: messageId 
      };
    } catch (error) {
      console.error('Mock email sending failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Verify mock connection (always succeeds)
   */
  async verifyConnection(): Promise<boolean> {
    console.log('✅ Mock email service connection verified successfully');
    return true;
  }

  /**
   * Close connection (not needed for mock, but keeping interface consistent)
   */
  async close(): Promise<void> {
    console.log('🔌 Mock email service connection closed');
  }
}

/**
 * Create mock email service instance
 */
export function createEmailServiceMock(): EmailServiceMock {
  return new EmailServiceMock('noreply@befachlogistics.com');
} 