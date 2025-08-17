# ⚡ Vercel Deployment Guide för appyChap

## 📋 **Förutsättningar**

- [Vercel](https://vercel.com/) konto
- GitHub repository med koden
- **OBS:** Vercel är statisk hosting - ingen backend-server

## 🔧 **Steg 1: Förberedelse**

### **1.1 Bygg för Vercel**
```bash
npm run build:vercel
```

Detta skapar en `public` mapp med alla filer som Vercel behöver.

### **1.2 Kontrollera public-mappen**
```bash
ls -la public/
```

Du ska se:
- `index.html`
- `about.html`
- `contact.html`
- `images/`
- `dist/`
- `src/`
- `robots.txt`
- `sitemap.xml`

## 🌐 **Steg 2: Vercel Setup**

### **2.1 Installera Vercel CLI**
```bash
npm i -g vercel
```

### **2.2 Logga in på Vercel**
```bash
vercel login
```

### **2.3 Deploya**
```bash
vercel
```

Eller för produktion:
```bash
vercel --prod
```

## 📁 **Steg 3: Vercel Dashboard**

### **3.1 Automatisk deployment**
1. Gå till [Vercel Dashboard](https://vercel.com/dashboard)
2. Klicka "New Project"
3. Välj ditt GitHub repository
4. Vercel kommer automatiskt att:
   - Detektera att det är en statisk webbplats
   - Använda `vercel.json` konfigurationen
   - Deploya från `public` mappen

### **3.2 Konfiguration**
- **Framework Preset:** Other
- **Build Command:** `npm run build:vercel`
- **Output Directory:** `public`
- **Install Command:** `npm install`

## ⚠️ **Begränsningar med Vercel**

### **❌ Vad som INTE fungerar:**
- **Kontaktformulär** - Ingen backend-server
- **E-postfunktionalitet** - Statisk hosting
- **Server-side rendering** - Endast statiska filer
- **API-endpoints** - Ingen Node.js-server

### **✅ Vad som FUNGERAR:**
- **Statisk webbplats** - Alla HTML-sidor
- **CSS och JavaScript** - Frontend-funktionalitet
- **Bilder och media** - Statiskt innehåll
- **SEO-optimering** - Meta-taggar och strukturdata
- **Säkerhetsfunktioner** - JavaScript-skydd

## 🔄 **Alternativ för kontaktformulär**

### **1. Netlify Forms (Enklast)**
Lägg till i HTML:
```html
<form name="contact" netlify>
  <!-- formulärfält -->
</form>
```

### **2. Formspree**
```html
<form action="https://formspree.io/f/din-nyckel" method="POST">
  <!-- formulärfält -->
</form>
```

### **3. Google Forms**
Bädda in Google Form i webbplatsen.

## 🚀 **Deployment**

### **Automatisk deployment**
```bash
git add .
git commit -m "⚡ Vercel deployment ready"
git push origin main
```

### **Manuell deployment**
```bash
npm run build:vercel
vercel --prod
```

## ✅ **Verifiering**

### **Kontrollera deployment**
1. Öppna din Vercel-URL
2. Testa alla sidor
3. Verifiera att skydden fungerar
4. Kontrollera att CSS laddas

### **Kontrollera säkerhet**
- Testa F12 (ska blockeras)
- Testa högerklick (ska blockeras)
- Testa textmarkering (ska vara inaktiverad)

## 🔒 **Säkerhet på Vercel**

### **Headers**
- Alla säkerhetsheaders är konfigurerade i `vercel.json`
- HTTPS hanteras automatiskt av Vercel

### **JavaScript-skydd**
- Alla skydd fungerar på frontend
- Ingen backend-attack-vektor

## 📊 **Monitoring**

### **Vercel Analytics**
- Automatisk prestandaövervakning
- Real-time analytics
- Error tracking

### **Externa verktyg**
- [Google Analytics](https://analytics.google.com/)
- [UptimeRobot](https://uptimerobot.com/)

## 🚨 **Felsökning**

### **Vanliga problem:**

1. **"No Output Directory named 'public'"**
   - Kör `npm run build:vercel` först
   - Kontrollera att `public` mappen skapas

2. **CSS laddas inte**
   - Verifiera att `dist/output.css` finns i `public/`
   - Kontrollera sökvägar i HTML

3. **Bilder visas inte**
   - Kontrollera att `images/` mappen kopierades till `public/`
   - Verifiera sökvägar

## 🔄 **Uppdateringar**

### **Automatisk deployment**
```bash
git push origin main
```

### **Manuell deployment**
```bash
npm run build:vercel
vercel --prod
```

## 📞 **Support**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Discord**: [discord.gg/vercel](https://discord.gg/vercel)
- **appyChap**: info@appychap.se

---

## 🎯 **Rekommendation**

**För appyChap rekommenderar jag Railway istället för Vercel** eftersom:
- Du behöver kontaktformulär med e-post
- Du vill ha full backend-funktionalitet
- Du vill behålla alla säkerhetsfunktioner

**Vercel är bra för:**
- Statiska webbplatser
- Frontend-projekt
- Snabb deployment

**Railway är bättre för:**
- Fullstack-applikationer
- Backend-funktionalitet
- E-post och API:er

---

**Lycka till med deploymenten! ⚡**
