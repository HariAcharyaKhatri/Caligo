// Comprehensive end-to-end simulation runner for CALIGO Phase 1 & 2
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const baseDir = 'd:\\HARI KHATRI\\Caligo';

// Mock localStorage
const storageStore = {};
const localStorageMock = {
  getItem: (k) => (k in storageStore ? storageStore[k] : null),
  setItem: (k, v) => { storageStore[k] = String(v); },
  removeItem: (k) => { delete storageStore[k]; },
  clear: () => { for (const k in storageStore) delete storageStore[k]; }
};

// Minimal DOM mock
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
      toggle: (c, force) => {
        if (force === undefined) {
          if (this.classList._classes.has(c)) this.classList._classes.delete(c);
          else this.classList._classes.add(c);
        } else if (force) this.classList._classes.add(c);
        else this.classList._classes.delete(c);
      },
      contains: (c) => this.classList._classes.has(c)
    };
    this.dataset = {};
    this.attributes = {};
    this.textContent = '';
    this._innerHTML = '';
    this.listeners = {};
    this.value = '';
    this.disabled = false;
  }
  get firstChild() { return this.children[0] || null; }
  appendChild(child) {
    if (!child) return;
    this.children.push(child);
    child.parentNode = this;
    return child;
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  addEventListener(evt, fn) {
    this.listeners[evt] = this.listeners[evt] || [];
    this.listeners[evt].push(fn);
  }
  removeEventListener(evt, fn) {
    if (this.listeners[evt]) {
      this.listeners[evt] = this.listeners[evt].filter(f => f !== fn);
    }
  }
  focus() {}
  querySelector(sel) {
    const s = sel.toLowerCase();
    for (const child of this.children) {
      if (child.tagName && child.tagName.toLowerCase() === s) return child;
      if (child.id && '#' + child.id.toLowerCase() === s) return child;
      if (child.querySelector) {
        const found = child.querySelector(sel);
        if (found) return found;
      }
    }
    return new MockElement(sel);
  }
  querySelectorAll(sel) { return []; }
  click() {
    if (this.onclick) this.onclick();
    if (this.listeners['click']) {
      this.listeners['click'].forEach(f => f({ type: 'click', target: this }));
    }
  }
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
  createElement: (tag) => new MockElement(tag),
  createTextNode: (t) => {
    const el = new MockElement('#text');
    el.textContent = t;
    return el;
  },
  getElementById: (id) => domElements[id] || (domElements[id] = new MockElement('div')),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return documentMock.getElementById(sel.slice(1));
    return new MockElement('div');
  },
  querySelectorAll: (sel) => [],
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

// Read script list from index.html
const indexHtml = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf-8');
const scriptMatches = [...indexHtml.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);

console.log('Loading scripts in order:');
for (const scriptPath of scriptMatches) {
  const fullPath = path.join(baseDir, scriptPath);
  const code = fs.readFileSync(fullPath, 'utf-8');
  console.log('  -> ' + scriptPath);
  vm.runInContext(code, context, { filename: scriptPath });
}

console.log('\n--- ALL SCRIPTS LOADED SUCCESSFULLY ---');

const C = windowMock.CALIGO;

function assert(condition, message) {
  if (!condition) {
    console.error('ASSERTION FAILED:', message);
    process.exit(1);
  }
  console.log('PASS: ' + message);
}

// 1. Character Creation
console.log('\n--- 1. Character Creation ---');
const save = C.actions.createCharacter('Deckard', '⌖');
assert(save.player.name === 'Deckard', 'Character name Deckard');
assert(save.player.avatar === '⌖', 'Character avatar ⌖');
assert(save.player.cash === C.config.START.cash, 'Starting cash');
assert(save.bots && save.bots.length === 40, 'Bot population initialized to 40');
assert(save.market && Array.isArray(save.market.listings) && save.market.listings.length > 0, 'Item market seeded with bot listings');
assert(save.bank && Array.isArray(save.bank.deposits), 'Bank deposits initialized');

// Set active save in state
C.state.save = save;

// 2. Resource Tick & Engine
console.log('\n--- 2. Resource Tick & Engine ---');
save.player.energy = 50;
C.engine.applyElapsed(save, 300); // 300 seconds elapsed
assert(save.player.energy > 50, 'Energy regenerated after tick: ' + save.player.energy);

// 3. Gym Training
console.log('\n--- 3. Gym Training ---');
save.player.energy = 100;
const oldStr = save.player.stats.strength;
const trainRes = C.actions.train('basic', 'strength');
if (!trainRes.ok) console.log('Train failed reason:', trainRes.reason);
assert(trainRes.ok, 'Train strength succeeded');
assert(save.player.stats.strength > oldStr, 'Strength increased: ' + save.player.stats.strength);

// 4. Crimes & Custody
console.log('\n--- 4. Crimes ---');
save.player.nerve = 20;
const crimeRes = C.actions.attemptCrime('shoplift');
assert(crimeRes && crimeRes.ok, 'Attempted shoplift crime: ' + crimeRes.success);
console.log('Crime result: success=' + crimeRes.success, 'text=' + crimeRes.text, 'cash=' + save.player.cash);

// 5. Combat
console.log('\n--- 5. Combat ---');
const bot = save.bots[0];
save.player.energy = 50;
save.player.life = 100;
// Clear hospital status if any
save.player.hospitalUntil = 0;
save.player.jailUntil = 0;
bot.hospitalUntil = 0;
const fightRes = C.actions.startFight(bot.id);
assert(fightRes.ok, 'Fight initialized with bot ' + bot.name);
assert(save.combat !== null, 'Combat state active');

let rounds = 0;
while (save.combat && !save.combat.over && rounds < 30) {
  rounds++;
  const roundRes = C.actions.fightRound('basic');
  console.log(`  Round ${rounds}:`, roundRes);
  if (save.combat.over) break;
}
assert(save.combat.over === true, 'Fight completed after ' + rounds + ' rounds with outcome: ' + save.combat.outcome);

if (save.combat.outcome === 'win') {
  const resolveRes = C.actions.resolveWin('mug');
  assert(resolveRes.ok, 'Resolved win via mug');
}
C.actions.clearCombat();
assert(save.combat === null, 'Combat cleared');

// 6. Bank Operations
console.log('\n--- 6. Bank ---');
save.player.cash = 10000;
const depRes = C.actions.deposit(5000);
assert(depRes.ok, 'Deposited 5000 to bank');
assert(save.player.bank === 5000, 'Bank balance is 5000');
const withRes = C.actions.withdraw(2000);
assert(withRes.ok, 'Withdrew 2000 from bank');
assert(save.player.bank === 3000, 'Bank balance is 3000');

// Fixed-term note
const noteId = C.config.BANK.deposits[0].id;
const noteRes = C.actions.buyDeposit(noteId, 1000);
assert(noteRes.ok, 'Opened fixed deposit note: ' + noteId);
assert(save.bank.deposits.length === 1, 'Note created');

// Loan
const loanId = C.config.BANK.loans[0].id;
const loanRes = C.actions.takeLoan(loanId);
assert(loanRes.ok, 'Took Tier 1 loan: ' + loanId);
assert(save.bank.loans.length === 1, 'Active loan present');
save.player.cash = 20000; // ensure cash to repay
const repayRes = C.actions.repayLoan(0);
assert(repayRes.ok, 'Repaid loan');
assert(save.bank.loans.length === 0, 'Loan cleared');

// 7. Market
console.log('\n--- 7. Market ---');
assert(save.market.listings.length > 0, 'Bot listings present in market: ' + save.market.listings.length);
const listingToBuy = save.market.listings[0];
save.player.cash = (listingToBuy.price * 2) + 100000;
const buyMarketRes = C.actions.buyListing(listingToBuy.id, 1);
if (!buyMarketRes.ok) console.log('buyMarketRes failed reason:', buyMarketRes.reason);
assert(buyMarketRes.ok, 'Purchased market listing: ' + listingToBuy.itemId);

// List item
const listRes = C.actions.listOnMarket('bandage', 1, 100);
if (!listRes.ok) console.log('listRes failed reason:', listRes.reason);
assert(listRes.ok, 'Player listed bandage on market');

// 8. Travel & Trade Goods
console.log('\n--- 8. Travel ---');
// Platform ferry
save.player.cash = 50000;
save.player.travelUntil = 0;
save.player.hospitalUntil = 0;
save.player.jailUntil = 0;
const ferryRes = C.actions.travelPlatform('spire');
assert(ferryRes.ok, 'Took ferry to Spire');
save.meta.gameTime = save.player.travelUntil + 5;
C.actions.completeTravel();
assert(save.player.location === 'spire', 'Current platform is Spire');

// Flight abroad
const flightRes = C.actions.travelAbroad('mexico', 'economy');
assert(flightRes.ok, 'Flight booked to Mexico');
// Fast forward game time to landing
save.meta.gameTime = save.player.travelUntil + 10;
C.actions.completeTravel();
assert(save.player.abroad === 'mexico', 'Landed in Mexico! Abroad is ' + save.player.abroad);

// Buy trade good abroad
const goodRes = C.actions.buyTradeGood('mexico', 'trade_spices', 1);
if (!goodRes.ok) console.log('goodRes failed reason:', goodRes.reason);
assert(goodRes.ok, 'Bought 1 Trade Spices in Mexico');

// Book return flight
const returnRes = C.actions.travelHome();
assert(returnRes.ok, 'Booked passage back to Caligo');
save.meta.gameTime = save.player.travelUntil + 10;
C.actions.completeTravel();
assert(save.player.abroad === null && save.player.travelUntil <= save.meta.gameTime, 'Returned to Caligo');

// Sell trade good
const sellRes = C.actions.sellItem('trade_spices', 1);
assert(sellRes.ok, 'Sold trade good in Caligo for profit');

// 9. Armoury & Equipment
console.log('\n--- 9. Armoury & Equipment ---');
C.actions.addItem('pistol_heavy', 1);
const equipRes = C.actions.equipItem('pistol_heavy');
assert(equipRes.ok, 'Equipped heavy pistol');
assert(save.player.equipped.weapon === 'pistol_heavy', 'Weapon equipped');
const power = C.state.playerPower(save);
assert(power > 0, 'Calculated battle power: ' + power);

// 10. Storage Save & Migrate
console.log('\n--- 10. Storage & Migrations ---');
C.storage.write(save);
const reloaded = C.storage.read();
assert(reloaded !== null, 'Save persisted and read successfully');
assert(reloaded.player.name === 'Deckard', 'Reloaded save has correct name');

// 11. State v2 -> v3 Migration
console.log('\n--- 11. State v2 -> v3 Migration ---');
const v2save = {
  version: 2,
  meta: { createdAt: Date.now(), lastSave: Date.now(), gameTime: 1000 },
  player: {
    name: 'Migrator',
    avatar: '◈',
    cash: 5000,
    bank: 1000,
    energy: 100,
    nerve: 18,
    happiness: 100,
    life: 100,
    wanted: 0,
    stats: { strength: 10, defense: 10, speed: 10, dexterity: 10, intelligence: 10 },
    equipped: { weapon: null, armour: null },
    location: 'docks',
    abroad: null,
    level: 1,
    xp: 0,
    crimeLevel: 1,
    crimeXp: 0,
    jailUntil: 0,
    hospitalUntil: 0,
    travelUntil: 0,
    acc: {}
  },
  inventory: [],
  market: { listings: [] },
  bank: { deposits: [], loans: [] },
  bots: []
};
const migrated = C.storage.migrate(v2save);
assert(migrated.version === 4, 'Save version bumped to 4');
assert(migrated.player.meritUpgrades && typeof migrated.player.meritUpgrades === 'object', 'Merit upgrades initialized');
assert(migrated.player.work && migrated.player.work.manual === 0, 'Work stats initialized');
assert(migrated.player.merits === 0 && migrated.player.points === 0, 'Merits & points initialized');
assert(migrated.job && migrated.job.current === null, 'Job state initialized');
assert(migrated.education && Array.isArray(migrated.education.completed), 'Education state initialized');
assert(migrated.companies && migrated.companies.owned === null, 'Companies state initialized');
assert(migrated.faction && migrated.faction.id === null, 'Faction state initialized');
assert(migrated.territories && typeof migrated.territories === 'object', 'Territories state initialized');
assert(migrated.casino && typeof migrated.casino.tokens === 'number', 'Casino tokens initialized');
assert(migrated.missions && migrated.missions.story === 0, 'Missions state initialized');
assert(migrated.lists && Array.isArray(migrated.lists.friends), 'Lists state initialized');
assert(migrated.mail && Array.isArray(migrated.mail), 'Mail state initialized');
assert(migrated.events && Array.isArray(migrated.events), 'Events state initialized');

// 12. Jobs System
console.log('\n--- 12. Jobs System ---');
const jobApplyRes = C.actions.applyForJob('fastfood');
assert(jobApplyRes.ok, 'Applied for Fast Food Cook job');
assert(save.job.current === 'fastfood', 'Current job is fastfood');
assert(save.job.rank === 0, 'Starting rank is Trainee');

// Work shift
save.player.energy = 50;
const workRes = C.actions.workShift();
assert(workRes.ok, 'Completed work shift');
assert(save.job.payAccrued > 0, 'Pay accrued: ' + save.job.payAccrued);
assert(save.player.work.manual > 0, 'Manual labour work stat increased: ' + save.player.work.manual);

// Collect pay
const oldCash = save.player.cash;
const payRes = C.actions.collectPay();
assert(payRes.ok, 'Collected accrued pay');
assert(save.player.cash > oldCash, 'Cash increased from pay: ' + save.player.cash);
assert(save.job.payAccrued === 0, 'Accrued pay reset to 0');

// Quit job
const quitRes = C.actions.quitJob();
assert(quitRes.ok, 'Quit current job');
assert(save.job.current === null, 'Job current cleared');

// 13. Education System
console.log('\n--- 13. Education System ---');
save.player.cash = 100000;
const enrolRes = C.actions.enrolCourse('cs_intro');
assert(enrolRes.ok, 'Enrolled in intro CS course');
assert(save.education.active === 'cs_intro', 'Active course is cs_intro');

// Fast forward time to finish course
const course = C.state.courseById('cs_intro');
save.meta.gameTime = save.education.startedAt + (course.hours * 3600) + 1;
const prog = C.actions.courseProgress('cs_intro');
assert(prog >= 1, 'Course progress is 100%');
C.actions.checkCourseProgress();
assert(save.education.active === null, 'Active course completed and cleared');
assert(save.education.completed.indexOf('cs_intro') !== -1, 'Course in completed list');

// 14. Companies
console.log('\n--- 14. Companies ---');
save.player.cash = 1000000;
const foundRes = C.actions.foundCompany('logistics');
assert(foundRes.ok, 'Founded logistics company');
assert(save.companies.owned === 'logistics', 'Player owns logistics');

// Fast forward 2 days and collect profits
save.meta.gameTime += 86400 * 2;
const collectCompRes = C.actions.collectCompany();
assert(collectCompRes.ok, 'Collected company profits: ' + collectCompRes.amount);

// Sell company
const sellCompRes = C.actions.sellCompany();
assert(sellCompRes.ok, 'Sold company for ' + sellCompRes.payout);
assert(save.companies.owned === null, 'No longer owns company');

// 15. Factions, War, Chains & Territories
console.log('\n--- 15. Factions, War, Chains & Territories ---');
// Meet requirements to join faction 'ironhides' (Level 5, strength 200)
save.player.level = 10;
save.player.stats.strength = 300;
const joinFacRes = C.actions.joinFaction('ironhides');
assert(joinFacRes.ok, 'Joined The Ironhides faction');
assert(save.faction.id === 'ironhides', 'Current faction is ironhides');

const members = C.actions.factionMembers();
assert(Array.isArray(members) && members.length > 0, 'Faction members populated: ' + members.length);

// Declare war against 'vermilion'
const warRes = C.actions.declareWar('vermilion');
assert(warRes.ok, 'War declared against Vermilion');
assert(save.faction.war !== null, 'Active war registered');

// Perform war attack
save.player.energy = 50;
const attackRes = C.actions.warAttack();
assert(attackRes.ok, 'Executed war attack (success: ' + attackRes.success + ')');

// Check chain / tick faction
C.actions.tickFaction();

// Capture territory
const capRes = C.actions.captureTerritory('docks_harbor');
assert(capRes.ok, 'Attempted capture of Docks Harbor territory');

// Manually award territory to player faction to test territory ticking
save.territories['docks_harbor'] = 'ironhides';
save.territories._lastPayout = save.meta.gameTime;
save.meta.gameTime += 86400 * 2;
const preTerrCash = save.player.cash;
C.actions.tickTerritories();
assert(save.player.cash > preTerrCash, 'Player received territory income');

// Leave faction
const leaveFacRes = C.actions.leaveFaction();
assert(leaveFacRes.ok, 'Left faction');
assert(save.faction.id === null, 'Faction cleared');

// 16. Casino System
console.log('\n--- 16. Casino System ---');
const oldTokens = save.casino.tokens;
save.casino.tokensClaimedAt = 0; // reset cooldown
const tokenRes = C.actions.claimCasinoTokens();
assert(tokenRes.ok, 'Claimed daily casino tokens');
assert(save.casino.tokens === oldTokens + C.config.CASINO.dailyTokens, 'Casino tokens increased');

save.player.cash = 50000;
const slotsRes = C.actions.playCasino('slots', 100);
if (!slotsRes.ok) console.log('slotsRes failed reason:', slotsRes.reason);
assert(slotsRes.ok, 'Played slots (detail: ' + slotsRes.detail + ')');

const rouletteRes = C.actions.playCasino('roulette', 100);
assert(rouletteRes.ok, 'Played roulette (detail: ' + rouletteRes.detail + ')');

const bjRes = C.actions.playCasino('blackjack', 100);
assert(bjRes.ok, 'Played blackjack (detail: ' + bjRes.detail + ')');

// 17. Missions System
console.log('\n--- 17. Missions System ---');
// Daily missions roll
C.actions.rollDailyMissions();
assert(save.missions.daily.list && save.missions.daily.list.length === 3, 'Rolled 3 daily missions');

// Story mission progress check & claim
save.player.cash = 2500;
const storyM = C.data.storyMissions[0];
const storyProg = C.actions.missionProgress(storyM);
assert(storyProg >= 500, 'Story mission 1 progress met: ' + storyProg);
const claimStoryRes = C.actions.claimStoryMission();
assert(claimStoryRes.ok, 'Claimed story mission 1 reward');
assert(save.missions.story === 1, 'Story mission progressed to next index');

// 18. Social & Lists System
console.log('\n--- 18. Social, Mail, Events & Lists ---');
C.actions.pushMail('The Boss', 'Payment due', 'Leave it at the docks.');
assert(save.mail.length > 0, 'Mail sent to inbox');
assert(save.mail[0].subject === 'Payment due', 'Correct mail subject');

C.actions.pushEvent('City Alert', 'A black sedan followed you home.');
assert(save.events.length > 0, 'Event logged');

const targetBotId = save.bots[0].id;
save.lists.enemies.push(targetBotId);
assert(save.lists.enemies.includes(targetBotId), 'Added bot to enemies list');

// 20. Merits Upgrade & Allocation System
console.log('\n--- 20. Merits Upgrade & Allocation System ---');
save.player.merits = 5;
const baseNerveMax = C.state.maxNerve(save.player);
const upgRes = C.actions.upgradeMerit('nerve_bar');
assert(upgRes.ok, 'Upgraded Natural Nerve Bar merit');
assert(save.player.merits === 4, 'Merits decremented to 4');
assert(save.player.meritUpgrades.nerve_bar === 1, 'Nerve Bar merit tier is 1');
assert(C.state.maxNerve(save.player) === baseNerveMax + 1, 'Max nerve increased by 1 via merit: ' + C.state.maxNerve(save.player));

const sharpRes = C.actions.upgradeMerit('sharpness');
assert(sharpRes.ok, 'Upgraded Sharpness merit');
assert(save.player.merits === 3, 'Merits decremented to 3');
const effStats = C.state.effectiveStats(save);
assert(effStats.speed > save.player.stats.speed, 'Effective speed increased via sharpness merit: ' + effStats.speed);

const resetRes = C.actions.resetMerits();
assert(resetRes.ok, 'Reset and refunded merits');
assert(save.player.merits === 5, 'All merits refunded to pool: ' + save.player.merits);
assert(save.player.meritUpgrades.nerve_bar === 0, 'Nerve bar tier reset to 0');

// 21. Crimes 2.0 Enhancers & Market Sales Tax
console.log('\n--- 21. Crimes 2.0 Enhancers & Market Sales Tax ---');
assert(C.config.MARKET.salesTax === 0.05, 'Market sales tax configured to 5%');
const burglaryCrime = C.data.crimeById.burglary;
assert(burglaryCrime.enhancer === 'flashlight', 'Burglary enhancer is flashlight');
assert(!C.state.hasCrimeEnhancer(save, burglaryCrime).has, 'Player does not have flashlight yet');

save.inventory.push({ id: 'flashlight', qty: 1 });
assert(C.state.hasCrimeEnhancer(save, burglaryCrime).has, 'Player now has flashlight enhancer');

const burgCalc = C.actions.crimeChance(burglaryCrime);
const enhancerPart = burgCalc.parts.find(p => p.kind === 'enhancer');
assert(enhancerPart && enhancerPart.value === 10, 'Crime chance includes +10% enhancer bonus');

// 22. UI Screen Rendering Verification
console.log('\n--- 22. UI Screen Rendering Verification ---');
for (const screenName in C.screens) {
  const sc = C.screens[screenName];
  if (sc && typeof sc.render === 'function') {
    const el = sc.render();
    assert(el !== null && el !== undefined, 'Screen ' + screenName + ' rendered successfully');
  }
}

// 23. Research Parity: Pickpocketing & Crimes 2.0 Families
console.log('\n--- 23. Research Parity: Pickpocketing & Crimes 2.0 Families ---');
assert(C.data.crimeById.pickpocket.nerve === 5, 'Pickpocket base nerve is exactly 5');
assert(C.data.crimeById.shoplift.nerve === 4, 'Shoplifting base nerve is 4');
assert(C.data.crimeById.card_skimming.nerve === 6, 'Card skimming base nerve is 6');
assert(C.data.pickpocketTargets.length === 22, 'All 22 researched pickpocket targets present');
assert(C.data.burglaryLocations.length === 34, 'All 34 researched burglary locations present');
assert(C.data.searchCashSubcrimes.length === 6, 'All 6 Search for Cash subcrimes present');
assert(C.data.disposalJobs.length === 12, 'All 12 Disposal jobs present');
assert(C.data.disposalMethods.length === 5, 'All 5 Disposal methods present');

// 24. Target Scoping & Tool Enforcement
console.log('\n--- 24. Target Scoping & Tool Enforcement ---');
const burglaryTarget = {
  id: 'test_target',
  crimeId: 'burglary',
  title: 'Manor House [Residential]',
  reqTool: 'lockpick_set',
  traits: [{ group: 'Test', label: 'Test', mod: 0 }],
  mods: 0,
  wealth: { label: 'High', mult: 1 },
  rewardMult: 1
};
// Remove lockpick_set if present
save.inventory = save.inventory.filter(i => i.id !== 'lockpick_set');
save.player.nerve = 50;
save.player.crimeLevel = 10;
save.player.hospitalUntil = 0;
save.player.jailUntil = 0;
const failAttempt = C.actions.attemptCrime('burglary', burglaryTarget);
assert(!failAttempt.ok && failAttempt.reason.includes('Lockpick Set'), 'Rejected crime when required tool is missing: ' + failAttempt.reason);

// Add lockpick_set and try again
save.inventory.push({ id: 'lockpick_set', qty: 1 });
const passAttempt = C.actions.attemptCrime('burglary', burglaryTarget);
assert(passAttempt.ok, 'Permitted crime when tool is carried');

// Test Pickpocket 5 nerve deduction
const startNerve = save.player.nerve = 30;
const pickpocketAttempt = C.actions.attemptCrime('pickpocket');
assert(pickpocketAttempt.ok, 'Pickpocket attempt succeeded');
assert(save.player.nerve === startNerve - 5, 'Pickpocket deducted exactly 5 nerve: ' + save.player.nerve);

// 25. Real Estate Ownership & Happiness Capacities
console.log('\n--- 25. Real Estate Ownership & Happiness Capacities ---');
assert(C.data.properties.length === 14, '14 real estate tiers from Shack to Private Island');
assert(save.player.property === 'shack', 'Default initial residence is Shack');
const lvHappy = (save.player.level - 1) * C.config.LEVEL.happinessPerLevel;
assert(C.state.maxHappiness(save.player) === 100 + lvHappy, 'Initial Shack max happiness is ' + (100 + lvHappy));

// Purchase Apartment for $25,000
save.player.cash = 100000;
const buyRes = C.actions.buyProperty('apartment');
assert(buyRes.ok, 'Purchased Apartment');
assert(save.player.property === 'apartment', 'Current residence updated to Apartment');
assert(save.player.propertiesOwned.includes('apartment'), 'Apartment added to propertiesOwned');
assert(C.state.maxHappiness(save.player) === 250 + lvHappy, 'Max happiness raised to ' + (250 + lvHappy) + ' for Apartment');

// Purchase Villa for $1,250,000
save.player.cash = 2000000;
const buyVilla = C.actions.buyProperty('villa');
assert(buyVilla.ok, 'Purchased Villa');
assert(save.player.property === 'villa', 'Current residence updated to Villa');
assert(C.state.maxHappiness(save.player) === 1500 + lvHappy, 'Max happiness raised to ' + (1500 + lvHappy) + ' for Villa');

// Move back to Apartment
const moveRes = C.actions.moveProperty('apartment');
assert(moveRes.ok, 'Moved back to Apartment');
assert(save.player.property === 'apartment', 'Current residence switched back to Apartment');
assert(C.state.maxHappiness(save.player) === 250 + lvHappy, 'Max happiness recalculated for Apartment');

// Sell Villa (75% refund)
const prevCash = save.player.cash;
const sellPropRes = C.actions.sellProperty('villa');
assert(sellPropRes.ok, 'Sold Villa');
assert(sellPropRes.refund === Math.floor(1250000 * 0.75), 'Received 75% refund ($937,500)');
assert(save.player.cash === prevCash + sellPropRes.refund, 'Refund added to player cash');
assert(!save.player.propertiesOwned.includes('villa'), 'Villa removed from owned list');

// 26. Community Forums Persistence
console.log('\n--- 26. Community Forums Persistence ---');
save.forums = save.forums || [];
const initialForums = save.forums.length;
save.forums.push({
  id: 'test_thread_1',
  category: 'General Discussion',
  title: 'Test Broadcast',
  body: 'Testing transmission across the Spire network.',
  author: save.player.name,
  replies: [{ author: 'Vane', text: 'Transmission acknowledged.', time: 'just now' }],
  repliesCount: 1,
  time: 'just now'
});
assert(save.forums.length === initialForums + 1, 'Forum thread saved into state');

// Re-render screens
const propEl = C.screens.properties.render();
assert(propEl !== null, 'Properties screen renders interactive UI');
const forumEl = C.screens.forums.render();
assert(forumEl !== null, 'Forums screen renders interactive UI');

// 27. Deep Audit of All 13 Crimes 2.0 Families
console.log('\n--- 27. Deep Audit of All 13 Crimes 2.0 Families ---');
function clearCustody() {
  save.player.jailUntil = 0;
  save.player.hospitalUntil = 0;
  save.player.life = 100;
}

// 1. Search for Cash
clearCustody();
assert(C.data.crimeById.search_cash.nerve === 2, 'Search for Cash base nerve is 2');
const sfcTargets = C.actions.rollTargets('search_cash');
assert(sfcTargets.length === 6, 'All 6 Search for Cash subcrimes rolled');
save.player.nerve = 20;
const sfcRes = C.actions.attemptCrime('search_cash', sfcTargets[0]);
assert(sfcRes.ok, 'Attempted Search for Cash');
assert(save.player.nerve === 18, 'Deducted exactly 2 nerve for Search for Cash: ' + save.player.nerve);

// 2. Bootlegging
clearCustody();
assert(C.data.crimeById.bootlegging.enhancer === 'high_drive', 'Bootlegging enhancer is High-Speed Drive');
const blTargets = C.actions.rollTargets('bootlegging');
assert(blTargets.length === 2, 'Bootlegging has 2 distinct operations (Copy & Sell)');
assert(blTargets[0].nerveCost === 2, 'Copy DVDs costs 2 Nerve');
assert(blTargets[1].nerveCost === 5, 'Sell DVDs costs 5 Nerve');
save.player.nerve = 20;
const copyRes = C.actions.attemptCrime('bootlegging', blTargets[0]);
assert(copyRes.ok, 'Copy DVDs succeeded');
assert(save.player.nerve === 18, 'Deducted 2 nerve for copying');
clearCustody();
save.inventory = save.inventory.filter(i => i.id !== 'dvd');
const sellFail = C.actions.attemptCrime('bootlegging', blTargets[1]);
assert(!sellFail.ok && sellFail.reason.includes('Bootleg Media DVD'), 'Rejected Sell when missing DVDs');
save.inventory.push({ id: 'dvd', qty: 2 });
save.player.nerve = 20;
clearCustody();
const sellPass = C.actions.attemptCrime('bootlegging', blTargets[1]);
assert(sellPass.ok, 'Permitted Sell when DVDs carried');
assert(save.player.nerve === 15, 'Deducted 5 nerve for selling DVDs');

// 3. Graffiti
clearCustody();
assert(C.data.crimeById.graffiti.nerve === 3, 'Graffiti base nerve is 3');
const grafTargets = C.actions.rollTargets('graffiti');
assert(grafTargets.length === 7, 'Rolled all 7 Graffiti districts');
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
clearCustody();
assert(C.data.crimeById.shoplift.nerve === 4, 'Shoplifting base nerve is 4');
const shopTargets = C.actions.rollTargets('shoplift');
assert(shopTargets.length === 8, 'Rolled all 8 commercial shops');
save.player.nerve = 20;
const shopRes = C.actions.attemptCrime('shoplift', shopTargets[0]);
assert(shopRes.ok, 'Attempted Shoplifting');
assert(save.player.nerve === 16, 'Deducted exactly 4 nerve for Shoplifting: ' + save.player.nerve);

// 5. Card Skimming
clearCustody();
assert(C.data.crimeById.card_skimming.nerve === 6, 'Card Skimming base nerve is 6');
const skimTargets = C.actions.rollTargets('card_skimming');
assert(skimTargets.length === 5, 'Rolled all 5 Card Skimming options');
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
clearCustody();
assert(C.data.crimeById.burglary.nerve === 6, 'Burglary base nerve is 6');
assert(C.data.burglaryLocations.length === 34, 'All 34 Burglary locations present');

// 7. Pickpocketing
clearCustody();
assert(C.data.crimeById.pickpocket.nerve === 5, 'Pickpocketing base nerve is exactly 5');
assert(C.data.pickpocketTargets.length === 22, 'All 22 Pickpocketing targets present');
save.player.nerve = 20;
const pickRes = C.actions.attemptCrime('pickpocket');
assert(pickRes.ok, 'Pickpocket attempt succeeded');
assert(save.player.nerve === 15, 'Deducted exactly 5 nerve for Pickpocketing: ' + save.player.nerve);

// 8. Hustling
clearCustody();
assert(C.data.crimeById.hustling.nerve === 4, 'Hustling base nerve is 4');
const hustTargets = C.actions.rollTargets('hustling');
assert(hustTargets.length === 5, 'Rolled all 5 street games');
save.player.nerve = 20;
const hustRes = C.actions.attemptCrime('hustling', hustTargets[1]);
assert(hustRes.ok, 'Played Three-Card Monte');
assert(save.player.nerve === 16, 'Deducted exactly 4 nerve: ' + save.player.nerve);

// 9. Disposal
clearCustody();
assert(C.data.disposalJobs.length === 12, 'All 12 Disposal jobs present');
assert(C.data.disposalMethods.length === 5, 'All 5 Disposal methods present');

// 10. Cracking
clearCustody();
const crackTargets = C.actions.rollTargets('cracking');
assert(crackTargets.length === 2, 'Rolled both Cracking actions');
assert(crackTargets[0].nerveCost === 7, 'Brute-force costs 7 Nerve');
assert(crackTargets[1].nerveCost === 5, 'Crack Vault costs 5 Nerve');
save.player.nerve = 20;
const crackRes = C.actions.attemptCrime('cracking', crackTargets[0]);
assert(crackRes.ok, 'Attempted Brute-Force Hash');
assert(save.player.nerve === 13, 'Deducted exactly 7 nerve: ' + save.player.nerve);

// 11. Forgery
clearCustody();
const forgeTargets = C.actions.rollTargets('forgery');
assert(forgeTargets.length === 5, 'Rolled 5 Forgery projects');
save.player.nerve = 20;
const forgeRes = C.actions.attemptCrime('forgery', forgeTargets[0]);
assert(forgeRes.ok, 'Worked on Driver\'s License forgery');
assert(save.player.nerve === 15, 'Deducted exactly 5 nerve: ' + save.player.nerve);

// 12. Scamming
clearCustody();
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
clearCustody();
const arsonTargets = C.actions.rollTargets('arson');
assert(arsonTargets.length === 7, 'Rolled full 7-step Arson sequence');
assert(arsonTargets[0].nerveCost === 0, 'Stage 1 (Inquire) costs 0 Nerve');
assert(arsonTargets[1].nerveCost === 3, 'Stage 2 (Breach) costs 3 Nerve');
assert(arsonTargets[2].nerveCost === 5, 'Stage 3 (Place Fuel) costs 5 Nerve');
assert(arsonTargets[6].nerveCost === 2, 'Stage 7 (Collect) costs 2 Nerve');
save.player.nerve = 20;
const inquireRes = C.actions.attemptCrime('arson', arsonTargets[0]);
assert(inquireRes.ok, 'Stage 1 Inquiry succeeded');
assert(save.player.nerve === 20, 'Stage 1 deducted 0 nerve (free): ' + save.player.nerve);

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

console.log('\n==============================================');
console.log('>>> ALL 27 TEST SUITES PASSED FLAWLESSLY! <<<');
console.log('==============================================');
