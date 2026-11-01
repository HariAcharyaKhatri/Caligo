// Deep verification test for all 13 Crimes 2.0 Families in CALIGO
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const baseDir = 'd:\\HARI KHATRI\\Caligo';

const storageStore = {};
const localStorageMock = {
  getItem: (k) => (k in storageStore ? storageStore[k] : null),
  setItem: (k, v) => { storageStore[k] = String(v); },
  removeItem: (k) => { delete storageStore[k]; },
  clear: () => { for (const k in storageStore) delete storageStore[k]; }
};

class MockElement {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this.classList = {
      _classes: new Set(),
      add: (...c) => c.forEach(x => this.classList._classes.add(x)),
      remove: (...c) => c.forEach(x => this.classList._classes.delete(x)),
      toggle: (c) => this.classList._classes.has(c) ? this.classList._classes.delete(c) : this.classList._classes.add(c),
      contains: (c) => this.classList._classes.has(c)
    };
    this.dataset = {};
    this.attributes = {};
    this.textContent = '';
    this.value = '';
    this.disabled = false;
  }
  focus() {}
  appendChild(child) {
    if (!child) return;
    this.children.push(child);
    child.parentNode = this;
    return child;
  }
  removeChild(c) { return c; }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  addEventListener() {}
  removeEventListener() {}
  querySelector(sel) { return new MockElement(sel); }
  querySelectorAll() { return []; }
}

const domElements = {
  'topbar': new MockElement('header'),
  'nav': new MockElement('nav'),
  'screen': new MockElement('main'),
  'toasts': new MockElement('div'),
  'modal-root': new MockElement('div'),
  'boot': new MockElement('div')
};

const documentMock = {
  readyState: 'complete',
  createElement: (t) => new MockElement(t),
  createTextNode: (t) => { const el = new MockElement('#text'); el.textContent = t; return el; },
  getElementById: (id) => domElements[id] || (domElements[id] = new MockElement('div')),
  querySelector: () => new MockElement('div'),
  querySelectorAll: () => [],
  addEventListener: () => {},
  removeEventListener: () => {}
};

const windowMock = {
  CALIGO: {},
  localStorage: localStorageMock,
  document: documentMock,
  location: { hash: '' },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  addEventListener: () => {},
  removeEventListener: () => {}
};
windowMock.window = windowMock;

const context = vm.createContext(windowMock);

const indexHtml = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf-8');
const scriptMatches = [...indexHtml.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);

for (const scriptPath of scriptMatches) {
  const fullPath = path.join(baseDir, scriptPath);
  const code = fs.readFileSync(fullPath, 'utf-8');
  vm.runInContext(code, context, { filename: scriptPath });
}

const C = windowMock.CALIGO;

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL: ' + msg);
    process.exit(1);
  }
  console.log('PASS: ' + msg);
}

function clearCustody() {
  save.player.jailUntil = 0;
  save.player.hospitalUntil = 0;
  save.player.life = 100;
}

console.log('\n======================================================');
console.log('--- AUDITING ALL 13 CRIMES 2.0 FAMILIES IN CALIGO ---');
console.log('======================================================');

const save = C.actions.createCharacter('Agent47', '◈');
C.state.save = save;
save.player.crimeLevel = 20; // unlock all crime tiers for testing
save.player.level = 50; // prevent level-up refills during atomic unit tests
save.player.xp = 0;

// 1. Search for Cash
console.log('\n1. Family: Search for Cash (2 Nerve, Glasses Enhancer, 6 Subcrimes)');
clearCustody();
const sfcCrime = C.data.crimeById.search_cash;
assert(sfcCrime.nerve === 2, 'Search for Cash base nerve is 2');
assert(sfcCrime.enhancer === 'glasses', 'Search for Cash enhancer is Glasses');
const sfcTargets = C.actions.rollTargets('search_cash');
assert(sfcTargets.length === 6, 'Rolled all 6 Search for Cash subcrimes');
assert(sfcTargets.map(t => t.title).includes('Search the Trash'), 'Contains Search the Trash');
assert(sfcTargets.map(t => t.title).includes('Search the Subway'), 'Contains Search the Subway');
assert(sfcTargets.map(t => t.title).includes('Search the Junkyard'), 'Contains Search the Junkyard');
assert(sfcTargets.map(t => t.title).includes('Search the Beach'), 'Contains Search the Beach');
assert(sfcTargets.map(t => t.title).includes('Search the Cemetery'), 'Contains Search the Cemetery');
assert(sfcTargets.map(t => t.title).includes('Search the Fountain'), 'Contains Search the Fountain');
save.player.nerve = 20;
const sfcRes = C.actions.attemptCrime('search_cash', sfcTargets[0]);
assert(sfcRes.ok, 'Attempted Search for Cash');
assert(save.player.nerve === 18, 'Deducted exactly 2 nerve for Search for Cash: ' + save.player.nerve);

// 2. Bootlegging
console.log('\n2. Family: Bootlegging (2N Copy / 5N Sell, High-Speed Drive)');
clearCustody();
const blCrime = C.data.crimeById.bootlegging;
assert(blCrime.enhancer === 'high_drive', 'Bootlegging enhancer is High-Speed Drive');
const blTargets = C.actions.rollTargets('bootlegging');
assert(blTargets.length === 2, 'Bootlegging has 2 distinct operations (Copy & Sell)');
assert(blTargets[0].nerveCost === 2, 'Copy DVDs costs 2 Nerve');
assert(blTargets[1].nerveCost === 5, 'Sell DVDs costs 5 Nerve');
save.player.nerve = 20;
// Test Copy produces DVD
const copyRes = C.actions.attemptCrime('bootlegging', blTargets[0]);
assert(copyRes.ok, 'Copy attempt succeeded');
assert(save.player.nerve === 18, 'Deducted 2 nerve for copying');
// Test Sell requires DVD
clearCustody();
save.inventory = save.inventory.filter(i => i.id !== 'dvd');
const sellFail = C.actions.attemptCrime('bootlegging', blTargets[1]);
assert(!sellFail.ok && sellFail.reason.includes('Bootleg Media DVD'), 'Rejected Sell when no DVDs in inventory');
save.inventory.push({ id: 'dvd', qty: 2 });
save.player.nerve = 20;
clearCustody();
const sellPass = C.actions.attemptCrime('bootlegging', blTargets[1]);
assert(sellPass.ok, 'Permitted Sell when DVDs in inventory');
assert(save.player.nerve === 15, 'Deducted 5 nerve for selling DVDs');

// 3. Graffiti
console.log('\n3. Family: Graffiti (3 Nerve, Paint Mask, 7 Districts, Spray Can)');
clearCustody();
const grafCrime = C.data.crimeById.graffiti;
assert(grafCrime.nerve === 3, 'Graffiti base nerve is 3');
assert(grafCrime.enhancer === 'paint_mask', 'Graffiti enhancer is Paint Mask');
const grafTargets = C.actions.rollTargets('graffiti');
assert(grafTargets.length === 7, 'Rolled all 7 Graffiti districts');
// Test spray_can requirement
save.inventory = save.inventory.filter(i => i.id !== 'spray_can');
save.player.nerve = 20;
clearCustody();
const grafFail = C.actions.attemptCrime('graffiti', grafTargets[0]);
assert(!grafFail.ok && grafFail.reason.includes('Spray Can'), 'Rejected Graffiti when missing Spray Can');
save.inventory.push({ id: 'spray_can', qty: 3 });
clearCustody();
const grafPass = C.actions.attemptCrime('graffiti', grafTargets[0]);
assert(grafPass.ok, 'Permitted Graffiti with Spray Can carried');
assert(save.player.nerve === 17, 'Deducted exactly 3 nerve for Graffiti: ' + save.player.nerve);

// 4. Shoplifting
console.log('\n4. Family: Shoplifting (4 Nerve, Mountain Bike, 8 Shops)');
clearCustody();
const shopCrime = C.data.crimeById.shoplift;
assert(shopCrime.nerve === 4, 'Shoplifting base nerve is 4');
assert(shopCrime.enhancer === 'mountain_bike', 'Shoplifting enhancer is Mountain Bike');
const shopTargets = C.actions.rollTargets('shoplift');
assert(shopTargets.length === 8, 'Rolled all 8 commercial shops');
save.player.nerve = 20;
const shopRes = C.actions.attemptCrime('shoplift', shopTargets[0]);
assert(shopRes.ok, 'Attempted Shoplifting');
assert(save.player.nerve === 16, 'Deducted exactly 4 nerve for Shoplifting: ' + save.player.nerve);

// 5. Card Skimming
console.log('\n5. Family: Card Skimming (6N Install / 2N Harvest / 6N Sell, Duct Tape)');
clearCustody();
const skimCrime = C.data.crimeById.card_skimming;
assert(skimCrime.nerve === 6, 'Card Skimming base nerve is 6');
assert(skimCrime.enhancer === 'duct_tape', 'Card Skimming enhancer is Duct Tape');
const skimTargets = C.actions.rollTargets('card_skimming');
assert(skimTargets.length === 5, 'Rolled all 5 Card Skimming options');
// Test skimmer requirement
save.inventory = save.inventory.filter(i => i.id !== 'skimmer');
save.player.nerve = 20;
clearCustody();
const skimFail = C.actions.attemptCrime('card_skimming', skimTargets[0]);
assert(!skimFail.ok && skimFail.reason.includes('Card Skimmer'), 'Rejected Install when missing Skimmer');
save.inventory.push({ id: 'skimmer', qty: 1 });
clearCustody();
const skimPass = C.actions.attemptCrime('card_skimming', skimTargets[0]);
assert(skimPass.ok, 'Permitted Skimmer install when skimmer present');
assert(save.player.nerve === 14, 'Deducted exactly 6 nerve for Install: ' + save.player.nerve);

// 6. Burglary
console.log('\n6. Family: Burglary (34 Locations, 3/2/6/9N, Flashlight, Required Tools)');
clearCustody();
const burgCrime = C.data.crimeById.burglary;
assert(burgCrime.nerve === 6, 'Burglary base nerve is 6');
assert(burgCrime.enhancer === 'flashlight', 'Burglary enhancer is Flashlight');
assert(C.data.burglaryLocations.length === 34, 'All 34 Burglary locations present');
const burgTargets = C.actions.rollTargets('burglary', 4);
assert(burgTargets.length === 4, 'Rolled 4 candidate burglary locations');
assert(burgTargets[0].reqTool !== undefined, 'Target specifies required tool');

// 7. Pickpocketing
console.log('\n7. Family: Pickpocketing (5 Nerve, Cut-Throat Razor, 22 Targets, Situational Conditions)');
clearCustody();
const pickCrime = C.data.crimeById.pickpocket;
assert(pickCrime.nerve === 5, 'Pickpocketing base nerve is exactly 5');
assert(pickCrime.enhancer === 'cut_razor', 'Pickpocketing enhancer is Cut-Throat Razor');
assert(C.data.pickpocketTargets.length === 22, 'All 22 Pickpocketing targets present');
save.player.nerve = 20;
const pickRes = C.actions.attemptCrime('pickpocket');
assert(pickRes.ok, 'Pickpocket attempt succeeded');
assert(save.player.nerve === 15, 'Deducted exactly 5 nerve: ' + save.player.nerve);

// 8. Hustling
console.log('\n8. Family: Hustling (4 Nerve, Megaphone, 5 Street Games)');
clearCustody();
const hustCrime = C.data.crimeById.hustling;
assert(hustCrime.nerve === 4, 'Hustling base nerve is 4');
assert(hustCrime.enhancer === 'megaphone', 'Hustling enhancer is Megaphone');
const hustTargets = C.actions.rollTargets('hustling');
assert(hustTargets.length === 5, 'Rolled all 5 street games');
save.player.nerve = 20;
const hustRes = C.actions.attemptCrime('hustling', hustTargets[1]); // Three-card monte
assert(hustRes.ok, 'Played Three-Card Monte');
assert(save.player.nerve === 16, 'Deducted exactly 4 nerve: ' + save.player.nerve);

// 9. Disposal
console.log('\n9. Family: Disposal (6–14 Nerve, Latex Gloves, 12 Jobs, 5 Methods)');
clearCustody();
const dispCrime = C.data.crimeById.disposal;
assert(dispCrime.enhancer === 'latex_gloves', 'Disposal enhancer is Latex Gloves');
assert(C.data.disposalJobs.length === 12, 'All 12 Disposal jobs present');
assert(C.data.disposalMethods.length === 5, 'All 5 Disposal methods present');
const dispTargets = C.actions.rollTargets('disposal', 4);
assert(dispTargets.length === 4, 'Rolled 4 disposal cargo contracts');

// 10. Cracking
console.log('\n10. Family: Cracking (7N Brute / 5N Vault, Office Chair)');
clearCustody();
const crackCrime = C.data.crimeById.cracking;
assert(crackCrime.enhancer === 'office_chair', 'Cracking enhancer is Office Chair');
const crackTargets = C.actions.rollTargets('cracking');
assert(crackTargets.length === 2, 'Rolled both Cracking actions');
assert(crackTargets[0].nerveCost === 7, 'Brute-force costs 7 Nerve');
assert(crackTargets[1].nerveCost === 5, 'Crack Vault costs 5 Nerve');
save.player.nerve = 20;
const crackRes = C.actions.attemptCrime('cracking', crackTargets[0]);
assert(crackRes.ok, 'Attempted Brute-Force Hash');
assert(save.player.nerve === 13, 'Deducted exactly 7 nerve: ' + save.player.nerve);

// 11. Forgery
console.log('\n11. Family: Forgery (5 Nerve, Magnifying Glass, 5 High-Value Document Projects)');
clearCustody();
const forgeCrime = C.data.crimeById.forgery;
assert(forgeCrime.enhancer === 'magnifying_glass', 'Forgery enhancer is Magnifying Glass');
const forgeTargets = C.actions.rollTargets('forgery');
assert(forgeTargets.length === 5, 'Rolled 5 Forgery projects');
save.player.nerve = 20;
const forgeRes = C.actions.attemptCrime('forgery', forgeTargets[0]);
assert(forgeRes.ok, 'Worked on Driver\'s License forgery');
assert(save.player.nerve === 15, 'Deducted exactly 5 nerve: ' + save.player.nerve);

// 12. Scamming
console.log('\n12. Family: Scamming (8N Farm / 8N Phish / 3N Converse, Ergonomic Keyboard)');
clearCustody();
const scamCrime = C.data.crimeById.scamming;
assert(scamCrime.enhancer === 'ergo_keyboard', 'Scamming enhancer is Ergonomic Keyboard');
const scamTargets = C.actions.rollTargets('scamming');
assert(scamTargets.length === 3, 'Rolled all 3 Scamming phases');
assert(scamTargets[0].nerveCost === 8, 'Farm Leads costs 8 Nerve');
assert(scamTargets[1].nerveCost === 8, 'Phishing Spam costs 8 Nerve');
assert(scamTargets[2].nerveCost === 3, 'Converse with Mark costs 3 Nerve');
save.player.nerve = 20;
const scamRes = C.actions.attemptCrime('scamming', scamTargets[2]);
assert(scamRes.ok, 'Conversing with mark succeeded');
assert(save.player.nerve === 17, 'Deducted exactly 3 nerve: ' + save.player.nerve);

// 13. Arson
console.log('\n13. Family: Arson (7-Step Sequence: 0N, 3N, 5N, 5N, 5N, 5N, 2N, Windproof Lighter)');
clearCustody();
const arsonCrime = C.data.crimeById.arson;
assert(arsonCrime.enhancer === 'lighter', 'Arson enhancer is Windproof Lighter');
const arsonTargets = C.actions.rollTargets('arson');
assert(arsonTargets.length === 7, 'Rolled full 7-step Arson sequence');
assert(arsonTargets[0].nerveCost === 0, 'Stage 1 (Inquire) costs 0 Nerve');
assert(arsonTargets[1].nerveCost === 3, 'Stage 2 (Breach) costs 3 Nerve');
assert(arsonTargets[2].nerveCost === 5, 'Stage 3 (Place Fuel) costs 5 Nerve');
assert(arsonTargets[2].reqItem === 'gas_can', 'Stage 3 requires Gasoline');
assert(arsonTargets[3].nerveCost === 5, 'Stage 4 (Ignite) costs 5 Nerve');
assert(arsonTargets[4].nerveCost === 5, 'Stage 5 (Stoke) costs 5 Nerve');
assert(arsonTargets[5].nerveCost === 5, 'Stage 6 (Dampen) costs 5 Nerve');
assert(arsonTargets[6].nerveCost === 2, 'Stage 7 (Collect) costs 2 Nerve');

// Test stage 1 free inquiry
save.player.nerve = 20;
const inquireRes = C.actions.attemptCrime('arson', arsonTargets[0]);
assert(inquireRes.ok, 'Stage 1 Inquiry succeeded');
assert(save.player.nerve === 20, 'Stage 1 deducted 0 nerve (free): ' + save.player.nerve);

// Test stage 3 fuel requirement and consumption
clearCustody();
save.inventory = save.inventory.filter(i => i.id !== 'gas_can');
save.player.nerve = 20;
const fuelFail = C.actions.attemptCrime('arson', arsonTargets[2]);
assert(!fuelFail.ok && fuelFail.reason.includes('Gasoline'), 'Stage 3 rejected when missing Gasoline');
save.inventory.push({ id: 'gas_can', qty: 2 });
clearCustody();
const fuelPass = C.actions.attemptCrime('arson', arsonTargets[2]);
assert(fuelPass.ok, 'Stage 3 permitted with Gasoline carried');
assert(save.inventory.find(i => i.id === 'gas_can').qty === 1, 'Consumed exactly 1 Gasoline: qty is now 1');
assert(save.player.nerve === 15, 'Deducted 5 nerve for Stage 3');

console.log('\n=====================================================================');
console.log('>>> COMPLETE PROOF: ALL 13 CRIMES 2.0 FAMILIES FULLY OPERATIONAL! <<<');
console.log('=====================================================================');
