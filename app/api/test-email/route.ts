export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        configured: false,
        message: 'Resend API key not configured in .env file',
        instructions: 'Add RESEND_API_KEY to your .env file. Get your API key from https://resend.com/api-keys',
      });
    }

    // Send test email
    const result = await resend.emails.send({
      from: 'Alphinex Solutions <onboarding@resend.dev>',
      to: 'delivered@resend.dev', // Resend test email
      subject: 'Test Email - Alphinex Solutions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Email Configuration Successful!</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
            <p style="color: #1f2937; font-size: 16px;">
              Your email configuration is working correctly. Contact form submissions will now be delivered to the configured email addresses.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <h3 style="color: #1f2937; margin-top: 0;">Using Resend Email API</h3>
              <p style="margin: 5px 0; color: #4b5563;">Fast, reliable email delivery without SMTP configuration.</p>
              <p style="margin: 5px 0; color: #4b5563;">Free tier: 3,000 emails/month</p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      configured: true,
      message: 'Email API is configured correctly and test email sent!',
      details: {
        provider: 'Resend',
        emailId: result.data?.id,
        testEmailSentTo: 'delivered@resend.dev',
      }
    });
  } catch (error) {
    console.error('Email test failed:', error);
    return NextResponse.json({
      success: false,
      configured: true,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Email API is configured but sending failed. Check your API key.',
    }, { status: 500 });
  }
}
