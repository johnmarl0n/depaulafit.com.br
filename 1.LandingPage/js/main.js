// ═══════════════════════════════════════════════════════
//  DePaula Fitness Store — Landing Page JS
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. NAV SCROLL BEHAVIOR ──────────────────────────
  const header = document.getElementById('header');
  const scrollThreshold = 80;

  const updateHeader = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ─── 2. MOBILE MENU ──────────────────────────────────
  const hamburger   = document.getElementById('nav-hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuClose   = document.getElementById('menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', openMenu);
  menuOverlay?.addEventListener('click', closeMenu);
  menuClose?.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // ─── 3. SCROLL REVEAL ────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── 4. PRODUTO CARDS — SIZE SELECTION ───────────────
  document.querySelectorAll('.size-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const card = e.target.closest('.produto-card-info');
      card.querySelectorAll('.size-dot').forEach(d => {
        d.style.borderColor = '';
        d.style.color = '';
        d.style.background = '';
      });
      dot.style.borderColor = 'var(--clr-bordeaux)';
      dot.style.color = 'white';
      dot.style.background = 'var(--clr-bordeaux)';
    });
  });

  // ─── 5. ADD TO CART SIMULATION ───────────────────────
  let cartCount = 0;
  const cartCountEl = document.querySelector('.cart-count');

  document.querySelectorAll('.produto-add-cart, .btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cartCount++;
      if (cartCountEl) cartCountEl.textContent = cartCount;

      // Ripple feedback
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:10px; height:10px;
        background:rgba(255,255,255,0.6);
        transform:scale(0); animation:ripple-anim 0.5s ease-out;
        pointer-events:none; top:50%; left:50%;
        margin:-5px;
      `;
      btn.style.position = 'relative';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);

      // Toast notification
      showToast('Produto adicionado ao carrinho! 🛍️');
    });
  });

  // ─── 6. TOAST NOTIFICATION ───────────────────────────
  function showToast(message) {
    const existing = document.querySelector('.dp-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'dp-toast';
    toast.innerHTML = `<span>${message}</span>`;
    toast.style.cssText = `
      position:fixed; bottom:7rem; right:2rem; z-index:9999;
      background:var(--clr-bordeaux); color:white;
      padding:0.875rem 1.5rem; border-radius:999px;
      font-family:var(--font-body); font-size:0.82rem; font-weight:500;
      box-shadow:0 8px 28px rgba(107,45,62,0.35);
      transform:translateY(20px); opacity:0;
      transition:all 0.4s cubic-bezier(0.16,1,0.3,1);
      pointer-events:none;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity   = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity   = '0';
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  // ─── 7. NEWSLETTER FORM ──────────────────────────────
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('.newsletter-input');
    const email = input.value.trim();

    if (!email || !email.includes('@')) {
      input.style.borderColor = 'var(--clr-rose)';
      return;
    }

    input.value = '';
    input.placeholder = '✓ Você está na lista! Obrigada ♥';
    input.style.borderColor = 'var(--clr-rose)';
    newsletterForm.querySelector('button[type="submit"]').textContent = 'Inscrita!';
    showToast('Bem-vinda à família DePaula! 💖');
  });

  // ─── 8. SMOOTH SCROLL FOR NAV LINKS ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─── 9. PRODUCT WISHLIST ─────────────────────────────
  document.querySelectorAll('.btn-wishlist').forEach(btn => {
    let active = false;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      active = !active;
      btn.style.background   = active ? 'var(--clr-bordeaux)' : 'white';
      btn.style.color        = active ? 'white' : 'var(--clr-text)';
      btn.innerHTML          = active ? '❤️' : '🤍';
      if (active) showToast('Adicionado aos favoritos! ❤️');
    });
  });

  // ─── 10. PARALLAX HERO ───────────────────────────────
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.04) translateY(${scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

  // ─── 11. STAGGER CHILDREN ANIMATION ─────────────────
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.classList.add('reveal');
      child.classList.add(`reveal-delay-${Math.min(i + 1, 5)}`);
    });
  });

  // ─── 12. SECTION COUNTER ANIMATION ───────────────────
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ─── 13. RIPPLE CSS ──────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(30); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

});
