/* ================================================
   ILLUMINE TES SENS — Main JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── AOS (Animate On Scroll) ──────────────────────
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 900,
      easing: 'ease-out-quart',
      once: true,
      offset: 60,
    });
  }

  // ── Navigation scroll state ───────────────────────
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Scrolled class for nav background
    nav.classList.toggle('scrolled', scrollY > 50);

    // Back-to-top visibility
    backToTop.classList.toggle('visible', scrollY > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Mobile nav toggle ─────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    // Animate hamburger → X
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close nav when a link is clicked
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ── Back to top ───────────────────────────────────
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Smooth anchor scrolling (with nav offset) ─────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Set minimum date for booking ──────────────────
  const bookDate = document.getElementById('bookDate');
  if (bookDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    bookDate.min = tomorrow.toISOString().split('T')[0];
    // Default to 7 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    bookDate.value = defaultDate.toISOString().split('T')[0];
  }

  // ── Booking form ───────────────────────────────────
  const bookingForm    = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');

  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();

      // Clear previous errors
      bookingForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      // Validate required fields
      let valid = true;
      bookingForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (!valid) {
        // Scroll to first error
        const firstError = bookingForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Simulate form submission (replace with real API call)
      const submitBtn = bookingForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';

      setTimeout(() => {
        bookingForm.style.display = 'none';
        bookingSuccess.style.display = 'block';
        bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1200);
    });

    // Live validation – remove error on input
    bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  // ── Contact form ───────────────────────────────────
  const contactForm    = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (!valid) {
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi…';

      setTimeout(() => {
        contactForm.style.display = 'none';
        contactSuccess.style.display = 'block';
      }, 1000);
    });

    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  // ── Newsletter form ────────────────────────────────
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (!input.value.trim()) return;
      const btn = newsletterForm.querySelector('button');
      btn.textContent = '✓ Inscrit(e)';
      btn.disabled = true;
      input.disabled = true;
    });
  }

  // ── Subtle parallax on hero ────────────────────────
  const hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        hero.style.backgroundPositionY = `calc(50% + ${scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

  // ── Active nav link on scroll (IntersectionObserver) ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));

});
