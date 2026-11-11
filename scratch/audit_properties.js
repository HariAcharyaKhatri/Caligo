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
    if (fs.statSync(path.join(dir, f)).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'scratch') {
        res = res.concat(getFiles(path.join(dir, f)));
      }
    } else if (f.endsWith('.js')) {
      res.push(path.join(dir, f));
    }
  });
  return res;
}

const allJs = getFiles(path.join(baseDir, 'js'));
const missingProps = new Set();
const modules = ['config', 'dom', 'storage', 'engine', 'bots', 'router', 'audio', 'sidebar'];

allJs.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  const relFile = path.relative(baseDir, file);

  modules.forEach(mod => {
    const regex = new RegExp(`\\bC\\.${mod}\\.([a-zA-Z0-9_$]+)`, 'g');
    for (const m of code.matchAll(regex)) {
      const prop = m[1];
      if (C[mod] && C[mod][prop] === undefined) {
        missingProps.add(`${relFile} accesses C.${mod}.${prop} [undefined]`);
      }
    }
  });
});

console.log('--- MISSING OTHER MODULE ACCESSES ---');
if (missingProps.size === 0) {
  console.log('None! All accesses are valid.');
} else {
  missingProps.forEach(m => console.log('BUG:', m));
}
