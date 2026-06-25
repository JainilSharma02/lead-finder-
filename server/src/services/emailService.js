const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const sendPasswordResetEmail = async ({ to, resetUrl, name }) => {
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #FAF9F6;">
      <h2 style="color: #0B1120; margin-bottom: 8px;">Reset your password</h2>
      <p style="color: #475569; line-height: 1.6;">Hi ${name || 'there'},</p>
      <p style="color: #475569; line-height: 1.6;">
        We received a request to reset your Lead Finder Pro password. Click the button below to choose a new one.
        This link expires in 30 minutes.
      </p>
      <a href="${resetUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background: #FF6B35; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Reset password
      </a>
      <p style="color: #94A3B8; font-size: 13px; line-height: 1.6;">
        If you didn't request this, you can safely ignore this email — your password will not change.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'Lead Finder Pro <no-reply@leadfinderpro.com>',
    to,
    subject: 'Reset your Lead Finder Pro password',
    html,
  });
};

module.exports = { sendPasswordResetEmail };
