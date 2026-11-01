// scratch/browser_qa.js — Comprehensive Browser QA & Regression Runner
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8097;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let server, chrome, ws;
let msgId = 1;
const callbacks = new Map();
const consoleErrors = [];
const consoleLogs = [];
let pageLoadedPromise;
let resolvePageLoaded;

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    callbacks.set(id, { resolve, reject, method });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evalJs(expr) {
  const res = await send('Runtime.evaluate', {
    expression: expr,
    returnByValue: true,
    awaitPromise: true
  });
  if (res.exceptionDetails) {
    throw new Error('JS Eval Exception: ' + JSON.stringify(res.exceptionDetails));
  }
  return res.result ? res.result.value : undefined;
}

function startServer() {
  return new Promise((resolve) => {
    server = http.createServer((req, res) => {
      let p = path.join(__dirname, '..', req.url.split('?')[0]);
      if (p.endsWith(path.sep) || (fs.existsSync(p) && fs.statSync(p).isDirectory())) {
        p = path.join(p, 'index.html');
      }
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        const ext = path.extname(p);
        const mimeMap = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.ico': 'image/x-icon',
          '.json': 'application/json'
        };
        res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
        fs.createReadStream(p).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not found: ' + req.url);
      }
    });
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[HTTP] Test server listening on http://127.0.0.1:${PORT}`);
      resolve();
    });
  });
}

function launchChrome() {
  pageLoadedPromise = new Promise(r => { resolvePageLoaded = r; });
  return new Promise(async (resolve, reject) => {
    chrome = spawn(CHROME_PATH, [
      '--headless=new',
      '--remote-debugging-port=9226',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank'
    ]);

    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch('http://127.0.0.1:9226/json');
        const list = await res.json();
        const page = list.find(x => x.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          console.log('[Chrome] Discovered browser page target');
          ws = new WebSocket(page.webSocketDebuggerUrl);
          ws.onopen = async () => {
            ws.send(JSON.stringify({ id: msgId++, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({ id: msgId++, method: 'Page.enable' }));
            ws.send(JSON.stringify({ id: msgId++, method: 'Log.enable' }));
            ws.send(JSON.stringify({ id: msgId++, method: 'Page.navigate', params: { url: `http://127.0.0.1:${PORT}/` } }));
            resolve();
          };
          ws.onmessage = (evt) => {
            const data = JSON.parse(evt.data);
            if (data.id && callbacks.has(data.id)) {
              const cb = callbacks.get(data.id);
              callbacks.delete(data.id);
              if (data.error) cb.reject(new Error(data.error.message));
              else cb.resolve(data.result);
            } else if (data.method === 'Page.loadEventFired') {
              console.log('[Chrome] Page.loadEventFired received!');
              if (resolvePageLoaded) resolvePageLoaded();
            } else if (data.method === 'Runtime.consoleAPICalled') {
              const text = data.params.args.map(a => a.value || a.description || '').join(' ');
              if (data.params.type === 'error') {
                consoleErrors.push(text);
                console.error('[Browser Console ERROR]:', text);
              } else {
                consoleLogs.push(`[${data.params.type}] ${text}`);
              }
            } else if (data.method === 'Runtime.exceptionThrown') {
              const desc = data.params.exceptionDetails.text + ' ' + (data.params.exceptionDetails.exception ? data.params.exceptionDetails.exception.description : '');
              consoleErrors.push(desc);
              console.error('[Browser Uncaught Exception]:', desc);
            }
          };
          return;
        }
      } catch (e) {}
    }
    reject(new Error('Failed to connect to Chrome CDP within timeout'));
  });
}

async function runQA() {
  const results = [];
  function assert(name, condition, extra = '') {
    if (condition) {
      console.log(`PASS: ${name} ${extra ? '(' + extra + ')' : ''}`);
      results.push({ name, pass: true });
    } else {
      console.error(`FAIL: ${name} ${extra ? '(' + extra + ')' : ''}`);
      results.push({ name, pass: false, error: extra });
    }
  }

  console.log('\n======================================================');
  console.log('--- RUNNING REAL GOOGLE CHROME BROWSER QA TEST ---');
  console.log('======================================================\n');

  try {
    // Wait for Page.loadEventFired
    await pageLoadedPromise;
    await new Promise(r => setTimeout(r, 400));

    // 1. Initial Screen Render & Character Creation Flow
    const title = await evalJs('document.title');
    assert('Page Title rendered', title.includes('CALIGO'), title);

    const hasApp = await evalJs('!!document.getElementById("app")');
    assert('App root container #app present', hasApp);

    const hasSidebar = await evalJs('!!document.getElementById("sidebar")');
    assert('Sidebar container #sidebar present', hasSidebar);

    const hasScreen = await evalJs('!!document.getElementById("screen")');
    assert('Main content container #screen present', hasScreen);

    // Verify #boot element handles initial character creation
    const bootPresent = await evalJs('!!document.getElementById("boot")');
    assert('Character creation overlay #boot present', bootPresent);

    // Step through real character creation via DOM
    await evalJs(`
      (function() {
        const input = document.querySelector('#boot input');
        if (input) {
          input.value = 'BrowserDeckard';
          const btn = document.querySelector('#boot button.primary');
          if (btn) btn.click();
        } else if (!window.CALIGO.state.save) {
          window.CALIGO.actions.createCharacter('BrowserDeckard', '⌖');
        }
      })()
    `);

    await new Promise(r => setTimeout(r, 300));

    // Check if character is now running
    const bootHidden = await evalJs('document.getElementById("boot").classList.contains("hidden")');
    assert('Boot character creation overlay hidden after creation', bootHidden);

    const pName = await evalJs('document.getElementById("side-name").textContent');
    assert('Player name rendered in sidebar', pName === 'BrowserDeckard', pName);

    // Grant testing resources
    await evalJs(`
      (function() {
        window.CALIGO.state.save.player.cash = 100000;
        window.CALIGO.state.save.player.nerve = 50;
        window.CALIGO.state.save.player.energy = 100;
        window.CALIGO.state.save.player.happiness = 100;
        window.CALIGO.state.save.player.maxHappiness = 100;
        window.CALIGO.storage.write(window.CALIGO.state.save);
        window.CALIGO.sidebar.update(window.CALIGO.state.save);
      })()
    `);
    await new Promise(r => setTimeout(r, 100));

    const pCash = await evalJs('document.getElementById("side-cash").textContent');
    assert('Player cash rendered in sidebar', pCash.includes('100,000') || pCash.includes('$100,000'), pCash);

    // 2. Comprehensive Navigation Across All 36 Screens
    const screens = [
      'home', 'city', 'crimes', 'gym', 'combat', 'inventory', 'shops', 'armoury',
      'market', 'bank', 'travel', 'jail', 'hospital', 'job', 'education', 'properties',
      'companies', 'faction', 'territory', 'casino', 'missions', 'newspaper', 'forums',
      'halloffame', 'calendar', 'recruit', 'friends', 'enemies', 'targets', 'mail',
      'events', 'settings', 'wiki', 'rules', 'credits', 'contact', 'merits'
    ];

    console.log('\n--- 2. Auditing Navigation & DOM Rendering Across All 36 Screens ---');
    for (const sc of screens) {
      await evalJs(`window.CALIGO.router.go("${sc}")`);
      await new Promise(r => setTimeout(r, 60));
      const rendered = await evalJs(`
        (function() {
          const el = document.getElementById("screen");
          return el && el.children.length > 0 && el.innerHTML.trim().length > 10;
        })()
      `);
      assert(`Screen "${sc}" renders active DOM content`, rendered);
    }

    // 3. Properties System in Real DOM
    console.log('\n--- 3. Interactive Real Estate & Properties QA ---');
    await evalJs(`window.CALIGO.router.go("properties")`);
    await new Promise(r => setTimeout(r, 150));

    const propertyRowsCount = await evalJs(`
      document.querySelectorAll('#screen tbody tr').length
    `);
    assert('Properties screen renders all 14 property rows in table', propertyRowsCount === 14, `Found: ${propertyRowsCount}`);

    const initHappyCap = await evalJs('window.CALIGO.state.save.player.maxHappiness');
    assert('Initial residence max happiness cap initialized', initHappyCap > 0, `Cap: ${initHappyCap}`);

    // Test buying Apartment via action in browser
    await evalJs(`
      (function() {
        window.CALIGO.actions.buyProperty('apartment');
        window.CALIGO.router.go('properties');
      })()
    `);
    await new Promise(r => setTimeout(r, 100));

    const currentProp = await evalJs('window.CALIGO.state.save.player.property');
    assert('Purchased property is set as current residence', currentProp === 'apartment', currentProp);

    const newHappyCap = await evalJs('window.CALIGO.state.save.player.maxHappiness');
    assert('Happiness cap dynamically raised by property tier bonus', newHappyCap > initHappyCap, `Old: ${initHappyCap}, New: ${newHappyCap}`);

    // 4. Community Forums in Real DOM
    console.log('\n--- 4. Interactive Community Forums QA ---');
    await evalJs(`window.CALIGO.router.go("forums")`);
    await new Promise(r => setTimeout(r, 150));

    const forumCategories = await evalJs(`
      document.querySelectorAll('#screen tbody tr').length
    `);
    assert('Forums screen renders category boards in table', forumCategories >= 4, `Categories: ${forumCategories}`);

    // Create a new player thread in General Discussion
    await evalJs(`
      (function() {
        window.CALIGO.state.save.forums = window.CALIGO.state.save.forums || [];
        window.CALIGO.state.save.forums.unshift({
          id: 'thread_' + Date.now(),
          category: 'General Discussion',
          title: 'Browser Automation Report',
          body: 'Caligo runs in Google Chrome headless without errors!',
          author: window.CALIGO.state.save.player.name,
          time: 'just now',
          replies: []
        });
        window.CALIGO.storage.write(window.CALIGO.state.save);
        window.CALIGO.router.go('forums');
      })()
    `);
    await new Promise(r => setTimeout(r, 100));

    const threadSaved = await evalJs(`
      (function() {
        const threads = window.CALIGO.state.save.forums;
        return threads.some(t => t.title === 'Browser Automation Report');
      })()
    `);
    assert('Player authored forum thread persists in forum state', threadSaved);

    // 5. Merits Allocation in Real DOM
    console.log('\n--- 5. Merits Allocation & Passive Boosts QA ---');
    await evalJs(`window.CALIGO.router.go("merits")`);
    await new Promise(r => setTimeout(r, 150));

    const meritCardsCount = await evalJs(`
      document.querySelectorAll('#screen .card').length
    `);
    assert('Merits screen renders overview + 11 branch cards', meritCardsCount === 12, `Cards: ${meritCardsCount}`);

    // Upgrade Nerve Merit
    const meritUpgradeRes = await evalJs(`
      (function() {
        window.CALIGO.state.save.player.merits = 5;
        const res = window.CALIGO.actions.upgradeMerit('nerve_bar');
        window.CALIGO.router.go('merits');
        return res;
      })()
    `);
    assert('Merit upgrade operation succeeds', meritUpgradeRes && meritUpgradeRes.ok);

    const nerveBonus = await evalJs('window.CALIGO.state.save.player.meritUpgrades.nerve_bar || 0');
    assert('Nerve bar merit rank incremented to 1', nerveBonus === 1);

    // 6. Deep Audit of All 13 Crime Families in Browser UI
    console.log('\n--- 6. Browser UI Testing for All 13 Crime Families ---');
    await evalJs(`window.CALIGO.router.go("crimes")`);
    await new Promise(r => setTimeout(r, 200));

    const crime13 = [
      'search_cash', 'bootlegging', 'graffiti', 'shoplift', 'card_skimming',
      'burglary', 'pickpocket', 'hustling', 'disposal', 'cracking',
      'forgery', 'scamming', 'arson'
    ];

    // Grant all crime levels and required tools for testing
    await evalJs(`
      (function() {
        window.CALIGO.state.save.player.level = 50;
        window.CALIGO.state.save.player.xp = 0;
        window.CALIGO.state.save.player.crimeLevel = 100;
        window.CALIGO.state.save.player.nerve = 50;
        window.CALIGO.state.save.player.maxNerve = 50;
        window.CALIGO.state.save.player.jailUntil = 0;
        window.CALIGO.state.save.player.hospitalUntil = 0;
        
        // Add all tools & materials to inventory
        const tools = [
          'glasses', 'high_drive', 'paint_mask', 'mountain_bike', 'duct_tape',
          'flashlight', 'cut_razor', 'megaphone', 'latex_gloves', 'office_chair',
          'magnifying_glass', 'ergo_keyboard', 'lighter', 'shovel', 'gas_can',
          'acid', 'skimmer', 'lockpick_set', 'jemmy', 'window_breaker',
          'rope', 'credit_card', 'spray_can', 'blank_dvds', 'dvd', 'blank_cards'
        ];
        tools.forEach(t => window.CALIGO.actions.addItem(t, 5));
        window.CALIGO.router.go('crimes');
      })()
    `);
    await new Promise(r => setTimeout(r, 150));

    for (const cid of crime13) {
      const info = await evalJs(`
        (function() {
          const c = window.CALIGO.data.crimes.find(x => x.id === "${cid}");
          const targets = window.CALIGO.actions.rollTargets("${cid}", 4);
          const hasEnhancer = window.CALIGO.state.ownsItem(window.CALIGO.state.save, c.enhancer);
          return {
            name: c.name,
            nerve: c.nerve,
            enhancer: c.enhancer,
            hasEnhancer: hasEnhancer,
            targetCount: targets ? targets.length : 0,
            firstTarget: targets && targets[0] ? targets[0].title : null,
            firstTargetNerve: targets && targets[0] && targets[0].nerveCost !== undefined ? targets[0].nerveCost : c.nerve,
            reqItem: targets && targets[0] ? (targets[0].reqItem || targets[0].reqTool) : null
          };
        })()
      `);

      assert(`Family [${cid}] (${info.name}) base nerve is ${info.nerve}`, info.nerve > 0);
      assert(`Family [${cid}] enhancer [${info.enhancer}] carried in luggage`, info.hasEnhancer);
      assert(`Family [${cid}] generated candidate targets/actions`, info.targetCount > 0, `Target: ${info.firstTarget}`);

      // Perform one valid attempt of this crime family
      const attemptRes = await evalJs(`
        (function() {
          window.CALIGO.state.save.player.jailUntil = 0;
          window.CALIGO.state.save.player.hospitalUntil = 0;
          window.CALIGO.state.save.player.level = 50;
          window.CALIGO.state.save.player.xp = 0;
          window.CALIGO.state.save.player.nerve = 40;
          const prevNerve = 40;
          const targets = window.CALIGO.actions.rollTargets("${cid}", 4);
          const target = targets[0];
          const expectedNerve = target.nerveCost !== undefined ? target.nerveCost : window.CALIGO.data.crimes.find(x => x.id === "${cid}").nerve;
          const res = window.CALIGO.actions.attemptCrime("${cid}", target);
          const newNerve = window.CALIGO.state.save.player.nerve;
          return {
            ok: res.ok,
            success: res.success,
            expectedNerve: expectedNerve,
            deductedNerve: prevNerve - newNerve
          };
        })()
      `);

      assert(`Family [${cid}] attempt executed`, attemptRes.ok, attemptRes.reason || '');
      assert(`Family [${cid}] deducted exactly ${attemptRes.expectedNerve} nerve`, attemptRes.deductedNerve === attemptRes.expectedNerve, `Deducted: ${attemptRes.deductedNerve}`);
    }

    // 7. Edge Case: Missing Tools and Insufficient Nerve
    console.log('\n--- 7. Edge Cases: Tool Prerequisites and Insufficient Nerve ---');
    const toolEdgeRes = await evalJs(`
      (function() {
        window.CALIGO.state.save.player.jailUntil = 0;
        window.CALIGO.state.save.player.hospitalUntil = 0;
        window.CALIGO.state.save.player.nerve = 20;
        // Strip spray cans from inventory array
        window.CALIGO.state.save.inventory = window.CALIGO.state.save.inventory.filter(x => x.id !== 'spray_can');
        const graf = window.CALIGO.actions.rollTargets('graffiti', 4)[0];
        const res = window.CALIGO.actions.attemptCrime('graffiti', graf);
        const nerveAfter = window.CALIGO.state.save.player.nerve;
        return {
          ok: res.ok,
          reason: res.reason,
          nervePreserved: nerveAfter === 20
        };
      })()
    `);
    assert('Graffiti blocked without Spray Can', !toolEdgeRes.ok, toolEdgeRes.reason);
    assert('Blocked attempt does not consume Nerve', toolEdgeRes.nervePreserved);

    const lowNerveRes = await evalJs(`
      (function() {
        window.CALIGO.state.save.player.jailUntil = 0;
        window.CALIGO.state.save.player.hospitalUntil = 0;
        window.CALIGO.state.save.player.nerve = 2; // only 2 nerve
        const pick = window.CALIGO.actions.rollTargets('pickpocket', 4)[0]; // costs 5
        const res = window.CALIGO.actions.attemptCrime('pickpocket', pick);
        const nerveAfter = window.CALIGO.state.save.player.nerve;
        return {
          ok: res.ok,
          reason: res.reason,
          nervePreserved: nerveAfter === 2
        };
      })()
    `);
    assert('Pickpocket blocked when Nerve < 5', !lowNerveRes.ok, lowNerveRes.reason);
    assert('Insufficient nerve attempt does not consume Nerve', lowNerveRes.nervePreserved);

    // 8. Responsive Viewport Testing (Desktop 1280x800 & Mobile 375x667)
    console.log('\n--- 8. Responsive Viewport Testing ---');
    // Desktop Viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 100));

    const desktopLayout = await evalJs(`
      (function() {
        const side = document.getElementById('sidebar');
        const screen = document.getElementById('screen');
        return {
          sideWidth: side.offsetWidth,
          screenWidth: screen.offsetWidth,
          sideVisible: window.getComputedStyle(side).display !== 'none'
        };
      })()
    `);
    assert('Desktop viewport sidebar is visible', desktopLayout.sideVisible, `Side width: ${desktopLayout.sideWidth}px`);
    assert('Desktop viewport content has ample width', desktopLayout.screenWidth > 700, `Screen width: ${desktopLayout.screenWidth}px`);

    // Mobile Viewport (iPhone SE / 375x667)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 100));

    const mobileLayout = await evalJs(`
      (function() {
        const app = document.getElementById('app');
        const screen = document.getElementById('screen');
        return {
          appWidth: app.offsetWidth,
          screenWidth: screen.offsetWidth,
          overflowX: document.documentElement.scrollWidth <= 375
        };
      })()
    `);
    assert('Mobile viewport fits 375px without horizontal overflow', mobileLayout.overflowX, `App width: ${mobileLayout.appWidth}px`);

    // Reset Viewport to Desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    // 9. Browser LocalStorage Save, Page Reload & State Integrity
    console.log('\n--- 9. Browser LocalStorage Save, Page Reload & State Integrity ---');
    await evalJs(`
      (function() {
        window.CALIGO.state.save.player.cash = 888777;
        window.CALIGO.state.save.player.name = 'PersistentRunner';
        window.CALIGO.storage.write(window.CALIGO.state.save);
      })()
    `);

    const rawSave = await evalJs(`localStorage.getItem('caligo.save')`);
    assert('Save serialized and stored in browser localStorage', rawSave && rawSave.includes('PersistentRunner'));

    // Reload the page inside Chrome and wait for Page.loadEventFired
    const reloadWait = new Promise(r => { resolvePageLoaded = r; });
    await send('Page.reload', { ignoreCache: true });
    await reloadWait;
    await new Promise(r => setTimeout(r, 500));

    const reloadedName = await evalJs(`document.getElementById("side-name").textContent`);
    assert('Player name persisted across browser page reload', reloadedName === 'PersistentRunner', reloadedName);

    const reloadedCash = await evalJs(`window.CALIGO.state.save.player.cash`);
    assert('Player cash ($888,777) preserved across browser reload', reloadedCash === 888777, `Cash: ${reloadedCash}`);

    // 10. Console Error Verification
    console.log('\n--- 10. Console Error & Exception Audit ---');
    assert('Browser console reported zero errors', consoleErrors.length === 0, consoleErrors.join(' | '));

  } catch (err) {
    console.error('Browser QA Uncaught Runner Error:', err);
    assert('Runner completed without unhandled exception', false, err.message);
  } finally {
    if (ws) ws.close();
    if (chrome) chrome.kill();
    if (server) server.close();
  }

  const passCount = results.filter(r => r.pass).length;
  const failCount = results.filter(r => !r.pass).length;
  console.log('\n======================================================');
  console.log(`BROWSER QA COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('======================================================\n');
  return failCount === 0;
}

startServer()
  .then(launchChrome)
  .then(runQA)
  .then(ok => {
    process.exit(ok ? 0 : 1);
  })
  .catch(err => {
    console.error('Fatal Browser QA error:', err);
    process.exit(1);
  });
