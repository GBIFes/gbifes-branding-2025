function translateBreadcrumbHome() {
  const selector = '#breadcrumb > div > div > nav > ol > li:nth-child(1)';
  const target = document.querySelector(selector);

  if (target && window.i18next) {
    const link = target.querySelector('a');
    const text = window.i18next.t('menu_home');
    if (link) {
      link.textContent = text;
    } else {
      target.textContent = text;
    }
    return true;
  }

  return false;
}

function observeAndTranslateBreadcrumb() {
  if (translateBreadcrumbHome()) return;

  const observer = new MutationObserver(() => {
    if (translateBreadcrumbHome()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

$(function(){
  if (window.i18next && window.i18next.isInitialized) {
    observeAndTranslateBreadcrumb();
  } else {
    window.i18next.on('initialized', observeAndTranslateBreadcrumb);
  }
});
