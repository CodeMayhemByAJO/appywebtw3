const API_URL =
  'https://primary-production-f961a.up.railway.app/webhook/appybot';

const toggle = document.getElementById('chat-toggle');
const windowEl = document.getElementById('chat-window');
const closeBtn = document.getElementById('chat-close');
const bodyEl = document.getElementById('chat-body');
const inputEl = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let sessionId = window.sessionStorage.getItem('appySessionId');
if (!sessionId) {
  sessionId = crypto.randomUUID();
  window.sessionStorage.setItem('appySessionId', sessionId);
}

function getRandomGreeting() {
  const g = [
    'Tjena! appyBot here! Vad kan jag hjälpa dig med idag?',
    'Hej på dig! Hur kan jag hjälpa till?',
    'Hallå där! Det är jag som är appyBot. Hur kan jag hjälpa dig idag?',
    'Tjenare! Vad kan jag göra för dig idag?',
  ];
  return g[Math.floor(Math.random() * g.length)];
}

toggle.addEventListener('click', () => {
  const open = windowEl.classList.toggle('scale-y-100');
  windowEl.classList.toggle('scale-y-0', !open);
  if (open) {
    // Generera nytt sessionId varje gång chatten öppnas
    sessionId = crypto.randomUUID();
    window.sessionStorage.setItem('appySessionId', sessionId);

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

  // Kolla om det är slutmeddelandet från Andreas ELLER close chat
  const isEndMessage =
    text.includes('Andreas hör av sig inom 24') ||
    text.includes('Andreas kollar på det och återkommer') ||
    text.includes('CLOSE_CHAT') ||
    text.includes('Ha en fortsatt bra dag');

  const wrap = document.createElement('div');
  wrap.className = 'w-full flex ' + (isBot ? 'justify-start' : 'justify-end');
  wrap.style.marginBottom = '1rem';

  const msg = document.createElement('div');
  if (isBot) {
    msg.className =
      'flex items-start max-w-[80%] font-medium italic text-gray-300';
    msg.style.gap = '0.5rem';

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('width', 24);
    icon.setAttribute('height', 24);
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.classList.add('flex-shrink-0', 'mt-px');

    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', 12);
    c.setAttribute('cy', 12);
    c.setAttribute('r', 10);
    c.setAttribute('stroke', '#FACC15');
    c.setAttribute('stroke-width', 3);
    c.setAttribute('fill', 'none');

    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', 12);
    t.setAttribute('y', 12);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'middle');
    t.setAttribute('font-size', 12);
    t.setAttribute('fill', 'white');
    t.setAttribute('font-weight', 'bold');
    t.textContent = 'a';
    icon.append(c, t);

    const span = document.createElement('span');
    msg.append(icon, span);
    wrap.appendChild(msg);
    bodyEl.appendChild(wrap);

    let i = 0;
    (function type() {
      span.innerHTML = `<em>${text.slice(
        0,
        i
      )}</em><span class="blinking">|</span>`;
      if (++i <= text.length) {
        bodyEl.scrollTop = bodyEl.scrollHeight;
        setTimeout(type, 25);
      } else {
        span.innerHTML = `<em>${text}</em>`;
        bodyEl.scrollTop = bodyEl.scrollHeight;

        // Kollaps chatten efter slutmeddelandet
        if (isEndMessage) {
          setTimeout(() => {
            closeChatWindow();
          }, 3000); // Vänta 3 sekunder så användaren hinner läsa
        }
      }
    })();
  } else {
    msg.className =
      'bg-yellow-400 text-gray-900 rounded-t-2xl rounded-l-2xl rounded-br-none px-3 py-2 max-w-[80%] font-medium text-right shadow';
    msg.style.whiteSpace = 'pre-wrap';
    msg.textContent = text;
    wrap.appendChild(msg);
    bodyEl.appendChild(wrap);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }
}

function showThinkingIndicator() {
  const wrap = document.createElement('div');
  wrap.className = 'w-full flex justify-start thinking-indicator';
  wrap.style.marginBottom = '1rem';

  const msg = document.createElement('div');
  msg.className =
    'flex items-start max-w-[80%] font-medium italic text-gray-300';
  msg.style.gap = '0.5rem';

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('width', 24);
  icon.setAttribute('height', 24);
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.classList.add('flex-shrink-0', 'mt-px');

  const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  c.setAttribute('cx', 12);
  c.setAttribute('cy', 12);
  c.setAttribute('r', 10);
  c.setAttribute('stroke', '#FACC15'); // Gul färg (samma som vanliga meddelanden)
  c.setAttribute('stroke-width', 3);
  c.setAttribute('fill', 'none');

  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', 12);
  t.setAttribute('y', 12);
  t.setAttribute('text-anchor', 'middle');
  t.setAttribute('dominant-baseline', 'middle');
  t.setAttribute('font-size', 12);
  t.setAttribute('fill', 'white');
  t.setAttribute('font-weight', 'bold');
  t.textContent = 'a';
  icon.append(c, t);

  const span = document.createElement('span');
  span.innerHTML =
    '<span class="dot dot1">●</span><span class="dot dot2">●</span><span class="dot dot3">●</span>';

  // Lägg till CSS för animationen
  if (!document.querySelector('#thinking-style')) {
    const style = document.createElement('style');
    style.id = 'thinking-style';
    style.textContent = `
      .dot {
        opacity: 0.3;
        font-size: 16px;
        animation: pulse 1.4s infinite;
        margin: 0 2px;
      }
      .dot1 { animation-delay: 0s; }
      .dot2 { animation-delay: 0.2s; }  
      .dot3 { animation-delay: 0.4s; }
      @keyframes pulse {
        0%, 60%, 100% { 
          opacity: 0.3; 
          transform: scale(1);
        }
        30% { 
          opacity: 1; 
          transform: scale(1.3);
          font-weight: bold;
        }
      }
    `;
    document.head.appendChild(style);
  }

  msg.append(icon, span);
  wrap.appendChild(msg);
  bodyEl.appendChild(wrap);
  bodyEl.scrollTop = bodyEl.scrollHeight;

  return wrap; // Returnera element för senare borttagning
}

function removeThinkingIndicator(thinkingElement) {
  if (thinkingElement && thinkingElement.parentNode) {
    thinkingElement.parentNode.removeChild(thinkingElement);
  }
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  appendMessage(text, false);
  inputEl.value = '';

  // Visa thinking indicator
  const thinkingId = showThinkingIndicator();

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        chatInput: text,
        chatHistory: [], // n8n Simple Memory hanterar detta
      }),
    });

    const data = await res.json();

    // Ta bort thinking indicator
    removeThinkingIndicator(thinkingId);

    // Kolla speciella actions
    if (data.action === 'OPEN_CONTACT') {
      console.log('Laddar kontaktformulär med AJAX');

      // Ladda contact.html innehåll och ersätt main content
      fetch('contact.html')
        .then((response) => response.text())
        .then((html) => {
          // Hitta main content area och ersätt med kontaktformulär
          const mainContent =
            document.querySelector('main') ||
            document.querySelector('.main-content') ||
            document.querySelector('#main-content');

          if (mainContent) {
            mainContent.innerHTML = html;

            // Kör kontaktformulär-scriptet efter att innehållet laddats
            if (window.initContactForm) {
              window.initContactForm();
            } else {
              // Alternativt, kör script-innehållet direkt
              const scriptRegex = /<script>([\s\S]*?)<\/script>/;
              const scriptMatch = html.match(scriptRegex);
              if (scriptMatch) {
                eval(scriptMatch[1]);
              }
            }
          } else {
            console.error('Kunde inte hitta main content area');
            // Fallback - navigera till sidan
            window.location.href = 'contact.html';
          }
        })
        .catch((err) => {
          console.error('Kunde inte ladda kontaktformulär:', err);
          window.location.href = 'contact.html';
        });
    } else if (data.action === 'SEND_EMAIL') {
      console.log('Email skickad - kommer stänga chatten om 3 sekunder');
      // Ingen extra handling behövs, meddelandet kommer visa tack-meddelandet
      // och chatten stängs automatiskt pga "Andreas hör av sig inom 24h"
    }

    // n8n skickar tillbaka responseText
    let botReply = data.responseText || 'Något gick fel 😕';

    appendMessage(botReply, true);
  } catch (err) {
    console.error('Chat error:', err);
    // Ta bort thinking indicator vid fel också
    removeThinkingIndicator(thinkingId);
    appendMessage('Oj då, något gick fel 😕', true);
  }
}
