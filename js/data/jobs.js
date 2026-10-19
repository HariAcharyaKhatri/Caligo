/* CALIGO — jobs. Each entry has rank tiers with stat requirements and pay. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var D = C.data = C.data || {};

  /* Format: id, name, blurb, perk, ranks[] where each rank is
     { title, pay, req } with req = { manual, intelligence, endurance } */
  D.jobs = [
    { id: 'fastfood', name: 'Fast Food Cook', blurb: 'Grease, timers, and a manager who counts napkins.',
      perk: 'Free meals while employed.', ranks: [
        { title: 'Trainee',  pay: 500, req: { manual: 0 } },
        { title: 'Cook',     pay: 700, req: { manual: 25 } },
        { title: 'Shift Lead', pay: 900, req: { manual: 80 } }
      ]},
    { id: 'janitor', name: 'Janitor', blurb: 'Keys to every floor and nobody looks at you twice.',
      perk: 'Access to more city locations.', ranks: [
        { title: 'Cleaner',   pay: 400, req: { manual: 0 } },
        { title: 'Custodian', pay: 600, req: { manual: 40 } },
        { title: 'Head Porter', pay: 900, req: { manual: 120 } }
      ]},
    { id: 'retail', name: 'Retail Clerk', blurb: 'The customer is always wrong, and you are paid to agree.',
      perk: '+5% item market sale price.', ranks: [
        { title: 'Cashier',    pay: 800, req: { manual: 0, intelligence: 20 } },
        { title: 'Senior Clerk', pay: 1200, req: { manual: 30, intelligence: 80 } },
        { title: 'Floor Manager', pay: 1800, req: { manual: 80, intelligence: 200 } }
      ]},
    { id: 'courier', name: 'Delivery Driver', blurb: 'Speed limits are a suggestion, tips are a lie.',
      perk: 'Reduced travel time on short hops.', ranks: [
        { title: 'Rider',     pay: 600, req: { manual: 0, endurance: 20 } },
        { title: 'Driver',    pay: 1100, req: { manual: 60, endurance: 80 } },
        { title: 'Route Lead', pay: 1900, req: { manual: 150, endurance: 200 } }
      ]},
    { id: 'mechanic', name: 'Mechanic', blurb: 'Grease up to your elbows, money under the table.',
      perk: '+10% vehicle sale value.', ranks: [
        { title: 'Apprentice', pay: 2000, req: { manual: 80, endurance: 40 } },
        { title: 'Mechanic', pay: 3500, req: { manual: 250, endurance: 150 } },
        { title: 'Master Tech', pay: 6000, req: { manual: 600, endurance: 400 } }
      ]},
    { id: 'security', name: 'Security Guard', blurb: 'Stand near the door. Look at the cameras.',
      perk: 'Small defence bonus while employed.', ranks: [
        { title: 'Rookie',   pay: 1800, req: { manual: 20, endurance: 100 } },
        { title: 'Guard',    pay: 3000, req: { manual: 80, endurance: 300 } },
        { title: 'Chief',    pay: 5500, req: { manual: 200, endurance: 700 } }
      ]},
    { id: 'teacher', name: 'Teacher', blurb: 'Underpaid, overworked, occasionally thanked.',
      perk: '+5% education speed.', ranks: [
        { title: 'Substitute', pay: 2500, req: { intelligence: 200 } },
        { title: 'Teacher',    pay: 4000, req: { intelligence: 500 } },
        { title: 'Department Head', pay: 7000, req: { intelligence: 1200 } }
      ]},
    { id: 'nurse', name: 'Nurse', blurb: 'Long shifts, short tempers, useful skills.',
      perk: '+20% medical item effectiveness.', ranks: [
        { title: 'Aide',    pay: 3000, req: { intelligence: 250, endurance: 150 } },
        { title: 'Nurse',   pay: 5000, req: { intelligence: 700, endurance: 400 } },
        { title: 'Head Nurse', pay: 8000, req: { intelligence: 1600, endurance: 900 } }
      ]},
    { id: 'engineer', name: 'Engineer', blurb: 'A hard hat, a CAD file, and a pocket full of pens.',
      perk: '+10% property income.', ranks: [
        { title: 'Junior',  pay: 8000, req: { intelligence: 800, manual: 200 } },
        { title: 'Engineer', pay: 14000, req: { intelligence: 2200, manual: 500 } },
        { title: 'Lead', pay: 25000, req: { intelligence: 5000, manual: 1200 } }
      ]},
    { id: 'pilot', name: 'Pilot', blurb: 'Caligo from the air is a beautiful ugly stack.',
      perk: 'Fast travel reductions.', ranks: [
        { title: 'Co-pilot', pay: 10000, req: { intelligence: 1500, endurance: 500 } },
        { title: 'Captain',  pay: 20000, req: { intelligence: 4000, endurance: 1500 } },
        { title: 'Senior Captain', pay: 35000, req: { intelligence: 9000, endurance: 3500 } }
      ]},
    { id: 'lawyer', name: 'Lawyer', blurb: 'Paid by the hour. The hour never ends.',
      perk: '-20% jail time.', ranks: [
        { title: 'Junior Associate', pay: 15000, req: { intelligence: 3000 } },
        { title: 'Partner',          pay: 28000, req: { intelligence: 7500 } },
        { title: 'Senior Partner',   pay: 50000, req: { intelligence: 15000 } }
      ]},
    { id: 'police', name: 'Police Officer', blurb: 'You know every alley and every bribe.',
      perk: '-50% wanted gain from crimes.', ranks: [
        { title: 'Cadet',    pay: 20000, req: { manual: 800, endurance: 800 } },
        { title: 'Officer',  pay: 35000, req: { manual: 2000, endurance: 2000 } },
        { title: 'Detective', pay: 60000, req: { manual: 5000, endurance: 5000 } }
      ]},
    { id: 'surgeon', name: 'Surgeon', blurb: 'Steady hands, steady income, unsteady sleep.',
      perk: '+50% healing.', ranks: [
        { title: 'Resident', pay: 30000, req: { intelligence: 5000 } },
        { title: 'Surgeon',  pay: 55000, req: { intelligence: 12000 } },
        { title: 'Chief Surgeon', pay: 90000, req: { intelligence: 25000 } }
      ]},
    { id: 'ceo', name: 'CEO', blurb: 'A desk, a view, and a tax advisor on retainer.',
      perk: '+20% business income.', ranks: [
        { title: 'Executive', pay: 100000, req: { intelligence: 40000 } },
        { title: 'CEO',       pay: 200000, req: { intelligence: 80000 } }
      ]}
  ];
})(window.CALIGO);
