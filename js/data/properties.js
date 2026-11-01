/* CALIGO — Property Catalogue & Happiness Capacities.
   14 residential tiers from Shack to Private Island (happiness cap 100 -> 5,025). */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var D = C.data = C.data || {};

  D.properties = [
    { id: 'shack', name: 'Shack', cost: 0, happyCap: 100, upkeep: 0, desc: 'A damp concrete cubicle on the salt flats. It keeps the rain off.' },
    { id: 'trailer', name: 'Trailer', cost: 5000, happyCap: 150, upkeep: 50, desc: 'A weathered aluminum trailer parked in the lower perimeter lot.' },
    { id: 'apartment', name: 'Apartment', cost: 25000, happyCap: 250, upkeep: 150, desc: 'A modest fourth-floor flat near the Underbelly transit hub.' },
    { id: 'semi_detached', name: 'Semi-Detached House', cost: 75000, happyCap: 400, upkeep: 350, desc: 'A sturdy brick duplex with a small paved rear courtyard.' },
    { id: 'detached', name: 'Detached House', cost: 300000, happyCap: 600, upkeep: 800, desc: 'Standalone suburban home with private security gate.' },
    { id: 'beach_house', name: 'Beach House', cost: 500000, happyCap: 850, upkeep: 1500, desc: 'A timber pavilion facing the dark outer harbor water.' },
    { id: 'chalet', name: 'Chalet', cost: 750000, happyCap: 1100, upkeep: 2200, desc: 'A high-elevation retreat nestled into the Spire pylon ridges.' },
    { id: 'villa', name: 'Villa', cost: 1250000, happyCap: 1500, upkeep: 3500, desc: 'Mediterranean-style residence with courtyard fountain.' },
    { id: 'penthouse', name: 'Penthouse', cost: 2000000, happyCap: 2000, upkeep: 6000, desc: 'Floor-through luxury penthouse overlooking the Exchange.' },
    { id: 'mansion', name: 'Mansion', cost: 3000000, happyCap: 2750, upkeep: 10000, desc: 'Private estate with perimeter patrols and underground garage.' },
    { id: 'ranch', name: 'Ranch', cost: 15000000, happyCap: 3500, upkeep: 25000, desc: 'Sprawling estate with subterranean gun range.' },
    { id: 'palace', name: 'Palace', cost: 65000000, happyCap: 4200, upkeep: 60000, desc: 'Gilded palace tower on the highest inhabited tier.' },
    { id: 'castle', name: 'Castle', cost: 200000000, happyCap: 4700, upkeep: 150000, desc: 'Ancient stone bastion with modern reinforced defenses.' },
    { id: 'private_island', name: 'Private Island', cost: 500000000, happyCap: 5025, upkeep: 300000, desc: 'A secluded sovereign offshore cay with private airstrip.' }
  ];

  D.propertyById = {};
  D.properties.forEach(function (p) { D.propertyById[p.id] = p; });
})(window.CALIGO);
