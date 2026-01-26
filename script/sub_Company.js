document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero-content, .hero-image, .ceo-message').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});
