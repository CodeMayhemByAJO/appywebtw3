// chat.js

const API_URL = 'https://appybackend-production.up.railway.app/chat';

const toggle = document.getElementById('chat-toggle');
const windowEl = document.getElementById('chat-window');
const bodyEl = document.getElementById('chat-body');
const inputEl = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Öppna/stäng chatfönstret
toggle.addEventListener('click', () => {
  const isOpen = windowEl.classList.toggle('scale-y-100');
  windowEl.classList.toggle('scale-y-0', !isOpen);
  if (isOpen) inputEl.focus();
});

// Skicka med Enter
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

function appendMessage(text, isBot = false) {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.className = isBot
    ? 'italic text-gray-300 mb-2'
    : 'text-right text-gray-100 mb-2';
  bodyEl.appendChild(msg);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
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
    // Ta bort loading‐meddelandet
    const last = bodyEl.lastChild;
    if (last.textContent === '… skickar…') bodyEl.removeChild(last);
    appendMessage(reply, true);
  } catch (err) {
    const last = bodyEl.lastChild;
    if (last && last.textContent === '… skickar…') bodyEl.removeChild(last);
    appendMessage('Oj då, något blev fel 😕', true);
    console.error('Chat-error:', err);
  }
}

sendBtn.addEventListener('click', sendMessage);
