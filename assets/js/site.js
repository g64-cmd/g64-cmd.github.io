(() => {
  'use strict';
  const theme = document.querySelector('#theme-select');
  if (theme) {
    theme.value = document.documentElement.dataset.theme || 'system';
    theme.closest('label').hidden = false;
    theme.addEventListener('change', () => {
      document.documentElement.dataset.theme = theme.value;
      try { localStorage.setItem('blog-theme', theme.value); } catch (_) {}
    });
  }

  const archive = document.querySelector('#archive');
  if (archive) {
    const form = archive.querySelector('form');
    const search = form.elements.q;
    const kind = form.elements.kind;
    const tag = form.elements.tag;
    const cards = [...archive.querySelectorAll('[data-article]')].map(element => ({
      element, kind: element.dataset.kind,
      tags: JSON.parse(element.dataset.tags || '[]'),
      text: element.dataset.search.toLocaleLowerCase()
    }));
    const readURL = () => {
      const params = new URLSearchParams(location.search);
      search.value = params.get('q') || '';
      for (const control of [kind, tag]) {
        const value = params.get(control.name) || '';
        // Keep a shared, obsolete filter meaningful instead of silently showing all posts.
        if (value && ![...control.options].some(option => option.value === value)) {
          const option = document.createElement('option');
          option.value = value; option.textContent = value;
          control.append(option);
        }
        control.value = value;
      }
    };
    const filter = (updateURL = true) => {
      const query = search.value.trim().toLocaleLowerCase();
      let count = 0;
      cards.forEach(card => {
        const matches = (!kind.value || kind.value === card.kind)
          && (!tag.value || card.tags.includes(tag.value))
          && (!query || (card.text + ' ' + card.tags.join(' ').toLocaleLowerCase()).includes(query));
        card.element.hidden = !matches;
        if (matches) count++;
      });
      archive.querySelectorAll('[data-year]').forEach(year => {
        year.hidden = ![...year.querySelectorAll('[data-article]')].some(card => !card.hidden);
      });
      archive.querySelector('#result-count').textContent = count + ' 篇文章';
      archive.querySelector('#no-results').hidden = count > 0 || cards.length === 0;
      if (updateURL) {
        const url = new URL(location.href);
        for (const control of [search, kind, tag]) {
          if (control.value.trim()) url.searchParams.set(control.name, control.value.trim());
          else url.searchParams.delete(control.name);
        }
        history.replaceState(null, '', url);
      }
    };
    form.hidden = false;
    form.addEventListener('submit', event => { event.preventDefault(); filter(); });
    form.addEventListener('input', () => filter());
    form.addEventListener('change', () => filter());
    form.addEventListener('reset', () => { requestAnimationFrame(() => filter()); });
    window.addEventListener('popstate', () => { readURL(); filter(false); });
    readURL(); filter(false);
  }

  const body = document.querySelector('#article-body');
  if (!body) return;
  const headings = [...body.querySelectorAll('h2, h3')];
  const toc = document.querySelector('.toc');
  if (toc && headings.length) {
    const list = toc.querySelector('ol');
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = 'section-' + (index + 1);
      const item = document.createElement('li');
      if (heading.tagName === 'H3') item.className = 'toc-sub';
      const link = document.createElement('a');
      link.href = '#' + encodeURIComponent(heading.id);
      link.textContent = heading.textContent;
      item.append(link); list.append(item);
    });
    toc.hidden = false;
    const desktop = matchMedia('(min-width: 1380px)');
    const adapt = () => { toc.querySelector('details').open = desktop.matches; };
    adapt(); desktop.addEventListener('change', adapt);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (!visible.length) return;
        list.querySelectorAll('a').forEach(link => {
          if (decodeURIComponent(link.hash.slice(1)) === visible[0].target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }, { rootMargin: '-85px 0px -65% 0px' });
      headings.forEach(heading => observer.observe(heading));
    }
  }

  body.querySelectorAll('div.highlight').forEach(block => {
    const code = block.querySelector('pre code');
    if (!code) return;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'copy-code';
    button.textContent = '复制'; button.setAttribute('aria-label', '复制代码');
    button.setAttribute('aria-live', 'polite');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = '已复制';
      } catch (_) { button.textContent = '请选中代码复制'; }
      setTimeout(() => { button.textContent = '复制'; }, 2200);
    });
    block.append(button);
  });

  // Kramdown turns Markdown math into these delimiters. Never parse ordinary dollar amounts.
  if (document.querySelector('[data-math]') && window.renderMathInElement) {
    window.renderMathInElement(body, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'],
      throwOnError: false,
      trust: false
    });
  }
})();
