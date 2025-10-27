// pages/api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    try {
      // 1️ Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "Gmail", // or another email service
        auth: {
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASS, // App password if using Gmail
        },
      });

      // 2️ Configure email options
      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // Your email to receive messages
        subject: `New Contact Form Submission from ${name}`,
        text: message,
        html: `
          <p>${message}</p>
          <p><strong>From:</strong> ${name} (${email})</p>
        `,
      };

      // 3️ Send email
      await transporter.sendMail(mailOptions);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ success: false, error: "Failed to send email" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
