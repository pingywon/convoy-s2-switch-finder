/* Retake the three pictures on the landing page from the built demo pages.
   Run tools/build.py first, then this, then tools/build.py again to copy them in.

   PUPPETEER=/path/to/node_modules/puppeteer-core node tools/shots.cjs            */
const path = require('path');
const puppeteer = require(process.env.PUPPETEER || 'puppeteer-core');
const ROOT = path.resolve(__dirname, '..');
const wait = ms => new Promise(r => setTimeout(r, ms));

/* page, picture, clicks to make first, element to put at the top (null = top of page) */
const SHOTS = [
  ['console.html', 'console.png', [], '.steps'],
  ['guided.html', 'guided.png', ['[data-h="black"]', '[data-em="519a - 4000K"]', '[data-sw="metal"]', '[data-led="Green"]'], '.stp[data-n="4"]'],
  ['board.html', 'board.png', [], '.steps'],
];

(async () => {
  const browser = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-gpu']});
  for (const [page, png, clicks, anchor] of SHOTS) {
    const p = await browser.newPage();
    await p.setViewport({width: 1200, height: 750});
    await p.goto('file://' + path.join(ROOT, '_site', page), {waitUntil: 'load'});
    await p.addStyleTag({content: 'html{scroll-behavior:auto!important}.shelltop,.bar{display:none!important}'});
    for (const sel of clicks) {
      await p.evaluate(s => document.querySelector(s).click(), sel);
      await wait(60);
    }
    await wait(1600);   /* let the page's own smooth scroll finish before placing the view */
    await p.evaluate(s => {
      const e = s && document.querySelector(s);
      window.scrollTo(0, e ? e.getBoundingClientRect().top + window.pageYOffset - 14 : 0);
    }, anchor);
    await wait(250);
    await p.screenshot({path: path.join(ROOT, 'site-src', 'img', png)});
    console.log('wrote site-src/img/' + png);
    await p.close();
  }
  await browser.close();
})();
