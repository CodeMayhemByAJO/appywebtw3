const API_URL = 'https://appybackend-production.up.railway.app/chat';
const CONTACT_URL = 'https://appybackend-production.up.railway.app/contact';
const toggle = document.getElementById('chat-toggle');
const windowEl = document.getElementById('chat-window');
const closeBtn = document.getElementById('chat-close');
const bodyEl = document.getElementById('chat-body');
const inputEl = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let hasWelcomed = false;
let askedForConsent = false;
let inNeedsFlow = false;
let currentQuestion = 0;

// Behovsflöde med frågor
const questions = [
  'Vad vill ni ha hjälp med? (hemsida, app, foto, AI-bot eller virtuell assistent…)',
  'Berätta gärna lite mer ingående om ert projekt!',
  'Vad är det primära syftet med detta, vad vill ni åstadkomma?',
  'Vad heter ert företag?',
  'Inom vilken bransch är ni?',
  'Hur ser er tidplan ut? När vill ni ha det klart?',
  'Vart finns ni geografiskt?',
  'Slutligen, vad är ditt namn?',
  'Vad har du för e-postadress?',
  'Vad har du för telefonnummer?',
];
const answers = [];

// Öppna/stäng chatten
toggle.addEventListener('click', () => {
  const isOpen = windowEl.classList.toggle('scale-y-100');
  windowEl.classList.toggle('scale-y-0', !isOpen);
  if (isOpen && !hasWelcomed) {
    appendMessage(
      'Tjena! Jag är appyBot – vad kan jag hjälpa dig med idag?',
      true
    );
    hasWelcomed = true;
  }
});

// Stäng-knapp
closeBtn.addEventListener('click', () => {
  windowEl.classList.add('scale-y-0');
  windowEl.classList.remove('scale-y-100');
});

// Enter = skicka
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
sendBtn.addEventListener('click', sendMessage);

// Visa meddelande i chatten
function appendMessage(text, isBot = false) {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.className = isBot
    ? 'italic text-gray-300 mb-2'
    : 'text-right text-gray-100 mb-2';
  bodyEl.appendChild(msg);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}

// logik för varje användarmeddelande
async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  // ── 0) Behovsanalys-trigger ──
  const needsRegex =
    /offert|behovsanalys|ny hemsida|skapa en hemsida|(?:behov av )?app(?:e?r)?|website|webbsida|fotografering|foto|photography|mjukvara|software|ai|bot|virtuell assistent|fixa hemsida|fixa hemsidor|behöver en|ska ha|kan ni/i;
  if (!askedForConsent && !inNeedsFlow && needsRegex.test(text)) {
    appendMessage(text, false);

    // Anpassad intro beroende på kategori
    if (/ai|bot|virtuell assistent/i.test(text)) {
      appendMessage(
        'Spännande – ni funderar på en AI-bot eller virtuell assistent!',
        true
      );
    } else if (/(?:behov av )?app(?:e?r)?|software/i.test(text)) {
      appendMessage(
        'Vad kul att ni är intresserade av en app eller mjukvara!',
        true
      );
    } else if (/hemsida|website|webbsida/i.test(text)) {
      appendMessage(
        'Vad kul att ni vill ha hjälp med en hemsida/webbsida!',
        true
      );
    } else if (/fotografering|foto|photography/i.test(text)) {
      appendMessage(
        'Fotografering låter toppen – bra bilder lyfter ju varumärket!',
        true
      );
    } else {
      appendMessage('Låter som ett spännande projekt!', true);
    }

    // Okej medd samtycke?
    appendMessage(
      'Är det okej att jag ställer några frågor om detta? Jag skickar dina svar vidare till Andreas efteråt som får kolla närmare på det och återkomma till dig. Okej? (Ja/Nej)',
      true
    );
    askedForConsent = true;
    inputEl.value = '';
    return;
  }

  // ── 1) Hantera samtycke ──
  if (askedForConsent && !inNeedsFlow) {
    appendMessage(text, false);

    const yesRegex =
      /^(ja|japp|jajjemen|absolut|visst|självklart|okej|kör på|yes?)\b/i;
    const noRegex = /^(nej|nä|nej tack|nope|nädu|icke|absolut inte)\b/i;

    if (yesRegex.test(text)) {
      inNeedsFlow = true;
      appendMessage(questions[currentQuestion], true);
    } else if (noRegex.test(text)) {
      appendMessage(
        'Inga problem! Du kan alltid kontakta appyChap via kontaktformuläret 😉',
        true
      );
      askedForConsent = false;
    } else {
      appendMessage(
        'Jag förstod inte ditt svar. Säg gärna Ja eller Nej så vi kan gå vidare! 😊',
        true
      );
    }

    inputEl.value = '';
    return;
  }

  // ── 2) Stegvis behovsanalys ──
  if (inNeedsFlow) {
    appendMessage(text, false);
    answers.push({ question: questions[currentQuestion], answer: text });
    currentQuestion++;

    if (currentQuestion < questions.length) {
      appendMessage(questions[currentQuestion], true);
    } else {
      // Alla frågor klara
      appendMessage('Tack! Jag skickar dina svar vidare!', true);

      // Bygg sammanfattning
      const summary = answers
        .map((a) => `• ${a.question}\n→ ${a.answer}`)
        .join('\n\n');

      // Hämta de tre sista svaren för namn, mejl, telefon
      const name = answers[questions.length - 3].answer;
      const email = answers[questions.length - 2].answer;
      const phone = answers[questions.length - 1].answer;

      try {
        const res = await fetch(CONTACT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            message: `Behovsanalys från appyBot:\n\n${summary}`,
          }),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        appendMessage(
          'Färdigt – Andreas återkommer så snart han kan! 😉',
          true
        );
      } catch (err) {
        console.error('Kontakt-POST failed:', err);
        appendMessage(
          'Oj då, kunde inte skicka din analys – prova igen senare.',
          true
        );
      }

      // Nollställ ﬂödet
      askedForConsent = false;
      inNeedsFlow = false;
      currentQuestion = 0;
      answers.length = 0;
    }

    inputEl.value = '';
    return;
  }

  // ── 3) Vanligt "hör av dig"-fall ──
  const contactRegex =
    /kontakta\s*oss|kontakt(ar jag)?|hur kan jag hör av mig|hör av dig/i;
  if (contactRegex.test(text)) {
    appendMessage(text, false);
    loadContent('contact.html');
    appendMessage('Jag har öppnat kontaktformuläret åt dig! 😉', true);
    inputEl.value = '';
    return;
  }

  // ── 4) Vanligt AI-anrop ──
  appendMessage(text, false);
  inputEl.value = '';
  appendMessage('… skickar…', true);

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const { reply } = await res.json();
    const lastMsg = bodyEl.lastChild;
    if (lastMsg && lastMsg.textContent === '… skickar…') {
      bodyEl.removeChild(lastMsg);
    }
    appendMessage(reply, true);
  } catch (err) {
    const lastMsg = bodyEl.lastChild;
    if (lastMsg && lastMsg.textContent === '… skickar…') {
      bodyEl.removeChild(lastMsg);
    }
    appendMessage('Oj då, något blev fel 😕', true);
    console.error('Chat-error:', err);
  }
}
