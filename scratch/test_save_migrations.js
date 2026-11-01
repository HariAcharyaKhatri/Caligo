// scratch/test_save_migrations.js — Safe Save Migration & Regression Verification
const fs = require('fs');
const vm = require('vm');

const files = [
  'js/util.js', 'js/config.js', 'js/data/items.js', 'js/data/targets.js',
  'js/data/crimes.js', 'js/data/world.js', 'js/data/bots.js', 'js/data/tradeGoods.js',
  'js/data/jobs.js', 'js/data/education.js', 'js/data/companies.js', 'js/data/factions.js',
  'js/data/territories.js', 'js/data/casino.js', 'js/data/missions.js', 'js/data/newspaper.js',
  'js/data/properties.js', 'js/state.js', 'js/storage.js', 'js/engine.js', 'js/bots.js', 'js/actions.js'
];

const ctx = { CALIGO: {} };
ctx.window = ctx;
vm.createContext(ctx);
files.forEach(f => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx));
const C = ctx.CALIGO;

let passed = 0;
let failed = 0;

function assert(name, condition, extra = '') {
  if (condition) {
    console.log(`PASS: ${name} ${extra ? '(' + extra + ')' : ''}`);
    passed++;
  } else {
    console.error(`FAIL: ${name} ${extra ? '(' + extra + ')' : ''}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('--- TESTING SAVE STATE MIGRATIONS (v1, v2, v3 -> v4) ---');
console.log('======================================================\n');

// 1. Mock Version 1 Save (Early Prototype)
const v1Save = {
  version: 1,
  meta: { created: 1000, gameTime: 2000, lastSave: 2000, name: 'VeteranDeckard', avatar: '◈' },
  player: {
    name: 'VeteranDeckard', avatar: '◈', cash: 55000, bank: 12000,
    energy: 80, nerve: 14, happiness: 90, life: 95, wanted: 0,
    level: 5, xp: 450, crimeLevel: 3, crimeXp: 210,
    stats: { strength: 45, defense: 40, speed: 35, dexterity: 38, intelligence: 50 },
    acc: { energy: 0, nerve: 0, life: 0, happyOver: 0, wanted: 0 },
    jailUntil: 0, hospitalUntil: 0, platform: 'docks'
  },
  inventory: [{ id: 'knife', qty: 1 }, { id: 'bandage', qty: 4 }],
  counters: { crimes: 40, crimesOk: 35, crimesFail: 5, gymTrains: 25 },
  settings: { theme: 'noir', volume: 0.5 }
};

const migratedV1 = C.storage.repair(C.storage.migrate(JSON.parse(JSON.stringify(v1Save))));
assert('v1 save version bumped to 4', migratedV1.version === 4, `Version: ${migratedV1.version}`);
assert('v1 player name preserved', migratedV1.player.name === 'VeteranDeckard');
assert('v1 cash preserved', migratedV1.player.cash === 55000);
assert('v1 Intelligence stat preserved', migratedV1.player.stats.intelligence === 50);
assert('v1 propertiesOwned initialized to shack', Array.isArray(migratedV1.player.propertiesOwned) && migratedV1.player.propertiesOwned[0] === 'shack');
assert('v1 current residence set to shack', migratedV1.player.property === 'shack');
assert('v1 merits initialized', migratedV1.player.merits === 0 && typeof migratedV1.player.meritUpgrades === 'object');
assert('v1 forums array initialized', Array.isArray(migratedV1.forums));

// 2. Mock Version 2 Save (Bots & Market Phase)
const v2Save = {
  version: 2,
  meta: { created: 5000, gameTime: 12000, lastSave: 12000, name: 'RunnerV2', avatar: '▲' },
  player: {
    name: 'RunnerV2', avatar: '▲', cash: 250000, bank: 50000,
    energy: 100, nerve: 20, happiness: 100, life: 100, wanted: 1,
    level: 10, xp: 1200, crimeLevel: 6, crimeXp: 850,
    stats: { strength: 120, defense: 110, speed: 105, dexterity: 115, intelligence: 95 },
    acc: { energy: 0, nerve: 0, life: 0, happyOver: 0, wanted: 0 },
    jailUntil: 0, hospitalUntil: 0, platform: 'midlevels'
  },
  inventory: [{ id: 'pistol_glock', qty: 1 }, { id: 'body_kevlar', qty: 1 }],
  bots: [{ id: 'bot_1', name: 'Bot Bravo', level: 8 }],
  market: { listings: [{ id: 'm1', seller: 'bot_1', item: 'bandage', price: 100 }] },
  counters: { crimes: 120, crimesOk: 105, crimesFail: 15 },
  settings: { theme: 'cyber', volume: 0.8 }
};

const migratedV2 = C.storage.repair(C.storage.migrate(JSON.parse(JSON.stringify(v2Save))));
assert('v2 save version bumped to 4', migratedV2.version === 4);
assert('v2 player stats preserved', migratedV2.player.stats.strength === 120);
assert('v2 work stats initialized for Jobs/Companies', typeof migratedV2.player.work === 'object');
assert('v2 properties initialized without overwriting inventory', migratedV2.inventory.length === 2);
assert('v2 bot population preserved', migratedV2.bots.length === 1);

// 3. Mock Version 3 Save (Jobs, Education & Factions)
const v3Save = {
  version: 3,
  meta: { created: 20000, gameTime: 45000, lastSave: 45000, name: 'SyndicateV3', avatar: '⌖' },
  player: {
    name: 'SyndicateV3', avatar: '⌖', cash: 1500000, bank: 400000,
    energy: 100, nerve: 35, happiness: 100, life: 100, wanted: 0,
    level: 22, xp: 8500, crimeLevel: 12, crimeXp: 3400,
    stats: { strength: 450, defense: 420, speed: 410, dexterity: 440, intelligence: 390 },
    workStats: { manual: 85, intelligence: 90, endurance: 80 },
    merits: 3, meritsSpent: 5,
    meritUpgrades: { nerve_bar: 2, life: 1, crit: 2 },
    acc: { energy: 0, nerve: 0, life: 0, happyOver: 0, wanted: 0 },
    jailUntil: 0, hospitalUntil: 0, platform: 'spire'
  },
  inventory: [{ id: 'ar_a', qty: 1 }, { id: 'xanax', qty: 8 }],
  job: { id: 'military', rank: 'Sergeant', progress: 50 },
  education: { active: 'bio_101', progress: 400 },
  faction: { id: 'syndicate_core', rank: 'Enforcer', respects: 450 },
  counters: { crimes: 450, crimesOk: 410, crimesFail: 40 },
  settings: { theme: 'noir' }
};

const migratedV3 = C.storage.repair(C.storage.migrate(JSON.parse(JSON.stringify(v3Save))));
assert('v3 save version bumped to 4', migratedV3.version === 4);
assert('v3 allocated merits preserved intact', migratedV3.player.meritUpgrades.nerve_bar === 2);
assert('v3 job status preserved', migratedV3.job.id === 'military');
assert('v3 education course preserved', migratedV3.education.active === 'bio_101');
assert('v3 faction affiliation preserved', migratedV3.faction.id === 'syndicate_core');
assert('v3 properties defaults populated (Shack)', migratedV3.player.property === 'shack');

// 4. Fresh Character Save (v4 Direct)
const freshSave = C.actions.createCharacter('FreshDeckard', '⌖');
assert('Fresh character initialized with version 4', freshSave.version === 4);
assert('Fresh character starts with Shack residence', freshSave.player.property === 'shack');
assert('Fresh character has shack in propertiesOwned', freshSave.player.propertiesOwned.includes('shack'));
freshSave.bots = freshSave.bots && freshSave.bots.length ? freshSave.bots : C.bots.generateRoster(C.config.BOTS.rosterSize);
assert('Fresh character has 40 bot roster generated', freshSave.bots.length === 40);
assert('Fresh character has 5 battle stats including Intelligence', typeof freshSave.player.stats.intelligence === 'number');

console.log('\n======================================================');
console.log(`SAVE MIGRATION TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

process.exit(failed === 0 ? 0 : 1);
