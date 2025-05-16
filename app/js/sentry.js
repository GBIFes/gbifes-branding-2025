import * as Sentry from '@sentry/browser';
import gbifesjs from './settings.js';
import { locale } from './i18n_init.js';
import Cookies from 'js-cookie';

const user = Cookies.get('ALA-Auth', { domain: 'gbif.es', path: '/' });

if (!gbifesjs.isDevel) {
  Sentry.init({ dsn: gbifesjs.sentryUrl });
  console.log('Sentry configured');

  if (typeof user !== 'undefined') {
    Sentry.setUser({ email: user });
    console.log('Sentry setting email scope');
  } else {
    console.log('Cannot set sentry email scope');
  }

  Sentry.setTag('page_locale', locale);
  console.log('Sentry setting lang scope');

  const buildInfo = '$_BUILD';
  console.log(`sentry build info: ${buildInfo}`);

  Sentry.setExtra('gbif-es-build', buildInfo);
}
