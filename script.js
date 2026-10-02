(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const links = [...document.querySelectorAll('nav a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  const portrait = document.querySelector('.hero-portrait');
  const hero = document.querySelector('.hero');
  let framePending = false;

  function updateScroll() {
    framePending = false;
    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= 160) current = section;
    });
    links.forEach(link => {
      if (link.getAttribute('href') === `#${current.id}`) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
    const top = hero.getBoundingClientRect().top;
    if (!reducedMotion.matches && window.innerWidth > 800 && top < window.innerHeight && top > -hero.offsetHeight) {
      const offset = Math.max(-12, Math.min(12, -top * 0.055));
      portrait.style.transform = `scale(1.06) translateY(${offset}px)`;
    } else {
      portrait.style.transform = '';
    }
  }

  function requestUpdate() {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateScroll);
    }
  }

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section-heading, .skill-group, .project-card').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add('reveal', 'reveal-pending');
        observer.observe(element);
      }
    });
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  reducedMotion.addEventListener('change', requestUpdate);
  updateScroll();
})();
