// The big numbers of the home (stats.js) must come out in the page language, even when they
// arrive before i18next has resolved it.
//
// dist/index.html served at settings.mainLAUrl through page.route, with the services stubbed.
// Run after `npm run build`.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import settings from '../../app/js/settings.js';

const root = path.resolve(import.meta.dirname, '../..');
const dist = path.join(root, 'dist');
const types = {
  '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.html': 'text/html',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2'
};
const contentType = file => types[path.extname(file)] || 'application/json';
const json = body => ({ contentType: 'application/json', body: JSON.stringify(body) });

async function openHome(page, lang) {
  const index = path.join(dist, 'index.html');
  if (!fs.existsSync(index)) throw new Error(`${index} not found: run npm run build before the e2e tests`);
  const html = fs.readFileSync(index, 'utf8');
  const base = html.match(/src="(https?:\/\/[^"]+?)\/js\/init[^"]*\.js"/)[1];
  const home = new URL(settings.mainLAUrl).href;
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.href.split('?')[0] === home) return route.fulfill({ contentType: 'text/html', body: html });
    if (url.pathname.endsWith('/occurrences/search')) return route.fulfill(json({ totalRecords: 86965283 }));
    if (url.pathname.endsWith('/occurrence/facets')) return route.fulfill(json([{ count: 412345 }]));
    if (url.pathname.endsWith('/ws/dataResource/count') || url.pathname.endsWith('/ws/institution/count')) return route.fulfill(json({ total: 1234 }));
    const href = url.origin + url.pathname;
    if (href.startsWith(base + '/')) {
      const file = path.join(dist, decodeURIComponent(href.slice(base.length)));
      if (file.startsWith(dist) && fs.existsSync(file) && fs.statSync(file).isFile()) {
        return route.fulfill({ contentType: contentType(file), body: fs.readFileSync(file) });
      }
    }
    return route.abort();
  });
  await page.goto(`${home}?lang=${lang}`);
}

// The login link of the banner must bring the visitor back to the home: with the bare CAS login
// URL (what the build and the ALA apps put there) CAS stays on its own page
test('the home login links return to the home', async ({ page }) => {
  await openHome(page, 'es');
  const hrefs = await page.locator('a.loginBtn').evaluateAll(as => as.map(a => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    const url = new URL(href);
    expect(url.origin + url.pathname).toBe(`${settings.services.cas.url}/cas/login`);
    expect(url.searchParams.get('service')).toBe(new URL(settings.mainLAUrl).href);
  }
});

for (const lang of ['en', 'es']) {
  test(`formats the numbers in ${lang}`, async ({ page }) => {
    await openHome(page, lang);
    const occ = page.locator('#stats_occurrences.loaded_stats');
    await expect(occ).toHaveCount(1);
    expect(await occ.textContent()).toBe(new Intl.NumberFormat(lang).format(86965283));
  });
}
