import nodemailer from 'nodemailer';
import { z } from 'zod';

// Email validation schema
const emailSchema = z.string().email('Invalid email address');

// Email configuration validation
const validateEmailConfig = () => {
  const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'SMTP_USER'];
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
};

// Configure Nodemailer transporter with proper error handling
const createTransporter = () => {
  try {
    validateEmailConfig();

    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com', // Fixed: Use Gmail SMTP host, not AWS
      port: 587,
      secure: false, // Fixed: Use false for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true, // Use connection pooling
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 20000, // Rate limiting
      rateLimit: 5,
    });
  } catch (error) {
    console.error('Failed to create email transporter:', error.message);
    throw error;
  }
};

// Generate a cryptographically secure 6-digit OTP
const generateOTP = () => {
  try {
    const crypto = require('crypto');
    let otp;
    do {
      const randomBytes = crypto.randomBytes(4);
      otp = (randomBytes.readUInt32BE(0) % 900000) + 100000;
    } while (otp < 100000 || otp > 999999);

    return otp.toString();
  } catch (error) {
    // Fallback to Math.random if crypto fails
    console.warn('Crypto OTP generation failed, using Math.random fallback');
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};

// Generic email sender with retry logic
const sendEmailWithRetry = async (transporter, mailOptions, maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(
        `Email sent successfully on attempt ${attempt}:`,
        info.messageId,
      );
      return info;
    } catch (error) {
      lastError = error;
      console.error(`Email attempt ${attempt} failed:`, error.message);

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

// Send OTP email with proper validation and error handling
const sendOTPEmail = async (email, otp) => {
  try {
    // Validate inputs
    emailSchema.parse(email);
    if (!otp || otp.length !== 6) {
      throw new Error('Invalid OTP format');
    }

    const transporter = createTransporter();

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (error) {
      console.error('SMTP connection verification failed:', error.message);
      throw new Error('Failed to connect to email server');
    }

    const mailOptions = {
      from: `"PMS - Project Management System" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your PMS Verification Code',
      text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
      html: generateOTPEmailHTML(otp),
    };

    const result = await sendEmailWithRetry(transporter, mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

// Send welcome email with proper error handling
const sendWelcomeEmail = async (email, name) => {
  try {
    // Validate inputs
    emailSchema.parse(email);
    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }

    const transporter = createTransporter();
    const sanitizedName = name.trim();

    const mailOptions = {
      from: `"PMS - Project Management System" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to PMS - Project Management System',
      text: `Hello ${sanitizedName},\n\nWelcome to PMS! Thank you for joining our project management platform.\n\nBest regards,\nThe PMS Team`,
      html: generateWelcomeEmailHTML(sanitizedName),
    };

    const result = await sendEmailWithRetry(transporter, mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error.message);
    // Non-critical - return null instead of throwing
    return { success: false, error: error.message };
  }
};

// Send password reset email with proper validation and error handling
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    // Validate inputs
    emailSchema.parse(email);
    if (!resetToken || resetToken.trim().length === 0) {
      throw new Error('Reset token is required');
    }
    if (!userName || userName.trim().length === 0) {
      throw new Error('User name is required');
    }

    const transporter = createTransporter();
    const sanitizedName = userName.trim();
    const resetUrl = `${process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"PMS - Project Management System" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - PMS',
      text: `Hello ${sanitizedName},\n\nYou have requested to reset your password for PMS - Project Management System.\n\nPlease click the following link to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this password reset, please ignore this email.\n\nBest regards,\nThe PMS Team`,
      html: generatePasswordResetEmailHTML(sanitizedName, resetUrl),
    };

    const result = await sendEmailWithRetry(transporter, mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

// HTML email templates
const generateOTPEmailHTML = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2563eb; margin: 0;">PMS</h1>
      <p style="color: #6b7280; margin: 5px 0;">Project Management System</p>
    </div>
    <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Your Verification Code</h2>
      <p style="color: #4b5563; margin-bottom: 20px;">Please use the following code to verify your account:</p>
      <div style="font-size: 36px; letter-spacing: 8px; font-weight: bold; text-align: center; padding: 20px; background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; margin: 20px 0; color: #1f2937;">
        ${otp}
      </div>
      <p style="color: #6b7280; font-size: 14px; text-align: center;">This code will expire in 10 minutes.</p>
    </div>
    <div style="text-align: center; color: #9ca3af; font-size: 12px;">
      <p>If you didn't request this code, you can safely ignore this email.</p>
      <p>© ${new Date().getFullYear()} PMS - Project Management System. All rights reserved.</p>
    </div>
  </div>
`;

const generateWelcomeEmailHTML = (name) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2563eb; margin: 0;">PMS</h1>
      <p style="color: #6b7280; margin: 5px 0;">Project Management System</p>
    </div>
    <div style="padding: 30px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: #1f2937; margin-top: 0;">Welcome to PMS!</h2>
      <p style="color: #4b5563; font-size: 16px;">Hello ${name},</p>
      <p style="color: #4b5563;">Thank you for joining our project management platform. We're excited to help you organize and manage your projects efficiently.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || process.env.NEXTAUTH_URL || '#'}/" 
           style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
          Get Started
        </a>
      </div>
      <p style="color: #4b5563;">If you have any questions, feel free to contact our support team.</p>
      <p style="color: #4b5563; margin-top: 20px;">Best regards,<br>The PMS Team</p>
    </div>
    <div style="text-align: center; color: #9ca3af; font-size: 12px;">
      <p>© ${new Date().getFullYear()} PMS - Project Management System. All rights reserved.</p>
    </div>
  </div>
`;

// Password reset email HTML template
const generatePasswordResetEmailHTML = (name, resetUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2563eb; margin: 0;">PMS</h1>
      <p style="color: #6b7280; margin: 5px 0;">Project Management System</p>
    </div>
    <div style="background-color: #fef3c7; padding: 30px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
      <h2 style="color: #92400e; margin-top: 0; margin-bottom: 15px;">🔐 Password Reset Request</h2>
      <p style="color: #4b5563; font-size: 16px;">Hello ${name},</p>
      <p style="color: #4b5563;">We received a request to reset your password for your PMS account. If you made this request, please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #dc2626; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
          Reset My Password
        </a>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <p style="color: #374151; margin: 0; font-size: 14px; line-height: 1.5;">
          <strong>⏰ Important:</strong> This password reset link will expire in <strong>1 hour</strong> for security reasons.
        </p>
      </div>
      <p style="color: #4b5563; font-size: 14px;">If the button above doesn't work, you can copy and paste this link into your browser:</p>
      <p style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 12px; color: #374151;">${resetUrl}</p>
    </div>
    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
      <h3 style="color: #dc2626; margin-top: 0; margin-bottom: 10px; font-size: 16px;">🚨 Security Notice</h3>
      <p style="color: #4b5563; margin: 0; font-size: 14px;">
        If you did not request this password reset, please ignore this email. Your account remains secure and no changes have been made.
      </p>
    </div>
    <div style="text-align: center; color: #9ca3af; font-size: 12px;">
      <p>Need help? Contact our support team at support@pms.com</p>
      <p>© ${new Date().getFullYear()} PMS - Project Management System. All rights reserved.</p>
    </div>
  </div>
`;

// Health check function
const checkEmailHealth = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { status: 'healthy', message: 'Email service is operational' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
};

export {
    createTransporter,
    generateOTP,
    sendOTPEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    checkEmailHealth
}