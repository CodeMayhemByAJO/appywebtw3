const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '.')));

// Serve static files from the 'pages' directory for /pages routes
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Handle requests for /about, /whatwedo, /kontakt by serving the corresponding HTML files
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

app.get('/whatwedo', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'whatwedo.html'));
});

app.get('/kontakt', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'kontakt.html'));
});

// Fallback for any other routes - serve index.html (for client-side routing if needed later)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
