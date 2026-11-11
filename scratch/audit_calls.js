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
const missing = new Set();

allJs.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  const relFile = path.relative(baseDir, file);

  // Check aliases defined in the file
  let hasA = code.includes('var A = C.actions') || code.includes('A = C.actions');
  let hasS = code.includes('var S = C.state') || code.includes('S = C.state');
  let hasUI = code.includes('var UI = C.ui') || code.includes('UI = C.ui');
  let hasU = code.includes('var U = C.util') || code.includes('U = C.util');
  let hasD = code.includes('var D = C.data') || code.includes('D = C.data');

  // Match C.something.something(
  const cMatches = code.matchAll(/\bC\.([a-zA-Z0-9_$]+)\.([a-zA-Z0-9_$]+)\s*\(/g);
  for (const m of cMatches) {
    const mod = m[1];
    const member = m[2];
    if (C[mod] && typeof C[mod] === 'object') {
      if (C[mod][member] === undefined) {
        missing.add(`${relFile} calls C.${mod}.${member}() [undefined]`);
      }
    }
  }

  // Match A.something(
  if (hasA) {
    const aMatches = code.matchAll(/\bA\.([a-zA-Z0-9_$]+)\s*\(/g);
    for (const m of aMatches) {
      if (C.actions && C.actions[m[1]] === undefined) {
        missing.add(`${relFile} calls A.${m[1]}() [undefined]`);
      }
    }
  }

  // Match S.something(
  if (hasS) {
    const sMatches = code.matchAll(/\bS\.([a-zA-Z0-9_$]+)\s*\(/g);
    for (const m of sMatches) {
      if (C.state && C.state[m[1]] === undefined) {
        missing.add(`${relFile} calls S.${m[1]}() [undefined]`);
      }
    }
  }

  // Match UI.something(
  if (hasUI) {
    const uiMatches = code.matchAll(/\bUI\.([a-zA-Z0-9_$]+)\s*\(/g);
    for (const m of uiMatches) {
      if (C.ui && C.ui[m[1]] === undefined) {
        missing.add(`${relFile} calls UI.${m[1]}() [undefined]`);
      }
    }
  }

  // Match U.something(
  if (hasU) {
    const uMatches = code.matchAll(/\bU\.([a-zA-Z0-9_$]+)\s*\(/g);
    for (const m of uMatches) {
      if (C.util && C.util[m[1]] === undefined) {
        missing.add(`${relFile} calls U.${m[1]}() [undefined]`);
      }
    }
  }
});

console.log('--- AUDIT OF FUNCTION CALLS ACROSS JS ---');
if (missing.size === 0) {
  console.log('No missing function calls found!');
} else {
  for (const m of missing) console.log('BUG:', m);
}
