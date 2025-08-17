const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Security middleware for production
app.use((req, res, next) => {
  // Disable caching for sensitive pages
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Advanced security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Hide server information
  res.setHeader('Server', 'Apache/2.4.41 (Ubuntu)');
  
  next();
});

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

app.get('/security-test.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'security-test.html'));
});

// Production contact endpoint with real email
app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Namn, e-post och meddelande måste vara ifyllda.' });
  }

  try {
    // Create transporter with fallback options
    let transporter;
    
    if (process.env.EMAIL_SERVICE === 'gmail') {
      transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else if (process.env.EMAIL_SERVICE === 'outlook') {
      transporter = nodemailer.createTransporter({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      // Generic SMTP
      transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `Nytt kontaktformulär från ${name} - appyChap.se`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F7A42B;">Nytt kontaktformulär från appyChap.se</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Namn:</strong> ${name}</p>
            <p><strong>E-post:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone || 'Ej angivet'}</p>
            <p><strong>Meddelande:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #F7A42B;">
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            <em>Skickat från appyChap.se kontaktformulär - ${new Date().toLocaleString('sv-SE')}</em>
          </p>
        </div>
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

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Starta servern
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Produktionsservern körs på port ${port}`);
  console.log(`📧 E-postfunktionalitet är aktiverad`);
  console.log(`🔒 Säkerhetsfunktioner aktiva`);
  console.log(`🌐 Railway deployment ready`);
});
