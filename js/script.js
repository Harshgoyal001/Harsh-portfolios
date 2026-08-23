/* =========================================================
   Harsh goyal — Portfolio behavior layer
   Vanilla JS, no dependencies. Organized by feature so any
   section can be lifted out or edited on its own.
   ========================================================= */
(() => {
  'use strict';

  /* ---------- Config ---------- */
  // TODO: replace with your real Formspree endpoint.
  // Sign up free at https://formspree.io, create a form, and paste its ID here.
  const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  /* ---------- Utilities ---------- */
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  const menuToggle = qs('#menu-toggle');
  const primaryNav = qs('#primary-nav');

  function closeMenu() {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
  }
  function openMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    primaryNav.classList.add('is-open');
  }
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });
    qsa('.nav-link').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', (e) => {
      const clickedOutside = !primaryNav.contains(e.target) && !menuToggle.contains(e.target);
      if (clickedOutside && primaryNav.classList.contains('is-open')) closeMenu();
    });
  }

  /* ---------- Scroll-spy: highlight the nav link for the section in view ---------- */
  const spySections = qsa('main section[id]');
  const navLinks = qsa('.nav-link');
  if (spySections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = qs(`.nav-link[href="#${entry.target.id}"]`);
          if (!link) return;
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    spySections.forEach((s) => spyObserver.observe(s));
  }

  /* ---------- Reveal-on-scroll ---------- */
  const revealTargets = qsa('[data-reveal]');
  if (revealTargets.length) {
    if (prefersReducedMotion()) {
      revealTargets.forEach((el) => el.classList.add('in-view'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealTargets.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ---------- Skills: functional tabs ---------- */
  const tabs = qsa('.tab-btn');
  const panels = qsa('.tab-panel');
  const skillsSection = qs('#skills');

  function animateSkillFills(panel) {
    if (!panel) return;
    qsa('.skill-row', panel).forEach((row) => {
      const fill = qs('.skill-fill', row);
      const level = row.dataset.level || '0';
      if (!fill) return;
      if (prefersReducedMotion()) {
        fill.style.width = `${level}%`;
        return;
      }
      fill.style.width = '0%';
      void fill.offsetWidth; // force reflow so the transition replays every time
      requestAnimationFrame(() => {
        fill.style.width = `${level}%`;
      });
    });
  }

  function activateTab(tab, { focus = false } = {}) {
    tabs.forEach((t) => {
      t.setAttribute('aria-selected', 'false');
      t.tabIndex = -1;
    });
    panels.forEach((p) => {
      p.hidden = true;
    });
    tab.setAttribute('aria-selected', 'true');
    tab.tabIndex = 0;
    if (focus) tab.focus();
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) {
      panel.hidden = false;
      animateSkillFills(panel);
    }
  }

  if (tabs.length && panels.length) {
    // Show the first tab's panel by default (HTML ships with all panels but
    // one hidden; this keeps JS as the single source of truth for state).
    panels.forEach((p, i) => { p.hidden = i !== 0; });

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', (e) => {
        let nextIndex = null;
        if (e.key === 'ArrowRight') nextIndex = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') nextIndex = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') nextIndex = 0;
        else if (e.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex !== null) {
          e.preventDefault();
          activateTab(tabs[nextIndex], { focus: true });
        }
      });
    });

    // Animate the default panel's bars once the section scrolls into view.
    if (skillsSection) {
      const skillsObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const activePanel = qs('.tab-panel:not([hidden])');
              animateSkillFills(activePanel);
              obs.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      skillsObserver.observe(skillsSection);
    }
  }

  /* ---------- Hero terminal: typewriter intro ---------- */
  const TERMINAL_LINES = [
    { prompt: '$ whoami', output: 'Harsh goyal' },
    { prompt: '$ role --current', output: 'Full-Stack Developer · CS Engineering Student' },
    { prompt: '$ focus --list', output: 'Web Development · AI/ML · Computer Vision' },
    { prompt: '$ status', output: 'Open to opportunities ✓' },
  ];

  function typeText(parent, text, className, onDone) {
    const span = document.createElement('span');
    span.className = className;
    parent.appendChild(span);
    let i = 0;
    const speed = className === 'prompt' ? 32 : 12;
    (function step() {
      if (i <= text.length) {
        span.textContent = text.slice(0, i);
        i += 1;
        setTimeout(step, speed);
      } else if (onDone) {
        onDone();
      }
    })();
  }

  function typeTerminal(container) {
    if (!container) return;

    if (prefersReducedMotion()) {
      container.innerHTML = TERMINAL_LINES.map(
        (l) =>
          `<span class="terminal-line"><span class="prompt">${l.prompt}</span></span>` +
          `<span class="terminal-line"><span class="output">${l.output}</span></span>`
      ).join('');
      return;
    }

    let lineIndex = 0;
    function nextLine() {
      if (lineIndex >= TERMINAL_LINES.length) {
        const cursorLine = document.createElement('span');
        cursorLine.className = 'terminal-line';
        cursorLine.innerHTML = '<span class="cursor"></span>';
        container.appendChild(cursorLine);
        return;
      }
      const { prompt, output } = TERMINAL_LINES[lineIndex];
      const promptLine = document.createElement('span');
      promptLine.className = 'terminal-line';
      container.appendChild(promptLine);
      typeText(promptLine, prompt, 'prompt', () => {
        const outputLine = document.createElement('span');
        outputLine.className = 'terminal-line';
        container.appendChild(outputLine);
        typeText(outputLine, output, 'output', () => {
          lineIndex += 1;
          setTimeout(nextLine, 260);
        });
      });
    }
    nextLine();
  }
  typeTerminal(qs('#terminal-body'));

  /* ---------- Back to top ---------- */
  qs('#back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });

  /* ---------- Broken image fallback ---------- */
  // If an image path (profile photo, project screenshot, certificate) hasn't
  // been added yet, swap in a small inline placeholder instead of a broken-image icon.
  const FALLBACK_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">' +
    '<rect width="400" height="250" fill="#171C28"/>' +
    '<g fill="none" stroke="#8891A5" stroke-width="2">' +
    '<rect x="150" y="90" width="100" height="70" rx="6"/>' +
    '<circle cx="175" cy="112" r="8"/>' +
    '<path d="M150 145l25-25 20 18 30-28 25 25"/>' +
    '</g>' +
    '<text x="200" y="192" font-family="monospace" font-size="12" fill="#8891A5" text-anchor="middle">add your image here</text>' +
    '</svg>';
  const FALLBACK_IMG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(FALLBACK_SVG)}`;

  qsa('main img').forEach((img) => {
    img.addEventListener(
      'error',
      () => {
        img.src = FALLBACK_IMG;
        img.style.objectFit = 'contain';
        img.style.padding = '2rem';
        img.style.background = 'var(--panel-2)';
      },
      { once: true }
    );
  });

  /* ---------- Contact form ---------- */
  const form = qs('#contact-form');
  const statusEl = qs('#form-status');
  const submitBtn = qs('#form-submit');
  const submitLabel = submitBtn ? qs('.btn-text', submitBtn) : null;

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    subject: (v) => v.trim().length >= 2 || 'Please add a subject.',
    message: (v) => v.trim().length >= 10 || 'Your message should be at least 10 characters.',
  };

  function validateField(field) {
    const row = field.closest('.form-row');
    const errorEl = row ? qs('.field-error', row) : null;
    const result = validators[field.name](field.value);
    if (result === true) {
      row?.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
    row?.classList.add('has-error');
    if (errorEl) errorEl.textContent = result;
    return false;
  }

  if (form && statusEl && submitBtn) {
    const fields = Array.from(form.elements).filter((el) => validators[el.name]);
    fields.forEach((field) => field.addEventListener('blur', () => validateField(field)));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const allValid = fields.map(validateField).every(Boolean);
      if (!allValid) {
        statusEl.dataset.state = 'error';
        statusEl.textContent = 'Please fix the highlighted fields.';
        return;
      }

      submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = 'Sending…';
      statusEl.dataset.state = 'sending';
      statusEl.textContent = 'Sending your message…';

      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });

        if (response.ok) {
          statusEl.dataset.state = 'success';
          statusEl.textContent = "Thanks! Your message is on its way — I'll get back to you soon.";
          form.reset();
        } else {
          throw new Error('Form endpoint returned an error');
        }
      } catch (err) {
        statusEl.dataset.state = 'error';
        statusEl.textContent =
          'Something went wrong sending that. Please email me directly at harshgoyal89200@gmail.com';
      } finally {harsh
        submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = 'Send message';
      }
    });
  }
})();
