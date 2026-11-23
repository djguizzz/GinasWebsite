/* ================= 1. THEME TOGGLE (DARK / LIGHT MODE) ================= */
(function initTheme() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  // Check saved preference in localStorage (defaults to dark)
  const savedTheme = localStorage.getItem('ginas-theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      if (themeIcon) themeIcon.innerHTML = '&#9790;'; // Moon icon
      if (themeLabel) themeLabel.textContent = 'Dark';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      root.removeAttribute('data-theme');
      if (themeIcon) themeIcon.innerHTML = '&#9788;'; // Sun icon
      if (themeLabel) themeLabel.textContent = 'Light';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      localStorage.setItem('ginas-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }
})();

/* ================= 2. MOBILE NAVIGATION MENU ================= */
const nav = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');

if (nav && menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('show');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when any nav link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ================= 3. HOME PAGE HERO CAROUSEL ================= */
if (document.getElementById('dots') && document.getElementById('home')) {
  const slides = document.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('dots');
  const hero = document.getElementById('home');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let current = 0;
  let timer;

  // Build pagination dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot' + (index === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
    dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');

    dot.addEventListener('click', () => {
      goTo(index);
      restart();
    });

    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-current', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-current', 'true');
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goTo(current + 1);
      restart();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goTo(current - 1);
      restart();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') {
      goTo(current + 1);
      restart();
    } else if (event.key === 'ArrowLeft') {
      goTo(current - 1);
      restart();
    }
  });

  // Touch swipe support for mobile
  let startX = 0;
  hero.addEventListener('touchstart', event => {
    startX = event.touches[0].clientX;
  }, { passive: true });

  hero.addEventListener('touchend', event => {
    const difference = event.changedTouches[0].clientX - startX;
    if (Math.abs(difference) > 50) {
      goTo(current + (difference < 0 ? 1 : -1));
      restart();
    }
  });

  // Pause auto-slide on hover
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', restart);

  restart();
}
