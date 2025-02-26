// src/utils/sendEmail.ts
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
  port: parseInt(process.env.EMAIL_PORT as string, 10), // e.g., 587
  secure: process.env.EMAIL_SECURE === 'true', // true for port 465, false for others
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your email password or app-specific password
  },
});

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Lab Utilisation System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendOtpEmail(to: string, otp: string) {
  const subject = 'Your OTP Code';
  const html = `
    <p>Hello,</p>
    <p>Your OTP code for authentication is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you,</p>
    <p>Lab Utilisation System</p>
  `;
  return sendEmail({ to, subject, html });
}

export async function sendRegisterEmail({ to, subject, html }: EmailOptions) {
    try {
      const info = await transporter.sendMail({
        from: `"Lab Utilisation System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log("Message sent: %s", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
  
  /**
   * Sends a registration email with the user's details.
   * @param user The user object containing registration details.
   */
  export async function sendRegistrationEmail(user: {
    userId: string;
    email: string;
    role: string;
    department: string;
    academicDetails?: any;
    profile?: { name?: string; designation?: string };
  }) {
    const subject = "Registration Successful - Welcome to Lab Utilisation System";
    const html = `
      <p>Hello ${user.profile?.name || "User"},</p>
      <p>Your registration was successful! Below are your account details:</p>
      <ul>
        <li><strong>User ID:</strong> ${user.userId}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Role:</strong> ${user.role}</li>
        <li><strong>Department:</strong> ${user.department}</li>
        ${
          user.academicDetails
            ? `<li><strong>Academic Details:</strong> ${JSON.stringify(user.academicDetails)}</li>`
            : ""
        }
      </ul>
      <p>Please keep this information safe.</p>
      <p>Thank you for registering with Lab Utilisation System.</p>
    `;
    return sendEmail({ to: user.email, subject, html });
  }