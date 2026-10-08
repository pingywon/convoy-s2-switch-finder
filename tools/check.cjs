/* Drives the real pages in headless Chromium with real mouse clicks.
   Store page bodies are tested as the store runs them (cart POST answered by a stub);
   the demo site in _site/ is tested in demo mode. Nothing leaves this machine.

   PUPPETEER=/path/to/node_modules/puppeteer-core node tools/check.cjs            */
const fs = require('fs');
const path = require('path');
const puppeteer = require(process.env.PUPPETEER || 'puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
const VERSION = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();
const BASE = 'http://s2.test/';
const TAKES = [
  ['storefront-v1-console.html', 'console.html'],
  ['storefront-v2-guided.html', 'guided.html'],
  ['storefront-v3-board.html', 'board.html'],
];
const VID = {black: 51141102076219, metalRed: 45259754471739, clear: 50903798841659,
             purpleBtn: 50903776330043, pressClip: 45014025568571};

let failed = 0, passed = 0;
function ok(cond, name, detail) {
  if (cond) { passed++; console.log('  ok    ' + name); }
  else { failed++; console.log('  FAIL  ' + name + (detail ? '  -> ' + detail : '')); }
}

async function open(browser, html, addStatus) {
  const page = await browser.newPage();
  await page.setViewport({width: 1280, height: 900});
  const seen = {posts: [], errors: [], outside: []};
  page.on('pageerror', e => seen.errors.push(String(e.message || e)));
  page.on('console', m => { if (m.type() === 'error') seen.errors.push(m.text()); });
  await page.setRequestInterception(true);
  page.on('request', req => {
    const u = req.url();
    if (u === BASE + 'page.html') return req.respond({status: 200, contentType: 'text/html', body: html});
    if (u === BASE + 'cart/add.js') {
      seen.posts.push(JSON.parse(req.postData() || '{}'));
      return req.respond({status: addStatus, contentType: 'application/json', body: '{}'});
    }
    if (u === BASE + 'cart') return req.respond({status: 200, contentType: 'text/html', body: '<title>CART</title>'});
    if (u.startsWith('data:')) return req.continue();
    if (u === BASE + 'favicon.ico') return req.respond({status: 204, body: ''});
    if (u.startsWith(BASE + 'img/')) {
      const f = path.join(ROOT, '_site', u.slice(BASE.length));
      return fs.existsSync(f) ? req.respond({status: 200, contentType: 'image/png', body: fs.readFileSync(f)})
                              : req.respond({status: 404, body: ''});
    }
    seen.outside.push(u);
    return req.abort();
  });
  /* smooth scrolling moves buttons while the mouse is on its way; make it instant */
  await page.evaluateOnNewDocument(() => {
    const st = window.scrollTo.bind(window);
    window.scrollTo = (a, b) => (a && typeof a === 'object') ? st(a.left || 0, a.top || 0) : st(a, b);
    Element.prototype.scrollIntoView = function () { st(0, this.getBoundingClientRect().top + window.pageYOffset - 100); };
  });
  await page.goto(BASE + 'page.html', {waitUntil: 'load'});
  page.seen = seen;
  return page;
}
/* a real mouse click, with the target first scrolled clear of the fixed bottom bar */
const click = async (page, sel) => {
  await page.evaluate(s => {
    const e = document.querySelector(s);
    if (e) window.scrollTo(0, e.getBoundingClientRect().top + window.pageYOffset - 300);
  }, sel);
  await page.click(sel);
  await new Promise(r => setTimeout(r, 40));
};
const st = (page, expr) => page.evaluate(expr);
async function start(page, host) {
  await click(page, '[data-h="' + host + '"]');
  await click(page, '[data-em="519a - 4000K"]');
}

async function storeChecks(browser, file) {
  const frag = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const html = '<!doctype html><meta charset="utf-8"><body style="background:#070d13;margin:0;padding:20px">' + frag;
  console.log('\n' + file + '  (as the store runs it)');
  let p;

  p = await open(browser, html, 200);
  await start(p, 'black');
  await click(p, '[data-sw="metal"]');
  await click(p, '[data-btn="Clear Plastic"]');
  await click(p, '[data-led="Red"]');
  await click(p, '[data-clip="press"]');
  await click(p, '#ack');
  ok(await st(p, 'ready()'), 'a complete build is ready to add',
     await st(p, 'JSON.stringify({host:S.host&&S.host.id,em:S.em,sw:S.sw&&S.sw.id,btn:S.btn&&S.btn[0],led:S.led&&S.led[0],clip:S.clip&&S.clip.k,ack:S.ack})'));
  ok(await st(p, 'document.body.innerText.includes("v' + VERSION + '")'), 'version ' + VERSION + ' is shown on the page');
  ok(await st(p, '(function(){var s={},d=0;document.querySelectorAll("[id]").forEach(function(e){if(s[e.id])d++;s[e.id]=1});return d})()') === 0,
     'no element id is used twice');
  await Promise.all([p.waitForNavigation({timeout: 5000}).catch(() => {}), p.click('#addcart').catch(() => {})]);
  const items = (p.seen.posts[0] || {}).items || [];
  ok(p.url() === BASE + 'cart', 'after adding, the customer lands on the cart', p.url());
  ok(JSON.stringify(items.map(i => i.id)) === JSON.stringify([VID.black, VID.metalRed, VID.pressClip, VID.clear]),
     'cart gets the light, the switch, the clip and the button', JSON.stringify(items.map(i => i.id)));
  const pr = (items[0] || {}).properties || {};
  ok(pr['Emitter'] === '519a - 4000K' && pr['Reflector'] === 'OP - Orange Peel (More Spill)' &&
     pr['Optic / lens'] === 'Default (Glass)' && pr['Please fit'] === 'Metal Illuminated (Red) + Clear Plastic button' &&
     pr['Agreed'] === 'Non-returnable custom build', 'the light carries the full build note', JSON.stringify(pr));
  ok(items.length === 4 && items.every(i => i.properties._gc_build === 'Build 1'), 'every line carries the same build tag');
  ok(p.seen.errors.length === 0, 'no script errors', p.seen.errors.join(' | '));
  await p.close();

  p = await open(browser, html, 200);
  await start(p, 'black');
  await click(p, '[data-sw="metal"]');
  await click(p, '[data-btn="Purple"]');
  await click(p, '[data-sw="rubber"]');
  ok(await st(p, 'S.btn===null && cartItems().every(function(i){return i.id!==' + VID.purpleBtn + '})'),
     'changing from the metal to the rubber switch drops the metal centre button',
     await st(p, 'JSON.stringify(lines().map(function(l){return l.n}))'));
  await p.close();

  p = await open(browser, html, 200);
  await start(p, 'blue');
  await click(p, '#presslit');
  ok(await st(p, 'S.presslit===true && !!S.sw && S.sw.id==="metal" && !!S.btn && S.btn[0]==="Clear Plastic"'),
     'the "Add centre glow" button can be clicked on a pressed-in finish');
  await p.close();

  p = await open(browser, html, 200);
  await start(p, 'blue');
  await click(p, '[data-btn="Clear Plastic"]');
  ok(await st(p, 'S.presslit===true && !!S.sw && S.sw.id==="metal" && glow().t==="Centre glows"'),
     'pressed-in finish: picking the clear centre brings the metal lit switch with it');
  await click(p, '[data-btn="Red"]');
  ok(await st(p, 'S.presslit===false && S.sw===null && glow().t==="Outer ring glows" && lines().every(function(l){return l.role!=="Tail switch"})'),
     'pressed-in finish: a solid centre drops the switch and stops promising a centre glow',
     await st(p, 'JSON.stringify({presslit:S.presslit,sw:S.sw&&S.sw.id,glow:glow().t})'));
  await p.close();

  p = await open(browser, html, 200);
  await start(p, 'black');
  await p.type('.namebox input', 'Work light');
  ok(await st(p, 'document.querySelector(".buildtag").innerText.includes("Work light")'),
     'the tag line follows the build name as it is typed');
  await p.close();

  p = await open(browser, html, 200);
  await start(p, 'black');
  await p.type('.nickrow input', 'Dad');
  ok(await st(p, 'document.querySelector(".namebox input").value==="Dad"'), 'the two name boxes always show the same name');
  await click(p, '[data-clip="none"]');
  ok(await st(p, 'S.nick==="Dad" && cartItems()[0].properties._gc_build==="Dad"'),
     'a build name typed in the lower box is kept', await st(p, 'JSON.stringify(S.nick)'));
  await p.close();

  p = await open(browser, html, 200);
  const soldOut = await st(p, 'HOSTS.filter(function(h){return h.oos}).map(function(h){return h.id})');
  for (const id of soldOut) await click(p, '[data-h="' + id + '"]');
  ok(await st(p, 'S.host===null') && (await st(p, 'Array.prototype.every.call(document.querySelectorAll("[data-oos]"),function(b){return b.disabled})')),
     'a sold-out finish is shown but cannot start a build (' + (soldOut.join(', ') || 'none flagged') + ')');
  await p.close();

  p = await open(browser, html, 500);
  await start(p, 'brass');
  await click(p, '[data-sw="forward"]');
  await click(p, '[data-clip="none"]');
  await click(p, '#ack');
  await click(p, '#addcart');
  await new Promise(r => setTimeout(r, 400));
  ok(p.seen.posts.length === 1 && p.url() === BASE + 'page.html', 'when the cart refuses, the customer stays on the page', p.url());
  ok(await st(p, '(function(){var b=document.getElementById("addcart");return !!b&&!b.disabled&&b.textContent.indexOf("Adding")<0})()'),
     'when the cart refuses, the button comes back',
     await st(p, '(function(){var b=document.getElementById("addcart");return b?b.textContent+" disabled="+b.disabled:"no button"})()'));
  ok(await st(p, '!!document.querySelector(".carterr") && /not added/i.test(document.querySelector(".carterr").innerText)'),
     'when the cart refuses, the page says so');
  ok(p.seen.errors.filter(e => !/500/.test(e)).length === 0, 'no script errors on a refused cart', p.seen.errors.join(' | '));
  await p.close();
}

async function demoChecks(browser, page) {
  const file = path.join(ROOT, '_site', page);
  if (!fs.existsSync(file)) { ok(false, '_site/' + page + ' exists (run tools/build.py first)'); return; }
  console.log('\n_site/' + page + '  (public demo copy)');
  const p = await open(browser, fs.readFileSync(file, 'utf8'), 200);
  await start(p, 'black');
  await click(p, '[data-sw="metal"]');
  await click(p, '[data-btn="Clear Plastic"]');
  await click(p, '[data-led="Red"]');
  await click(p, '[data-clip="press"]');
  await click(p, '#ack');
  await click(p, '#addcart');
  await new Promise(r => setTimeout(r, 300));
  ok(p.seen.posts.length === 0 && p.url() === BASE + 'page.html', 'demo: the button sends nothing and goes nowhere');
  ok(await st(p, '!!document.querySelector(".demoout") && /nothing was added/i.test(document.querySelector(".demoout").innerText)'),
     'demo: the page says nothing was added');
  ok(await st(p, 'document.querySelectorAll(".demoout .part").length') === 4, 'demo: all four cart lines are listed');
  ok(await st(p, 'document.body.innerText.includes("v' + VERSION + '")'), 'demo: version ' + VERSION + ' is shown');
  ok(await st(p, 'document.documentElement.scrollWidth<=window.innerWidth'), 'demo: no sideways scroll at desktop width');
  await p.setViewport({width: 390, height: 800});
  ok(await st(p, 'document.documentElement.scrollWidth<=window.innerWidth'), 'demo: no sideways scroll at phone width',
     await st(p, 'document.documentElement.scrollWidth+" > "+window.innerWidth'));
  ok(p.seen.outside.length === 0, 'demo: the page loads nothing from other sites', p.seen.outside.join(' '));
  ok(p.seen.errors.length === 0, 'demo: no script errors', p.seen.errors.join(' | '));
  await p.close();
}

/* No dead ends: every finish that can be picked must reach a finished build down every
   kind of path, at phone size. The rules are shared, so one take is enough. */
async function everyFinishChecks(browser) {
  const file = path.join(ROOT, '_site', 'console.html');
  if (!fs.existsSync(file)) { ok(false, '_site/console.html exists (run tools/build.py first)'); return; }
  console.log('\n_site/console.html  (every finish, phone size)');
  const p = await open(browser, fs.readFileSync(file, 'utf8'), 200);
  await p.setViewport({width: 390, height: 800});
  const hosts = await st(p, 'HOSTS.filter(function(h){return !h.oos}).map(function(h){return {id:h.id,v:h.v,n:h.n}})');
  const PATHS = {
    full: [['[data-sw="rubber"]', '[data-btn="Translucent / White"]', '[data-led="Blue"]'],
           ['[data-sw="metal"]', '[data-btn="Clear Plastic"]', '[data-led="Red"]'],
           ['[data-sw="forward"]']],
    center: [[], ['[data-btn="Tan"]'], ['[data-btn="Clear Plastic"]', '[data-led="Green"]'], ['#presslit', '[data-led="White"]']],
    unknown: [[]],
  };
  const stuck = [];
  let walked = 0;
  for (const h of hosts) {
    for (const steps of PATHS[h.v]) {
      await p.reload({waitUntil: 'load'});
      try {
        await start(p, h.id);
        for (const sel of steps) await click(p, sel);
        await click(p, '[data-clip="none"]');
        await click(p, '#ack');
        if (!(await st(p, 'ready()'))) throw new Error('not ready');
        await click(p, '#addcart');
        if ((await st(p, 'document.querySelectorAll(".demoout .part").length')) !== (await st(p, 'cartItems().length'))) throw new Error('result list is wrong');
      } catch (e) { stuck.push(h.n + ' via ' + (steps.join(' ') || 'no extras') + ': ' + e.message); }
      walked++;
    }
  }
  ok(stuck.length === 0, 'all ' + walked + ' paths across ' + hosts.length + ' finishes reach a finished build', stuck.join(' | '));
  ok(p.seen.errors.length === 0, 'every finish: no script errors', p.seen.errors.join(' | '));
  await p.close();
}

async function landingChecks(browser) {
  const file = path.join(ROOT, '_site', 'index.html');
  if (!fs.existsSync(file)) { ok(false, '_site/index.html exists (run tools/build.py first)'); return; }
  console.log('\n_site/index.html  (landing page)');
  const html = fs.readFileSync(file, 'utf8');
  const p = await open(browser, html, 200);
  ok(await st(p, 'document.body.innerText.includes("v' + VERSION + '")'), 'landing: version ' + VERSION + ' is shown');
  const links = await st(p, 'Array.prototype.map.call(document.querySelectorAll("a[href]"),function(a){return a.getAttribute("href")})');
  ok(TAKES.every(t => links.includes(t[1])), 'landing: links to all three takes', links.join(' '));
  const local = links.concat(await st(p, 'Array.prototype.map.call(document.querySelectorAll("img[src]"),function(a){return a.getAttribute("src")})'))
    .filter(h => !/^(https?:|data:|#)/.test(h));
  const missing = local.filter(h => !fs.existsSync(path.join(ROOT, '_site', h)));
  ok(missing.length === 0, 'landing: every local link and picture exists', missing.join(' '));
  await p.setViewport({width: 390, height: 800});
  ok(await st(p, 'document.documentElement.scrollWidth<=window.innerWidth'), 'landing: no sideways scroll at phone width');
  ok(p.seen.errors.filter(e => !/ERR_FAILED|ERR_BLOCKED/.test(e)).length === 0, 'landing: no script errors', p.seen.errors.join(' | '));
  await p.close();
}

(async () => {
  const browser = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-gpu']});
  try {
    const only = process.argv[2];
    for (const [storeFile, demoPage] of TAKES) {
      if (only !== 'site') await storeChecks(browser, storeFile);
      if (only !== 'store') await demoChecks(browser, demoPage);
    }
    if (only !== 'store') await everyFinishChecks(browser);
    if (only !== 'store') await landingChecks(browser);
  } finally { await browser.close(); }
  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})();
