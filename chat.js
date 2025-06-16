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
  'Vad är det primära målet med projektet?',
  'Vad heter ert företag eller organisation?',
  'Vilken bransch verkar ni inom?',
  'När önskar ni att projektet ska vara klart?',
  'Var är ni baserade geografiskt?',
  'Ditt namn?',
  'Vilken e-postadress nås du på?',
  'Vilket telefonnummer nås du på?',
];

let answers = [];
let hasWelcomed = false;
let askedForConsent = false;
let inNeedsFlow = false;
let currentQuestion = 0;

let sessionId = window.sessionStorage.getItem('appySessionId');
if (!sessionId) {
  sessionId = crypto.randomUUID();
  window.sessionStorage.setItem('appySessionId', sessionId);
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

closeBtn.addEventListener('click', () => {
  closeChatWindow();
});

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

function resetChat() {
  answers = [];
  hasWelcomed = false;
  askedForConsent = false;
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
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.className = isBot
    ? 'bot-message italic text-yellow-400 bg-yellow-900 rounded-tl-xl rounded-tr-xl rounded-br-xl p-1 max-w-4/5 mr-auto mb-2 text-left font-semibold'
    : 'user-message text-gray-100 bg-transparent rounded-tr-xl rounded-tl-xl rounded-bl-xl p-1 max-w-4/5 ml-auto mb-2 text-right font-medium';
  msg.style.lineHeight = '1.3';
  bodyEl.appendChild(msg);
  bodyEl.scrollTop = bodyEl.scrollHeight;
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

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  // Visa användarens meddelande endast om vi INTE väntar på consent eller är i behovsanalys
  if (!askedForConsent && !inNeedsFlow) {
    appendMessage(text, false);
  }

  inputEl.value = '';

  if (askedForConsent && !inNeedsFlow) {
    await handleConsent(text);
    return;
  }

  if (inNeedsFlow) {
    await handleNeedsFlow(text);
    return;
  }

  // Trigger kontaktformulär vid kontaktuppgiftsfrågor
  const contactFormRegex =
    /mejladress|mailadress|e-post|kontaktuppgifter|adress|telefonnummer/i;
  if (contactFormRegex.test(text)) {
    appendMessage(
      'Du tar enklast kontakt med oss via kontaktformuläret, jag laddar det åt dig.',
      true
    );
    loadContent('contact.html');
    return;
  }

  // Fasta frågor om företaget
  const companyQuestions = [
    /hur många är ni/i,
    /hur stort är appychap/i,
    /är ni många/i,
    /är ni enmansföretag/i,
    /vem jobbar där/i,
    /vem är chef/i,
  ];
  for (const regex of companyQuestions) {
    if (regex.test(text)) {
      appendMessage(
        'appyChap är ett enmansföretag med Andreas som driver allt själv, men med Bruno (vovven) som chef! 😉',
        true
      );
      return;
    }
  }

  // Direktkontakt-trigger
  const contactDirectRegex =
    /kontakta\s*oss|kontakt(ar jag)?|hur kan jag hör av mig|hör av dig/i;
  if (contactDirectRegex.test(text)) {
    appendMessage('Jag har öppnat kontaktformuläret åt dig! 😉', true);
    loadContent('contact.html');
    return;
  }

  // Skicka till AI för svar
  await handleAIResponse(text);
}

async function handleConsent(text) {
  appendMessage(text, false);

  const yesRegex =
    /^(ja|japp|jajjemen|absolut|visst|självklart|okej|kör på|yes?)\b/i;
  const noRegex = /^(nej|nä|nej tack|nope|nädu|icke|absolut inte)\b/i;

  if (yesRegex.test(text)) {
    inNeedsFlow = true;
    askedForConsent = false; // consent är nu bekräftat, sluta vänta på det
    appendMessage(questions[currentQuestion], true);
    inputEl.focus();
  } else if (noRegex.test(text)) {
    appendMessage(
      'Inga problem! Du kan alltid kontakta appyChap via kontaktformuläret 😉',
      true
    );
    askedForConsent = false;
  } else {
    appendMessage(
      'Jag förstod inte ditt svar. Säg gärna Ja eller Nej så vi kan gå vidare!',
      true
    );
  }
  inputEl.value = '';
}

async function handleNeedsFlow(text) {
  if (currentQuestion === questions.length - 2 && !text.includes('@')) {
    appendMessage(
      'Ajdå, det verkar inte vara en giltig e-postadress. Försök igen:',
      true
    );
    inputEl.value = '';
    return;
  }
  if (currentQuestion === questions.length - 1 && !/^\d+$/.test(text)) {
    appendMessage(
      'Ajdå, telefonnummer får bara innehålla siffror. Försök igen:',
      true
    );
    inputEl.value = '';
    return;
  }

  appendMessage(text, false);
  answers.push({ question: questions[currentQuestion], answer: text });
  currentQuestion++;

  if (currentQuestion < questions.length) {
    appendMessage(questions[currentQuestion], true);
    inputEl.focus();
  } else {
    const summary = answers
      .map((a) => `• ${a.question}\n→ ${a.answer}`)
      .join('\n\n');
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
      appendMessage('Färdigt – Andreas återkommer så snart han kan! 😉', true);
      setTimeout(closeChatWindow, 1500);
    } catch (err) {
      console.error('Kontakt-POST failed:', err);
      appendMessage(
        'Oj då, kunde inte skicka din analys – prova igen senare.',
        true
      );
    }

    askedForConsent = false;
    inNeedsFlow = false;
    currentQuestion = 0;
    answers = [];
  }
  inputEl.value = '';
}

async function handleAIResponse(text) {
  appendMessage('… skickar…', true);

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);

    const { reply, triggerNeedsFlow, openContactForm } = await res.json();

    const lastMsg = bodyEl.lastChild;
    if (lastMsg && lastMsg.textContent === '… skickar…') {
      bodyEl.removeChild(lastMsg);
    }

    appendMessage(reply, true);

    if (openContactForm) {
      loadContent('contact.html');
    }

    if (triggerNeedsFlow) {
      askedForConsent = true;
      inputEl.focus();
    }
  } catch (err) {
    const lastMsg = bodyEl.lastChild;
    if (lastMsg && lastMsg.textContent === '… skickar…') {
      bodyEl.removeChild(lastMsg);
    }
    appendMessage('Oj då, något blev fel 😕', true);
    console.error('Chat-error:', err);
  }
}
