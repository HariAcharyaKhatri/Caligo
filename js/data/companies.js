/* CALIGO — company types the player can found. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var D = C.data = C.data || {};

  D.companies = [
    { id: 'logistics', name: 'Logistics',     cost: 500000,    dailyIncome: 8000,    dailyCost: 3000, bonus: '+10% smuggling' },
    { id: 'security',  name: 'Security Firm', cost: 1500000,   dailyIncome: 22000,   dailyCost: 7000, bonus: '+10% combat payout' },
    { id: 'medical',   name: 'Medical Clinic', cost: 3000000,  dailyIncome: 45000,   dailyCost: 14000, bonus: '+20% healing' },
    { id: 'tech',      name: 'Tech Studio',   cost: 5000000,   dailyIncome: 80000,   dailyCost: 24000, bonus: '+15% hacking' },
    { id: 'finance',   name: 'Finance Group', cost: 10000000,  dailyIncome: 170000,  dailyCost: 50000, bonus: '+20% laundering' },
    { id: 'media',     name: 'Media House',   cost: 15000000,  dailyIncome: 240000,  dailyCost: 70000, bonus: '+10% respect gain' },
    { id: 'realestate',name: 'Real Estate',   cost: 20000000,  dailyIncome: 340000,  dailyCost: 100000, bonus: '+20% property income' },
    { id: 'arms',      name: 'Arms Trading',  cost: 50000000,  dailyIncome: 900000,  dailyCost: 250000, bonus: '+15% weapon sale' },
    { id: 'pharma',    name: 'Pharma Lab',    cost: 100000000, dailyIncome: 2100000, dailyCost: 600000, bonus: '+25% drug effect' },
    { id: 'energy',    name: 'Energy Corp',   cost: 200000000, dailyIncome: 4500000, dailyCost: 1200000, bonus: '+10% all income' }
  ];
})(window.CALIGO);
