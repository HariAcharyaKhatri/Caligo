const fs = require('fs');
const path = require('path');
const vm = require('vm');

const baseDir = path.resolve(__dirname, '..');
const win = { CALIGO: {}, addEventListener: ()=>{}, removeEventListener: ()=>{}, document: { addEventListener: ()=>{}, readyState: 'complete' } };
win.window = win;
const ctx = vm.createContext(win);
const html = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
const scriptMatches = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
scriptMatches.forEach(s => {
  if (s !== 'js/main.js') {
    vm.runInContext(fs.readFileSync(path.join(baseDir, s), 'utf8'), ctx);
  }
});
const C = win.CALIGO;

console.log('--- 1. AUDITING ITEM REFERENCES ACROSS THE CODEBASE ---');
const items = C.data.items;
const itemIds = new Set(Object.keys(items));

function getFiles(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'scratch') {
        res = res.concat(getFiles(p));
      }
    } else if (p.endsWith('.js')) {
      res.push(p);
    }
  });
  return res;
}

const allJs = getFiles(path.join(baseDir, 'js'));

// Check shops stock
C.data.shops.forEach(shop => {
  shop.stock.forEach(id => {
    if (!itemIds.has(id)) {
      console.log(`BUG in shop ${shop.id}: item ${id} not found in D.items`);
    }
  });
});

// Check crime tools and enhancers
C.data.crimes.forEach(crime => {
  if (crime.enhancer && !itemIds.has(crime.enhancer)) {
    console.log(`BUG in crime ${crime.id}: enhancer ${crime.enhancer} not found in D.items`);
  }
  if (crime.reqTool && !itemIds.has(crime.reqTool)) {
    console.log(`BUG in crime ${crime.id}: reqTool ${crime.reqTool} not found in D.items`);
  }
});

// Check burglary targets
if (C.data.burglaryTargets) {
  C.data.burglaryTargets.forEach(t => {
    if (t.reqTool && !itemIds.has(t.reqTool)) {
      console.log(`BUG in burglary target ${t.title}: reqTool ${t.reqTool} not found in D.items`);
    }
  });
}

// Check trade goods
if (C.data.tradeGoods) {
  Object.keys(C.data.tradeGoods).forEach(id => {
    // trade goods may be independent or items
  });
}

console.log('--- 2. AUDITING CRIME FAMILY IMPLEMENTATIONS & TARGETS ---');
const save = C.actions.createCharacter('Agent47', '◈');
C.state.save = save;
C.engine.rollWeather(save, Date.now());

const crimeIds = new Set(C.data.crimes.map(c => c.id));
C.data.crimes.forEach(c => {
  const targets = C.actions.rollTargets(c.id, 4);
  if (!targets || targets.length === 0) {
    console.log(`BUG: crime ${c.id} returns empty targets array!`);
  }
});

console.log('--- 3. AUDITING DOM ELEMENT IDS IN index.html VS sidebar.js ---');
const idMatches = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const htmlIds = new Set(idMatches);

const sidebarCode = fs.readFileSync(path.join(baseDir, 'js/ui/sidebar.js'), 'utf8');
const sideGetElemMatches = [...sidebarCode.matchAll(/document\.getElementById\('([^']+)'\)/g)].map(m => m[1]);
sideGetElemMatches.forEach(id => {
  if (!htmlIds.has(id)) {
    console.log(`BUG in sidebar.js: getElementById('${id}') not found in index.html!`);
  }
});

console.log('--- 4. AUDITING NAVIGATION BUTTON DATA-SCREEN TARGETS ---');
const screens = C.screens;
const sideAreas = C.sidebar.areas;
const sideLists = C.sidebar.lists;

sideAreas.forEach(a => {
  if (!screens[a.id]) {
    console.log(`BUG in sidebar.js areas: screen "${a.id}" not found in C.screens!`);
  }
});

sideLists.forEach(l => {
  if (!screens[l.id]) {
    console.log(`BUG in sidebar.js lists: screen "${l.id}" not found in C.screens!`);
  }
});

console.log('--- AUDIT INTEGRITY CHECK FINISHED ---');
