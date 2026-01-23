(function() {
  'use strict';

  // ==========================================
  // DOM Elements
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');

  // ==========================================
  // Mobile Menu Toggle
  // ==========================================
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = mainNav.classList.toggle('active');
      
      // Update ARIA attributes
      mobileMenuBtn.setAttribute('aria-expanded', isActive);
      mobileMenuBtn.setAttribute('aria-label', isActive ? '메뉴 닫기' : '메뉴 열기');
    });
  }

  // ==========================================
  // Close Mobile Menu on Link Click
  // ==========================================
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', '메뉴 열기');
      }
    });
  });

  // ==========================================
  // Close Mobile Menu on Outside Click
  // ==========================================
  document.addEventListener('click', function(e) {
    if (mainNav && mobileMenuBtn) {
      if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        if (mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mobileMenuBtn.setAttribute('aria-label', '메뉴 열기');
        }
      }
    }
  });

  // ==========================================
  // Scroll to Top Button
  // ==========================================
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Show/Hide scroll to top button based on scroll position
    let lastScrollPosition = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
      lastScrollPosition = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateScrollTopButton(lastScrollPosition);
          ticking = false;
        });

        ticking = true;
      }
    });

    function updateScrollTopButton(scrollPos) {
      if (scrollPos > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
      } else {
        scrollTopBtn.style.opacity = '0.5';
        scrollTopBtn.style.pointerEvents = 'none';
      }
    }
  }

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // Close Mobile Menu on ESC Key
  // ==========================================
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', '메뉴 열기');
        mobileMenuBtn.focus();
      }
    }
  });

  // ==========================================
  // Lazy Loading Images (optional enhancement)
  // ==========================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ==========================================
  // Add Animation on Scroll (optional)
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  // Observe case cards for animation
  document.querySelectorAll('.case-card').forEach(function(card) {
    observer.observe(card);
  });

  // ==========================================
  // Handle Window Resize
  // ==========================================
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Close mobile menu on resize to desktop
      if (window.innerWidth > 992 && mainNav && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        if (mobileMenuBtn) {
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mobileMenuBtn.setAttribute('aria-label', '메뉴 열기');
        }
      }
    }, 250);
  });

  // ==========================================
  // Console Info
  // ==========================================
  console.log('%cNextLab Website', 'color: #f0620a; font-size: 20px; font-weight: bold;');
  console.log('%c안전을 넘어 미래를 설계하다', 'color: #04456f; font-size: 14px;');
  console.log('Version 1.0.0');

})();