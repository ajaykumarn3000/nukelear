// Mobile navigation toggle
const mobileToggle = document.querySelector('.nav-mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-links-open');
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Close mobile menu when clicking a link
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-links-open');
    });
  });
}

// Documentation navigation active state
const docsNavLinks = document.querySelectorAll('.docs-nav-link');
const docsSections = document.querySelectorAll('.docs-section');

if (docsNavLinks.length > 0 && docsSections.length > 0) {
  // Update active state on scroll
  const observerOptions = {
    rootMargin: '-100px 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        docsNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  docsSections.forEach(section => {
    observer.observe(section);
  });

  // Handle click on docs nav links
  docsNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      docsNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}