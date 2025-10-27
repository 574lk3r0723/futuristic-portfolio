// api/contact.js - Vercel serverless function
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    console.log('New contact message:', { name, email, message });
    // Optional: send email using nodemailer or store in a database
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
