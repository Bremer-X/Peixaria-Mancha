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

  // ── "Aberto Agora" Badge ────────────────────────────────────────────
  // Funcionamento: Ter(2)–Dom(0) · 11h às 15h30
  function updateOpenStatus() {
    const badge = document.getElementById('open-status-badge');
    const text  = document.getElementById('open-status-text');
    if (!badge || !text) return;

    let day;
    let hour;
    let min;

    try {
      const dateParts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Belem',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).formatToParts(new Date()).reduce((acc, part) => {
        if (part.type !== 'literal') acc[part.type] = part.value;
        return acc;
      }, {});

      const year = Number(dateParts.year);
      const month = Number(dateParts.month);
      const dayOfMonth = Number(dateParts.day);
      hour = Number(dateParts.hour);
      min = Number(dateParts.minute);
      // Descobre o dia da semana para Belém com base na data local da cidade.
      day = new Date(Date.UTC(year, month - 1, dayOfMonth)).getUTCDay();
    } catch {
      const now = new Date();
      day = now.getDay();
      hour = now.getHours();
      min = now.getMinutes();
    }

    const timeDecimal = hour + min / 60;

    const openDays  = [0, 2, 3, 4, 5, 6]; // Dom, Ter, Qua, Qui, Sex, Sab
    const isOpenDay  = openDays.includes(day);
    const isOpenTime = timeDecimal >= 11 && timeDecimal < 15.5; // 11h às 15:30
    const isOpen     = isOpenDay && isOpenTime;

    badge.className = 'isOpen' + (isOpen ? ' aberto' : ' fechado');
    text.textContent = isOpen ? 'Aberto agora' : 'Fechado agora';
  }
  updateOpenStatus();
  // Atualiza a cada minuto
  setInterval(updateOpenStatus, 60000);


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
    lightboxImg.src = src;
    if (lightboxCap) lightboxCap.textContent = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
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

});
