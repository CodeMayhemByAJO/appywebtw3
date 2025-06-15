// api chat & kontaktformulär
const API_URL = 'https://appybackend-production.up.railway.app/chat';
const CONTACT_URL = 'https://appybackend-production.up.railway.app/contact';

// element för att hantera chatten
const toggle = document.getElementById('chat-toggle');
const windowEl = document.getElementById('chat-window');
// Här lägger vi till rundade hörn och overflow hidden direkt efter vi hämtat elementet:
windowEl.classList.add('rounded-xl', 'overflow-hidden');

const closeBtn = document.getElementById('chat-close');
const bodyEl = document.getElementById('chat-body');
const inputEl = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Behovsanalys-frågor
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

// håller koll på svaren och status i chatten
let answers = [];
let hasWelcomed = false;
let askedForConsent = false;
let inNeedsFlow = false;
let currentQuestion = 0;

// sparar unik session
let sessionId = window.sessionStorage.getItem('appySessionId');
if (!sessionId) {
  sessionId = crypto.randomUUID();
  window.sessionStorage.setItem('appySessionId', sessionId);
}

// koppling knappar o input t funktioner
toggle.addEventListener('click', toggleChatWindow);
closeBtn.addEventListener('click', closeChatWindow);
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
sendBtn.addEventListener('click', sendMessage);

// öppna/stäng chat
function toggleChatWindow() {
  const isOpen = windowEl.classList.toggle('scale-y-100');
  windowEl.classList.toggle('scale-y-0', !isOpen);
  if (isOpen && !hasWelcomed) {
    appendMessage(
      'Tjena! Jag är appyBot! Vad kan jag hjälpa dig med idag?',
      true
    );
    hasWelcomed = true;
    inputEl.focus();
  }
}

// stäng chat på x
function closeChatWindow() {
  windowEl.classList.add('scale-y-0');
  windowEl.classList.remove('scale-y-100');

  // Nollställ chatflödet
  answers = [];
  hasWelcomed = false;
  askedForConsent = false;
  inNeedsFlow = false;
  currentQuestion = 0;

  // rensa chatthistorik från UI
  bodyEl.innerHTML = '';
}

// lägger till ett meddelande i chatten
function appendMessage(text, isBot = false) {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.className = isBot
    ? 'bot-message italic text-yellow-400 bg-yellow-900 rounded-tl-xl rounded-tr-xl rounded-br-xl p-1 max-w-4/5 mr-auto mb-2 text-left font-semibold'
    : 'user-message text-gray-100 bg-transparent rounded-tr-xl rounded-tl-xl rounded-bl-xl p-1 max-w-4/5 ml-auto mb-2 text-right font-medium';
  msg.style.lineHeight = '1,3';
  bodyEl.appendChild(msg);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}

// funktion användarens meddelande
async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  // kontroll texten triggning behovsanalys
  const needsRegex =
    /offert|behovsanalys|ny hemsida|skapa en hemsida|(?:behov av )?\bapp(?:e?r)?\b|website|webbsida|fotografering|foto|photography|mjukvara|software|ai|bot|virtuell assistent|fixa hemsida|fixa hemsidor|behöver en|ska ha|kan ni|problem|fel|bugg|strula|hänga sig|crash|strul|kass|krånglar|funkar inte|är död/i;

  if (!askedForConsent && !inNeedsFlow && needsRegex.test(text)) {
    await handleNeedsTrigger(text);
    return;
  }

  // ok, ja eller nej att ställa frågor som skickas vidare?
  if (askedForConsent && !inNeedsFlow) {
    await handleConsent(text);
    return;
  }

  // hantera frågor o svar i behovsanalys-flödet
  if (inNeedsFlow) {
    await handleNeedsFlow(text);
    return;
  }

  //om besökare vill kontakta direkt, öppna kontaktformuläret
  const contactRegex =
    /kontakta\s*oss|kontakt(ar jag)?|hur kan jag hör av mig|hör av dig/i;
  if (contactRegex.test(text)) {
    appendMessage(text, false);
    loadContent('contact.html');
    appendMessage('Jag har öppnat kontaktformuläret åt dig! 😉', true);
    inputEl.value = '';
    return;
  }

  // skicka texten till AI:n för svar
  await handleAIResponse(text);
}

// användaren skriver in ett behov som ska trigga behovsanalysen
async function handleNeedsTrigger(text) {
  appendMessage(text, false);

  const problemRegex =
    /problem|fel|bugg|strula|hänga sig|crash|strul|kass|krånglar|funkar inte|är död/i;
  if (problemRegex.test(text)) {
    appendMessage('Ajdå, det låter inte bra!', true);
    appendMessage(
      'Är det okej att jag ställer några frågor om detta? Jag skickar dina svar vidare till Andreas som får kolla närmare på det och återkomma till dig. Okej?',
      true
    );
    askedForConsent = true;
    inputEl.value = '';
    return;
  }

  // svar beroende på vad användaren nämner
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

  // ok med fler frågor?
  appendMessage(
    'Är det okej att jag ställer några frågor om detta? Jag skickar dina svar vidare till Andreas som får kolla närmare på det och återkomma till dig. Okej?',
    true
  );

  askedForConsent = true;
  inputEl.value = '';
}

// ja eller nej
async function handleConsent(text) {
  appendMessage(text, false);

  const yesRegex =
    /^(ja|japp|jajjemen|absolut|visst|självklart|okej|kör på|yes?)\b/i;
  const noRegex = /^(nej|nä|nej tack|nope|nädu|icke|absolut inte)\b/i;

  if (yesRegex.test(text)) {
    inNeedsFlow = true;
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

// behovsanalys-flödet steg för steg
async function handleNeedsFlow(text) {
  // ok format på mejl och telefonnummer?
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

  // lägg till svar och gå vidare till nästa fråga
  appendMessage(text, false);
  answers.push({ question: questions[currentQuestion], answer: text });
  currentQuestion++;

  // fortsätt med nästa fråga eller skicka in analys om klart
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
      setTimeout(() => {
        closeChatWindow();
      }, 1500);
    } catch (err) {
      console.error('Kontakt-POST failed:', err);
      appendMessage(
        'Oj då, kunde inte skicka din analys – prova igen senare.',
        true
      );
    }

    // nollställ flödet
    askedForConsent = false;
    inNeedsFlow = false;
    currentQuestion = 0;
    answers = [];
  }

  inputEl.value = '';
}

// skicka meddelande till AI:n
async function handleAIResponse(text) {
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

    const { reply, triggerNeedsFlow } = await res.json();

    const lastMsg = bodyEl.lastChild;
    if (lastMsg && lastMsg.textContent === '… skickar…') {
      bodyEl.removeChild(lastMsg);
    }

    appendMessage(reply, true);

    if (triggerNeedsFlow) {
      askedForConsent = true;
      appendMessage(questions[currentQuestion], true);
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
