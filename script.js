/* ==========================================================================
   SHOURYA PUNJ — PERSONAL SITE
   script.js — minimal interactivity layer
   --------------------------------------------------------------------------
   Responsibilities:
     1. Tag eligible elements with `.reveal` so they animate in on scroll.
     2. Observe sections and toggle `.is-revealed` when they enter view.
     3. Track the currently visible section to highlight the side nav.
     4. Wire up click-to-expand on experience rows + project cards
        (single-open per group, keyboard accessible).
     5. Year-stamp the footer so it never goes stale.
   No frameworks, no dependencies. Runs after DOM via the `defer` attribute.
   ========================================================================== */

(() => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. SCROLL REVEAL
     Each block listed below gets the `.reveal` class so its CSS transition
     fires when an IntersectionObserver tags it `.is-revealed`.
     -------------------------------------------------------------------------- */

  const revealTargets = document.querySelectorAll(
    [
      '.section__header',
      '.about__copy',
      '.about__portrait',
      '.about__stack',
      '.exp-row',
      '.project-card',
      '.contact__intro',
      '.contact__email',
      '.contact__socials',
      '.hero__tagline',
      '.hero__meta'
    ].join(',')
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Once revealed, stop observing — the animation only needs to fire once.
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      // Trigger slightly before the element reaches the viewport
      // for a more polished feel when scrolling at speed.
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));


  /* --------------------------------------------------------------------------
     2. ACTIVE SECTION (SIDE NAV)
     A second observer tracks which <section> currently fills the viewport
     and mirrors that state onto the matching side-nav link.
     -------------------------------------------------------------------------- */

  const sideNavLinks = document.querySelectorAll('.side-nav a[data-section]');
  const sections = document.querySelectorAll('main .section');

  const setActiveSection = (id) => {
    sideNavLinks.forEach((link) => {
      const isActive = link.dataset.section === id;
      link.classList.toggle('is-active', isActive);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      // Pick the entry with the largest intersection ratio currently in view.
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveSection(visible.target.id);
    },
    {
      // The "active" band is roughly the middle 50% of the viewport.
      rootMargin: '-30% 0px -50% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));


  /* --------------------------------------------------------------------------
     3. ACCORDION — experience rows + project cards
     Both groups behave as "single-open accordions": clicking any item closes
     the others in the same group and opens the clicked one. Clicking an
     already-open item closes it.
     -------------------------------------------------------------------------- */

  /**
   * Toggle `.is-open` on the clicked item and keep `aria-expanded` in sync.
   * Closes every other item in the group so the page stays tidy.
   *
   * @param {HTMLElement} item   The item being toggled.
   * @param {NodeList}    group  All items in the same accordion group.
   */
  const toggleItem = (item, group) => {
    const willOpen = !item.classList.contains('is-open');

    group.forEach((other) => {
      other.classList.remove('is-open');
      other.setAttribute('aria-expanded', 'false');
    });

    if (willOpen) {
      item.classList.add('is-open');
      item.setAttribute('aria-expanded', 'true');
    }
  };

  /**
   * Wire up click + (optionally) keyboard activation on each item.
   * Native <button> elements already handle Enter/Space, so they don't
   * need the keydown shim — only role="button" stand-ins do.
   *
   * @param {NodeList}     items
   * @param {{needsKeyboard?: boolean}} opts
   */
  const setupAccordion = (items, opts = {}) => {
    const { needsKeyboard = false } = opts;

    items.forEach((item) => {
      item.addEventListener('click', () => toggleItem(item, items));

      if (needsKeyboard) {
        item.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleItem(item, items);
          }
        });
      }
    });
  };

  // Experience rows are <button> elements — skip the header row, which is a
  // labelled <div> sharing the `.exp-row` class for layout purposes only.
  const expRows = document.querySelectorAll('.exp-row:not(.exp-row--head)');
  setupAccordion(expRows);

  // Project cards are <article role="button"> — they need the keyboard shim
  // because <article> doesn't natively respond to Enter / Space.
  const projectCards = document.querySelectorAll('.project-card');
  setupAccordion(projectCards, { needsKeyboard: true });


  /* --------------------------------------------------------------------------
     4. FOOTER YEAR
     Replace the hard-coded year in the copyright line with the current one.
     Cheap insurance against the page looking stale.
     -------------------------------------------------------------------------- */

  const yearNode = document.querySelector('.footer__row .mono--dim');
  if (yearNode && /© \d{4}/.test(yearNode.textContent)) {
    yearNode.textContent = yearNode.textContent.replace(
      /© \d{4}/,
      `© ${new Date().getFullYear()}`
    );
  }
})();
