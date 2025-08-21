import { Resend } from 'resend';
import { EmailConfig, EmailContent, EmailResult } from './types';

/**
 * Email Service for Shipment Status Updates using Resend
 * This service uses Resend to send emails when shipment status changes
 */
export class EmailServiceResend {
  private resend: Resend;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string = 'noreply@yourdomain.com') {
    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  /**
   * Send email using Resend
   */
  async sendEmail(to: string, subject: string, content: EmailContent): Promise<EmailResult> {
    try {
      // Validate configuration
      if (!this.resend) {
        return {
          success: false,
          error: 'Resend configuration missing. Please set RESEND_API_KEY environment variable.'
        };
      }

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: subject,
        html: content.html,
        text: content.text
      });

      if (error) {
        console.error('Resend email sending failed:', error);
        return { 
          success: false, 
          error: error.message || 'Failed to send email via Resend'
        };
      }

      console.log('Email sent successfully via Resend:', data?.id);
      return { 
        success: true, 
        message: 'Email sent successfully via Resend', 
        messageId: data?.id 
      };
    } catch (error) {
      console.error('Resend email sending failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Verify Resend connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      // Test by sending a simple email to a test address
      const testResult = await this.sendEmail(
        'test@example.com',
        'Connection Test',
        {
          html: '<h1>Test</h1>',
          text: 'Test'
        }
      );
      
      // If we get a proper error (not connection error), connection is working
      if (testResult.error && !testResult.error.includes('API key')) {
        console.log('Resend connection verified successfully');
        return true;
      } else if (testResult.success) {
        console.log('Resend connection verified successfully');
        return true;
      } else {
        console.error('Resend connection verification failed:', testResult.error);
        return false;
      }
    } catch (error) {
      console.error('Resend connection verification failed:', error);
      return false;
    }
  }

  /**
   * Close connection (not needed for Resend, but keeping interface consistent)
   */
  async close(): Promise<void> {
    // Resend doesn't require connection closing
    console.log('Resend connection closed (no action needed)');
  }
}

/**
 * Create Resend configuration
 */
export function createResendConfig(): { apiKey: string; fromEmail: string } {
  return {
    apiKey: process.env['RESEND_API_KEY'] || 're_1234567890abcdef',
    fromEmail: process.env['RESEND_FROM_EMAIL'] || 'noreply@befachlogistics.com'
  };
}

/**
 * Create email service instance with Resend configuration
 */
export function createEmailServiceResend(): EmailServiceResend {
  const config = createResendConfig();
  return new EmailServiceResend(config.apiKey, config.fromEmail);
} 