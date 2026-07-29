const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer.
 * In development mode without SMTP config, logs the email to console instead.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  // ─── Dev Fallback: Console log when no SMTP configured ─────
  if (
    process.env.NODE_ENV === 'development' &&
    (!process.env.SMTP_USER || !process.env.SMTP_PASS)
  ) {
    console.log('\n' + '═'.repeat(60));
    console.log('📧 EMAIL (Dev Mode — Not actually sent)');
    console.log('═'.repeat(60));
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('─'.repeat(60));
    console.log(text || html);
    console.log('═'.repeat(60) + '\n');
    return { messageId: 'dev-mode-no-send' };
  }

  // ─── Production: Real SMTP transport ───────────────────────
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'Mockly'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
};

/**
 * HTML email template for verification
 */
const getVerificationEmailHTML = (name, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0a0a1a;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px;overflow:hidden;border:1px solid #2a2a4a;">
        <div style="background:linear-gradient(90deg,#6366f1,#8b5cf6);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;letter-spacing:1px;">🎯 Mockly</h1>
          <p style="color:#e0e0ff;margin:8px 0 0;font-size:14px;">AI-Powered Interview Preparation</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#e0e7ff;margin:0 0 16px;font-size:22px;">Verify Your Email</h2>
          <p style="color:#a0a8c0;font-size:15px;line-height:1.6;">
            Hey <strong style="color:#c7d2fe;">${name}</strong>,<br><br>
            Welcome to Mockly! Please verify your email address to activate your account and start preparing for interviews.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verificationUrl}" style="display:inline-block;background:linear-gradient(90deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.5px;">
              ✅ Verify Email Address
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;line-height:1.5;">
            Or copy this link:<br>
            <a href="${verificationUrl}" style="color:#818cf8;word-break:break-all;">${verificationUrl}</a>
          </p>
          <p style="color:#6b7280;font-size:13px;margin-top:24px;">
            This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
        <div style="background:#0f0f23;padding:16px 32px;text-align:center;border-top:1px solid #2a2a4a;">
          <p style="color:#4b5563;font-size:12px;margin:0;">© ${new Date().getFullYear()} Mockly. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * HTML email template for password reset
 */
const getPasswordResetEmailHTML = (name, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0a0a1a;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px;overflow:hidden;border:1px solid #2a2a4a;">
        <div style="background:linear-gradient(90deg,#ef4444,#f97316);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;letter-spacing:1px;">🔐 Mockly</h1>
          <p style="color:#ffe0e0;margin:8px 0 0;font-size:14px;">Password Reset Request</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#e0e7ff;margin:0 0 16px;font-size:22px;">Reset Your Password</h2>
          <p style="color:#a0a8c0;font-size:15px;line-height:1.6;">
            Hey <strong style="color:#c7d2fe;">${name}</strong>,<br><br>
            We received a request to reset your password. Click the button below to set a new password.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(90deg,#ef4444,#f97316);color:#fff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.5px;">
              🔑 Reset Password
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;line-height:1.5;">
            Or copy this link:<br>
            <a href="${resetUrl}" style="color:#fb923c;word-break:break-all;">${resetUrl}</a>
          </p>
          <p style="color:#6b7280;font-size:13px;margin-top:24px;">
            This link expires in <strong>10 minutes</strong>. If you didn't request a password reset, please ignore this email — your password will remain unchanged.
          </p>
        </div>
        <div style="background:#0f0f23;padding:16px 32px;text-align:center;border-top:1px solid #2a2a4a;">
          <p style="color:#4b5563;font-size:12px;margin:0;">© ${new Date().getFullYear()} Mockly. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendEmail,
  getVerificationEmailHTML,
  getPasswordResetEmailHTML,
};
