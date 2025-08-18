const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servera statiska filer från root

// Kontaktformulär endpoint
app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Namn, e-post och meddelande måste vara ifyllda.' });
  }

  try {
    // För utveckling, logga bara till konsolen
    console.log('📧 Nytt meddelande från kontaktformuläret:');
    console.log('Namn:', name);
    console.log('E-post:', email);
    console.log('Telefon:', phone || 'Ej angivet');
    console.log('Meddelande:', message);
    
    res.status(200).json({ success: true, message: 'Meddelande mottaget!' });
  } catch (err) {
    console.error('❌ Fel vid hantering av meddelande:', err);
    res.status(500).json({ error: 'Något gick snett när meddelandet skulle hanteras.' });
  }
});

// Explicit routes för HTML-filer
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

// Starta servern
app.listen(port, () => {
  console.log(`🚀 Servern körs på http://localhost:${port}`);
  console.log(`📁 Statiska filer serveras från: ${__dirname}`);
  console.log(`🔧 Utvecklingsläge - kontaktformulär loggas bara till konsolen`);
});
