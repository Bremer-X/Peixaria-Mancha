/**
 * @file script.js
 * @description Camada principal de interatividade, serviços de conversão (WhatsApp, Google Maps,
 * Analytics GA4/Ads/Meta Pixel), status de funcionamento America/Belem, filtros de cardápio,
 * carrossel de eventos, galeria com Lightbox e Assistente Virtual da Peixaria Mancha.
 */

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================================================
  // 1. SERVIÇO DE ANALYTICS PADRONIZADO (SEM DUPLICIDADE)
  // ==========================================================================
  const lastFiredTimestamps = new Map();
  const DEDUPE_INTERVAL_MS = 1200;

  /**
   * Dispara eventos padronizados:
   * - view_menu
   * - click_whatsapp
   * - click_directions
   * - view_event
   * - click_social
   */
  function trackEvent(eventName, params = {}) {
    const dedupeKey = `${eventName}:${params.cta_location || params.item_name || params.platform || 'default'}`;
    const now = Date.now();
    const lastFired = lastFiredTimestamps.get(dedupeKey) || 0;

    if (now - lastFired < DEDUPE_INTERVAL_MS) return;
    lastFiredTimestamps.set(dedupeKey, now);

    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, {
          ...params,
          send_to: 'G-7WDDRBG9TC'
        });
      }
      if (typeof window.fbq === 'function') {
        // Nunca contabiliza clique como pedido concluído (Purchase)
        window.fbq('trackCustom', eventName, params);
      }
    } catch (e) {
      // Silencioso caso bloqueador de anúncios esteja ativo
    }
  }

  window.PeixariaAnalytics = { trackEvent };

  // ==========================================================================
  // 2. SERVIÇO CENTRALIZADO DE WHATSAPP
  // ==========================================================================
  const WHATSAPP_NUMBER = '5591989379978';
  const WHATSAPP_MESSAGES = {
    cardapio: 'Olá! Gostaria de conhecer o cardápio.',
    pedido: 'Olá! Gostaria de fazer um pedido.',
    eventos: 'Olá! Gostaria de informações sobre os eventos.',
    reserva: 'Olá! Gostaria de reservar uma mesa para minha família.'
  };

  function buildWhatsAppUrl(contextOrMessage = 'pedido', phone = WHATSAPP_NUMBER) {
    const message = WHATSAPP_MESSAGES[contextOrMessage] || contextOrMessage || WHATSAPP_MESSAGES.pedido;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  window.PeixariaWhatsApp = { buildWhatsAppUrl, WHATSAPP_MESSAGES };

  // ==========================================================================
  // 3. STATUS DE FUNCIONAMENTO (FUSO AMERICA/BELEM)
  // ==========================================================================
  const operatingHours = {
    0: { open: 11, close: 20, label: 'Domingo' }, // Domingo
    1: null,                                       // Segunda-feira fechado no salão
    2: { open: 11, close: 20, label: 'Terça' },   // Terça-feira
    3: { open: 11, close: 20, label: 'Quarta' },  // Quarta-feira
    4: { open: 11, close: 20, label: 'Quinta' },  // Quinta-feira
    5: { open: 11, close: 20, label: 'Sexta' },   // Sexta-feira
    6: { open: 11, close: 20, label: 'Sábado' }   // Sábado
  };

  function getBelemTime() {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Belem',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      const parts = formatter.formatToParts(now);
      const weekdayStr = parts.find(p => p.type === 'weekday')?.value || 'Sun';
      const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10) % 24;
      const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
      const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return {
        day: dayMap[weekdayStr] ?? now.getDay(),
        hour,
        minute
      };
    } catch {
      const now = new Date();
      return {
        day: now.getDay(),
        hour: now.getHours(),
        minute: now.getMinutes()
      };
    }
  }

  function evaluateOperatingStatus() {
    const { day, hour, minute } = getBelemTime();
    const schedule = operatingHours[day];
    const currentMinutes = hour * 60 + minute;

    if (!schedule) {
      return {
        isOpen: false,
        stateClass: 'fechado',
        headerText: 'Fechado agora • Abre Terça às 11h',
        shortText: 'Fechado agora'
      };
    }

    const openMinutes = schedule.open * 60;
    const closeMinutes = schedule.close * 60;

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return {
        isOpen: true,
        stateClass: 'aberto',
        headerText: 'Aberto agora • Até 20h',
        shortText: 'Aberto agora'
      };
    }

    if (currentMinutes < openMinutes) {
      return {
        isOpen: false,
        stateClass: 'fechado',
        headerText: `Abre às ${schedule.open}h`,
        shortText: `Abre às ${schedule.open}h`
      };
    }

    const nextOpenText = day === 0 ? 'Fechado agora • Abre Terça às 11h' : 'Fechado agora • Abre às 11h';
    return {
      isOpen: false,
      stateClass: 'fechado',
      headerText: nextOpenText,
      shortText: 'Fechado agora'
    };
  }

  function updateOpenStatusUI() {
    const status = evaluateOperatingStatus();
    const badges = document.querySelectorAll('#open-status-badge, .js-status-badge');
    const texts = document.querySelectorAll('#open-status-text, .js-status-text');

    badges.forEach(badge => {
      badge.classList.remove('aberto', 'fechado', 'especial');
      badge.classList.add(status.stateClass);
    });

    texts.forEach(textEl => {
      const useShort = textEl.getAttribute('data-status-format') === 'short';
      textEl.textContent = useShort ? status.shortText : status.headerText;
    });
  }

  updateOpenStatusUI();
  setInterval(updateOpenStatusUI, 60 * 1000);

  // ==========================================================================
  // 4. HEADER STICKY, MENU MOBILE & BARRA INFERIOR FIXA MOBILE
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const mobileBottomBar = document.getElementById('mobile-bottom-bar');
  const chatWidget = document.getElementById('ai-chat-widget');
  const lightbox = document.getElementById('lightbox-overlay');

  function syncMobileBottomBarVisibility() {
    if (!mobileBottomBar) return;
    const isMenuOpen = mobileMenu && !mobileMenu.classList.contains('hidden');
    const isChatOpen = chatWidget && !chatWidget.classList.contains('opacity-0');
    const isLightboxOpen = lightbox && lightbox.classList.contains('active');

    if (isMenuOpen || isChatOpen || isLightboxOpen) {
      mobileBottomBar.classList.add('is-hidden');
    } else {
      mobileBottomBar.classList.remove('is-hidden');
    }
  }

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 16);
    }, { passive: true });
  }

  function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuBtn) return;
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    const iconOpen = mobileMenuBtn.querySelector('.icon-menu-open');
    const iconClose = mobileMenuBtn.querySelector('.icon-menu-close');
    if (iconOpen && iconClose) {
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
    }
    syncMobileBottomBarVisibility();
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const willOpen = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', String(willOpen));

      const iconOpen = mobileMenuBtn.querySelector('.icon-menu-open');
      const iconClose = mobileMenuBtn.querySelector('.icon-menu-close');
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle('hidden', willOpen);
        iconClose.classList.toggle('hidden', !willOpen);
      }
      syncMobileBottomBarVisibility();
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  // ==========================================================================
  // 5. FILTROS INTERATIVOS DO CARDÁPIO E BUSCA DE PRATOS
  // ==========================================================================
  const menuFilterButtons = document.querySelectorAll('[data-menu-filter]');
  const menuCategoryPanels = document.querySelectorAll('[data-menu-category-panel]');
  const menuSearchInput = document.getElementById('cardapio-search-input');
  const menuEmptyState = document.getElementById('cardapio-empty-state');
  const menuResetBtn = document.getElementById('cardapio-reset-btn');

  let activeMenuCategory = 'todos';
  let currentMenuSearch = '';

  function filterMenuItems() {
    let totalVisibleItems = 0;
    const term = currentMenuSearch.trim().toLowerCase();

    menuCategoryPanels.forEach(panel => {
      const panelCategory = panel.getAttribute('data-menu-category-panel');
      const matchesCategoryTab = activeMenuCategory === 'todos' || activeMenuCategory === panelCategory;

      if (!matchesCategoryTab) {
        panel.classList.add('hidden');
        return;
      }

      const items = panel.querySelectorAll('[data-menu-item]');
      let visibleInPanel = 0;

      items.forEach(item => {
        const searchContent = (item.getAttribute('data-menu-search') || item.textContent || '').toLowerCase();
        const matchesSearch = !term || searchContent.includes(term);
        item.classList.toggle('hidden', !matchesSearch);
        if (matchesSearch) {
          visibleInPanel++;
          totalVisibleItems++;
        }
      });

      panel.classList.toggle('hidden', visibleInPanel === 0);
    });

    if (menuEmptyState) {
      menuEmptyState.classList.toggle('hidden', totalVisibleItems > 0);
    }
  }

  menuFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-menu-filter') || 'todos';
      activeMenuCategory = filter;

      menuFilterButtons.forEach(b => {
        const isActive = b.getAttribute('data-menu-filter') === filter;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });

      trackEvent('view_menu', { category: filter, cta_location: 'menu_tabs' });
      filterMenuItems();
    });
  });

  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      currentMenuSearch = e.target.value || '';
      filterMenuItems();
    });
  }

  if (menuResetBtn) {
    menuResetBtn.addEventListener('click', () => {
      activeMenuCategory = 'todos';
      currentMenuSearch = '';
      if (menuSearchInput) menuSearchInput.value = '';
      menuFilterButtons.forEach(b => {
        const isActive = b.getAttribute('data-menu-filter') === 'todos';
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });
      filterMenuItems();
    });
  }

  // ==========================================================================
  // 6. CARROSSEL DE EVENTOS
  // ==========================================================================
  const sliderTrack = document.getElementById('eventos-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');

  if (sliderTrack) {
    const cards = Array.from(sliderTrack.querySelectorAll('.evento-card'));
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getVisibleCount());
    }

    function getCardWidth() {
      if (!cards[0]) return 0;
      const gap = 24;
      return cards[0].offsetWidth + gap;
    }

    function goTo(index, userTriggered = false) {
      const max = getMaxIndex();
      currentIndex = Math.max(0, Math.min(index, max));
      sliderTrack.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
      updateDots();
      updateArrows();

      if (userTriggered && cards[currentIndex]) {
        const eventTitle = cards[currentIndex].getAttribute('data-event-title') || `Evento ${currentIndex + 1}`;
        trackEvent('view_event', { item_name: eventTitle, cta_location: 'eventos_slider' });
      }
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const total = getMaxIndex() + 1;
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Visualizar programação ${i + 1}`);
        dot.addEventListener('click', () => goTo(i, true));
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

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1, true));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1, true));

    // Suporte a arraste e toque
    sliderTrack.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.clientX;
      currentX = e.clientX;
      sliderTrack.classList.add('is-dragging');
    });
    sliderTrack.addEventListener('mousemove', e => {
      if (!isDragging) return;
      currentX = e.clientX;
    });
    sliderTrack.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      sliderTrack.classList.remove('is-dragging');
      const diff = startX - currentX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(currentIndex + 1, true) : goTo(currentIndex - 1, true);
      }
    });
    sliderTrack.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        sliderTrack.classList.remove('is-dragging');
      }
    });

    sliderTrack.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      currentX = startX;
    }, { passive: true });
    sliderTrack.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(currentIndex + 1, true) : goTo(currentIndex - 1, true);
      }
    });

    window.addEventListener('resize', () => {
      buildDots();
      goTo(currentIndex, false);
    });

    buildDots();
    goTo(0, false);
  }

  // ==========================================================================
  // 7. GALERIA COM FILTRO DE CATEGORIAS E LIGHTBOX ACESSÍVEL
  // ==========================================================================
  const galleryFilterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = Array.from(document.querySelectorAll('.galeria-item'));
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCap = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentLightboxIndex = 0;

  function getVisibleGalleryItems() {
    return galleryItems.filter(item => !item.classList.contains('hidden'));
  }

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-gallery-filter') || 'todos';
      galleryFilterBtns.forEach(b => {
        const isActive = b.getAttribute('data-gallery-filter') === filter;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-gallery-category') || 'todos';
        const show = filter === 'todos' || itemCat === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  function openLightboxAtIndex(index) {
    const visibleItems = getVisibleGalleryItems();
    if (!visibleItems.length) return;
    currentLightboxIndex = (index + visibleItems.length) % visibleItems.length;
    const targetItem = visibleItems[currentLightboxIndex];
    const img = targetItem.querySelector('img');
    if (!img) return;

    if (lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Fotografia Peixaria Mancha';
    }
    if (lightboxCap) {
      lightboxCap.textContent = targetItem.getAttribute('data-caption') || img.alt || '';
    }
    if (lightbox) {
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
    syncMobileBottomBarVisibility();
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    syncMobileBottomBarVisibility();
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const visibleItems = getVisibleGalleryItems();
      const idx = visibleItems.indexOf(item);
      openLightboxAtIndex(idx >= 0 ? idx : 0);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const visibleItems = getVisibleGalleryItems();
        const idx = visibleItems.indexOf(item);
        openLightboxAtIndex(idx >= 0 ? idx : 0);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); openLightboxAtIndex(currentLightboxIndex - 1); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); openLightboxAtIndex(currentLightboxIndex + 1); });

  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMobileMenu();
    } else if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'ArrowRight') openLightboxAtIndex(currentLightboxIndex + 1);
      if (e.key === 'ArrowLeft') openLightboxAtIndex(currentLightboxIndex - 1);
    }
  });

  // ==========================================================================
  // 8. DELEGAÇÃO DE EVENTOS DE ANALYTICS (CONVERSÃO PADRONIZADA)
  // ==========================================================================
  document.addEventListener('click', (e) => {
    const linkOrBtn = e.target.closest('a, button');
    if (!linkOrBtn) return;

    const explicitTrack = linkOrBtn.getAttribute('data-track');
    const context = linkOrBtn.getAttribute('data-track-context') || linkOrBtn.textContent.trim().slice(0, 40);
    const href = linkOrBtn.getAttribute('href') || '';

    if (explicitTrack) {
      trackEvent(explicitTrack, { cta_location: context });
      return;
    }

    if (href.includes('wa.me')) {
      trackEvent('click_whatsapp', { cta_location: context });
    } else if (href.includes('maps.app.goo.gl') || href.includes('google.com/maps') || href.includes('waze.com')) {
      trackEvent('click_directions', { cta_location: context });
    } else if (href.includes('instagram.com') || href.includes('facebook.com')) {
      trackEvent('click_social', { platform: href.includes('instagram') ? 'instagram' : 'facebook', cta_location: context });
    } else if (href.includes('cardapio') || href === '#cardapio' || href === '#cardapio-restaurante') {
      trackEvent('view_menu', { cta_location: context });
    } else if (href === '#eventos') {
      trackEvent('view_event', { cta_location: context });
    }
  });

  // ==========================================================================
  // 9. ANIMAÇÕES DE REVELAÇÃO SUAVES E ANO DINÂMICO
  // ==========================================================================
  const observerOptions = { threshold: 0.08, rootMargin: "0px 0px -40px 0px" };
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

  // Rastrear visualização das seções de Cardápio e Eventos quando entram na viewport
  const sectionTracker = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.id === 'cardapio') {
          trackEvent('view_menu', { cta_location: 'scroll_section_cardapio' });
        } else if (entry.target.id === 'eventos') {
          trackEvent('view_event', { cta_location: 'scroll_section_eventos' });
        }
        sectionTracker.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  const cardapioSection = document.getElementById('cardapio');
  const eventosSection = document.getElementById('eventos');
  if (cardapioSection) sectionTracker.observe(cardapioSection);
  if (eventosSection) sectionTracker.observe(eventosSection);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==========================================================================
  // 10. ASSISTENTE VIRTUAL IA (N8N WEBHOOK PRESERVADO)
  // ==========================================================================
  const toggleChatBtn = document.getElementById('toggle-chat-btn');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendChatBtn = document.getElementById('send-chat-btn');

  if (toggleChatBtn && chatWidget) {
    let chatHistory = [];
    const chatWebhookUrl = "https://n8n.vps7767.panel.icontainer.cloud/webhook/peixaria-mancha/chat";

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
      syncMobileBottomBarVisibility();
    }

    toggleChatBtn.addEventListener('click', toggleChat);
    if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);

    function sanitizeHTML(str) {
      const temp = document.createElement('div');
      temp.textContent = str;
      return temp.innerHTML;
    }

    function addMessageUI(text, isUser = false) {
      if (!chatMessages) return;
      const wrapper = document.createElement('div');
      wrapper.className = `max-w-[85%] p-3 text-sm leading-relaxed shadow-sm ${
        isUser
          ? 'self-end bg-[#F15A24] text-white rounded-2xl rounded-tr-sm'
          : 'self-start bg-white/10 border border-white/10 text-[#F8F6F0] rounded-2xl rounded-tl-sm backdrop-blur-md'
      }`;
      const formatted = sanitizeHTML(text).replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formatted;
      wrapper.appendChild(tempDiv);
      chatMessages.appendChild(wrapper);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return wrapper;
    }

    function showLoaderUI() {
      if (!chatMessages) return;
      const wrapper = document.createElement('div');
      wrapper.id = "chat-loader";
      wrapper.className = "self-start max-w-[85%] bg-white/10 border border-white/10 p-3 rounded-2xl rounded-tl-sm backdrop-blur-md shadow-sm";
      wrapper.innerHTML = `<div class="flex gap-1.5 items-center h-4 px-2"><div class="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"></div><div class="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style="animation-delay: 0.15s"></div><div class="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style="animation-delay: 0.3s"></div></div>`;
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

    let messageTimestamps = [];
    const MAX_MESSAGES_PER_MINUTE = 10;

    function checkRateLimit() {
      const now = Date.now();
      messageTimestamps = messageTimestamps.filter(t => now - t < 60000);
      if (messageTimestamps.length >= MAX_MESSAGES_PER_MINUTE) return false;
      messageTimestamps.push(now);
      return true;
    }

    async function handleSend() {
      if (!chatInput || !sendChatBtn) return;
      const rawText = chatInput.value.trim();
      if (!rawText) return;

      if (!checkRateLimit()) {
        addMessageUI("Aguarde um momento antes de enviar outra mensagem.", false);
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
        const response = await fetch(chatWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
          if (response.status === 401 || response.status === 403) {
            throw new Error("A função de chat recusou a requisição (autorização).");
          }
          if (response.status >= 500) {
            throw new Error("A função de chat está indisponível no momento.");
          }
          throw new Error(data.error || "Falha na comunicação com o assistente.");
        }

        const botReply = data.reply || data.message || "";
        if (!botReply) throw new Error("A API respondeu sem texto de resposta.");

        chatHistory.push({ role: "assistant", content: botReply });
        addMessageUI(botReply, false);
      } catch (error) {
        hideLoaderUI();
        if (error && error.name === "AbortError") {
          addMessageUI("A assistente demorou para responder. Tente novamente ou chame no WhatsApp (91) 98937-9978.", false);
        } else {
          addMessageUI("Nossa assistente virtual está indisponível no momento. Fale conosco pelo WhatsApp: (91) 98937-9978.", false);
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
