const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sendMail = require('./sendMail');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Alla fält måste vara ifyllda.' });
  }

  try {
    await sendMail(name, email, phone, message);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Fel vid e-post:', err);
    res
      .status(500)
      .json({ error: 'Något gick snett när meddelandet skulle skickas.' });
  }
});

// Starta servern
app.listen(port, () => {
  console.log(`🚀 Servern körs på http://localhost:${port}`);
});
