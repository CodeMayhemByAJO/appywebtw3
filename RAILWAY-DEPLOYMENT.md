# 🚀 Railway Deployment Guide för appyChap

## 📋 **Förutsättningar**

- [Railway](https://railway.app/) konto
- GitHub repository med koden
- Gmail-konto med App-lösenord

## 🔧 **Steg 1: Förberedelse**

### **1.1 Bygg projektet lokalt**
```bash
npm run build:css:prod
```

### **1.2 Kontrollera att alla filer är committade**
```bash
git add .
git commit -m "🚀 Railway deployment ready"
git push origin main
```

## 🌐 **Steg 2: Railway Setup**

### **2.1 Skapa nytt projekt**
1. Gå till [Railway Dashboard](https://railway.app/dashboard)
2. Klicka "New Project"
3. Välj "Deploy from GitHub repo"
4. Välj ditt `tw4-appyweb` repository

### **2.2 Konfigurera miljövariabler**
Gå till **Variables** tab och lägg till:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=din.email@gmail.com
EMAIL_PASS=ditt_app_lösenord_här
EMAIL_TO=info@appychap.se
NODE_ENV=production
PORT=3000
```

### **2.3 Konfigurera deployment**
1. Gå till **Settings** tab
2. Sätt **Start Command** till: `npm run start:railway`
3. Sätt **Health Check Path** till: `/health`

## 📧 **Steg 3: Gmail-konfiguration**

### **3.1 Aktivera 2FA**
1. Gå till [Google Account Settings](https://myaccount.google.com/)
2. Säkerhet → 2-stegsverifiering → Aktivera

### **3.2 Skapa App-lösenord**
1. Säkerhet → 2-stegsverifiering → App-lösenord
2. Välj "Mail" som app
3. Kopiera det genererade lösenordet
4. Lägg till i Railway som `EMAIL_PASS`

## 🚀 **Steg 4: Deploy**

### **4.1 Automatisk deployment**
- Railway deployar automatiskt vid varje push till main
- Kolla **Deployments** tab för status

### **4.2 Manuell deployment**
1. Gå till **Deployments** tab
2. Klicka "Deploy Now"

## ✅ **Steg 5: Verifiering**

### **5.1 Kontrollera deployment**
- Kolla att alla miljövariabler är satta
- Verifiera att servern startar utan fel
- Testa health check: `https://din-app.railway.app/health`

### **5.2 Testa funktionalitet**
- Öppna webbplatsen
- Testa kontaktformuläret
- Verifiera att e-post skickas

## 🔒 **Steg 6: Säkerhet**

### **6.1 Aktivera HTTPS**
- Railway hanterar HTTPS automatiskt
- Verifiera att `Strict-Transport-Security` header finns

### **6.2 Miljövariabler**
- Kontrollera att `.env` inte är committad
- Alla känsliga uppgifter ska vara i Railway

## 📊 **Steg 7: Monitoring**

### **7.1 Railway Metrics**
- Övervakning i **Metrics** tab
- Loggar i **Deployments** tab

### **7.2 Externa verktyg**
- [UptimeRobot](https://uptimerobot.com/) för uptime
- [Google Analytics](https://analytics.google.com/) för trafik

## 🚨 **Felsökning**

### **Vanliga problem:**

1. **E-post fungerar inte**
   - Kontrollera Gmail App-lösenord
   - Verifiera miljövariabler

2. **Servern startar inte**
   - Kolla loggar i Railway
   - Verifiera start command

3. **CSS laddas inte**
   - Kör `npm run build:css:prod` lokalt
   - Committa `dist/output.css`

### **Loggar**
- Kolla **Deployments** → **View Logs**
- Använd `console.log()` för debugging

## 🔄 **Uppdateringar**

### **Automatisk deployment**
```bash
git add .
git commit -m "Update message"
git push origin main
```

### **Manuell deployment**
- Gå till Railway Dashboard
- Klicka "Deploy Now"

## 📞 **Support**

- **Railway Docs**: [docs.railway.app](https://docs.railway.app/)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **appyChap**: info@appychap.se

---

**Lycka till med deploymenten! 🚀**
