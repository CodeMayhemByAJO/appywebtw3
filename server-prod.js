const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/whatwedo.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'whatwedo.html'));
});

app.get('/whatwevedone.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'whatwevedone.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/integrity.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'integrity.html'));
});

app.get('/test.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'test.html'));
});

// Production contact endpoint with real email
app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Namn, e-post och meddelande måste vara ifyllda.' });
  }

  try {
    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail', // 'gmail', 'outlook', 'yahoo', etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER, // Where to send contact form submissions
      subject: `Nytt kontaktformulär från ${name}`,
      html: `
        <h2>Nytt kontaktformulär från appyChap.se</h2>
        <p><strong>Namn:</strong> ${name}</p>
        <p><strong>E-post:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Ej angivet'}</p>
        <p><strong>Meddelande:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Skickat från appyChap.se kontaktformulär</em></p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    console.log('📧 E-post skickad till:', process.env.EMAIL_TO || process.env.EMAIL_USER);
    
    res.status(200).json({ 
      success: true, 
      message: 'Tack för ditt meddelande! Vi hörs snart.' 
    });

  } catch (error) {
    console.error('❌ Fel vid e-post:', error);
    res.status(500).json({ 
      error: 'Kunde inte skicka meddelandet. Försök igen senare eller kontakta oss direkt.' 
    });
  }
});

// Starta servern
app.listen(port, () => {
  console.log(`🚀 Produktionsservern körs på http://localhost:${port}`);
  console.log(`📧 E-postfunktionalitet är aktiverad`);
  console.log(`📁 Statiska filer serveras från: ${__dirname}`);
});
