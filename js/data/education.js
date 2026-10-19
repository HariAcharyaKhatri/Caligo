/* CALIGO — education categories and courses. All courses cost game hours. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var D = C.data = C.data || {};

  /* Format: [category, [ [id, name, hours, cost, prereqId|'none', bonusText] ] ] */
  D.education = [
    ['Computer Science', [
      ['cs_intro',  'Intro to Computers', 10, 5000, 'none', '+2% hacking'],
      ['cs_prog',   'Programming Fundamentals', 20, 15000, 'cs_intro', '+5% hacking'],
      ['cs_script', 'Scripting Basics', 25, 20000, 'cs_prog', '+10% hacking'],
      ['cs_web',    'Web Development', 30, 25000, 'cs_prog', '+10% cyber crime'],
      ['cs_sec',    'Cybersecurity', 40, 50000, 'cs_web', '+15% hacking'],
      ['cs_eth',    'Ethical Hacking', 50, 100000, 'cs_sec', '+20% hacking'],
      ['cs_db',     'Databases', 25, 20000, 'cs_prog', '+10% data crimes'],
      ['cs_net',    'Networking', 30, 25000, 'cs_intro', '+10% network hacking'],
      ['cs_ai',     'Artificial Intelligence', 40, 75000, 'cs_script', '+15% automation'],
      ['cs_crypto', 'Cryptography', 35, 50000, 'cs_sec', '+20% encryption, +15% crypto trading'],
      ['cs_chain',  'Blockchain', 30, 60000, 'cs_crypto', '+15% crypto'],
      ['cs_quantum','Quantum Computing', 50, 200000, 'cs_ai', '+30% hacking']
    ]],
    ['Mathematics', [
      ['m_basic','Basic Math',10,2000,'none','+2% gym gains'],
      ['m_alg','Algebra',20,10000,'m_basic','+5% gym gains'],
      ['m_geo','Geometry',20,10000,'m_basic','+5% aim'],
      ['m_calc','Calculus',40,50000,'m_alg','+10% gym gains'],
      ['m_stat','Statistics',25,20000,'m_alg','+10% casino'],
      ['m_prob','Probability',20,15000,'m_stat','+15% casino'],
      ['m_linalg','Linear Algebra',30,25000,'m_calc','+10% AI'],
      ['m_disc','Discrete Math',30,25000,'m_calc','+10% programming'],
      ['m_num','Number Theory',25,30000,'m_disc','+15% cryptography'],
      ['m_adv','Advanced Math',60,100000,'m_calc','+20% all math bonuses']
    ]],
    ['Science', [
      ['s_bio','Basic Biology',15,5000,'none','+5% medical'],
      ['s_anat','Human Anatomy',30,25000,'s_bio','+10% medical, +10% combat damage'],
      ['s_pharm','Pharmacology',35,50000,'s_bio','+20% drug effects'],
      ['s_chem','Basic Chemistry',15,5000,'none','+5% crafting'],
      ['s_org','Organic Chemistry',30,30000,'s_chem','+15% crafting'],
      ['s_advchem','Advanced Chemistry',40,75000,'s_org','+25% crafting'],
      ['s_phys','Physics',30,25000,'m_basic','+10% aim'],
      ['s_advphys','Advanced Physics',50,100000,'s_phys','+15% aim'],
      ['s_bioch','Biochemistry',35,60000,'s_org','+20% medical'],
      ['s_neuro','Neuroscience',40,80000,'s_anat','+20% intel gathering']
    ]],
    ['Medicine', [
      ['me_first','First Aid',10,5000,'none','+10% self healing'],
      ['me_emerg','Emergency Medicine',20,15000,'me_first','+15% healing others'],
      ['me_surg','Surgery Basics',40,50000,'me_emerg','+20% healing'],
      ['me_asurg','Advanced Surgery',60,150000,'me_surg','+30% healing'],
      ['me_forensic','Forensic Science',35,60000,'s_bio','+20% evidence skill'],
      ['me_psych','Psychiatry',35,50000,'s_neuro','+20% persuasion'],
      ['me_dent','Dentistry',25,30000,'me_surg','+15% healing'],
      ['me_vet','Veterinary Medicine',30,40000,'s_bio','+15% animal handling'],
      ['me_alt','Alternative Medicine',25,20000,'me_first','+10% healing']
    ]],
    ['Law', [
      ['l_intro','Intro to Law',15,5000,'none','-10% jail time'],
      ['l_crim','Criminal Law',30,25000,'l_intro','-20% jail time'],
      ['l_civil','Civil Law',25,20000,'l_intro','+10% lawsuit wins'],
      ['l_const','Constitutional Law',30,30000,'l_civil','+15% political influence'],
      ['l_corp','Corporate Law',35,50000,'l_civil','+20% business success'],
      ['l_intl','International Law',35,50000,'l_const','+15% travel crime'],
      ['l_proc','Criminal Procedure',30,30000,'l_crim','-25% jail time'],
      ['l_evid','Evidence Law',25,25000,'l_crim','+20% court'],
      ['l_adv','Advanced Legal Studies',50,100000,'l_proc','+30% all legal']
    ]],
    ['Business', [
      ['b_intro','Intro to Business',10,5000,'none','+5% income'],
      ['b_acct','Accounting',30,25000,'b_intro','+15% laundering'],
      ['b_fin','Finance',35,50000,'b_acct','+15% stocks'],
      ['b_mkt','Marketing',25,20000,'b_intro','+15% business income'],
      ['b_mgmt','Management',25,20000,'b_intro','+15% employee efficiency'],
      ['b_ent','Entrepreneurship',30,30000,'b_mgmt','+20% startup success'],
      ['b_intl','International Business',35,50000,'b_intro','+20% trade'],
      ['b_re','Real Estate',30,40000,'b_fin','+20% property income'],
      ['b_stock','Stock Trading',40,75000,'b_fin','+25% stocks'],
      ['b_adv','Advanced Business',60,150000,'b_fin','+30% all business']
    ]],
    ['Combat Training', [
      ['c_sd','Self Defense',10,5000,'none','+10% defense'],
      ['c_box','Boxing',25,20000,'c_sd','+15% strength, +10% speed'],
      ['c_ma','Martial Arts',40,50000,'c_box','+20% strength, +15% speed, +15% dexterity'],
      ['c_fire','Firearms Training',20,25000,'none','+15% aim'],
      ['c_marks','Advanced Marksmanship',40,75000,'c_fire','+25% aim'],
      ['c_long','Long-range Training',60,150000,'c_marks','+40% aim'],
      ['c_tac','Tactical Training',40,75000,'c_box','+20% combat and teamwork'],
      ['c_mil','Military Strategy',50,100000,'c_tac','+25% faction war score'],
      ['c_spec','Special Operations',80,250000,'c_mil','+40% all combat']
    ]],
    ['Languages', [
      ['lg_sp','Spanish',30,15000,'none','+10% Mexico crime and trade'],
      ['lg_ru','Russian',40,25000,'none','+15% Russia crime and trade'],
      ['lg_jp','Japanese',50,30000,'none','+15% Japan crime and trade'],
      ['lg_cn','Mandarin',60,40000,'none','+15% China crime and trade'],
      ['lg_ar','Arabic',50,35000,'none','+15% UAE crime and trade'],
      ['lg_fr','French',30,15000,'none','+10% France crime and trade'],
      ['lg_de','German',35,20000,'none','+10% Germany crime and trade'],
      ['lg_poly','Polyglot Mastery',100,200000,'lg_sp','+30% all international actions']
    ]],
    ['Arts & Crafts', [
      ['a_draw','Drawing',20,10000,'none','+10% forgery'],
      ['a_paint','Painting',30,15000,'a_draw','+15% forgery'],
      ['a_sculp','Sculpture',30,20000,'a_draw','+15% crafting'],
      ['a_photo','Photography',25,15000,'none','+15% intel'],
      ['a_music','Music',20,10000,'none','+10% happiness gains'],
      ['a_acting','Acting',30,25000,'none','+20% disguise'],
      ['a_write','Writing',25,15000,'none','+15% forgery'],
      ['a_film','Film Making',35,40000,'a_photo','+15% intel'],
      ['a_master','Master Crafting',60,150000,'a_sculp','+30% crafting']
    ]],
    ['Specialised', [
      ['sp_pick','Pickpocketing',15,10000,'none','+20% pickpocket'],
      ['sp_lock','Lockpicking',20,15000,'none','+20% burglary and safe cracking'],
      ['sp_stealth','Stealth',25,20000,'none','+25% stealth'],
      ['sp_disg','Disguise',20,15000,'none','+25% disguise'],
      ['sp_surv','Survival',40,25000,'none','+30% survival'],
      ['sp_track','Tracking',30,25000,'none','+25% tracking'],
      ['sp_esc','Escape and Evasion',35,40000,'none','+30% escape from jail attempts'],
      ['sp_master','Master Criminal',100,500000,'sp_pick','+50% all crime']
    ]]
  ];

  D.eduCourses = {};
  D.education.forEach(function (cat) {
    cat[1].forEach(function (c) {
      D.eduCourses[c[0]] = {
        id: c[0], name: c[1], category: cat[0],
        hours: c[2], cost: c[3], prereq: c[4], bonus: c[5]
      };
    });
  });
})(window.CALIGO);
