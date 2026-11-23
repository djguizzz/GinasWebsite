document.addEventListener('DOMContentLoaded', () => {
  /* ================= 1. THEME TOGGLE (LIGHT / DARK EDITORIAL MODE) ================= */
  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      body.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.innerHTML = '&#9788;';
      if (themeLabel) themeLabel.textContent = 'Light';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      root.removeAttribute('data-theme');
      body.removeAttribute('data-theme');
      if (themeIcon) themeIcon.innerHTML = '&#9790;';
      if (themeLabel) themeLabel.textContent = 'Dark';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  const savedTheme = localStorage.getItem('ginas-editorial-theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isDark = root.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('ginas-editorial-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

  /* ================= 2. MOBILE NAVIGATION MENU ================= */
  const nav = document.getElementById('mainNav');
  const menuToggle = document.getElementById('menuToggle');

  if (nav && menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = nav.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ================= 3. EDITORIAL LOOKBOOK AUTO-SLIDESHOW (2.5s) ================= */
  const plateImage = document.getElementById('plateImage');
  const plateFrame = document.getElementById('plateFrame');

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
    let slideTimer = null;

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

    function startAutoSlide() {
      stopAutoSlide();
      slideTimer = setInterval(() => {
        renderPlate(currentPlate + 1);
      }, 2500);
    }

    function stopAutoSlide() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    if (prevPlate) {
      prevPlate.addEventListener('click', () => {
        renderPlate(currentPlate - 1);
        startAutoSlide();
      });
    }

    if (nextPlate) {
      nextPlate.addEventListener('click', () => {
        renderPlate(currentPlate + 1);
        startAutoSlide();
      });
    }

    // Pause slideshow while hovering over the photo frame
    if (plateFrame) {
      plateFrame.addEventListener('mouseenter', stopAutoSlide);
      plateFrame.addEventListener('mouseleave', startAutoSlide);
    }

    // Contact sheet cards load the selected photo into the top Lookbook Plate
    document.querySelectorAll('.sheet-card[data-plate]').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = Number(card.getAttribute('data-plate'));
        renderPlate(idx);
        startAutoSlide();
        const homeSection = document.getElementById('home');
        if (homeSection) {
          homeSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Kick off automatic 2.5s slideshow
    startAutoSlide();
  }

  /* ================= 4. ABOUT PAGE INTERACTIONS ================= */
  if (document.body.classList.contains('about-page')) {
    // 4a. Staggered hero entrance
    document.querySelectorAll('.hero-item').forEach((item) => {
      const order = Number(item.style.getPropertyValue('--i')) || 0;
      item.style.opacity = '0';
      item.style.transform = 'translateY(18px)';
      item.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      item.style.transitionDelay = (0.1 + order * 0.12) + 's';

      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          item.style.opacity = '1';
          item.style.transform = 'none';
        })
      );
    });

    // 4b. Scroll reveal for sections
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'none';
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      reveals.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
        revealObserver.observe(el);
      });
    }

    // 4c. Dynamic years counter (since 1989)
    const years = new Date().getFullYear() - 1989;
    const yearsCount = document.getElementById('yearsCount');
    const factYears = document.getElementById('factYears');
    if (yearsCount) yearsCount.textContent = years;

    if (factYears && 'IntersectionObserver' in window) {
      const counter = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          counter.disconnect();
          let n = 0;
          const step = setInterval(() => {
            n++;
            factYears.textContent = n + '+';
            if (n >= years) clearInterval(step);
          }, 35);
        },
        { threshold: 0.5 }
      );
      counter.observe(factYears);
    }

    // 4d. Interactive Tabs ("Our Clients" / "Events We Cover")
    const tabs = Array.from(document.querySelectorAll('.about-tab'));
    const panels = document.querySelectorAll('.about-tabpanel');

    function showTab(tab) {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.tabIndex = -1;
      });
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.tabIndex = 0;

      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.about-tiles li').forEach((tile, i) => {
          tile.style.opacity = '0';
          tile.style.transform = 'translateY(10px)';
          tile.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          tile.style.transitionDelay = i * 0.05 + 's';
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              tile.style.opacity = '1';
              tile.style.transform = 'none';
            })
          );
        });
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => showTab(tab));
      tab.addEventListener('keydown', (event) => {
        let next = null;
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (next) {
          showTab(next);
          next.focus();
        }
      });
    });

    // 4e. Subtle sideways watermark motion
    const watermark = document.getElementById('serveWatermark');
    const serveSection = document.getElementById('who-we-serve');
    if (watermark && serveSection) {
      window.addEventListener(
        'scroll',
        () => {
          const box = serveSection.getBoundingClientRect();
          if (box.top < window.innerHeight && box.bottom > 0) {
            watermark.style.transform = 'translateX(' + box.top * 0.14 + 'px)';
          }
        },
        { passive: true }
      );
    }

    // 4f. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ================= 5. SERVICES PAGE FILTER & SMOOTH SCROLL ================= */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (filterBtns.length && serviceCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selected = btn.getAttribute('data-filter');
        serviceCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (selected === 'all' || category === selected) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });

    // Smooth scroll for anchor links on Services page
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
});
