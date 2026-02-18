export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Get all active contact emails
    const contactEmails = await prisma.contactEmail.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    if (contactEmails.length === 0) {
      console.error('No active contact emails configured');
      return NextResponse.json(
        { error: 'No contact emails configured' },
        { status: 500 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('Resend API key not configured. Email will not be sent.');
      console.log('Contact form submission:', { name, email, subject, message });
      console.log('Would send to:', contactEmails.map((e: { email: string }) => e.email).join(', '));
      
      // Return success anyway so the form works
      return NextResponse.json({ 
        success: true, 
        message: 'Contact form submitted successfully (Email API not configured)' 
      });
    }

    // Prepare email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Contact Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong style="color: #4b5563;">Name:</strong> <span style="color: #1f2937;">${name}</span></p>
            <p style="margin: 10px 0;"><strong style="color: #4b5563;">Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></p>
            <p style="margin: 10px 0;"><strong style="color: #4b5563;">Subject:</strong> <span style="color: #1f2937;">${subject}</span></p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #1f2937; margin-top: 0;">Message</h3>
            <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            This email was sent from the Alphinex Solutions contact form
          </p>
        </div>
      </div>
    `;

    // Send email to all active contact emails
    const emailPromises = contactEmails.map((contactEmail: { email: string; id: string; isActive: boolean; order: number }) =>
      resend.emails.send({
        from: 'Alphinex Solutions <onboarding@resend.dev>',
        to: contactEmail.email,
        subject: `Contact Form: ${subject}`,
        html: emailContent,
        replyTo: email,
      })
    );

    const results = await Promise.all(emailPromises);
    console.log('Emails sent successfully to:', contactEmails.map((e: { email: string }) => e.email).join(', '));
    console.log('Resend results:', results);

    // Send auto-reply confirmation email to the visitor
    try {
      const autoReplyContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 40px;">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <p style="color: #1f2937; font-size: 18px; line-height: 1.6; margin-top: 0;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 20px 0;">
                Your details have been successfully shared with the <strong style="color: #667eea;">Alphinex Solutions Team</strong>. 
                We appreciate you reaching out to us!
              </p>
              
              <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
                <p style="color: #1f2937; font-size: 16px; margin: 0; line-height: 1.6;">
                  <strong>⏰ What's Next?</strong><br/>
                  Our team will review your inquiry and get back to you within <strong>24 hours</strong>.
                </p>
              </div>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #1f2937; margin-top: 0; font-size: 16px;">Your Submission Details:</h3>
                <p style="margin: 8px 0; color: #4b5563;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>Message:</strong></p>
                <p style="margin: 8px 0; color: #6b7280; font-style: italic; white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 25px 0;">
                In the meantime, feel free to explore our services or check out our portfolio on our website.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://alphinexsolutions.com" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Visit Our Website
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
                Best regards,<br/>
                <strong style="color: #1f2937;">The Alphinex Solutions Team</strong>
              </p>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 30px; text-align: center;">
            <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
              📧 alphinexsolutions@gmail.com | 📞 +92 325 3028856
            </p>
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              This is an automated confirmation email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: 'Alphinex Solutions <onboarding@resend.dev>',
        to: email,
        subject: 'Thank You for Contacting Alphinex Solutions',
        html: autoReplyContent,
      });

      console.log('Auto-reply confirmation sent to:', email);
    } catch (autoReplyError) {
      console.error('Failed to send auto-reply:', autoReplyError);
      // Don't fail the main request if auto-reply fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
