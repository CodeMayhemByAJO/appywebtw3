# appyChap - Tech Consulting Website

En modern, optimerad webbplats för appyChap - norrländsk tech-consulting som hjälper företag med AI, hemsidor, appar och smarta automationer.

## 🚀 **Funktioner**

- **Responsiv design** med Tailwind CSS
- **PWA-funktionalitet** med service worker
- **SEO-optimerad** med strukturdata och meta-taggar
- **Prestanda-optimerad** med lazy loading och caching
- **Modern UX** med smooth animations och transitions
- **Chat-funktionalitet** med appyBot

## 🛠 **Teknisk Stack**

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS med custom komponenter
- **PWA**: Service Worker, Web App Manifest
- **Build Tools**: PostCSS, Autoprefixer
- **Server**: Express.js (Node.js)

## 📦 **Installation**

```bash
# Klona repository
git clone [repository-url]
cd tw4-appyweb

# Installera dependencies
npm install

# Starta utvecklingsläge
npm run dev

# Bygg för produktion
npm run build
```

## 🔧 **Tillgängliga Scripts**

- `npm run dev` - Starta utvecklingsläge med hot reload (ingen e-post)
- `npm run dev:prod` - Starta produktionsläge med e-postfunktionalitet
- `npm run build` - Bygg för produktion
- `npm run build:css` - Bygg CSS en gång
- `npm run build:css:watch` - Bygg CSS med watch mode
- `npm run start` - Starta utvecklingsservern
- `npm run start:prod` - Starta produktionsservern med e-post
- `npm run start:serve` - Starta statisk server (för deployment)
- `npm run analyze` - Analysera prestanda med Lighthouse
- `npm run optimize-images` - Optimera bilder

## 🎯 **SEO-optimeringar**

### Meta-taggar
- Kompletta Open Graph taggar för social media
- Twitter Card support
- Strukturerad data (JSON-LD) för LocalBusiness
- Canonical URLs och robots.txt

### Prestanda
- Lazy loading för bilder
- Service worker för caching
- Optimerade CSS och JavaScript
- WebP-bildformat

### Accessibility
- ARIA-labels och semantisk HTML
- Tangentbordsnavigering
- Fokus-hantering
- Kontrast-optimering

## 📱 **PWA-funktioner**

- **Installation**: Användare kan installera webbplatsen som app
- **Offline support**: Service worker cachar viktiga resurser
- **App-like experience**: Standalone display mode
- **Fast loading**: Caching av statiska resurser

## 🎨 **Design-system**

### Färger
- **Primary**: `#F7A42B` (appyYellow)
- **Secondary**: `#2BAAA8` (appyTurquoise)
- **Accent**: `#F1531A` (appyOrange)
- **Background**: `#000000` (Black)
- **Text**: `#FFFFFF` (White)

### Typografi
- **Primary Font**: Poppins (300, 400, 600)
- **Fallback**: Sans-serif system fonts

## 📊 **Prestanda-mätningar**

Webbplatsen är optimerad för:
- **Core Web Vitals**: LCP, FID, CLS
- **Lighthouse Score**: Mål 90+ på alla kategorier
- **Mobile First**: Responsiv design för alla enheter
- **Fast Loading**: < 3 sekunder på 3G

## 🔍 **Analytics & Tracking**

- Google Analytics 4
- Facebook Pixel
- Performance monitoring
- Error tracking

## 📁 **Projektstruktur**

```
tw4-appyweb/
├── index.html          # Huvudsida
├── about.html          # Om oss
├── whatwedo.html       # Tjänster
├── whatwevedone.html   # Portfolio
├── contact.html        # Kontakt
├── integrity.html      # Integritetspolicy
├── src/
│   └── input.css      # Tailwind input
├── dist/
│   └── output.css     # Kompilerad CSS
├── images/             # Optimerade bilder
├── sw.js              # Service Worker
├── chat.js            # Chat-funktionalitet
├── robots.txt         # SEO
├── sitemap.xml        # Sitemap
└── package.json       # Dependencies
```

## 🚀 **Deployment**

### Utveckling (ingen e-post)
```bash
npm run dev
```

### Produktion (med e-postfunktionalitet)
```bash
# 1. Skapa .env-fil från env.example
cp env.example .env

# 2. Konfigurera e-post i .env-filen
# 3. Starta produktionsläge
npm run dev:prod
```

### Statisk deployment
```bash
npm run build
npm run start:serve
```

## 📧 **E-postkonfiguration**

För att få kontaktformuläret att skicka riktiga e-postmeddelanden:

1. **Kopiera env.example till .env:**
   ```bash
   cp env.example .env
   ```

2. **Konfigurera e-posttjänst i .env:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=din.email@gmail.com
   EMAIL_PASS=ditt_lösenord
   EMAIL_TO=info@appychap.se
   ```

3. **Starta produktionsläge:**
   ```bash
   npm run dev:prod
   ```

**Viktigt:** För Gmail behöver du använda ett "App-lösenord" istället för ditt vanliga lösenord.

## 📈 **Framtida förbättringar**

- [ ] A/B-testning av CTA-knappar
- [ ] Multispråksstöd (engelska)
- [ ] Blog-sektion för SEO
- [ ] Kundrecensioner och testimonials
- [ ] Avancerad analytics dashboard
- [ ] Automatisk bildoptimering
- [ ] CDN-integration

## 🤝 **Bidrag**

För att bidra till projektet:
1. Forka repository
2. Skapa feature branch
3. Committa dina ändringar
4. Pusha till branch
5. Öppna Pull Request

## 📄 **Licens**

ISC License - se LICENSE-fil för detaljer.

## 📞 **Kontakt**

- **Webbplats**: [appychap.se](https://appychap.se)
- **Email**: info@appychap.se
- **LinkedIn**: [appyChap](https://www.linkedin.com/company/appychap)

---

**appyChap** - Din kompis på digitaliseringsresan! 🚀
