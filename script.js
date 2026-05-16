/* ============================================
   KMG Menuiserie — JavaScript
   Animations au défilement, En-tête, Menu Mobile, Compteurs
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // Effet au défilement pour l'en-tête (Header)
  // ============================================
  const header = document.getElementById('header');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ============================================
  // Menu de navigation mobile (Burger)
  // ============================================
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  // Fermer le menu mobile lorsqu'on clique sur un lien
  nav.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ============================================
  // Défilement fluide (Smooth scroll) des ancres
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Animations d'apparition des éléments au défilement
  // ============================================
  const animateElements = document.querySelectorAll(
    '.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale, .animate-rotate, .animate-blur, .animate-flip'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // ============================================
  // Animation des chiffres (Compteurs) dans la section principale
  // ============================================
  const animateCounter = (el, target, suffix = '') => {
    const duration = 2000;
    const startTime = performance.now();
    const startVal = 0;

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Calcul pour ralentir l'animation vers la fin (effet Ease Out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * easeOut);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  // Déclencher les compteurs quand on les voit à l'écran
  const statsSection = document.querySelector('.hero__stats');
  if (statsSection) {
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;

          const statYears = document.getElementById('stat-years');
          const statProjects = document.getElementById('stat-projects');
          const statSatisfaction = document.getElementById('stat-satisfaction');

          if (statYears) animateCounter(statYears, 15, '+');
          if (statProjects) animateCounter(statProjects, 500, '+');
          if (statSatisfaction) animateCounter(statSatisfaction, 98, '%');

          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ============================================
  // Mise en évidence du menu actif selon la section visible
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ============================================
  // Petit effet de mouvement (Parallax) sur l'image d'accueil
  // ============================================
  const heroImage = document.querySelector('.hero__bg img');
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }

  // ============================================
  // Préchargement de l'image principale pour un affichage rapide
  // ============================================
  const preloadImages = ['assets/images/hero.png'];
  preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

});
