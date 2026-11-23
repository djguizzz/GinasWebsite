/* ================= 1. THEME TOGGLE (LIGHT / DARK EDITORIAL MODE) ================= */
(function initTheme() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  // Default to crisp Editorial Light mode unless user chose Dark
  const savedTheme = localStorage.getItem('ginas-editorial-theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.innerHTML = '&#9788;'; // Sun icon
      if (themeLabel) themeLabel.textContent = 'Light';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      root.removeAttribute('data-theme');
      if (themeIcon) themeIcon.innerHTML = '&#9790;'; // Moon icon
      if (themeLabel) themeLabel.textContent = 'Dark';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('ginas-editorial-theme', nextTheme);
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

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ================= 3. EDITORIAL LOOKBOOK PLATE SWITCHER ================= */
const plateImage = document.getElementById('plateImage');
if (plateImage) {
  const plates = [
    {
      num: 'PLATE 01 / 04',
      category: 'FAMILY PORTRAITURE',
      src: 'Images/example1-hd-upscale.jpg',
      alt: 'Family portrait captured by Gina’s Photo & Video Services',
      caption: 'Generational portraits captured in natural light and timeless studio compositions.'
    },
    {
      num: 'PLATE 02 / 04',
      category: 'STUDIO & ON-LOCATION',
      src: 'Images/example2-hd-upscale.jpg',
      alt: 'Studio and on-location portrait session',
      caption: 'Tailored sessions for individuals, couples, and families of every size.'
    },
    {
      num: 'PLATE 03 / 04',
      category: 'ACADEMIC MILESTONES',
      src: 'Images/example3-hd-upscale.jpg',
      alt: 'School photos and graduation portraits',
      caption: 'Class pictures, official IDs, and graduation portraits delivered on time.'
    },
    {
      num: 'PLATE 04 / 04',
      category: 'EVENTS & CINEMA',
      src: 'Images/example4-hd-upscale.jpg',
      alt: 'Wedding and celebration videography',
      caption: 'Weddings, debuts, and celebrations filmed and edited to relive every chapter.'
    }
  ];

  let currentPlate = 0;
  const plateNumber = document.getElementById('plateNumber');
  const plateCategory = document.getElementById('plateCategory');
  const plateCaption = document.getElementById('plateCaption');
  const prevPlate = document.getElementById('prevPlate');
  const nextPlate = document.getElementById('nextPlate');

  function renderPlate(index) {
    currentPlate = (index + plates.length) % plates.length;
    const item = plates[currentPlate];

    plateImage.style.opacity = '0.2';
    setTimeout(() => {
      plateImage.src = item.src;
      plateImage.alt = item.alt;
      if (plateNumber) plateNumber.textContent = item.num;
      if (plateCategory) plateCategory.textContent = item.category;
      if (plateCaption) plateCaption.textContent = item.caption;
      plateImage.style.opacity = '1';
    }, 150);
  }

  if (prevPlate) prevPlate.addEventListener('click', () => renderPlate(currentPlate - 1));
  if (nextPlate) nextPlate.addEventListener('click', () => renderPlate(currentPlate + 1));

  // Clicking any Contact Sheet card loads that photo into the top Lookbook Plate & scrolls up
  document.querySelectorAll('.sheet-card[data-plate]').forEach(card => {
    card.addEventListener('click', () => {
      const idx = Number(card.getAttribute('data-plate'));
      renderPlate(idx);
      document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    });
  });
}
