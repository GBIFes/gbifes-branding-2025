import Url from 'domurl';
import Cookies from 'js-cookie';
import gbifesjs from './settings.js';

const cookieLang = 'datos-gbif-es-lang';
const sessionCookie = 'datos-gbif-es-lang-session';
const enabledLangs = gbifesjs.enabledLangs;

let locale = window.gbiflocale; // opcional para sobreescribir desde fuera
const currentUrl = new Url();

// Fallback para detectar idiomas del navegador
function getUsersPreferredLanguages() {
  return navigator.languages || [navigator.language] || [];
}

// Encuentra el primer idioma preferido del usuario que coincida con los disponibles
function parseLanguages(acceptedLangs, defaultLang = 'es') {
  const userPref = getUsersPreferredLanguages();
  const match = userPref.find(lang => acceptedLangs.includes(lang));
  return match || defaultLang;
}

function i18n_init() {
  if (gbifesjs.isDevel) console.log('i18n init in development');

  locale = currentUrl.query.lang || Cookies.get(cookieLang);

  if (!locale) {
    locale = parseLanguages(enabledLangs, 'es');
  }

  const isValid = enabledLangs.includes(locale);
  if (!isValid) {
    locale = 'es';
    if (gbifesjs.isDevel) console.log('Invalid locale, fallback to es');
  }

  Cookies.remove(cookieLang, { path: '/' });
  Cookies.set(cookieLang, locale, {
    expires: 365,
    path: '/',
    domain: '.gbif.es'
  });

  if (gbifesjs.isDevel) console.log(`Final locale: ${locale}`);
}

// Ejecutar inicialización si no está definida
if (typeof locale === 'undefined') {
  i18n_init();
}

// Workaround para grails: redirige con lang en URL si no hay cookie ni query
if (!Cookies.get(sessionCookie) && !currentUrl.query.lang) {
  Cookies.set(sessionCookie, '/', {
    expires: 1 / 48,
    path: '/'
  });
  currentUrl.query.lang = locale;
  window.location.search = currentUrl.query;
}

export { locale, enabledLangs };
