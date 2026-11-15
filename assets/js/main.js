/**
 * Qbix Solutions — Core Interactive Scripts
 * Features: Three.js 3D Interactive WebGL Cube, Live Stats Counter,
 * Interactive Price Estimator, FAQ Filter & Search, Mobile Drawer, Cookie Consent, Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicYear();
  initScrollEffects();
  initMobileNavigation();
  init3DHeroCanvas();
  initStatsCounters();
  initPortfolioFilter();
  initTechFilter();
  initPriceEstimator();
  initFaqAccordion();
  initConsultationForms();
  initCookieBanner();
  initScrollReveal();
  initCardTilt();
});

/* ==========================================================================
   1. Dynamic Year (Fixes F-12)
   ========================================================================== */
function initDynamicYear() {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = currentYear;
  });
}

/* ==========================================================================
   2. Scroll Effects: Sticky Nav, Progress Bar & Smooth Scroll
   ========================================================================== */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Header background change
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll progress bar
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = (scrollY / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
      }
    }
  }, { passive: true });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Close when clicking any link inside drawer
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   4. Three.js 3D Interactive Cyber Cube Canvas
   ========================================================================== */
function init3DHeroCanvas() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 7;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Main 3D Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // 1. Outer Wireframe Cube (Electric Cyan Glow)
  const outerGeom = new THREE.BoxGeometry(2.6, 2.6, 2.6);
  const outerEdges = new THREE.EdgesGeometry(outerGeom);
  const outerMaterial = new THREE.LineBasicMaterial({
    color: 0x00d2ff,
    linewidth: 2,
    transparent: true,
    opacity: 0.85
  });
  const wireframeCube = new THREE.LineSegments(outerEdges, outerMaterial);
  masterGroup.add(wireframeCube);

  // 2. Translucent Glass-like Inner Cube (Navy Deep Blue)
  const innerGeom = new THREE.BoxGeometry(2.4, 2.4, 2.4);
  const innerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0072ff,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.75,
    transparent: true,
    opacity: 0.35,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });
  const glassCube = new THREE.Mesh(innerGeom, innerMaterial);
  masterGroup.add(glassCube);

  // 3. Glowing Core Isometric Octahedron / Core Sphere
  const coreGeom = new THREE.OctahedronGeometry(1.0, 0);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.9
  });
  const coreShape = new THREE.Mesh(coreGeom, coreMaterial);
  masterGroup.add(coreShape);

  // 4. Orbiting Data Node Rings
  const ringGeom = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00d2ff,
    transparent: true,
    opacity: 0.4
  });
  const ring1 = new THREE.Mesh(ringGeom, ringMat);
  ring1.rotation.x = Math.PI / 3;
  masterGroup.add(ring1);

  const ring2 = new THREE.Mesh(ringGeom, ringMat.clone());
  ring2.material.color.setHex(0x8b5cf6);
  ring2.rotation.y = Math.PI / 4;
  masterGroup.add(ring2);

  // 5. Floating Ambient Particle Field
  const particleCount = 120;
  const particleGeom = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 12;
    particlePositions[i + 1] = (Math.random() - 0.5) * 12;
    particlePositions[i + 2] = (Math.random() - 0.5) * 8;
  }

  particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.05,
    transparent: true,
    opacity: 0.6
  });
  const particleSystem = new THREE.Points(particleGeom, particleMat);
  scene.add(particleSystem);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00d2ff, 2.5, 50);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x0072ff, 2, 50);
  pointLight2.position.set(-5, -5, -3);
  scene.add(pointLight2);

  // Mouse Interaction with Damped Lerp
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0.5;
  let targetRotationY = 0.5;

  function onMouseMove(event) {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    mouseX = (x / rect.width) * 2;
    mouseY = (y / rect.height) * 2;
    targetRotationY = mouseX * 0.8;
    targetRotationX = -mouseY * 0.8;
  }

  container.addEventListener('mousemove', onMouseMove);

  container.addEventListener('touchmove', (event) => {
    if (event.touches && event.touches.length > 0) {
      const rect = container.getBoundingClientRect();
      const touch = event.touches[0];
      const x = touch.clientX - rect.left - rect.width / 2;
      const y = touch.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 1.5;
      mouseY = (y / rect.height) * 1.5;
      targetRotationY = mouseX * 0.8;
      targetRotationX = -mouseY * 0.8;
    }
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Constant rotation + responsive mouse tracking
    masterGroup.rotation.y += (targetRotationY + elapsedTime * 0.35 - masterGroup.rotation.y) * 0.05;
    masterGroup.rotation.x += (targetRotationX + Math.sin(elapsedTime * 0.5) * 0.2 - masterGroup.rotation.x) * 0.05;

    // Counter-rotate core and rings
    coreShape.rotation.x -= 0.015;
    coreShape.rotation.y += 0.02;
    ring1.rotation.z += 0.008;
    ring2.rotation.z -= 0.006;

    // Gentle floating bobbing
    masterGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

    // Slowly rotate particle field
    particleSystem.rotation.y = elapsedTime * 0.04;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Listener
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ==========================================================================
   5. Statistics Counters (Fixes F-06: Initial Real Numbers, Animated on Scroll)
   ========================================================================== */
function initStatsCounters() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(targetValue)) return;

        animateValue(el, 0, targetValue, 1800);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach(el => observer.observe(el));

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      obj.textContent = Math.floor(easeProgress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* ==========================================================================
   6. Portfolio Category Filter
   ========================================================================== */
function initPortfolioFilter() {
  const tabs = document.querySelectorAll('.portfolio-tab-btn');
  const items = document.querySelectorAll('.portfolio-item');

  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter || category.includes(filter)) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   7. Technology Stack Category Filter
   ========================================================================== */
function initTechFilter() {
  const filterBtns = document.querySelectorAll('.tech-filter-btn');
  const techItems = document.querySelectorAll('.tech-item');

  if (!filterBtns.length || !techItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-tech-filter');

      techItems.forEach(item => {
        const group = item.getAttribute('data-group');
        if (filter === 'all' || group === filter || group.includes(filter)) {
          item.style.display = 'flex';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 30);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Interactive Pricing & Estimator Calculator
   ========================================================================== */
function initPriceEstimator() {
  const serviceChips = document.querySelectorAll('.chip-service');
  const scopeChips = document.querySelectorAll('.chip-scope');
  const inrDisplay = document.getElementById('calc-price-inr');
  const usdDisplay = document.getElementById('calc-price-usd');
  const timelineDisplay = document.getElementById('calc-timeline');
  const featuresList = document.getElementById('calc-features-list');
  const bookPkgBtn = document.getElementById('btn-book-package');

  if (!serviceChips.length || !inrDisplay) return;

  // Pricing matrix data based on audited company offerings
  const pricingData = {
    'web': {
      'basic': { inr: '₹25,000', usd: '$320', time: '1 – 2 Weeks', features: ['Custom Mobile-Responsive Design', '5 Core Pages (Home, About, Services, Contact)', 'Basic SEO & Fast Loading', 'WhatsApp & Social Integration', '3 Months Free Support'] },
      'business': { inr: '₹65,000', usd: '$800', time: '2 – 4 Weeks', features: ['High-Converting Business Architecture', 'Dynamic CMS or Django/React Stack', 'Full On-Page Technical SEO', 'Lead Generation Forms & CRM Webhook', 'Speed Optimization (90+ PageSpeed)', '3 Months Free Maintenance'] },
      'ecommerce': { inr: '₹1,20,000', usd: '$1,500', time: '4 – 6 Weeks', features: ['Full E-Commerce Catalog & Filter Matrix', 'Secure Payment Gateway (UPI, Cards, Stripe/Razorpay)', 'Cart, Wishlist & User Accounts', 'Real-Time Order Tracking & Admin Panel', 'SMS/Email Transactional Alerts', '3 Months Comprehensive Support'] }
    },
    'seo': {
      'basic': { inr: '₹18,000/mo', usd: '$220/mo', time: 'Monthly Retainer', features: ['Complete Technical SEO Audit', 'Keyword Strategy (15 Target Keywords)', 'On-Page Optimization (5 Key Pages)', 'Google Search Console & Analytics Setup', 'Monthly Transparent KPI Report'] },
      'business': { inr: '₹35,000/mo', usd: '$420/mo', time: 'Monthly Retainer', features: ['Full Technical & Local SEO Suite', '30 High-Intent Keyword Targeting', '2 SEO-Optimized Blog Posts per Month', 'Quality Backlink Building Outreach', 'Competitor Gap & Ranking Monitoring', 'Bi-weekly Performance Strategy Calls'] },
      'ecommerce': { inr: '₹55,000/mo', usd: '$680/mo', time: 'Monthly Retainer', features: ['Enterprise E-commerce SEO Architecture', 'Category & Product Schema Markup', 'Full Technical Health & Core Web Vitals', '4 Long-Form Content Pieces Monthly', 'High-Domain Authority Digital PR Outreach', 'Dedicated Account Manager'] }
    },
    'social': {
      'basic': { inr: '₹12,000/mo', usd: '$150/mo', time: 'Monthly Retainer', features: ['12 High-Engagement Posts / Month', 'Custom Graphic Designs & Captions', 'Hashtag Optimization & Strategy', 'Instagram & Facebook Scheduling', 'Monthly Growth Performance Report'] },
      'business': { inr: '₹25,000/mo', usd: '$310/mo', time: 'Monthly Retainer', features: ['20 Premium Posts + 4 Reels / Month', 'Content Calendar & Brand Aesthetic', 'Active Community Engagement & DM Responses', 'Paid Ad Campaign Strategy Setup', 'Influencer & Trend Alignment', 'Monthly Strategy Review Call'] },
      'ecommerce': { inr: '₹40,000/mo', usd: '$500/mo', time: 'Monthly Retainer', features: ['30 Content Pieces + 8 Reels/Shorts', 'Full Cross-Platform Management (IG, FB, LinkedIn)', 'Custom Video Hooks & Motion Graphics', 'High-Converting Ad Creatives & Copy', 'Daily Community Management', 'Comprehensive Bi-Weekly ROI Dashboard'] }
    },
    'creative': {
      'basic': { inr: '₹10,000/mo', usd: '$125/mo', time: 'Monthly Retainer', features: ['15 Custom Brand Graphics', 'Social Media Templates & Story Posts', 'YouTube Thumbnails & Banners', 'High-Resolution Vector Source Files', '2 Revision Rounds per Asset'] },
      'business': { inr: '₹22,000/mo', usd: '$270/mo', time: 'Monthly Retainer', features: ['Complete Brand Visual Identity Kit', 'Marketing Flyers, Brochures & Ads', '4 Short-Form Video Edits (Reels/Shorts)', 'Infographics & Presentation Decks', 'Fast 48-Hour Turnaround Time'] },
      'ecommerce': { inr: '₹38,000/mo', usd: '$460/mo', time: 'Monthly Retainer', features: ['Full Creative Production Suite', 'Product Launch 3D Renders / Mockups', '8 High-End Promotional Video Edits', 'Display Banner Ads & E-Commerce Creatives', 'Dedicated Senior Creative Director'] }
    }
  };

  let currentService = 'web';
  let currentScope = 'business';

  function updateEstimate() {
    const data = pricingData[currentService]?.[currentScope] || pricingData['web']['business'];
    inrDisplay.textContent = data.inr;
    usdDisplay.textContent = `Approx. ${data.usd}`;
    if (timelineDisplay) timelineDisplay.textContent = data.time;

    if (featuresList) {
      featuresList.innerHTML = '';
      data.features.forEach(feat => {
        const item = document.createElement('div');
        item.className = 'summary-feature';
        item.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${feat}</span>`;
        featuresList.appendChild(item);
      });
    }

    if (bookPkgBtn) {
      const packageTitle = `${currentService.toUpperCase()} (${currentScope.toUpperCase()}) - ${data.inr}`;
      bookPkgBtn.setAttribute('data-package', packageTitle);
    }
  }

  serviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      serviceChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentService = chip.getAttribute('data-service');
      updateEstimate();
    });
  });

  scopeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      scopeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentScope = chip.getAttribute('data-scope');
      updateEstimate();
    });
  });

  // Initial estimate render
  updateEstimate();

  if (bookPkgBtn) {
    bookPkgBtn.addEventListener('click', () => {
      const pkg = bookPkgBtn.getAttribute('data-package');
      const serviceSelect = document.getElementById('consult-service');
      if (serviceSelect) {
        if (currentService === 'web') serviceSelect.value = 'Web Development';
        else if (currentService === 'seo') serviceSelect.value = 'SEO Optimization';
        else if (currentService === 'social') serviceSelect.value = 'Social Media Management';
        else if (currentService === 'creative') serviceSelect.value = 'Graphic Design';
      }
      const messageField = document.getElementById('consult-message');
      if (messageField) {
        messageField.value = `I am interested in booking the ${pkg} package. Please send me a custom proposal.`;
      }
      const consultSection = document.getElementById('consultation');
      if (consultSection) {
        consultSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   9. FAQ Accordion with Search & Category Filtering
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const tabs = document.querySelectorAll('.faq-tab');
  const searchInput = document.getElementById('faq-search-input');

  if (!faqItems.length) return;

  // Toggle Accordion
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');

    if (questionBtn && answerPanel) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherPanel = otherItem.querySelector('.faq-answer-panel');
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          answerPanel.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
        }
      });
    }
  });

  // Category Filter
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-faq-cat');

      faqItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      faqItems.forEach(item => {
        const qText = item.querySelector('.faq-question-btn')?.textContent.toLowerCase() || '';
        const aText = item.querySelector('.faq-answer-content')?.textContent.toLowerCase() || '';

        if (qText.includes(query) || aText.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   10. Consultation & Contact Form Submissions + Direct WhatsApp Integration
   ========================================================================== */
function initConsultationForms() {
  const forms = document.querySelectorAll('form[data-agency-form]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const serviceInput = form.querySelector('[name="service"]');
      const messageInput = form.querySelector('[name="message"]');

      const name = nameInput ? nameInput.value.trim() : 'Prospective Client';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const service = serviceInput ? serviceInput.value : 'General Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validation
      if (!name || !email) {
        showToast('Please provide your name and email address.', 'error');
        return;
      }

      // Show Success Toast
      showToast(`Thank you, ${name}! Your consultation request has been received. Ravi & Montu will respond within 24 hours.`, 'success');

      // Pre-fill WhatsApp message option
      const whatsappText = encodeURIComponent(
        `Hello Qbix Solutions! My name is ${name}.\nService: ${service}\nEmail: ${email}\nPhone: ${phone}\nDetails: ${message}`
      );
      const whatsappUrl = `https://wa.me/919016592958?text=${whatsappText}`;

      // Open WhatsApp prompt modal or direct option
      setTimeout(() => {
        const promptWa = confirm('Would you also like to open an instant WhatsApp chat with our founder Ravi Bhatasana?');
        if (promptWa) {
          window.open(whatsappUrl, '_blank');
        }
      }, 700);

      form.reset();
    });
  });
}

function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  toast.className = `toast-notice ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   11. Cookie Consent Banner (Fixes F-18)
   ========================================================================== */
function initCookieBanner() {
  const banner = document.getElementById('cookie-consent-banner');
  if (!banner) return;

  const cookieChoice = localStorage.getItem('qbix_cookie_consent');
  if (!cookieChoice) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 1200);
  }

  const acceptBtn = document.getElementById('btn-cookie-accept');
  const rejectBtn = document.getElementById('btn-cookie-reject');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('qbix_cookie_consent', 'all');
      banner.classList.remove('show');
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('qbix_cookie_consent', 'essential');
      banner.classList.remove('show');
    });
  }
}

/* ==========================================================================
   12. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.fade-up');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   13. 3D Card Tilt Effect on Mouse Move
   ========================================================================== */
function initCardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      const tiltX = deltaY * -7;
      const tiltY = deltaX * 7;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}
