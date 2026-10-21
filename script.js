/**
 * ============================================================================
 * DOLCE BREZZA CAFÉ - JAVASCRIPT MODULE (script.js)
 * Clean, modular ES6+ Vanilla JavaScript
 * Zero external dependencies | Fully accessible (ARIA compliant)
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // Module 1: Mobile Hamburger Menu Navigation Toggle
  // ==========================================================================
  const NavigationToggle = {
    init() {
      this.hamburgerBtn = document.getElementById('hamburger-btn');
      this.navMenu = document.getElementById('primary-navigation');
      this.header = document.getElementById('site-header');
      this.navLinks = document.querySelectorAll('.nav-link');

      if (!this.hamburgerBtn || !this.navMenu) return;

      // Event Listeners
      this.hamburgerBtn.addEventListener('click', () => this.toggle());

      // Close menu when clicking outside navigation
      document.addEventListener('click', (event) => {
        if (
          this.isOpen() &&
          !this.navMenu.contains(event.target) &&
          !this.hamburgerBtn.contains(event.target)
        ) {
          this.close();
        }
      });

      // Keyboard Accessibility: Close on Escape key press
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.isOpen()) {
          this.close();
          this.hamburgerBtn.focus();
        }
      });

      // Close menu when any internal nav link is clicked
      this.navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          this.close();
        });
      });

      // Sticky Header Shadow on Scroll
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          this.header?.classList.add('scrolled');
        } else {
          this.header?.classList.remove('scrolled');
        }
      }, { passive: true });

      // Active Navigation Link Highlighting on Scroll
      this.setupActiveLinkSpy();
    },

    isOpen() {
      return this.hamburgerBtn.getAttribute('aria-expanded') === 'true';
    },

    toggle() {
      if (this.isOpen()) {
        this.close();
      } else {
        this.open();
      }
    },

    open() {
      this.hamburgerBtn.setAttribute('aria-expanded', 'true');
      this.navMenu.classList.add('is-open');
    },

    close() {
      this.hamburgerBtn.setAttribute('aria-expanded', 'false');
      this.navMenu.classList.remove('is-open');
    },

    setupActiveLinkSpy() {
      const sections = document.querySelectorAll('main section[id]');
      if (!('IntersectionObserver' in window) || sections.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const currentId = entry.target.getAttribute('id');
              this.navLinks.forEach((link) => {
                const href = link.getAttribute('href');
                if (href === `#${currentId}`) {
                  link.classList.add('active');
                  link.setAttribute('aria-current', 'page');
                } else if (href.startsWith('#')) {
                  link.classList.remove('active');
                  link.removeAttribute('aria-current');
                }
              });
            }
          });
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      );

      sections.forEach((section) => observer.observe(section));
    }
  };

  // ==========================================================================
  // Module 2: Dark / Light Mode Theme Toggle (AGENTS.md Section 5 Feature)
  // ==========================================================================
  const ThemeToggle = {
    STORAGE_KEY: 'dolce_brezza_theme',

    init() {
      this.toggleBtn = document.getElementById('theme-toggle');
      if (!this.toggleBtn) return;

      // Determine starting theme: LocalStorage -> System preference -> Light
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

      this.applyTheme(initialTheme);

      // Event Listener on toggle button
      this.toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
        localStorage.setItem(this.STORAGE_KEY, nextTheme);
      });

      // System preference changes listener
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const isDark = theme === 'dark';
      this.toggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light color theme' : 'Switch to dark color theme'
      );
      this.toggleBtn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  };

  // ==========================================================================
  // Module 3: Interactive FAQ Accordion (AGENTS.md Section 5 Feature)
  // ==========================================================================
  const AccordionComponent = {
    init() {
      this.headers = document.querySelectorAll('.accordion-header');

      this.headers.forEach((header) => {
        header.addEventListener('click', () => {
          const isCurrentlyExpanded = header.getAttribute('aria-expanded') === 'true';
          const targetContentId = header.getAttribute('aria-controls');
          const contentPanel = document.getElementById(targetContentId);

          if (!contentPanel) return;

          // Toggle the targeted panel
          if (isCurrentlyExpanded) {
            header.setAttribute('aria-expanded', 'false');
            contentPanel.setAttribute('hidden', '');
          } else {
            header.setAttribute('aria-expanded', 'true');
            contentPanel.removeAttribute('hidden');
          }
        });
      });
    }
  };

  // ==========================================================================
  // Module 4: Accessible Modal Dialog Window (AGENTS.md Section 5 Feature)
  // ==========================================================================
  const ModalComponent = {
    init() {
      this.modal = document.getElementById('item-modal');
      this.closeBtn = document.getElementById('modal-close-btn');
      this.dismissBtn = document.getElementById('modal-dismiss-btn');
      this.detailBtns = document.querySelectorAll('.view-detail-btn');

      if (!this.modal) return;

      this.modalTitle = document.getElementById('modal-title');
      this.modalPrice = document.getElementById('modal-price');
      this.modalDesc = document.getElementById('modal-desc');
      this.modalOrigin = document.getElementById('modal-origin');
      this.modalNotes = document.getElementById('modal-notes');
      this.modalBadge = document.getElementById('modal-badge');
      this.modalImg = document.getElementById('modal-img');

      // Bind all "View Tasting Notes" triggers
      this.detailBtns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
          const card = event.target.closest('.menu-item-card');
          if (card) {
            this.open(card);
          }
        });
      });

      // Close button triggers
      this.closeBtn?.addEventListener('click', () => this.close());
      this.dismissBtn?.addEventListener('click', () => this.close());

      // Backdrop click closes dialog
      this.modal.addEventListener('click', (event) => {
        const rect = this.modal.getBoundingClientRect();
        const isInDialog = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          this.close();
        }
      });
    },

    open(card) {
      const title = card.getAttribute('data-name') || card.querySelector('.menu-item-title')?.textContent || 'Item';
      const price = card.getAttribute('data-price') ? `$${card.getAttribute('data-price')}` : card.querySelector('.menu-item-price')?.textContent || '';
      const desc = card.querySelector('.menu-item-desc')?.textContent || '';
      const origin = card.getAttribute('data-origin') || 'Direct Single Origin';
      const notes = card.getAttribute('data-notes') || 'Balanced & Smooth';
      const dietary = card.querySelector('.dietary-pill')?.textContent || 'Specialty';

      const cardImg = card.querySelector('.menu-item-img');

      if (this.modalTitle) this.modalTitle.textContent = title;
      if (this.modalPrice) this.modalPrice.textContent = price;
      if (this.modalDesc) this.modalDesc.textContent = desc;
      if (this.modalOrigin) this.modalOrigin.textContent = origin;
      if (this.modalNotes) this.modalNotes.textContent = notes;
      if (this.modalBadge) this.modalBadge.textContent = dietary;
      if (this.modalImg && cardImg) {
        this.modalImg.src = cardImg.getAttribute('src');
        this.modalImg.alt = cardImg.getAttribute('alt') || title;
      }

      // Native HTML5 <dialog> API
      if (typeof this.modal.showModal === 'function') {
        this.modal.showModal();
      } else {
        this.modal.setAttribute('open', '');
      }
    },

    close() {
      if (!this.modal) return;
      if (typeof this.modal.close === 'function') {
        this.modal.close();
      } else {
        this.modal.removeAttribute('open');
      }
    }
  };

  // ==========================================================================
  // Module 5: Filterable Menu Gallery & Real-Time Search
  // ==========================================================================
  const MenuFilterComponent = {
    init() {
      this.tabs = document.querySelectorAll('.filter-tabs .tab-btn');
      this.searchInput = document.getElementById('menu-search-input');
      this.cards = document.querySelectorAll('.menu-item-card');
      this.countDisplay = document.getElementById('item-count-display');
      this.statusRow = document.getElementById('filter-status-msg');

      if (this.tabs.length === 0 || this.cards.length === 0) return;

      this.selectedCategory = 'all';
      this.searchTerm = '';

      // Tab selection event listener
      this.tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          this.tabs.forEach((t) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          this.selectedCategory = tab.getAttribute('data-category') || 'all';
          this.applyFilter();
        });
      });

      // Search input event listener
      if (this.searchInput) {
        this.searchInput.addEventListener('input', (event) => {
          this.searchTerm = event.target.value.trim().toLowerCase();
          this.applyFilter();
        });
      }
    },

    applyFilter() {
      let visibleCount = 0;

      this.cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const origin = (card.getAttribute('data-origin') || '').toLowerCase();
        const notes = (card.getAttribute('data-notes') || '').toLowerCase();
        const desc = (card.querySelector('.menu-item-desc')?.textContent || '').toLowerCase();

        const matchesCategory = this.selectedCategory === 'all' || category === this.selectedCategory;
        const matchesSearch =
          !this.searchTerm ||
          name.includes(this.searchTerm) ||
          origin.includes(this.searchTerm) ||
          notes.includes(this.searchTerm) ||
          desc.includes(this.searchTerm);

        if (matchesCategory && matchesSearch) {
          card.classList.remove('is-hidden');
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
        }
      });

      // Update Screen Reader Announcement and visual counter
      if (this.countDisplay) {
        this.countDisplay.textContent = String(visibleCount);
      }
      if (this.statusRow) {
        this.statusRow.textContent = `Showing ${visibleCount} handcrafted item${visibleCount === 1 ? '' : 's'}`;
      }
    }
  };

  // ==========================================================================
  // Module 6: Static Contact Form UI Validation & Live Alerts
  // ==========================================================================
  const ContactFormComponent = {
    init() {
      this.form = document.getElementById('contact-form');
      this.alertBox = document.getElementById('form-alert');
      this.submitBtn = document.getElementById('submit-btn');

      if (!this.form) return;

      this.nameInput = document.getElementById('contact-name');
      this.emailInput = document.getElementById('contact-email');
      this.inquirySelect = document.getElementById('inquiry-type');
      this.messageInput = document.getElementById('contact-message');

      this.form.addEventListener('submit', (e) => this.handleSubmit(e));

      // Clear validation errors on user typing
      [this.nameInput, this.emailInput, this.inquirySelect, this.messageInput].forEach((input) => {
        if (!input) return;
        input.addEventListener('input', () => {
          input.classList.remove('invalid');
          const errorSpan = document.getElementById(`${input.name}-error`) || input.nextElementSibling;
          if (errorSpan && errorSpan.classList.contains('field-error-msg')) {
            errorSpan.textContent = '';
          }
        });
      });
    },

    handleSubmit(event) {
      event.preventDefault();
      let isValid = true;

      // Validate Full Name
      if (!this.nameInput.value.trim()) {
        this.showError('name-error', this.nameInput, 'Please enter your full name.');
        isValid = false;
      }

      // Validate Email with RegEx
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.emailInput.value.trim()) {
        this.showError('email-error', this.emailInput, 'Please enter your email address.');
        isValid = false;
      } else if (!emailPattern.test(this.emailInput.value.trim())) {
        this.showError('email-error', this.emailInput, 'Please provide a valid email address.');
        isValid = false;
      }

      // Validate Inquiry Type
      if (!this.inquirySelect.value) {
        this.showError('inquiry-error', this.inquirySelect, 'Please select an inquiry subject.');
        isValid = false;
      }

      // Validate Message
      if (!this.messageInput.value.trim()) {
        this.showError('message-error', this.messageInput, 'Please provide details in your message.');
        isValid = false;
      }

      if (!isValid) {
        this.showAlert('Please correct the highlighted fields before submitting.', 'error');
        return;
      }

      // Simulate sending state
      const originalText = this.submitBtn.innerHTML;
      this.submitBtn.disabled = true;
      this.submitBtn.innerHTML = 'Sending...';

      setTimeout(() => {
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = originalText;

        const senderName = this.nameInput.value.trim();
        this.form.reset();
        this.showAlert(
          `Thank you, ${senderName}! Your message has been sent. Our team will contact you within 24 hours.`,
          'success'
        );
      }, 700);
    },

    showError(errorSpanId, inputElem, message) {
      inputElem.classList.add('invalid');
      const span = document.getElementById(errorSpanId);
      if (span) {
        span.textContent = message;
      }
    },

    showAlert(message, type) {
      if (!this.alertBox) return;
      this.alertBox.className = `form-alert ${type}`;
      this.alertBox.textContent = message;
      this.alertBox.removeAttribute('hidden');
      this.alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // ==========================================================================
  // Module 7: Dynamic Year Component
  // ==========================================================================
  const DynamicYearComponent = {
    init() {
      const yearSpan = document.getElementById('current-year');
      if (yearSpan) {
        yearSpan.textContent = String(new Date().getFullYear());
      }
    }
  };

  // ==========================================================================
  // App Bootstrapper
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    NavigationToggle.init();
    ThemeToggle.init();
    AccordionComponent.init();
    ModalComponent.init();
    MenuFilterComponent.init();
    ContactFormComponent.init();
    DynamicYearComponent.init();
  });
})();
