import gbifesjs from './settings.js';
import './jquery-eu-cookie-law-popup';

const locale = window.i18next.language;
const enabledLangs = gbifesjs.enabledLangs;

function i18n_menus() {
  console.log('Calling i18n_menus');
  if (gbifesjs.isDevel) console.log(`locale in i18n_menus: ${locale}`);

  // Add lang param to links
  if (locale) {
    $('.top-nav-menu a, .portal-link').each(function () {
      const $this = $(this);
      const _href = $this.attr('href');
      if (!_href) return;
      const [uri, hash] = _href.split('#');
      const href = hash
        ? `${uri}?lang=${locale}#${hash}`
        : `${uri}?lang=${locale}`;
      $this.attr('href', href);
      if (gbifesjs.isDevel) console.log(`Added lang to href: ${href}`);
    });
  }

  const currentUrl = window.location.href;

  // Language switch links
  enabledLangs.forEach((curlang) => {
    const $link = $(`.${curlang}-locale-link`);
    const localeUrl = new URL(currentUrl);
    localeUrl.searchParams.set('lang', curlang);
    $link.attr('href', localeUrl.toString());
    if (gbifesjs.isDevel) console.log(`Added lang to href: ${localeUrl}`);
  });

  const t = window.i18next.t;

  $(document).euCookieLawPopup().init({
    cookiePolicyUrl: 'https://www.gbif.es/politica-de-cookies/',
    popupPosition: 'bottom',
    colorStyle: 'gbif',
    compactStyle: true,
    popupTitle: '',
    popupText: t('cookie_message'),
    buttonContinueTitle: t('cookie_accept_btn'),
    buttonLearnmoreTitle: t('cookie_policy_btn'),
    buttonLearnmoreOpenInNewWindow: true,
    agreementExpiresInDays: 30,
    autoAcceptCookiePolicy: false,
    htmlMarkup: null
  });
}

// Inicialización tras carga del DOM y elementos
$(function () {
  const checkExist = setInterval(function () {
    if (
      window.jQuery &&
      $('#menu_home').length &&
      window.i18next &&
      window.i18next.isInitialized
    ) {
      console.log('gbif_es_elements loaded');
      clearInterval(checkExist);
      i18n_menus();
    } else {
      if (gbifesjs.isDevel) console.log('gbif_es_elements not loaded yet');
    }
  }, 500);
});
