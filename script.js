(() => {
  'use strict';

  const revealTargets = document.querySelectorAll(
    [
      '.section__header',
      '.hero__left',
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
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));


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
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveSection(visible.target.id);
    },
    {
      rootMargin: '-30% 0px -50% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));


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

  const expRows = document.querySelectorAll('.exp-row:not(.exp-row--head)');
  setupAccordion(expRows);

  const projectCards = document.querySelectorAll('.project-card');
  setupAccordion(projectCards, { needsKeyboard: true });


  const yearNode = document.querySelector('.footer__row .mono--dim');
  if (yearNode && /© \d{4}/.test(yearNode.textContent)) {
    yearNode.textContent = yearNode.textContent.replace(
      /© \d{4}/,
      `© ${new Date().getFullYear()}`
    );
  }
})();
