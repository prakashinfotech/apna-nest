const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
});

// POST /notify/email — generic email
router.post('/email', async (req, res) => {
  const { to, subject, html } = req.body;
  await transporter.sendMail({ from: process.env.GMAIL_USER, to, subject, html });
  res.json({ sent: true });
});

// POST /notify/lead — notify owner of new lead
router.post('/lead', async (req, res) => {
  const { ownerEmail, ownerName, propertyTitle, buyerName, buyerPhone, message } = req.body;
  await transporter.sendMail({
    from: `ApnaNest <${process.env.GMAIL_USER}>`,
    to: ownerEmail,
    subject: `New enquiry for "${propertyTitle}"`,
    html: `<p>Hi ${ownerName},</p><p><b>${buyerName}</b> (${buyerPhone}) enquired about your property: <b>${propertyTitle}</b>.</p><p>Message: ${message}</p>`
  });
  res.json({ sent: true });
});

// POST /notify/payment — send payment QR request email
router.post('/payment', async (req, res) => {
  const { email, name, amount, planName, upiId } = req.body;
  // UPI QR deep link — no API needed, standard format
  const upiLink = `upi://pay?pa=${upiId}&pn=ApnaNest&am=${amount}&cu=INR&tn=${planName}`;
  await transporter.sendMail({
    from: `ApnaNest <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Complete your ApnaNest payment — ₹${amount}`,
    html: `
      <h2>Hi ${name}, complete your payment</h2>
      <p>Plan: ${planName} — ₹${amount}</p>
      <p>Pay via UPI: <b>${upiId}</b></p>
      <p>Or use this link on mobile: <a href="${upiLink}">Pay Now</a></p>
      <p>After payment, reply to this email with your UTR number and we'll activate your account within 2 hours.</p>
    `
  });
  res.json({ sent: true });
});

module.exports = router;
