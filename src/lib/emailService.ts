// Email service for problem report notifications

export interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

export class EmailService {
  // Send email using configured email service (placeholder for now)
  static async sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, integrate with your email service (SendGrid, AWS SES, etc.)
      // For now, we'll simulate sending and log
      console.log('📧 Email would be sent:', {
        to: emailData.to,
        subject: emailData.subject,
        preview: emailData.textContent.substring(0, 100) + '...'
      });

      // Simulate email service delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Send confirmation email when user submits a problem report
  static async sendProblemReportConfirmation(
    emailAddress: string, 
    reportId: string
  ): Promise<void> {
    const emailData: EmailData = {
      to: emailAddress,
      subject: 'Tudobem - Problem Report Received',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for your report!</h2>
          
          <p>We've received your problem report and greatly appreciate your help in improving Tudobem.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Report Details</h3>
            <p><strong>Report ID:</strong> ${reportId}</p>
            <p><strong>Status:</strong> Under review</p>
          </div>
          
          <p>Our team will review your report and take appropriate action if needed. You'll receive another email if we accept your correction.</p>
          
          <p>Your feedback helps make Tudobem a better learning tool for everyone!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The Tudobem Team
          </p>
        </div>
      `,
      textContent: `
Thank you for your report!

We've received your problem report and greatly appreciate your help in improving Tudobem.

Report Details:
- Report ID: ${reportId}
- Status: Under review

Our team will review your report and take appropriate action if needed. You'll receive another email if we accept your correction.

Your feedback helps make Tudobem a better learning tool for everyone!

Best regards,
The Tudobem Team
      `.trim()
    };

    const result = await this.sendEmail(emailData);
    
    // Email notification logged (placeholder for email tracking)

    if (!result.success) {
      console.error('Failed to send confirmation email:', result.error);
    }
  }

  // Send acceptance email when admin accepts a problem report
  static async sendProblemReportAcceptance(
    emailAddress: string,
    reportId: string
  ): Promise<void> {
    const emailData: EmailData = {
      to: emailAddress,
      subject: 'Tudobem - Your Correction Was Accepted!',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Great news!</h2>
          
          <p>Your problem report has been reviewed and <strong>accepted</strong>. The correction has been applied to improve the exercise.</p>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #047857;">Report Accepted</h3>
            <p><strong>Report ID:</strong> ${reportId}</p>
            <p><strong>Status:</strong> ✅ Accepted and applied</p>
          </div>
          
          <p>Thank you for helping us improve Tudobem! Your eagle eyes help make our Portuguese learning exercises more accurate and helpful for all users.</p>
          
          <p>We appreciate your contribution to making Tudobem better! 🇵🇹</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The Tudobem Team
          </p>
        </div>
      `,
      textContent: `
Great news!

Your problem report has been reviewed and accepted. The correction has been applied to improve the exercise.

Report Details:
- Report ID: ${reportId}
- Status: ✅ Accepted and applied

Thank you for helping us improve Tudobem! Your eagle eyes help make our Portuguese learning exercises more accurate and helpful for all users.

We appreciate your contribution to making Tudobem better! 🇵🇹

Best regards,
The Tudobem Team
      `.trim()
    };

    const result = await this.sendEmail(emailData);
    
    // Email notification logged (placeholder for email tracking)

    if (!result.success) {
      console.error('Failed to send acceptance email:', result.error);
    }
  }
}