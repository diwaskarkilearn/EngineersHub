// routes/contact.js
const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// Submit Contact Form
router.post('/', async (req, res) => {
  try {
    const { name, email, inquiry, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      inquiry,
      subject,
      message
    });

    await contact.save();

    res.json({ message: 'Message sent successfully' });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Get all contact messages (admin route)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

module.exports = router;