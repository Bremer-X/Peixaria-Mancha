document.addEventListener("DOMContentLoaded", () => {

  // ── Mobile Menu Toggle ─────────────────────────────────────────────
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu    = document.getElementById('mobile-menu');
  const mobileLinks   = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // ── Scroll Reveal Animations ────────────────────────────────────────
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });

  // ── Dynamic Year ────────────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar shadow on scroll ─────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('shadow-md', window.scrollY > 20);
    });
  }

  // ── Carrossel de Eventos ────────────────────────────────────────────
  const sliderTrack  = document.getElementById('eventos-track');
  const prevBtn      = document.getElementById('slider-prev');
  const nextBtn      = document.getElementById('slider-next');
  const dotsContainer= document.getElementById('slider-dots');

  if (sliderTrack) {

    const cards        = Array.from(sliderTrack.querySelectorAll('.evento-card'));
    let currentIndex   = 0;
    let autoplayTimer  = null;
    let isDragging     = false;
    let startX         = 0;
    let currentX       = 0;

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768)  return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getVisibleCount());
    }

    function getCardWidth() {
      if (!cards[0]) return 0;
      const gap = window.innerWidth >= 768 ? 24 : 0;
      return cards[0].offsetWidth + gap;
    }

    function goTo(index) {
      const max = getMaxIndex();
      currentIndex = Math.max(0, Math.min(index, max));
      sliderTrack.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
      updateDots();
      updateArrows();
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const total = getMaxIndex() + 1;
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Evento ${i + 1}`);
        dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function updateArrows() {
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= getMaxIndex();
    }

    function startAutoplay() {
      autoplayTimer = setInterval(() => {
        const nextIdx = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
        goTo(nextIdx);
      }, 4500);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAutoplay(); });

    // Touch / drag
    sliderTrack.addEventListener('mousedown',  e => {
      isDragging = true;
      startX = e.clientX;
      currentX = e.clientX;
      sliderTrack.classList.add('is-dragging');
    });
    sliderTrack.addEventListener('mousemove',  e => { if (!isDragging) return; currentX = e.clientX; });
    sliderTrack.addEventListener('mouseup',    () => {
      if (!isDragging) return;
      isDragging = false;
      sliderTrack.classList.remove('is-dragging');
      const diff = startX - currentX;
      if (Math.abs(diff) > 50) { diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1); resetAutoplay(); }
    });
    sliderTrack.addEventListener('mouseleave', () => {
      if (isDragging) { isDragging = false; sliderTrack.classList.remove('is-dragging'); }
    });

    sliderTrack.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      currentX = startX;
    }, { passive: true });
    sliderTrack.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1); resetAutoplay(); }
    });

    window.addEventListener('resize', () => { buildDots(); goTo(currentIndex); });

    buildDots();
    goTo(0);
    startAutoplay();
  }


  // ── Lightbox da Galeria ─────────────────────────────────────────────
  const lightbox    = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCap = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, alt) {
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCap) lightboxCap.textContent = alt || '';
    if (lightbox) lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.galeria-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox)      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });


  // ── Chatbot Assistente Peixaria Mancha (Supabase Edge Function) ──
  const toggleChatBtn = document.getElementById('toggle-chat-btn');
  const chatWidget = document.getElementById('ai-chat-widget');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendChatBtn = document.getElementById('send-chat-btn');

  if (toggleChatBtn && chatWidget) {
    let chatHistory = [];
    const _supabaseUrl = "https://kgyhrapfhfkwgejquyjx.supabase.co/functions/v1/chat-handler";

    // Toggle UI
    function toggleChat() {
      const isClosed = chatWidget.classList.contains('opacity-0');
      if (isClosed) {
        chatWidget.classList.remove('opacity-0', 'pointer-events-none', 'scale-95', 'translate-y-8');
        chatWidget.classList.add('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');
        if (chatInput) chatInput.focus();
      } else {
        chatWidget.classList.add('opacity-0', 'pointer-events-none', 'scale-95', 'translate-y-8');
        chatWidget.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');
      }
    }

    toggleChatBtn.addEventListener('click', toggleChat);
    if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);

    // Formatar Respostas
    function addMessageUI(text, isUser = false) {
      if (!chatMessages) return;
      const wrapper = document.createElement('div');
      wrapper.className = `max-w-[85%] p-3 text-sm leading-relaxed shadow-sm ${isUser ? 'self-end bg-tertiary text-white rounded-2xl rounded-tr-sm' : 'self-start bg-white/10 border border-white/5 text-white/90 rounded-2xl rounded-tl-sm backdrop-blur-md'}`;
      const formatted = sanitizeHTML(text).replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formatted;
      wrapper.appendChild(tempDiv);
      chatMessages.appendChild(wrapper);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return wrapper;
    }

    function sanitizeHTML(str) {
      const temp = document.createElement('div');
      temp.textContent = str;
      return temp.innerHTML;
    }

    function showLoaderUI() {
      if (!chatMessages) return;
      const wrapper = document.createElement('div');
      wrapper.id = "chat-loader";
      wrapper.className = "self-start max-w-[85%] bg-white/10 border border-white/5 p-3 rounded-2xl rounded-tl-sm backdrop-blur-md shadow-sm";
      wrapper.innerHTML = `<div class="flex gap-1.5 items-center h-4 px-2"><div class="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"></div><div class="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style="animation-delay: 0.15s"></div><div class="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style="animation-delay: 0.3s"></div></div>`;
      chatMessages.appendChild(wrapper);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideLoaderUI() {
      const loader = document.getElementById('chat-loader');
      if (loader) loader.remove();
    }

    function sanitizeInput(str) {
      return str.replace(/<[^>]*>/g, '').replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
      });
    }

    // Rate limiting: max 10 messages per minute
    let messageTimestamps = [];
    const MAX_MESSAGES_PER_MINUTE = 10;

    function checkRateLimit() {
      const now = Date.now();
      messageTimestamps = messageTimestamps.filter(t => now - t < 60000);
      if (messageTimestamps.length >= MAX_MESSAGES_PER_MINUTE) {
        return false;
      }
      messageTimestamps.push(now);
      return true;
    }

    // Chamada Segura para Supabase Edge Function
    async function handleSend() {
      if (!chatInput || !sendChatBtn) return;
      const rawText = chatInput.value.trim();
      if (!rawText) return;

      if (!checkRateLimit()) {
        addMessageUI("⚠️ Aguarde um momento antes de enviar outra mensagem.", false);
        return;
      }

      const text = sanitizeInput(rawText);

      chatInput.value = '';
      sendChatBtn.disabled = true;
      chatInput.disabled = true;

      addMessageUI(rawText, true);
      showLoaderUI();

      chatHistory.push({ role: "user", content: text });

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const response = await fetch(_supabaseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          signal: controller.signal,
          body: JSON.stringify({
            history: chatHistory.slice(0, -1),
            userMessage: text
          })
        });
        clearTimeout(timeoutId);

        hideLoaderUI();
        const rawResponse = await response.text();
        let data = {};
        try {
          data = rawResponse ? JSON.parse(rawResponse) : {};
        } catch {
          data = { raw: rawResponse };
        }

        if (!response.ok) {
          console.error("Erro da Inteligência Artificial:", {
            status: response.status,
            statusText: response.statusText,
            data
          });

          if (response.status === 401 || response.status === 403) {
            throw new Error("A função de chat recusou a requisição (autorização).");
          }

          if (response.status >= 500) {
            throw new Error("A função de chat está indisponível no momento.");
          }

          throw new Error(data.error || "Falha na comunicação com o assistente.");
        }

        const botReply = data.reply;
        chatHistory.push({ role: "assistant", content: botReply });
        addMessageUI(botReply, false);

      } catch (error) {
        hideLoaderUI();
        console.error("Supabase Func Fetch Error:", error);
        if (error && error.name === "AbortError") {
          addMessageUI("⚠️ A assistente demorou para responder. Tente novamente em alguns segundos.", false);
        } else if (error && error.message && error.message.includes("autorização")) {
          addMessageUI("⚠️ Assistente indisponível por configuração de acesso da API.", false);
        } else {
          addMessageUI("⚠️ Nossa assistente está sobrecarregada no momento. Tente novamente mais tarde.", false);
        }
      } finally {
        sendChatBtn.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();
      }
    }

    if (sendChatBtn) sendChatBtn.addEventListener('click', handleSend);
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }
  }

});
