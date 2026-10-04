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
     2. HERO INTERACTION — Draggable Split Slider, Presets & Physics
     ═══════════════════════════════════════════════════════════════════ */
  const hero = $('.hero');
  const heroStage = $('#hero-stage');
  const heroToggle = $('#hero-toggle');
  const heroAnnouncement = $('#hero-announcement');
  const heroStatusTag = $('#hero-status-tag');
  const heroSliderHandle = $('#hero-slider-handle');
  const presetBtns = $$('.preset-btn');
  let currentRevealPercent = 0;
  let isDraggingHero = false;

  function updateHeroReveal(percent, animate = false) {
    percent = Math.max(0, Math.min(100, percent));
    currentRevealPercent = percent;

    if (!hero) return;
    if (animate) {
      hero.classList.add('is-animating');
      setTimeout(() => hero.classList.remove('is-animating'), 400);
    }

    hero.style.setProperty('--reveal', `${percent}%`);
    hero.style.setProperty('--phase', (percent / 100).toFixed(2));

    if (heroSliderHandle) {
      heroSliderHandle.setAttribute('aria-valuenow', Math.round(percent));
    }

    const isRestored = percent > 50;
    hero.classList.toggle('is-restored', isRestored);

    presetBtns.forEach(btn => {
      const p = parseInt(btn.dataset.preset, 10);
      const isMatch = Math.abs(p - percent) < 10;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', String(isMatch));
    });

    if (heroToggle) {
      const toggleText = heroToggle.querySelector('.toggle-text');
      if (toggleText) toggleText.textContent = isRestored ? 'Show Damaged' : 'Show Restored';
      heroToggle.setAttribute('aria-pressed', String(isRestored));
    }

    if (heroStatusTag) {
      if (percent >= 85) {
        heroStatusTag.textContent = 'STATUS: RESTORATION COMPLETE';
        heroStatusTag.style.color = '#4ade80';
      } else if (percent <= 15) {
        heroStatusTag.textContent = 'STATUS: IMPACT DAMAGE';
        heroStatusTag.style.color = 'var(--red)';
      } else {
        heroStatusTag.textContent = `STATUS: SPLIT INSPECTION (${Math.round(percent)}%)`;
        heroStatusTag.style.color = '#f59e0b';
      }
    }

    if (heroAnnouncement) {
      heroAnnouncement.textContent = isRestored
        ? 'Restored vehicle road-ready.'
        : 'Utility vehicle before repair with impact damage.';
    }
  }

  // Pointer drag handling on hero stage
  function getHeroPercentFromEvent(e) {
    if (!heroStage) return 0;
    const rect = heroStage.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }

  if (heroStage) {
    const startDrag = (e) => {
      isDraggingHero = true;
      hero.classList.add('is-dragging');
      // Hide drag prompt after first interaction
      const prompt = heroStage.querySelector('.handle-prompt');
      if (prompt) prompt.style.display = 'none';
      updateHeroReveal(getHeroPercentFromEvent(e));
    };

    const doDrag = (e) => {
      if (!isDraggingHero) return;
      e.preventDefault();
      updateHeroReveal(getHeroPercentFromEvent(e));
    };

    const stopDrag = () => {
      if (isDraggingHero) {
        isDraggingHero = false;
        hero.classList.remove('is-dragging');
      }
    };

    heroStage.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);

    heroStage.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchmove', doDrag, { passive: false });
    window.addEventListener('touchend', stopDrag);

    // Keyboard support on slider handle
    if (heroSliderHandle) {
      heroSliderHandle.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          updateHeroReveal(currentRevealPercent - 10, true);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          updateHeroReveal(currentRevealPercent + 10, true);
        } else if (e.key === 'Home') {
          e.preventDefault();
          updateHeroReveal(0, true);
        } else if (e.key === 'End') {
          e.preventDefault();
          updateHeroReveal(100, true);
        }
      });
    }
  }

  // Preset buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const p = parseInt(btn.dataset.preset, 10);
      updateHeroReveal(p, true);
    });
  });

  // Quick toggle button
  if (heroToggle) {
    heroToggle.addEventListener('click', () => {
      updateHeroReveal(currentRevealPercent > 50 ? 0 : 100, true);
    });
  }

  // Teaser entrance animation (invites user to drag)
  if (!prefersReducedMotion && heroStage) {
    setTimeout(() => {
      updateHeroReveal(50, true);
      setTimeout(() => {
        updateHeroReveal(35, true);
      }, 700);
    }, 450);
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
     4. SERVICES — Image, Thumbnail & Specs Transitions
     ═══════════════════════════════════════════════════════════════════ */
  const serviceRows = $$('.service-row');
  const serviceThumbs = $$('.service-thumb');
  const servicePhoto = $('#service-photo');
  const serviceCaption = $('#service-caption');
  const serviceSpec = $('#service-spec');

  function activateServiceByIndex(index) {
    const row = serviceRows[index];
    if (!row) return;

    serviceRows.forEach((r, i) => {
      const isCurrent = i === index;
      r.classList.toggle('active', isCurrent);
      r.setAttribute('aria-selected', String(isCurrent));
    });

    serviceThumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    if (servicePhoto && row.dataset.image) {
      servicePhoto.style.opacity = '0.3';
      servicePhoto.style.transform = 'scale(0.98)';
      setTimeout(() => {
        servicePhoto.src = `assets/${row.dataset.image}`;
        servicePhoto.alt = row.dataset.alt || '';
        servicePhoto.style.opacity = '1';
        servicePhoto.style.transform = 'scale(1)';
      }, 140);
    }

    if (serviceCaption) {
      const title = $('strong', row)?.textContent || '';
      serviceCaption.textContent = title;
    }

    if (serviceSpec && row.dataset.spec) {
      serviceSpec.textContent = row.dataset.spec;
    }
  }

  serviceRows.forEach((row, index) => {
    row.addEventListener('click', () => activateServiceByIndex(index));
    row.addEventListener('mouseenter', () => activateServiceByIndex(index));
    row.addEventListener('focus', () => activateServiceByIndex(index));
  });

  serviceThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => activateServiceByIndex(index));
    thumb.addEventListener('mouseenter', () => activateServiceByIndex(index));
  });

  /* ═══════════════════════════════════════════════════════════════════
     5. PROCESS — Seven-Stage Stepper & Auto-Tour
     ═══════════════════════════════════════════════════════════════════ */
  const timelineStages = $$('.timeline-stage');
  const processImages = $$('.process-img');
  const processStageLabel = $('#process-stage-label');
  const stageProgressBar = $('#stage-progress-bar');
  const processDeliverable = $('#process-deliverable');
  const procPrevBtn = $('#proc-prev');
  const procNextBtn = $('#proc-next');
  const procPlayBtn = $('#proc-play');
  const procCounter = $('#proc-counter');

  let currentStageIndex = 0;
  let autoTourInterval = null;
  let isTourPlaying = false;

  const stageDescriptions = [
    '01 / STAGE: INSPECTION — Comprehensive damage assessment',
    '02 / STAGE: ESTIMATE — Itemized parts and repair schedule',
    '03 / STAGE: INSURANCE ASSISTANCE — Claim documentation & coordination',
    '04 / STAGE: REPAIR — Structural alignment & panel rebuilding',
    '05 / STAGE: PAINT — Climate-controlled refinishing & clear coat',
    '06 / STAGE: QUALITY CHECK — Multi-point fitment and safety inspection',
    '07 / STAGE: RELEASE — Delivered road-ready to vehicle owner'
  ];

  const stageDeliverables = [
    'DELIVERABLE: 36-POINT STRUCTURAL DIAGNOSTIC LOG',
    'DELIVERABLE: TRANSPARENT ITEMIZATION & SCOPE SIGN-OFF',
    'DELIVERABLE: DIRECT ADJUSTER APPROVAL & CLAIMS TRACKING',
    'DELIVERABLE: 10-TON JIG REALIGNMENT TO FACTORY TOLERANCE',
    'DELIVERABLE: SPECTROPHOTOMETER FORMULATION & 65°C BAKE',
    'DELIVERABLE: 50-POINT ROAD SAFETY & FITMENT CERTIFICATION',
    'DELIVERABLE: HANDOVER CEREMONY WITH 1-YEAR WORKMANSHIP WARRANTY'
  ];

  function activateStage(index) {
    index = (index + timelineStages.length) % timelineStages.length;
    currentStageIndex = index;

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

    if (processDeliverable && stageDeliverables[index]) {
      processDeliverable.textContent = stageDeliverables[index];
    }

    if (procCounter) {
      procCounter.textContent = `STAGE 0${index + 1} / 07`;
    }

    if (stageProgressBar) {
      const pct = ((index + 1) / timelineStages.length) * 100;
      stageProgressBar.style.width = `${pct}%`;
    }
  }

  function setAutoTour(play) {
    isTourPlaying = play;
    if (procPlayBtn) {
      const icon = procPlayBtn.querySelector('.tour-icon');
      const label = procPlayBtn.querySelector('.tour-label');
      procPlayBtn.classList.toggle('playing', play);
      if (icon) icon.textContent = play ? '⏸' : '▶';
      if (label) label.textContent = play ? 'Pause tour' : 'Auto-tour';
    }

    if (play) {
      if (autoTourInterval) clearInterval(autoTourInterval);
      autoTourInterval = setInterval(() => {
        activateStage(currentStageIndex + 1);
      }, 3000);
    } else {
      if (autoTourInterval) {
        clearInterval(autoTourInterval);
        autoTourInterval = null;
      }
    }
  }

  timelineStages.forEach((stage, index) => {
    stage.addEventListener('click', () => {
      setAutoTour(false);
      activateStage(index);
    });
  });

  if (procPrevBtn) {
    procPrevBtn.addEventListener('click', () => {
      setAutoTour(false);
      activateStage(currentStageIndex - 1);
    });
  }

  if (procNextBtn) {
    procNextBtn.addEventListener('click', () => {
      setAutoTour(false);
      activateStage(currentStageIndex + 1);
    });
  }

  if (procPlayBtn) {
    procPlayBtn.addEventListener('click', () => {
      setAutoTour(!isTourPlaying);
    });
  }

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
