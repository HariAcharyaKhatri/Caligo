/* CALIGO — target generation. Every crime rolls a handful of candidate
   targets; each trait contributes percentage points to the success chance
   and the wealth tier multiplies the payout.                             */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var D = C.data = C.data || {};

  /* ---- WEALTH --------------------------------------------------------
     Multipliers are normalised so "middle class" is 1x. They correspond
     to the design bible's 2x / 5x / 20x / 50x / 200x scale divided by 5. */
  D.wealth = [
    { id: 'poor',        label: 'Poor',        mult: 0.4 },
    { id: 'middle',      label: 'Middle class', mult: 1 },
    { id: 'wealthy',     label: 'Wealthy',     mult: 4 },
    { id: 'rich',        label: 'Rich',        mult: 10 },
    { id: 'millionaire', label: 'Millionaire', mult: 40 }
  ];

  /* Weight of each wealth tier by crime tier band. Low-tier crimes almost
     never meet a millionaire, which keeps early payouts sane.            */
  D.wealthWeights = {
    low:  [60, 33, 6, 1, 0],     // crime tiers 1-2
    mid:  [25, 45, 24, 5, 1],    // tiers 3-4
    high: [10, 33, 38, 15, 4]    // tiers 5+
  };

  D.wealthBandForTier = function (tier) {
    if (tier <= 2) return 'low';
    if (tier <= 4) return 'mid';
    return 'high';
  };

  /* ---- TRAIT POOLS ---------------------------------------------------
     Each pool is a list of groups. One option is drawn from each group.  */
  D.targetPools = {
    person: [
      { key: 'awareness', label: 'Awareness', options: [
        { label: 'Distracted',  mod: 25,  w: 20 },
        { label: 'Normal',      mod: 0,   w: 45 },
        { label: 'Alert',       mod: -20, w: 25 },
        { label: 'Paranoid',    mod: -40, w: 8 },
        { label: 'Bodyguard',   mod: -60, w: 2 }
      ]},
      { key: 'occupation', label: 'Occupation', options: [
        { label: 'Office worker',   mod: 0,   w: 20 },
        { label: 'Shopper',         mod: 0,   w: 16 },
        { label: 'Student',         mod: 15,  w: 12 },
        { label: 'Tourist',         mod: 25,  w: 12 },
        { label: 'Businessperson',  mod: -10, w: 15 },
        { label: 'Athlete',         mod: -30, w: 8 },
        { label: 'Criminal',        mod: -30, w: 8 },
        { label: 'Celebrity',       mod: -40, w: 3 },
        { label: 'Politician',      mod: -50, w: 2 },
        { label: 'Police officer',  mod: -60, w: 4 }
      ]},
      { key: 'status', label: 'Status', options: [
        { label: 'Alone',          mod: 20,  w: 30 },
        { label: 'With a group',   mod: -25, w: 30 },
        { label: 'With a bodyguard', mod: -50, w: 8 },
        { label: 'Drunk',          mod: 30,  w: 12 },
        { label: 'Asleep',         mod: 50,  w: 6 },
        { label: 'Working',        mod: -10, w: 14 }
      ]},
      { key: 'distraction', label: 'Distraction', options: [
        { label: 'None',        mod: 0,   w: 35 },
        { label: 'Headphones',  mod: 25,  w: 15 },
        { label: 'Texting',     mod: 25,  w: 15 },
        { label: 'On a call',   mod: 20,  w: 12 },
        { label: 'With a dog',  mod: -10, w: 10 },
        { label: 'Arguing',     mod: 15,  w: 13 }
      ]},
      { key: 'fitness', label: 'Fitness', options: [
        { label: 'Sickly',   mod: 20,  w: 8,  rewardMod: 0.7 },
        { label: 'Average',  mod: 0,   w: 62 },
        { label: 'Athletic', mod: -20, w: 30, rewardMod: 1.25 }
      ]},
      { key: 'location', label: 'Setting', options: [
        { label: 'Isolated',     mod: 30,  w: 10 },
        { label: 'Alley',        mod: 25,  w: 15 },
        { label: 'Quiet street', mod: 15,  w: 20 },
        { label: 'Busy street',  mod: -20, w: 25 },
        { label: 'Market',       mod: -30, w: 15 },
        { label: 'Near police',  mod: -60, w: 5 }
      ]}
    ],

    store: [
      { key: 'security', label: 'Security', options: [
        { label: 'No security',   mod: 30,  w: 14 },
        { label: 'Basic locks',   mod: -10, w: 28 },
        { label: 'Cameras',       mod: -20, w: 26 },
        { label: 'Alarm system',  mod: -25, w: 20 },
        { label: 'Guard',         mod: -45, w: 9 },
        { label: 'Armed guard',   mod: -60, w: 3 }
      ]},
      { key: 'staff', label: 'Staff', options: [
        { label: 'Distracted staff', mod: 20, w: 25 },
        { label: 'Normal staff',     mod: 0,  w: 50 },
        { label: 'Alert staff',      mod: -20, w: 25 }
      ]},
      { key: 'size', label: 'Size', options: [
        { label: 'Small',  mod: 10,  w: 35, rewardMod: 0.7 },
        { label: 'Medium', mod: 0,   w: 45, rewardMod: 1 },
        { label: 'Large',  mod: -15, w: 20, rewardMod: 1.5 }
      ]},
      { key: 'location', label: 'Setting', options: [
        { label: 'Quiet street', mod: 15,  w: 30 },
        { label: 'Busy street',  mod: -20, w: 35 },
        { label: 'Inside a mall', mod: -30, w: 25 },
        { label: 'Near police',  mod: -60, w: 10 }
      ]}
    ],

    residence: [
      { key: 'security', label: 'Security', options: [
        { label: 'Unlocked',      mod: 35,  w: 12 },
        { label: 'Basic locks',   mod: 0,   w: 28 },
        { label: 'Deadbolt',      mod: -15, w: 26 },
        { label: 'Alarm system',  mod: -25, w: 20 },
        { label: 'Doorman',       mod: -40, w: 10 },
        { label: 'Full security', mod: -60, w: 4 }
      ]},
      { key: 'occupancy', label: 'Occupancy', options: [
        { label: 'Empty',        mod: 40, w: 22 },
        { label: 'Occupant out', mod: 20, w: 30 },
        { label: 'Occupant home', mod: -35, w: 32 },
        { label: 'Party inside', mod: -50, w: 16 }
      ]},
      { key: 'size', label: 'Size', options: [
        { label: 'Studio',   mod: 10,  w: 30, rewardMod: 0.5 },
        { label: 'Apartment', mod: 0,  w: 40, rewardMod: 1 },
        { label: 'Townhouse', mod: -10, w: 20, rewardMod: 2 },
        { label: 'Estate',   mod: -25, w: 10, rewardMod: 5 }
      ]},
      { key: 'location', label: 'Setting', options: [
        { label: 'Isolated row', mod: 25,  w: 20 },
        { label: 'Quiet street', mod: 15,  w: 25 },
        { label: 'Gated block',  mod: -30, w: 35 },
        { label: 'Near police',  mod: -60, w: 20 }
      ]}
    ],

    vehicle: [
      { key: 'lock', label: 'Lock', options: [
        { label: 'Unlocked',    mod: 40, w: 14 },
        { label: 'Basic lock',  mod: 0,  w: 34 },
        { label: 'Chain lock',  mod: -20, w: 26 },
        { label: 'Immobiliser', mod: -30, w: 18 },
        { label: 'GPS tracker', mod: -30, w: 8 }
      ]},
      { key: 'alarm', label: 'Alarm', options: [
        { label: 'No alarm',   mod: 20,  w: 35 },
        { label: 'Basic alarm', mod: -10, w: 35 },
        { label: 'Smart alarm', mod: -25, w: 22 },
        { label: 'Live tracker', mod: -35, w: 8 }
      ]},
      { key: 'value', label: 'Vehicle', options: [
        { label: 'Scooter',    mod: 15,  w: 22, rewardMod: 0.15, vehItem: null },
        { label: 'Sedan',      mod: 0,   w: 34, rewardMod: 1,    vehItem: 'veh_sedan' },
        { label: 'Coupe',      mod: -10, w: 24, rewardMod: 2.2,  vehItem: 'veh_coupe' },
        { label: 'Sports car', mod: -25, w: 15, rewardMod: 10,   vehItem: 'veh_sports' },
        { label: 'Supercar',   mod: -45, w: 5,  rewardMod: 50,   vehItem: 'veh_supercar' }
      ]},
      { key: 'location', label: 'Setting', options: [
        { label: 'Isolated lot', mod: 25,  w: 22 },
        { label: 'Quiet street', mod: 15,  w: 28 },
        { label: 'Busy street',  mod: -20, w: 32 },
        { label: 'Near police',  mod: -60, w: 18 }
      ]}
    ],

    atm: [
      { key: 'tamper', label: 'Tamper protection', options: [
        { label: 'Unprotected',   mod: 30,  w: 20 },
        { label: 'Basic casing',  mod: 5,   w: 35 },
        { label: 'Sealed casing', mod: -20, w: 30 },
        { label: 'Hardened unit', mod: -40, w: 15 }
      ]},
      { key: 'surveillance', label: 'Surveillance', options: [
        { label: 'Blind spot',    mod: 30,  w: 18 },
        { label: 'Single camera', mod: 0,   w: 40 },
        { label: 'Covered camera', mod: -25, w: 30 },
        { label: 'Monitored live', mod: -40, w: 12 }
      ]},
      { key: 'location', label: 'Setting', options: [
        { label: 'Isolated',     mod: 30, w: 20 },
        { label: 'Late-night street', mod: 10, w: 30 },
        { label: 'Busy street',  mod: -25, w: 30 },
        { label: 'Near police',  mod: -60, w: 20 }
      ]}
    ],

    document: [
      { key: 'complexity', label: 'Document', options: [
        { label: 'Cheque',        mod: 25,  w: 22, rewardMod: 0.3 },
        { label: 'Work permit',   mod: 15,  w: 22, rewardMod: 0.6 },
        { label: 'Driver licence', mod: 0,  w: 24, rewardMod: 1 },
        { label: 'Passport',      mod: -20, w: 20, rewardMod: 2.5 },
        { label: 'Art certificate', mod: -35, w: 12, rewardMod: 8 }
      ]},
      { key: 'scrutiny', label: 'Scrutiny', options: [
        { label: 'Nobody checks', mod: 25,  w: 25 },
        { label: 'Basic check',   mod: 0,   w: 40 },
        { label: 'Careful check', mod: -20, w: 25 },
        { label: 'Forensic check', mod: -40, w: 10 }
      ]},
      { key: 'location', label: 'Setting', options: [
        { label: 'Harbor office', mod: 15,  w: 30 },
        { label: 'Exchange office', mod: -10, w: 35 },
        { label: 'Spire registry', mod: -30, w: 35 }
      ]}
    ]
  };

  /* ---- TIME OF DAY ---------------------------------------------------
     Read from the real clock so the city has a rhythm.                   */
  D.timeOfDay = function (date) {
    var h = date.getHours();
    if (h >= 5 && h < 9) return { label: 'Early morning', mod: 20 };
    if (h >= 9 && h < 18) return { label: 'Daytime', mod: 0 };
    if (h >= 18 && h < 22) return { label: 'Evening', mod: -15 };
    if (h >= 22 || h < 2) return { label: 'Night', mod: -25 };
    return { label: 'Late night', mod: 15 };
  };

  /* ---- WEATHER -------------------------------------------------------
     Rolled once per real day and stored in the save.                     */
  D.weatherTypes = [
    { id: 'clear',     label: 'Clear',      mod: 0,   w: 42 },
    { id: 'overcast',  label: 'Overcast',   mod: 0,   w: 20 },
    { id: 'rain',      label: 'Rain',       mod: 10,  w: 20 },
    { id: 'storm',     label: 'Storm',      mod: 20,  w: 8 },
    { id: 'fog',       label: 'Fog',        mod: 25,  w: 6 },
    { id: 'heat',      label: 'Heat wave',  mod: -10, w: 4 }
  ];

  /* ---- NAME / TITLE POOLS -------------------------------------------- */
  D.namePools = {
    first: ['Marek', 'Ines', 'Tobias', 'Yara', 'Dmitri', 'Sora', 'Lucia', 'Amos', 'Neve', 'Corvin',
            'Ilse', 'Rashid', 'Petra', 'Osric', 'Nadia', 'Halden', 'Mira', 'Ewan', 'Talia', 'Bruno',
            'Selin', 'Gideon', 'Rosa', 'Kaito', 'Vera', 'Emil', 'Noor', 'Casper', 'Dalia', 'Rurik'],
    last:  ['Vance', 'Okonkwo', 'Halloran', 'Brant', 'Ferro', 'Nakamura', 'Solano', 'Kestrel', 'Dray',
            'Mallory', 'Voss', 'Ibarra', 'Renner', 'Quill', 'Ashgrove', 'Mercer', 'Toledo', 'Wren',
            'Castellan', 'Novak', 'Barrow', 'Sinclair', 'Okafor', 'Petrov', 'Lindqvist', 'Marchetti'],
    personTag: ['a commuter', 'a late shopper', 'a tourist with a map', 'someone leaving a bar',
                'a courier on a break', 'a tired office worker', 'a dockhand', 'a broker on a call',
                'a night-shift nurse', 'a student with headphones', 'a delivery rider'],
    storeName: ['Blue Lantern Grocers', 'Pier Three Convenience', 'Halden Electronics',
                'Rustline Pharmacy', 'Corner Mart 24', 'The Paper Rack', 'Voss & Daughters Clothing',
                'Tidewater Supermarket', 'Amber Street Books', 'Kess Fuel Stop'],
    residenceName: ['Rig 14-B', 'Sunset Row Apt 6', 'Harrow Street 22', 'Dockside Loft 3C',
                    'Old Customs House Flat', 'Marlin Court 11', 'The Narrows, Unit 9',
                    'Lighthouse Row 4', 'Foundry Lane 17', 'Exchange Terrace 88'],
    atmName: ['Harbor St. Terminal', 'Pier 3 Cashpoint', 'Exchange Arcade ATM',
              'Undercity Metro ATM', 'Spire Plaza Cashpoint', 'Foundry Lane Terminal'],
    docName: ['Driver licence', 'Work permit', 'Passport', 'Bank cheque',
              'Art provenance certificate', 'Shipping manifest']
  };

  D.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
})(window.CALIGO);
