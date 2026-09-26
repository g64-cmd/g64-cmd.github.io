(() => {
  let preference = 'system';
  try { preference = localStorage.getItem('blog-theme') || 'system'; } catch (_) {}
  if (!['system', 'light', 'dark'].includes(preference)) preference = 'system';
  document.documentElement.dataset.theme = preference;
})();
