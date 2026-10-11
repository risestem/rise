const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { resolve } = require('node:path');
const { chromium } = require('playwright');

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5199';
const root = resolve(__dirname, '..');
let server;
let browser;
let passed = 0;
const check = (condition, message) => { assert.ok(condition, message); passed++; };
const pages = ['home', 'kits', 'turtle', 'projects', 'about', 'team', 'curriculum',
  'news_overview', 'issue', 'workshops', 'what-we-do', 'questions'];

async function scrollProgress(page, progress) {
  await page.evaluate(progress => {
    const track = document.getElementById('animationContainer');
    const stage = track.querySelector('.animation-stage');
    window.scrollTo({
      top: scrollY + track.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top)
        + (track.offsetHeight - stage.offsetHeight) * progress,
      behavior: 'instant'
    });
  }, progress);
}

async function main() {
  if (!process.env.SMOKE_BASE_URL) {
    server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5199', '--strictPort'], { cwd: root, stdio: 'pipe' });
    let output = '';
    server.stdout.on('data', data => { output += data; });
    server.stderr.on('data', data => { output += data; });
    let ready = false;
    for (let i = 0; i < 100; i++) {
      try { ready = (await fetch(`${base}/home`)).ok; } catch {}
      if (ready) break;
      if (server.exitCode !== null) throw new Error(`Vite exited: ${output}`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, `Vite did not start: ${output}`);
  }
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox']
  });

  for (const viewport of (process.env.SMOKE_TURTLE_ONLY ? [] : [{ width: 1280, height: 900 }, { width: 390, height: 844 }])) {
    const page = await browser.newPage({ viewport, isMobile: viewport.width < 500, hasTouch: viewport.width < 500 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // Core rendering should work even when fonts, embeds and external image hosts are offline.
    await page.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin
      ? route.continue() : route.abort());
    for (const name of pages) {
      await page.goto(`${base}/${name}`, { waitUntil: 'networkidle' });
      check(errors.length === 0, `${name}: ${errors.join(', ')}`);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}: horizontal overflow`);
      const python = page.locator('a[href="https://python.risestem.org"]');
      check(!((await python.getAttribute('class')).split(' ').includes('text-purple-950')), `${name}: Python IDE marked active`);
      const broken = await page.evaluate(() => [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.src));
      check(broken.length === 0, `${name}: broken images ${broken}`);
    }
    await page.goto(`${base}/home.html`, { waitUntil: 'networkidle' });
    check(await page.locator('nav a[aria-current="page"]').filter({ hasText: 'Home' }).count() === 1, 'Home .html route highlights correctly');
    if (viewport.width < 500) {
      await page.locator('#hamburger-btn').click();
      check(await page.locator('#hamburger-btn').getAttribute('aria-expanded') === 'true', 'Mobile menu opens');
      check(await page.locator('#navbar-sticky').isVisible(), 'Mobile navigation visible');
      await page.locator('#hamburger-btn').click();
      check(!await page.locator('#navbar-sticky').isVisible(), 'Mobile menu closes');
    }
    await page.locator('#open-contact-modal').click();
    check(await page.locator('#contact-modal').isVisible(), 'Contact modal opens after header injection');
    await page.locator('#close-contact-modal').click();
    check(!await page.locator('#contact-modal').isVisible(), 'Contact modal closes');

    await page.goto(`${base}/news_updates?updates=news_updates/RISEfirstupdate.md`, { waitUntil: 'networkidle' });
    check((await page.locator('#news-error').textContent()).trim() === '', 'News Markdown renders offline');
    check(await page.locator('#news-markdown h1').count() === 1, 'News Markdown becomes HTML');
    const newsImage = page.locator('#news-markdown img');
    await page.waitForFunction(() => document.querySelector('#news-markdown img')?.src.endsWith('/logo1.svg'));
    check((await newsImage.getAttribute('src')) === '/logo1.svg', 'Unavailable news photo gets a fallback');

    await page.goto(`${base}/team`, { waitUntil: 'networkidle' });
    await page.locator('[data-profile]').first().click();
    await page.waitForFunction(() => document.querySelector('#profile-markdown h1'));
    check(await page.locator('#profile-markdown img').count() > 0, 'Team profile renders Markdown photos offline');
    await page.locator('#close-profile-modal').click();
    check(await page.locator('#profile-modal').count() === 0, 'Team profile closes');
    check(errors.length === 0, errors.join(', '));
    await page.close();
  }

  for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 568 },
    { width: 740, height: 375 }, { width: 1280, height: 900 }]) {
    const mobile = viewport.width < 800;
    const page = await browser.newPage({ viewport, isMobile: mobile, hasTouch: mobile });
    await page.goto(`${base}/turtle`, { waitUntil: 'networkidle' });
    check(await page.evaluate(() => getComputedStyle(document.body).overflowY !== 'hidden'), 'Turtle never locks page scrolling');
    for (const [progress, section, number] of [[0, 1, 1], [.5, 2, 76], [.95, 3, 143], [.25, 1, 38]]) {
      await scrollProgress(page, progress);
      try {
        // Native scroll offsets round to whole pixels, so allow one adjacent frame.
        await page.waitForFunction(number => {
          const match = document.getElementById('videoFrame').src.match(/turtleExplodev5(\d{5})\.webp$/);
          return match && Math.abs(Number(match[1]) - number) <= 1;
        }, number, { timeout: 10000 });
      } catch (error) {
        console.error('Turtle frame failure', viewport, progress, await page.evaluate(() => ({
          url: document.getElementById('videoFrame').src, scroll: scrollY,
          track: document.getElementById('animationContainer').getBoundingClientRect().toJSON(),
          stage: document.querySelector('.animation-stage').getBoundingClientRect().toJSON()
        })));
        throw error;
      }
      check(await page.locator(`#textSection${section}`).getAttribute('aria-hidden') === 'false', 'Turtle captions follow forward and reverse progress');
      check(await page.evaluate(() => {
        const text = document.querySelector('.scroll-text-section.active').getBoundingClientRect();
        const nav = document.querySelector('nav').getBoundingClientRect();
        return text.top >= nav.bottom && text.bottom <= innerHeight && text.left >= 0 && text.right <= innerWidth;
      }), `Turtle caption fits viewport ${viewport.width}x${viewport.height}`);
    }
    if (mobile) {
      await scrollProgress(page, .3);
      const before = await page.evaluate(() => scrollY);
      const cdp = await page.context().newCDPSession(page);
      const x = Math.round(viewport.width / 2);
      const y = Math.round(viewport.height * .8);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let i = 1; i <= 8; i++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - i * 15 }] });
        await page.waitForTimeout(20);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForFunction(before => scrollY > before + 30, before);
      check(true, 'Real touch swipe scrolls the turtle scene');
    } else {
      await page.locator('.scrollbar-segment').nth(2).click();
      await page.waitForFunction(() => document.getElementById('textSection3').classList.contains('active'));
      check(true, 'Turtle section control navigates the scene');
    }
    await scrollProgress(page, 1.1);
    check(await page.locator('.post-animation-content').isVisible(), 'Content after animation remains accessible');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await scrollProgress(page, .7);
    await page.waitForFunction(() => document.getElementById('videoFrame').src.endsWith('00001.webp'));
    check(true, 'Reduced motion keeps a static turtle frame');
    await page.close();
  }
  console.log(`${passed} browser checks passed (${new URL(base).host}).`);
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  if (server) server.kill('SIGTERM');
});
