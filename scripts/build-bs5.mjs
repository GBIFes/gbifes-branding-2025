// Bootstrap 5 build: dist/bs5/{assets,banner,footer,head}.mustache + css/js/fonts.
//
// Apps using ala-bootstrap5 (spatial-service, ...) fetch <headerAndFooter.baseURL>/{assets,banner,footer}.mustache
// and render them server-side ({{headerFooterServer}}, {{containerClass}}, {{loginURL}}, {{loginStatus}}, ...).
// The header/footer are derived from the same theme sources as the Bootstrap 3 build
// (app/themes/<theme>/assets/{banner,footer}.html), so there is one markup source and two outputs.
//
// Run `npm run build` (vite) first, then this (done by `npm run build`). Publish dist/ and point those apps to
// https://<host>/<branding>/bs5 (headerAndFooter.baseURL).
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import settings from '../app/js/settings.js';

const root = path.resolve(import.meta.dirname, '..');
const bs5Dir = path.join(root, 'commonui-bs5-2019');
const out = path.join(root, 'dist', 'bs5');
const theme = settings.theme;
const baseUrl = (process.env.BASE_BRANDING_URL || settings.baseFooterUrl).replace(/\/+$/, '');
const buildTimestamp = Date.now();

// 1. Build the ALA Bootstrap 5 base (git submodule) if needed
if (!fs.existsSync(path.join(bs5Dir, 'build', 'css', 'bootstrap.min.css'))) {
  if (!fs.existsSync(path.join(bs5Dir, 'source'))) {
    throw new Error('commonui-bs5-2019 submodule missing: git submodule update --init');
  }
  const vars = {
    homeDomain: settings.mainLAUrl.replace(/\/+$/, ''),
    signUpURL: `${settings.services.cas.url}/userdetails/registration/createAccount`,
    profileURL: `${settings.services.cas.url}/userdetails/myprofile`,
    fathomID: ''
  };
  fs.writeFileSync(path.join(bs5Dir, 'buildvars.js'), `module.exports = ${JSON.stringify(vars, null, 2)};\n`);
  execSync('npm install --no-audit --no-fund && npx gulp', { cwd: bs5Dir, stdio: 'inherit' });
}

// 2. Static resources of the base
fs.rmSync(out, { recursive: true, force: true });
for (const d of ['css', 'js', 'fonts']) {
  fs.cpSync(path.join(bs5Dir, 'build', d), path.join(out, d), { recursive: true });
}
fs.copyFileSync(path.join(root, 'app/bs5/branding-bs5.css'), path.join(out, 'css/branding-bs5.css'));

// 3. Bootstrap 3 -> 5 markup of the theme fragments
const bs3to5 = html => html
  .replace(/\bdata-(toggle|target|dismiss|placement|parent|ride|slide)\b/g, 'data-bs-$1')
  .replace(/\bhidden-xs hidden-sm\b/g, 'd-none d-md-block')
  .replace(/\bhidden-md hidden-lg\b/g, 'd-md-none')
  .replace(/\bhidden-xs\b/g, 'd-none d-sm-block')
  .replace(/\bhidden-sm\b/g, 'd-sm-none d-md-block')
  .replace(/\bsr-only-focusable\b/g, 'visually-hidden-focusable')
  .replace(/\bsr-only\b/g, 'visually-hidden')
  // navbar-toggle / navbar-default are kept: the theme css styles them (Bootstrap 5 ignores them)
  .replace(/\bnavbar-default\b/g, 'navbar-default navbar-expand-md');

// ::token:: of the BS3 build: runtime values are rendered by the app ({{token}}), the rest at build time
const runtime = ['containerClass', 'loginURL', 'logoutURL', 'searchServer', 'searchPath', 'loginStatus'];
const buildTime = {
  headerFooterServer: baseUrl,
  centralServer: settings.mainLAUrl,
  collectoryURL: settings.services.collectory.url,
  datasetsURL: `${settings.services.collectory.url}/datasets`,
  biocacheURL: settings.services.biocache.url,
  bieURL: settings.services.bie.url,
  regionsURL: settings.services.regions.url,
  listsURL: settings.services.lists.url,
  spatialURL: settings.services.spatial.url,
  casURL: settings.services.cas.url,
  imagesURL: settings.services.images.url,
  buildTimestamp, baseUrl
};
const tokens = txt => txt.replace(/::(\w+)::/g, (m, k) =>
  runtime.includes(k) ? `{{${k}}}` : (k in buildTime ? buildTime[k] : m));

// Theme css: Bootstrap 3 copies are dropped; Bootstrap 3 state classes are mapped to Bootstrap 5 ones
// (.collapse.in -> .collapse.show), the rest of the theme css is used as is.
const themeCssDir = path.join(root, 'app/themes', theme, 'css');
const themeCss = fs.readdirSync(themeCssDir)
  .filter(f => f.endsWith('.css') && !/^bootstrap(-theme)?(\.min)?\.css$/.test(f));
fs.mkdirSync(path.join(out, 'css/theme'), { recursive: true });
for (const f of themeCss) {
  const css = fs.readFileSync(path.join(themeCssDir, f), 'utf8').replace(/\.collapse\.in\b/g, '.collapse.show');
  fs.writeFileSync(path.join(out, 'css/theme', f), css);
}
const themeLinks = themeCss.map(f =>
  `<link rel="stylesheet" href="${baseUrl}/bs5/css/theme/${f}?v=${buildTimestamp}" data-theme="${theme}">`).join('\n');
const initLinks = `<link rel="stylesheet" href="${baseUrl}/css/init.css?v=${buildTimestamp}">\n` +
  `<script defer src="${baseUrl}/js/init.js?v=${buildTimestamp}"></script>`;

const fragment = name => fs.readFileSync(path.join(root, 'app/themes', theme, 'assets', `${name}.html`), 'utf8')
  // es6-promise polyfills are only for IE
  .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/es6-promise[^>]*><\/script>\n?/g, '');

const files = {
  'banner.mustache': `${themeLinks}\n${tokens(bs3to5(fragment('banner')))}\n${initLinks}\n`,
  'footer.mustache': `${tokens(bs3to5(fragment('footer')))}\n`,
  'assets.mustache': tokens(fs.readFileSync(path.join(root, 'app/bs5/assets.mustache'), 'utf8')),
  'head.mustache': tokens(fs.readFileSync(path.join(root, 'app/bs5/head.mustache'), 'utf8'))
};
for (const [name, txt] of Object.entries(files)) {
  const left = txt.match(/::\w+::/g);
  if (left) throw new Error(`${name}: unresolved tokens ${[...new Set(left)].join(', ')}`);
  fs.writeFileSync(path.join(out, name), txt);
}
console.log(`dist/bs5 ready (baseUrl ${baseUrl})`);
