/**
 * La Plume Artiste - Script Principal
 * Interactions et animations pour une expérience fluide
 */

document.addEventListener('DOMContentLoaded', () => {
  // === Menu Mobile Toggle ===
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      
      // Animation des barres du menu
      menuToggle.classList.toggle('active');
    });
  }

  // === Recherche avec filtre client (pour listing.html) ===
  const searchInput = document.querySelector('.filters input[type="search"]');
  const categorySelect = document.querySelector('.filters select');
  const articleCards = document.querySelectorAll('.article-card, .card');
  
  function filterArticles() {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const selectedCategory = categorySelect?.value.toLowerCase() || 'all';
    
    articleCards.forEach(card => {
      const title = card.querySelector('h3, h4')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('p')?.textContent.toLowerCase() || '';
      const category = card.querySelector('.category-tag, .category-badge')?.textContent.toLowerCase() || '';
      
      const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || category.includes(selectedCategory);
      
      card.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
  }
  
  searchInput?.addEventListener('input', filterArticles);
  categorySelect?.addEventListener('change', filterArticles);

  // === Animation au scroll (Intersection Observer) ===
  const animatedElements = document.querySelectorAll('.article-card, .featured-card, .value-card, .panel');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // === Header scroll effect ===
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 20px rgba(26, 58, 47, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  // === Newsletter form handling ===
  const newsletterForms = document.querySelectorAll('form');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      
      if (emailInput && emailInput.value) {
        // Simulation d'envoi
        submitBtn.innerHTML = '✓';
        submitBtn.disabled = true;
        emailInput.disabled = true;
        
        setTimeout(() => {
          // Message de confirmation
          const parent = form.parentElement;
          const successMsg = document.createElement('p');
          successMsg.className = 'newsletter-success';
          successMsg.style.cssText = 'color: var(--forest); font-weight: 600; margin-top: 12px; animation: fadeIn 0.3s ease;';
          successMsg.textContent = 'Merci ! Vous êtes inscrit(e) à la newsletter.';
          form.style.display = 'none';
          parent.appendChild(successMsg);
        }, 500);
      }
    });
  });

  // === Smooth scroll pour les ancres ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // === Pills actives (catégories) ===
  const pills = document.querySelectorAll('.pill, .category-pills a');
  
  pills.forEach(pill => {
    pill.addEventListener('click', function(e) {
      // Si c'est un lien vers une autre page, ne pas empêcher
      if (this.href && !this.href.includes('#')) return;
      
      e.preventDefault();
      pills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // === Lazy loading des images (si présentes) ===
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // === Reading progress bar (pour page article) ===
  const prose = document.querySelector('.prose');
  
  if (prose) {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--forest), var(--gold));
      z-index: 1000;
      width: 0%;
      transition: width 0.1s linear;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / documentHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, { passive: true });
  }

  // === Copier le lien de l'article ===
  const shareButtons = document.querySelectorAll('.share-link');
  
  shareButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        btn.textContent = 'Lien copié !';
        setTimeout(() => {
          btn.textContent = 'Partager';
        }, 2000);
      } catch (err) {
        console.log('Erreur lors de la copie');
      }
    });
  });

  console.log('🌿 La Plume Artiste - Site initialisé');
});

// Ajout du style pour l'animation fadeIn
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  .menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }
`;
document.head.appendChild(style);
