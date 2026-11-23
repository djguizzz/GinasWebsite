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

    if (plateFrame) {
      plateFrame.addEventListener('mouseenter', stopAutoSlide);
      plateFrame.addEventListener('mouseleave', startAutoSlide);
    }

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

    startAutoSlide();
  }

  /* ================= 4. ABOUT PAGE INTERACTIONS ================= */
  if (document.body.classList.contains('about-page')) {
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

  /* ================= 5. SERVICES PAGE: FILTER, SORT & DETAIL MODAL ================= */
  const serviceGrid = document.getElementById('serviceGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceSort = document.getElementById('serviceSort');
  const serviceModal = document.getElementById('serviceModal');

  if (serviceGrid) {
    const cards = Array.from(serviceGrid.querySelectorAll('.service-card'));

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selected = btn.getAttribute('data-filter');
        cards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (selected === 'all' || category === selected) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });

    if (serviceSort) {
      serviceSort.addEventListener('change', () => {
        const mode = serviceSort.value;
        const sorted = [...cards].sort((a, b) => {
          if (mode === 'az') {
            return a.querySelector('h3').textContent.trim().localeCompare(b.querySelector('h3').textContent.trim());
          }
          if (mode === 'za') {
            return b.querySelector('h3').textContent.trim().localeCompare(a.querySelector('h3').textContent.trim());
          }
          return Number(a.getAttribute('data-index')) - Number(b.getAttribute('data-index'));
        });

        sorted.forEach((card) => serviceGrid.appendChild(card));
      });
    }

    const serviceDetails = {
      'event-coverage': {
        num: 'SERVICE 01 • EVENTS',
        title: 'Event Photography & Videography',
        desc: 'Complete photo and video coverage for reunions, anniversaries, corporate gatherings, and community events across Iloilo City. We capture both key program highlights and natural candid moments.',
        samples: [
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80',
          'Images/example4-hd-upscale.jpg'
        ]
      },
      'wedding-coverage': {
        num: 'SERVICE 02 • WEDDINGS',
        title: 'Wedding Coverage',
        desc: 'Full-day wedding photography and cinematic highlight films—from pre-ceremony preparations and church vows to reception portraits and family group photos.',
        samples: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=500&q=80',
          'Images/example1-hd-upscale.jpg'
        ]
      },
      'birthday-debut': {
        num: 'SERVICE 03 • CELEBRATIONS',
        title: 'Birthday & Debut Coverage',
        desc: 'Vibrant coverage for 18th debuts, kids’ parties, and milestone birthdays—including pre-debut portrait sessions, program highlights, and edited keepsake albums.',
        samples: [
          'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=500&q=80',
          'Images/example2-hd-upscale.jpg'
        ]
      },
      'graduation-photo': {
        num: 'SERVICE 04 • ACADEMIC MILESTONES',
        title: 'Graduation Photography',
        desc: 'Studio toga portraits, creative graduation shoots, and family milestone photos—delivered with crisp lighting, retouching, and framing options.',
        samples: [
          'Images/example3-hd-upscale.jpg',
          'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=500&q=80'
        ]
      },
      'portrait-studio': {
        num: 'SERVICE 05 • STUDIO & ON-SITE',
        title: 'Portrait & Studio Photography',
        desc: 'Comfortable indoor studio sessions in La Paz or on-location shoots for solo portraits, couples, maternity, and extended family reunions.',
        samples: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
          'Images/example1-hd-upscale.jpg',
          'Images/example2-hd-upscale.jpg'
        ]
      },
      'photo-video-editing': {
        num: 'SERVICE 06 • POST-PRODUCTION',
        title: 'Photo & Video Editing',
        desc: 'Color grading, skin retouching, old photo restoration, and same-day or post-event video highlight editing tailored to your footage.',
        samples: [
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&q=80'
        ]
      },
      'photo-printing': {
        num: 'SERVICE 07 • ARCHIVAL PRINTS',
        title: 'Photo Printing',
        desc: 'High-resolution prints in wallet, 3R, 4R, 5R, 8R, and large wall-frame sizes printed on durable, fade-resistant photo paper.',
        samples: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=500&q=80'
        ]
      },
      'id-pictures': {
        num: 'SERVICE 08 • EXPRESS STUDIO',
        title: 'ID Pictures',
        desc: 'Fast, compliant 1x1, 2x2, passport, PRC, civil service, and school/company ID photos with neat formal attire overlays if needed.',
        samples: [
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80'
        ]
      },
      'funeral-photography': {
        num: 'SERVICE 09 • MEMORIAL DOCUMENTATION',
        title: 'Funeral Photography',
        desc: 'Discreet, respectful photography and memorial tribute documentation to honor and preserve memories with loved ones.',
        samples: [
          'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80'
        ]
      },
      'copying-printing': {
        num: 'SERVICE 10 • EVERYDAY ESSENTIALS',
        title: 'Photo Copying & Printing',
        desc: 'Walk-in document photocopying, scanning, and everyday photo/document printing services at our Brgy. Rizal, La Paz studio.',
        samples: [
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&q=80'
        ]
      }
    };

    const modalNumber = document.getElementById('modalNumber');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalSamples = document.getElementById('modalSamples');
    const modalGmailLink = document.getElementById('modalGmailLink');
    const closeModalBtn = document.getElementById('closeServiceModal');
    const modalBackdrop = document.getElementById('modalBackdrop');

    function openServiceModal(key) {
      const data = serviceDetails[key];
      if (!data || !serviceModal) return;

      if (modalNumber) modalNumber.textContent = data.num;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalDescription) modalDescription.textContent = data.desc;

      if (modalSamples) {
        modalSamples.innerHTML = data.samples
          .map((src, i) => `<img src="${src}" alt="${data.title} sample ${i + 1}" loading="lazy">`)
          .join('');
      }

      if (modalGmailLink) {
        const subject = encodeURIComponent(`Service Inquiry: ${data.title}`);
        const body = encodeURIComponent(`Hello Gina's Photo & Video Services,\n\nI would like to inquire about your ${data.title} rates and availability.\n\nThank you!`);
        modalGmailLink.href = `mailto:gina.photovidservices@gmail.com?subject=${subject}&body=${body}`;
      }

      serviceModal.classList.add('is-open');
      serviceModal.style.display = 'flex';
      serviceModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeServiceModal() {
      if (!serviceModal) return;
      serviceModal.classList.remove('is-open');
      serviceModal.style.display = 'none';
      serviceModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => openServiceModal(card.getAttribute('data-service')));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openServiceModal(card.getAttribute('data-service'));
        }
      });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeServiceModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeServiceModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && serviceModal && serviceModal.classList.contains('is-open')) {
        closeServiceModal();
      }
    });
  }

  /* ================= 6. GALLERY PAGE: FILTER, VIEW TOGGLE & LIGHTBOX ================= */
  const galleryGrid = document.getElementById('galleryGrid');
  const galFilterBtns = document.querySelectorAll('.gal-filter-btn');
  const viewMasonry = document.getElementById('viewMasonry');
  const viewUniform = document.getElementById('viewUniform');
  const galleryLightbox = document.getElementById('galleryLightbox');

  if (galleryGrid) {
    const galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
    let visibleItems = [...galleryItems];
    let currentLightboxIndex = 0;

    galFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        galFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        galleryItems.forEach((item) => {
          const cat = item.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        });

        visibleItems = galleryItems.filter((item) => !item.classList.contains('is-hidden'));
      });
    });

    if (viewMasonry && viewUniform) {
      viewMasonry.addEventListener('click', () => {
        galleryGrid.classList.remove('is-uniform');
        viewMasonry.classList.add('active');
        viewUniform.classList.remove('active');
      });

      viewUniform.addEventListener('click', () => {
        galleryGrid.classList.add('is-uniform');
        viewUniform.classList.add('active');
        viewMasonry.classList.remove('active');
      });
    }

    const lbImage = document.getElementById('lightboxImage');
    const lbCategory = document.getElementById('lightboxCategory');
    const lbTitle = document.getElementById('lightboxTitle');
    const lbDesc = document.getElementById('lightboxDesc');
    const lbCounter = document.getElementById('lightboxCounter');
    const lbClose = document.getElementById('lightboxClose');
    const lbBackdrop = document.getElementById('lightboxBackdrop');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');

    function showLightboxImage(idx) {
      if (!visibleItems.length || !galleryLightbox) return;
      currentLightboxIndex = (idx + visibleItems.length) % visibleItems.length;
      const item = visibleItems[currentLightboxIndex];
      const img = item.querySelector('img');
      const tag = item.querySelector('.gal-tag');

      if (lbImage && img) {
        lbImage.src = img.src;
        lbImage.alt = img.alt;
      }
      if (lbCategory && tag) lbCategory.textContent = tag.textContent;
      if (lbTitle) lbTitle.textContent = item.getAttribute('data-title') || '';
      if (lbDesc) lbDesc.textContent = item.getAttribute('data-caption') || '';
      if (lbCounter) {
        const cur = String(currentLightboxIndex + 1).padStart(2, '0');
        const tot = String(visibleItems.length).padStart(2, '0');
        lbCounter.textContent = `${cur} / ${tot}`;
      }
    }

    function openLightbox(item) {
      visibleItems = galleryItems.filter((el) => !el.classList.contains('is-hidden'));
      const idx = visibleItems.indexOf(item);
      showLightboxImage(idx >= 0 ? idx : 0);

      galleryLightbox.classList.add('is-open');
      galleryLightbox.style.display = 'flex';
      galleryLightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!galleryLightbox) return;
      galleryLightbox.classList.remove('is-open');
      galleryLightbox.style.display = 'none';
      galleryLightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => openLightbox(item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    if (lbPrev) lbPrev.addEventListener('click', () => showLightboxImage(currentLightboxIndex - 1));
    if (lbNext) lbNext.addEventListener('click', () => showLightboxImage(currentLightboxIndex + 1));
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (!galleryLightbox || !galleryLightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showLightboxImage(currentLightboxIndex + 1);
      if (e.key === 'ArrowLeft') showLightboxImage(currentLightboxIndex - 1);
    });
  }

  /* ================= 7. CONTACT PAGE: CLIENT-SIDE FORM VALIDATION ================= */
  const contactForm = document.getElementById('contactValidationForm');
  const statusMsg = document.getElementById('formStatusMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('inqName');
      const emailInput = document.getElementById('inqEmail');
      const serviceInput = document.getElementById('inqService');

      [nameInput, emailInput, serviceInput].forEach((el) => el.classList.remove('input-error'));
      statusMsg.classList.remove('is-error');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const service = serviceInput.value;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (name.length < 2) {
        nameInput.classList.add('input-error');
        statusMsg.classList.add('is-error');
        statusMsg.textContent = 'Please enter your full name (at least 2 characters).';
        nameInput.focus();
        return;
      }

      if (!emailPattern.test(email)) {
        emailInput.classList.add('input-error');
        statusMsg.classList.add('is-error');
        statusMsg.textContent = 'Please enter a valid email address (e.g., name@email.com).';
        emailInput.focus();
        return;
      }

      if (!service) {
        serviceInput.classList.add('input-error');
        statusMsg.classList.add('is-error');
        statusMsg.textContent = 'Please select the service you are inquiring about.';
        serviceInput.focus();
        return;
      }

      statusMsg.textContent = `Validated! Preparing email draft for ${service}...`;
      const subject = encodeURIComponent(`Inquiry: ${service} (${name})`);
      const body = encodeURIComponent(`Hello Gina's Photo & Video Services,\n\nName: ${name}\nEmail: ${email}\nService Needed: ${service}\n\nPlease share your available dates and quotation. Thank you!`);
      window.location.href = `mailto:gina.photovidservices@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
