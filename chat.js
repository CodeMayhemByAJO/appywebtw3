// chat.js - Frontend code
const API_URL = 'https://appybackend-production.up.railway.app/chat';
const CONTACT_URL = 'https://appybackend-production.up.railway.app/contact';

const toggle = document.getElementById('chat-toggle');
const windowEl = document.getElementById('chat-window');
windowEl.classList.add('rounded-xl', 'overflow-hidden');

const closeBtn = document.getElementById('chat-close');
const bodyEl = document.getElementById('chat-body');
const inputEl = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const questions = [
  'Vad behöver ni hjälp med? (t.ex hemsida, app, fotografering/fotoredigering, automatiserade processer, AI-bottar eller något annat roligt)',
  'Berätta gärna mer detaljerat om ert projekt. Mer information ger träffsäkrare uppskattning av tid och kostnad.',
  'Vad är det primära målet med projektet)?',
  'Vad heter ert företag eller organisation?',
  'Vilken bransch verkar ni inom?',
  'När önskar ni att projektet ska vara klart?',
  'Var är ni baserade geografiskt?',
  'Ditt namn?',
  'Vilken e-postadress nås du på?',
  'Vilket telefonnummer nås du på?',
];

let answers = [];
let askedForConsent = false;
let consentDenied = false;
let inNeedsFlow = false;
let currentQuestion = 0;

let sessionId = window.sessionStorage.getItem('appySessionId');
if (!sessionId) {
  sessionId = crypto.randomUUID();
  window.sessionStorage.setItem('appySessionId', sessionId);
}

function getRandomGreeting() {
  const greetings = [
    'Tjena! Jag är appyBot! Vad kan jag hjälpa dig med idag?',
    'Hej på dig! Hur kan jag hjälpa till?',
    'Hallå där! Vad vill du veta om appyChap?',
    'Tjenare! Vad kan jag göra för dig idag?',
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

toggle.addEventListener('click', () => {
  const isOpen = windowEl.classList.toggle('scale-y-100');
  windowEl.classList.toggle('scale-y-0', !isOpen);
  if (isOpen) {
    resetChat();
    appendMessage(getRandomGreeting(), true);
    inputEl.focus();
  }
});

closeBtn.addEventListener('click', closeChatWindow);
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
sendBtn.addEventListener('click', sendMessage);

function resetChat() {
  answers = [];
  askedForConsent = false;
  consentDenied = false;
  inNeedsFlow = false;
  currentQuestion = 0;
  bodyEl.innerHTML = '';
  inputEl.value = '';
}

function closeChatWindow() {
  windowEl.classList.add('scale-y-0');
  windowEl.classList.remove('scale-y-100');
  resetChat();
}

function appendMessage(text, isBot = false) {
  if (!text) return;
  const last = bodyEl.lastChild;
  if (last && last.textContent === text) return;
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.className = isBot
    ? 'bot-message italic text-yellow-400 bg-yellow-900 rounded-tl-xl rounded-tr-xl rounded-br-xl p-1 max-w-4/5 mr-auto mb-2 text-left font-semibold'
    : 'user-message text-gray-100 bg-transparent rounded-tr-xl rounded-tl-xl rounded-bl-xl p-1 max-w-4/5 ml-auto mb-2 text-right font-medium';
  msg.style.lineHeight = '1.3';
  bodyEl.appendChild(msg);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  appendMessage(text, false);
  inputEl.value = '';

  // Consent handling
  if (askedForConsent && !consentDenied) {
    if (/^(ja|japp|absolut|okej|visst)\b/i.test(text)) {
      askedForConsent = false;
      inNeedsFlow = true;
      appendMessage(questions[currentQuestion], true);
      inputEl.focus();
      return;
    }
    if (/^(nej|nä|nope|nej tack)\b/i.test(text)) {
      askedForConsent = false;
      consentDenied = true;
      appendMessage(
        'Inga problem! Du kan alltid kontakta appyChap via kontaktformuläret 😉',
        true
      );
      return;
    }
    appendMessage(
      'Jag förstod inte ditt svar. Säg gärna Ja eller Nej så vi kan gå vidare!',
      true
    );
    return;
  }

  // Needs flow
  if (inNeedsFlow) {
    await handleNeedsFlow(text);
    return;
  }

  // Contact info trigger
  if (
    /mejladress|mailadress|e-post|kontaktuppgifter|telefonnummer/i.test(text)
  ) {
    appendMessage(
      'Du tar enklast kontakt via kontaktformuläret, jag laddar det åt dig.',
      true
    );
    loadContent('contact.html');
    return;
  }

  // Company questions
  const companyQ = [/hur många är ni/i, /är ni enmansföretag/i, /vem är chef/i];
  for (const rx of companyQ)
    if (rx.test(text)) {
      appendMessage(
        'appyChap är ett enmansföretag med Andreas som driver allt själv, men med Bruno (vovven) som chef! 😉',
        true
      );
      return;
    }

  // Direct contact
  if (/kontakta oss|hör av dig|kontakt/i.test(text)) {
    appendMessage('Jag har öppnat kontaktformuläret åt dig! 😉', true);
    loadContent('contact.html');
    return;
  }

  // Default: call backend
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, sessionId }),
    });
    const data = await res.json();
    appendMessage(data.reply, true);
    if (data.openContactForm) loadContent('contact.html');
    if (data.triggerNeedsFlow) askedForConsent = true;
    if (data.startNeedsFlow) {
      askedForConsent = false;
      inNeedsFlow = true;
      appendMessage(questions[0], true);
    }
  } catch (e) {
    appendMessage('Oj då, något gick fel 😕', true);
    console.error(e);
  }
}

async function handleNeedsFlow(text) {
  if (currentQuestion === questions.length - 2 && !text.includes('@')) {
    appendMessage('Ogiltig e-post, försök igen:', true);
    return;
  }
  if (currentQuestion === questions.length - 1 && !/^\d+$/.test(text)) {
    appendMessage(
      'Telefonnummer får bara innehålla siffror, försök igen:',
      true
    );
    return;
  }
  appendMessage(text, false);
  answers.push({ question: questions[currentQuestion], answer: text });
  currentQuestion++;
  if (currentQuestion < questions.length) {
    appendMessage(questions[currentQuestion], true);
  } else {
    // submit summary
    const summary = answers
      .map((a) => `• ${a.question}\n→ ${a.answer}`)
      .join('\n\n');
    const name = answers[questions.length - 3].answer;
    const email = answers[questions.length - 2].answer;
    const phone = answers[questions.length - 1].answer;
    try {
      await fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: `Behovsanalys:\n${summary}`,
        }),
      });
      appendMessage('Färdigt – Andreas återkommer så snart han kan! 😉', true);
      setTimeout(closeChatWindow, 1500);
    } catch (e) {
      appendMessage('Kunde inte skicka analys, försök senare.', true);
    }
    askedForConsent = false;
    inNeedsFlow = false;
    currentQuestion = 0;
    answers = [];
  }
}

// chatHandler.js - Backend code
const saveMessage = require('./saveMessage');
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// session management
const sessionStates = {};
function getSessionState(id) {
  if (!sessionStates[id]) {
    sessionStates[id] = { consentRequested: false, consentDenied: false };
  }
  return sessionStates[id];
}

const priceKeywords = ['pris', 'kostar', 'offert', 'beställa', 'köpa'];
const serviceKeywords = [
  'app',
  'hemsida',
  'webbsida',
  'fotografering',
  'ai',
  'bot',
];
const helpKeywords = ['hjälp mig', 'kan du hjälpa', 'behöver hjälp'];

function containsAny(msg, list) {
  return list.some((k) => msg.includes(k));
}

module.exports = async function chatHandler(req, res) {
  const { message, sessionId } = req.body;
  if (!message || !sessionId)
    return res.status(400).json({ error: 'Missing message or sessionId' });
  const msg = message.toLowerCase();
  const session = getSessionState(sessionId);

  // help-signal → consent
  if (
    containsAny(msg, helpKeywords) &&
    !session.consentRequested &&
    !session.consentDenied
  ) {
    session.consentRequested = true;
    return res.json({
      reply:
        'Spännande! Är det okej att jag ställer några frågor så att Andreas kan hjälpa dig närmare och återkomma?',
      triggerNeedsFlow: true,
    });
  }
  // handle consent response
  if (session.consentRequested) {
    if (/^(ja|absolut|visst)\b/.test(msg)) {
      session.consentRequested = false;
      return res.json({
        reply: 'Bra! Då börjar vi med några frågor.',
        startNeedsFlow: true,
      });
    }
    if (/^(nej|nä)\b/.test(msg)) {
      session.consentRequested = false;
      session.consentDenied = true;
      return res.json({
        reply:
          'Inga problem! Du kan alltid kontakta oss via kontaktformuläret 😉',
      });
    }
    return res.json({ reply: 'Jag förstod inte ditt svar. Säg Ja eller Nej.' });
  }

  // fixed answers
  const fixed = [
    { rx: /vem är chef/i, ans: 'Bruno är chef och Andreas gör allt annat! 😉' },
    {
      rx: /hur många är ni/i,
      ans: 'appyChap är ett enmansföretag med Andreas och Bruno som chef! 😉',
    },
  ];
  for (const f of fixed)
    if (f.rx.test(message)) return res.json({ reply: f.ans });

  // contact info
  if (/mejladresser?|telefonnummer|kontaktuppgifter|adress/.test(msg)) {
    return res.json({
      reply:
        'Du tar enklast kontakt via vårt kontaktformulär. Jag kan öppna det åt dig om du vill!',
      openContactForm: true,
    });
  }

  // price → consent
  if (
    containsAny(msg, priceKeywords) &&
    !session.consentRequested &&
    !session.consentDenied
  ) {
    session.consentRequested = true;
    return res.json({
      reply:
        'Det låter som du vill ha offert. Vill du att jag ställer några frågor?',
      triggerNeedsFlow: true,
    });
  }

  // service interest
  if (
    containsAny(msg, serviceKeywords) &&
    !session.consentRequested &&
    !session.consentDenied
  ) {
    // direct info if contains 'vad gör' etc
    if (/vad gör|vad är/.test(msg)) {
      const ai = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Du är appyBot... kort svar utan consent.',
          },
          { role: 'user', content: message },
        ],
      });
      return res.json({ reply: ai.choices[0].message.content });
    }
    // else trigger consent
    session.consentRequested = true;
    return res.json({
      reply:
        'Är det okej att jag ställer några frågor så att Andreas kan hjälpa dig?',
      triggerNeedsFlow: true,
    });
  }

  // fallback AI
  const ai = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Du är appyBot... svara inom ramarna.' },
      { role: 'user', content: message },
    ],
  });
  await saveMessage({
    content: message,
    user_message: message,
    bot_response: ai.choices[0].message.content,
  });
  res.json({ reply: ai.choices[0].message.content });
};
