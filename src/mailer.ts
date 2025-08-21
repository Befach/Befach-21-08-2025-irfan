import nodemailer from 'nodemailer';
import { EmailConfig, EmailContent, EmailResult } from './types';

/**
 * Email Service for Shipment Status Updates using SMTP
 * This service uses SMTP to send emails when shipment status changes
 */
export class EmailService {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport(config);
  }

  /**
   * Send email using SMTP
   */
  async sendEmail(to: string, subject: string, content: EmailContent): Promise<EmailResult> {
    try {
      // Validate configuration
      if (!this.config.auth.user || !this.config.auth.pass) {
        return {
          success: false,
          error: 'SMTP configuration missing. Please set SMTP_USER and SMTP_PASS environment variables.'
        };
      }

      const info = await this.transporter.sendMail({
        from: this.config.auth.user,
        to: to,
        subject: subject,
        html: content.html,
        text: content.text
      });

      console.log('Email sent successfully:', info.messageId);
      return { 
        success: true, 
        message: 'Email sent successfully via SMTP', 
        messageId: info.messageId 
      };
    } catch (error) {
      console.error('SMTP email sending failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      return false;
    }
  }

  /**
   * Close transporter connection
   */
  async close(): Promise<void> {
    if (this.transporter) {
      await this.transporter.close();
    }
  }
}

/**
 * Create default Gmail SMTP configuration
 */
export function createGmailConfig(): EmailConfig {
  const smtpUser = process.env.SMTP_USER || '21r11a05p6@gcet.edu.in';
  const smtpPass = process.env.SMTP_PASS || 'djsr emay rjfy Ifgc';
  
  // Validate environment variables
  if (!smtpUser || !smtpPass) {
    console.warn('⚠️  SMTP credentials not found in environment variables. Using fallback values.');
    console.warn('   Please create a .env.local file with SMTP_USER and SMTP_PASS');
  }

  return {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    // Add debug options for troubleshooting
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  };
}

/**
 * Create email service instance with Gmail configuration
 */
export function createEmailService(): EmailService {
  const config = createGmailConfig();
  return new EmailService(config);
} 