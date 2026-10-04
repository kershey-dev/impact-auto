/**
 * Auto Movers Corporation — Interactive Prototype Scripts
 * Pure vanilla JavaScript with accessible controls & natural scrolling.
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Utility helpers
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════════════════════════
     1. NAVIGATION & MOBILE MENU
     ═══════════════════════════════════════════════════════════════════ */
  const nav = $('.nav');
  const menuToggle = $('.menu-toggle');
  const navLinks = $$('.nav nav a');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     2. HERO INTERACTION — Purposeful Entrance & Before/After Toggle
     ═══════════════════════════════════════════════════════════════════ */
  const hero = $('.hero');
  const heroToggle = $('#hero-toggle');
  const heroAnnouncement = $('#hero-announcement');
  const heroStatusTag = $('#hero-status-tag');
  let heroIsRestored = false;

  function setHeroState(isRestored) {
    heroIsRestored = isRestored;
    if (!hero) return;
    hero.classList.toggle('is-restored', isRestored);

    if (isRestored) {
      hero.style.setProperty('--reveal', '100%');
      hero.style.setProperty('--phase', '1');
      if (heroToggle) {
        heroToggle.querySelector('.toggle-text').textContent = 'Show damaged vehicle';
        heroToggle.setAttribute('aria-pressed', 'true');
      }
      if (heroStatusTag) {
        heroStatusTag.textContent = 'STATUS: RESTORATION COMPLETE';
        heroStatusTag.style.color = '#4ade80';
      }
      if (heroAnnouncement) {
        heroAnnouncement.textContent = 'Restored vehicle: road-ready.';
      }
    } else {
      hero.style.setProperty('--reveal', '0%');
      hero.style.setProperty('--phase', '0');
      if (heroToggle) {
        heroToggle.querySelector('.toggle-text').textContent = 'Show repaired vehicle';
        heroToggle.setAttribute('aria-pressed', 'false');
      }
      if (heroStatusTag) {
        heroStatusTag.textContent = 'STATUS: IMPACT DAMAGE';
        heroStatusTag.style.color = 'var(--red)';
      }
      if (heroAnnouncement) {
        heroAnnouncement.textContent = 'Utility vehicle before repair.';
      }
    }
  }

  if (heroToggle) {
    heroToggle.addEventListener('click', () => {
      setHeroState(!heroIsRestored);
    });
  }

  // Quick initial scan line demonstration on entrance (if motion allowed)
  if (!prefersReducedMotion && hero) {
    setTimeout(() => {
      hero.style.setProperty('--reveal', '15%');
      setTimeout(() => {
        hero.style.setProperty('--reveal', '0%');
      }, 600);
    }, 400);
  }

  /* ═══════════════════════════════════════════════════════════════════
     3. REPAIR GALLERY — Featured Case Study & Supporting Examples
     ═══════════════════════════════════════════════════════════════════ */
  const repairArticles = $$('.project-featured, .project-card');

  repairArticles.forEach(article => {
    const frame = $('.comparison-frame', article);
    const switchBtns = $$('.switch-btn', article);
    const imgBefore = $('.img-before', article);
    const imgAfter = $('.img-after', article);
    const badge = $('.comparison-badge', article);

    function updateView(view) {
      const isAfter = view === 'after';
      if (frame) frame.dataset.active = view;

      switchBtns.forEach(btn => {
        const active = btn.dataset.view === view;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
      });

      if (imgBefore && imgAfter) {
        imgBefore.classList.toggle('active', !isAfter);
        imgAfter.classList.toggle('active', isAfter);
      }

      if (badge) {
        const isFeatured = article.classList.contains('project-featured');
        if (isAfter) {
          badge.textContent = isFeatured ? 'AFTER REPAIR · FINISHED' : 'AFTER REPAIR';
          badge.style.borderLeftColor = '#4ade80';
        } else {
          badge.textContent = isFeatured ? 'BEFORE REPAIR · IMPACT DAMAGE' : 'BEFORE REPAIR';
          badge.style.borderLeftColor = 'var(--red)';
        }
      }
    }

    switchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateView(btn.dataset.view);
      });
    });

    if (frame) {
      frame.addEventListener('click', () => {
        const current = frame.dataset.active || 'after';
        updateView(current === 'after' ? 'before' : 'after');
      });

      frame.setAttribute('tabindex', '0');
      frame.setAttribute('role', 'button');
      frame.setAttribute('aria-label', 'Toggle between before and after repair images');
      frame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const current = frame.dataset.active || 'after';
          updateView(current === 'after' ? 'before' : 'after');
        }
      });
    }
  });

  /* ═══════════════════════════════════════════════════════════════════
     4. SERVICES — Image and State Transitions
     ═══════════════════════════════════════════════════════════════════ */
  const serviceRows = $$('.service-row');
  const servicePhoto = $('#service-photo');
  const serviceCaption = $('#service-caption');

  function activateService(row) {
    serviceRows.forEach(r => {
      const isCurrent = r === row;
      r.classList.toggle('active', isCurrent);
      r.setAttribute('aria-selected', String(isCurrent));
    });

    if (servicePhoto && row.dataset.image) {
      servicePhoto.style.opacity = '0.4';
      setTimeout(() => {
        servicePhoto.src = `assets/${row.dataset.image}`;
        servicePhoto.alt = row.dataset.alt || '';
        servicePhoto.style.opacity = '1';
      }, 150);
    }

    if (serviceCaption) {
      const title = $('strong', row)?.textContent || '';
      serviceCaption.textContent = title;
    }
  }

  serviceRows.forEach(row => {
    row.addEventListener('click', () => activateService(row));
    row.addEventListener('mouseenter', () => activateService(row));
    row.addEventListener('focus', () => activateService(row));
  });

  /* ═══════════════════════════════════════════════════════════════════
     5. PROCESS — Scannable Seven-Stage Repair Timeline
     ═══════════════════════════════════════════════════════════════════ */
  const timelineStages = $$('.timeline-stage');
  const processImages = $$('.process-img');
  const processStageLabel = $('#process-stage-label');
  const stageProgressBar = $('#stage-progress-bar');

  const stageDescriptions = [
    '01 / STAGE: INSPECTION — Comprehensive damage assessment',
    '02 / STAGE: ESTIMATE — Itemized parts and repair schedule',
    '03 / STAGE: INSURANCE ASSISTANCE — Claim documentation & coordination',
    '04 / STAGE: REPAIR — Structural alignment & panel rebuilding',
    '05 / STAGE: PAINT — Climate-controlled refinishing & clear coat',
    '06 / STAGE: QUALITY CHECK — Multi-point fitment and safety inspection',
    '07 / STAGE: RELEASE — Delivered road-ready to vehicle owner'
  ];

  function activateStage(index) {
    timelineStages.forEach((stage, i) => {
      const isActive = i === index;
      stage.classList.toggle('active', isActive);
      stage.setAttribute('aria-selected', String(isActive));
    });

    processImages.forEach(img => {
      const imgStage = parseInt(img.dataset.stage, 10);
      img.classList.toggle('active', imgStage === index);
    });

    if (processStageLabel && stageDescriptions[index]) {
      processStageLabel.textContent = stageDescriptions[index];
    }

    if (stageProgressBar) {
      const pct = ((index + 1) / timelineStages.length) * 100;
      stageProgressBar.style.width = `${pct}%`;
    }
  }

  timelineStages.forEach((stage, index) => {
    stage.addEventListener('click', () => activateStage(index));
  });

  /* ═══════════════════════════════════════════════════════════════════
     6. ESTIMATE FORM — Usable Photo Upload & Local Validation Preview
     ═══════════════════════════════════════════════════════════════════ */
  const form = $('#estimate-form');
  const photoInput = $('#photos');
  const uploadZone = $('#upload-zone');
  const photoPreviews = $('#photo-previews');
  const photoCounter = $('#photo-counter');
  const photoError = $('#photo-error');
  const reviewContainer = $('#request-review');

  let uploadedPhotos = [];

  function updatePhotoStatus() {
    if (photoCounter) {
      photoCounter.textContent = `${uploadedPhotos.length} of 6 photos selected`;
    }
    if (photoError && uploadedPhotos.length > 0) {
      photoError.textContent = '';
    }
  }

  function renderPhotoPreviews() {
    if (!photoPreviews) return;
    photoPreviews.replaceChildren();

    uploadedPhotos.forEach((item, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'preview-thumb';

      const img = document.createElement('img');
      img.src = item.url;
      img.alt = `Damage photo preview ${index + 1}: ${item.file.name}`;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'thumb-remove';
      removeBtn.innerHTML = '&times;';
      removeBtn.setAttribute('aria-label', `Remove photo ${item.file.name}`);
      removeBtn.addEventListener('click', () => {
        URL.revokeObjectURL(item.url);
        uploadedPhotos.splice(index, 1);
        renderPhotoPreviews();
        updatePhotoStatus();
      });

      thumb.appendChild(img);
      thumb.appendChild(removeBtn);
      photoPreviews.appendChild(thumb);
    });

    updatePhotoStatus();
  }

  function handleFiles(files) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxFiles = 6;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const errors = [];

    Array.from(files).forEach(file => {
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported format (JPG, PNG, WebP only).`);
        return;
      }
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds the 10 MB size limit.`);
        return;
      }
      if (uploadedPhotos.length >= maxFiles) {
        errors.push('Maximum 6 photos allowed.');
        return;
      }

      uploadedPhotos.push({
        file: file,
        url: URL.createObjectURL(file)
      });
    });

    if (errors.length > 0 && photoError) {
      photoError.textContent = errors[0];
    } else if (photoError) {
      photoError.textContent = '';
    }

    renderPhotoPreviews();
    if (photoInput) photoInput.value = '';
  }

  if (photoInput) {
    photoInput.addEventListener('change', () => {
      if (photoInput.files) handleFiles(photoInput.files);
    });
  }

  if (uploadZone) {
    ['dragenter', 'dragover'].forEach(eventType => {
      uploadZone.addEventListener(eventType, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventType => {
      uploadZone.addEventListener(eventType, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadZone.classList.remove('dragover');
      });
    });

    uploadZone.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    });
  }

  // Field validation helper
  function validateField(input, msgEl, customValidator) {
    const val = input.value.trim();
    let error = '';

    if (input.required && !val) {
      error = 'This field is required.';
    } else if (customValidator) {
      error = customValidator(val);
    }

    if (msgEl) msgEl.textContent = error;
    input.classList.toggle('invalid', Boolean(error));
    return !error;
  }

  if (form) {
    const vehicleInput = form.elements['vehicle'];
    const damageInput = form.elements['damage'];
    const nameInput = form.elements['name'];
    const phoneInput = form.elements['phone'];

    // Real-time input clearing
    form.addEventListener('input', (e) => {
      if (reviewContainer) reviewContainer.hidden = true;
      const target = e.target;
      target.classList.remove('invalid');
      const msg = $(`#msg-${target.name}`);
      if (msg) msg.textContent = '';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      isValid = validateField(vehicleInput, $('#msg-vehicle')) && isValid;
      isValid = validateField(damageInput, $('#msg-damage')) && isValid;
      isValid = validateField(nameInput, $('#msg-name')) && isValid;

      isValid = validateField(phoneInput, $('#msg-phone'), (val) => {
        const digits = val.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) {
          return 'Enter a valid phone number (7–15 digits).';
        }
        return '';
      }) && isValid;

      if (!isValid) {
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (uploadedPhotos.length === 0) {
        if (photoError) photoError.textContent = 'Please attach at least one photo of the vehicle damage.';
        if (uploadZone) uploadZone.focus();
        return;
      }

      // Generate demonstration review card
      const formData = new FormData(form);
      const vehicle = formData.get('vehicle') || '';
      const year = formData.get('year') || 'Not specified';
      const damageType = formData.get('damage_type') || 'Collision';
      const damageDesc = formData.get('damage') || '';
      const insurance = formData.get('insurance') || 'Not sure';
      const name = formData.get('name') || '';
      const phone = formData.get('phone') || '';

      if (reviewContainer) {
        reviewContainer.innerHTML = `
          <div class="review-header">
            <h3>Estimate Request Preview</h3>
            <span class="review-tag">LOCAL VERIFICATION PASSED</span>
          </div>
          <div class="review-notice">
            <strong>Interactive Demonstration:</strong> Your information and ${uploadedPhotos.length} photo(s) have been verified locally. In production, this form connects to the Auto Movers shop management system. No live enquiry has been transmitted.
          </div>
          <dl class="review-details">
            <dt>Vehicle:</dt>
            <dd>${escapeHtml(vehicle)} (${escapeHtml(year)})</dd>
            <dt>Damage Type:</dt>
            <dd>${escapeHtml(damageType)}</dd>
            <dt>Description:</dt>
            <dd>${escapeHtml(damageDesc)}</dd>
            <dt>Photos:</dt>
            <dd>${uploadedPhotos.length} photo(s) attached and ready for appraisal</dd>
            <dt>Insurance:</dt>
            <dd>${escapeHtml(insurance)}</dd>
            <dt>Customer:</dt>
            <dd>${escapeHtml(name)} · ${escapeHtml(phone)}</dd>
          </dl>
          <div class="review-actions">
            <button type="button" class="review-btn" id="edit-request-btn">Edit Details</button>
            <button type="button" class="review-btn reset" id="reset-request-btn">Start Over</button>
          </div>
        `;

        reviewContainer.hidden = false;
        reviewContainer.focus();
        reviewContainer.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });

        const editBtn = $('#edit-request-btn', reviewContainer);
        if (editBtn) {
          editBtn.addEventListener('click', () => {
            reviewContainer.hidden = true;
            if (vehicleInput) vehicleInput.focus();
          });
        }

        const resetBtn = $('#reset-request-btn', reviewContainer);
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            form.reset();
            uploadedPhotos.forEach(p => URL.revokeObjectURL(p.url));
            uploadedPhotos = [];
            renderPhotoPreviews();
            reviewContainer.hidden = true;
            if (vehicleInput) vehicleInput.focus();
          });
        }
      }
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ═══════════════════════════════════════════════════════════════════
     7. MOBILE CTA VISIBILITY (Intersection Observer on Hero)
     ═══════════════════════════════════════════════════════════════════ */
  const mobileBar = $('.mobile-cta');
  const heroSection = $('.hero-section');

  if (mobileBar && heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      const heroInView = entries[0].isIntersecting;
      mobileBar.hidden = heroInView;
    }, { threshold: 0.1 });

    heroObserver.observe(heroSection);
  }

  // Cleanup object URLs on unload
  window.addEventListener('pagehide', () => {
    uploadedPhotos.forEach(p => URL.revokeObjectURL(p.url));
  });
});
