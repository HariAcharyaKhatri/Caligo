/* CALIGO — Complete Crimes 2.0 Family Catalogue & Research Parity.
   Integrates all 13 researched Crime Families, 22 Pickpocketing targets,
   34 Burglary locations, 6 Search for Cash subcrimes, and 12 Disposal jobs.
   Preserves legacy crime IDs for save and mission compatibility.            */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var D = C.data = C.data || {};

  /* ---- 22 RESEARCHED PICKPOCKETING TARGETS ---- */
  D.pickpocketTargets = [
    { id: 'businessman', name: 'Businessman', difficulty: 'Moderate', condition: 'Any', uniqueDrop: 'speed', cash: [150, 650], desc: 'Carrying a leather briefcase and talking trade figures.' },
    { id: 'businesswoman', name: 'Businesswoman', difficulty: 'Moderate', condition: 'Any', uniqueDrop: 'glasses', cash: [180, 700], desc: 'Checking market indices on a sleek tablet.' },
    { id: 'classy_lady', name: 'Classy Lady', difficulty: 'More difficult', condition: 'Must be on phone', uniqueDrop: 'high_heels', cash: [300, 1200], desc: 'Preoccupied with an animated telephone call.' },
    { id: 'cyclist', name: 'Cyclist', difficulty: 'More difficult', condition: 'Cycling only', reqItem: 'cut_razor', uniqueDrop: 'mountain_bike', cash: [100, 450], desc: 'Pedaling past the dock junction in high-vis spandex.' },
    { id: 'drunk_man', name: 'Drunk Man', difficulty: 'Easier', condition: 'Any', reqItem: 'cut_razor', uniqueDrop: 'beer', cash: [50, 300], desc: 'Staggering out of the dockside dive bar.' },
    { id: 'drunk_woman', name: 'Drunk Woman', difficulty: 'Easier', condition: 'Any', reqItem: 'cut_razor', uniqueDrop: 'pumpkin_brew', cash: [60, 350], desc: 'Laughing loudly with a purse swinging loosely from her arm.' },
    { id: 'elderly_man', name: 'Elderly Man', difficulty: 'Easier', condition: 'Walking only', reqItem: 'cut_razor', uniqueDrop: 'tootsie_rolls', cash: [80, 400], desc: 'Walking slowly with an antique cane.' },
    { id: 'elderly_woman', name: 'Elderly Woman', difficulty: 'Easier', condition: 'Walking only', uniqueDrop: 'opium', cash: [90, 420], desc: 'Clutching a velvet handbag near the tram stop.' },
    { id: 'gang_member', name: 'Gang Member', difficulty: 'More difficult', condition: 'Loitering only', reqItem: 'cut_razor', uniqueDrop: 'wire_cutters', cash: [200, 900], desc: 'Standing on a corner wearing syndicate colors.' },
    { id: 'homeless_person', name: 'Homeless Person', difficulty: 'Easier', condition: 'Any', uniqueDrop: 'morphine', cash: [10, 80], desc: 'Resting on cardboard with pockets bulging with scrap.' },
    { id: 'jogger', name: 'Jogger', difficulty: 'Moderate', condition: 'Walking/jogging only', reqItem: 'cut_razor', uniqueDrop: 'crocozade', cash: [40, 250], desc: 'Pacing the boulevard with an arm-band music pouch.' },
    { id: 'junkie', name: 'Junkie', difficulty: 'Easier', condition: 'Stumbling only', uniqueDrop: 'ecstasy', cash: [20, 150], desc: 'Shivering in an alleyway, completely unobservant.' },
    { id: 'laborer', name: 'Laborer', difficulty: 'Moderate', condition: 'Walking only', uniqueDrop: 'megaphone', cash: [100, 500], desc: 'Carrying a heavy metal lunch pail and toolbelt.' },
    { id: 'mobster', name: 'Mobster', difficulty: 'Very difficult', condition: 'Walking only', reqItem: 'cut_razor', uniqueDrop: 'rare_stamp', cash: [561000, 772000], desc: 'High-ranking syndicate enforcer surrounded by shadows.' },
    { id: 'police_officer', name: 'Police Officer', difficulty: 'Very difficult', condition: 'Running only', uniqueDrop: 'police_badge', cash: [150, 800], desc: 'Uniformed patrol officer distracted by radio dispatch.' },
    { id: 'postal_worker', name: 'Postal Worker', difficulty: 'Moderate', condition: 'Distracted only', uniqueDrop: 'lottery_voucher', cash: [120, 550], desc: 'Sorting parcels inside a parked delivery van.' },
    { id: 'rich_kid', name: 'Rich Kid', difficulty: 'More difficult', condition: 'Listening to music only', reqItem: 'cut_razor', uniqueDrop: 'alcohol', cash: [400, 1800], desc: 'Designer jacket and noise-cancelling headphones.' },
    { id: 'sex_worker', name: 'Sex Worker', difficulty: 'More difficult', condition: 'Soliciting only', uniqueDrop: 'thong', cash: [250, 950], desc: 'Standing under the neon lights of the red-light promenade.' },
    { id: 'student', name: 'Student', difficulty: 'Moderate', condition: 'Any', reqItem: 'cut_razor', uniqueDrop: 'laptop', cash: [50, 300], desc: 'Carrying an overstuffed canvas backpack.' },
    { id: 'thug', name: 'Thug', difficulty: 'Moderate', condition: 'Loitering, male only', reqItem: 'cut_razor', uniqueDrop: 'cut_razor', cash: [150, 700], desc: 'Pacing in front of a betting parlor.' },
    { id: 'young_man', name: 'Young Man', difficulty: 'Less difficult', condition: 'Any', uniqueDrop: 'ketamine', cash: [75, 400], desc: 'Browsing his phone while waiting for the crosswalk.' },
    { id: 'young_woman', name: 'Young Woman', difficulty: 'Less difficult', condition: 'Any', uniqueDrop: 'ecstasy', cash: [80, 450], desc: 'Sipping coffee with a tote bag over her shoulder.' }
  ];

  /* ---- 34 RESEARCHED BURGLARY LOCATIONS ---- */
  D.burglaryLocations = [
    /* Residential (12) */
    { id: 'b_apt', name: 'Apartment', district: 'Residential', skill: 14, reqTool: 'credit_card', uniqueDrop: 'high_drive', cash: [8000, 25000], desc: 'High-rise residential flat.' },
    { id: 'b_beach_hut', name: 'Beach Hut', district: 'Residential', skill: 1, reqTool: 'jemmy', uniqueDrop: 'cash', cash: [127000, 399200], desc: 'Secluded seaside shack on the lower perimeter.' },
    { id: 'b_bungalow', name: 'Bungalow', district: 'Residential', skill: 1, reqTool: 'window_breaker', uniqueDrop: 'xanax', cash: [5000, 18000], desc: 'Quiet single-story suburban dwelling.' },
    { id: 'b_cottage', name: 'Cottage', district: 'Residential', skill: 3, reqTool: 'window_breaker', uniqueDrop: 'leather_jacket', cash: [6000, 22000], desc: 'Old brick cottage on the city fringe.' },
    { id: 'b_farmhouse', name: 'Farmhouse', district: 'Residential', skill: 38, reqTool: 'window_breaker', uniqueDrop: 'first_aid', cash: [12000, 40000], desc: 'Rural homestead with private perimeter.' },
    { id: 'b_lake_house', name: 'Lake House', district: 'Residential', skill: 46, reqTool: 'jemmy', uniqueDrop: 'med_kit', cash: [25000, 85000], desc: 'Sprawling lakeside villa with private jetty.' },
    { id: 'b_luxury_villa', name: 'Luxury Villa', district: 'Residential', skill: 69, reqTool: 'window_breaker', uniqueDrop: 'persian_rug', cash: [50000, 190000], desc: 'Guarded mansion on the upper Spire ring.' },
    { id: 'b_manor_house', name: 'Manor House', district: 'Residential', skill: 100, reqTool: 'lockpick_set', uniqueDrop: 'chandelier', cash: [150000, 500000], desc: 'Historic estate with heavy antique deadbolts.' },
    { id: 'b_mobile_home', name: 'Mobile Home', district: 'Residential', skill: 1, reqTool: 'rope', uniqueDrop: 'claymore_mine', cash: [3000, 12000], desc: 'Trailer lot unit with makeshift latch.' },
    { id: 'b_secluded_cabin', name: 'Secluded Cabin', district: 'Residential', skill: 30, reqTool: 'jemmy', uniqueDrop: 'lighter', cash: [15000, 45000], desc: 'Isolated mountain cabin off the main line.' },
    { id: 'b_suburban_home', name: 'Suburban Home', district: 'Residential', skill: 1, reqTool: 'window_breaker', uniqueDrop: 'lottery_voucher', cash: [7000, 24000], desc: 'Family house with rear sliding patio glass.' },
    { id: 'b_tool_shed', name: 'Tool Shed', district: 'Residential', skill: 1, reqTool: 'lockpick_set', uniqueDrop: 'flashlight', cash: [2000, 8000], desc: 'Backyard outbuilding housing heavy equipment.' },
    /* Commercial (11) */
    { id: 'b_ad_agency', name: 'Advertising Agency', district: 'Commercial', skill: 25, reqTool: 'skeleton_key', uniqueDrop: 'energy_drink', cash: [18000, 55000], desc: 'Creative studio with executive liquor stash.' },
    { id: 'b_barbershop', name: 'Barbershop', district: 'Commercial', skill: 25, reqTool: 'lockpick_set', uniqueDrop: 'cash', cash: [13783, 19887], desc: 'Cash-heavy corner salon.' },
    { id: 'b_chiropractors', name: 'Chiropractors', district: 'Commercial', skill: 25, reqTool: 'window_breaker', uniqueDrop: 'xanax', cash: [14000, 38000], desc: 'Medical office with locked dispensary cabinet.' },
    { id: 'b_cleaning_agency', name: 'Cleaning Agency', district: 'Commercial', skill: 25, reqTool: 'jemmy', uniqueDrop: 'tumble_dryer', cash: [10000, 32000], desc: 'Industrial laundry and supply hub.' },
    { id: 'b_dentist', name: 'Dentists Office', district: 'Commercial', skill: 25, reqTool: 'credit_card', uniqueDrop: 'gold_tooth', cash: [20000, 65000], desc: 'Dental suite with precious metal dental reserves.' },
    { id: 'b_funeral_directors', name: 'Funeral Directors', district: 'Commercial', skill: 25, reqTool: 'lockpick_set', uniqueDrop: 'blood_bag', cash: [16000, 48000], desc: 'Quiet mortuary with secure rear vault.' },
    { id: 'b_liquor_store', name: 'Liquor Store', district: 'Commercial', skill: 25, reqTool: 'skeleton_key', uniqueDrop: 'alcohol', cash: [15000, 50000], desc: 'Wholesale liquor room protected by grate.' },
    { id: 'b_market', name: 'Market', district: 'Commercial', skill: 25, reqTool: 'jemmy', uniqueDrop: 'fanny_pack', cash: [12000, 42000], desc: 'Farmers and vendor cooperative depot.' },
    { id: 'b_postal_office', name: 'Postal Office', district: 'Commercial', skill: 25, reqTool: 'credit_card', uniqueDrop: 'rare_stamp', cash: [22000, 75000], desc: 'Central logistics station sorting vault.' },
    { id: 'b_recruitment_agency', name: 'Recruitment Agency', district: 'Commercial', skill: 25, reqTool: 'window_breaker', uniqueDrop: 'jade_buddha', cash: [16000, 52000], desc: 'Corporate staffing office with safe.' },
    { id: 'b_self_storage', name: 'Self-Storage Facility', district: 'Commercial', skill: 25, reqTool: 'skeleton_key', uniqueDrop: 'opium', cash: [30000, 95000], desc: 'Secured roll-up storage locker matrix.' },
    /* Industrial (11) */
    { id: 'b_brewery', name: 'Brewery', district: 'Industrial', skill: 50, reqTool: 'rope', uniqueDrop: 'pumpkin_brew', cash: [35000, 110000], desc: 'Heavy distilling complex with overhead cranes.' },
    { id: 'b_dockside_warehouse', name: 'Dockside Warehouse', district: 'Industrial', skill: 50, reqTool: 'lockpick_set', uniqueDrop: 'dvd', cash: [40000, 130000], desc: 'Smugglers depot on the salt pier.' },
    { id: 'b_farm_storage', name: 'Farm Storage Unit', district: 'Industrial', skill: 50, reqTool: 'jemmy', uniqueDrop: 'cattle_prod', cash: [32000, 105000], desc: 'Agricultural machinery hangar.' },
    { id: 'b_fertilizer_plant', name: 'Fertilizer Plant', district: 'Industrial', skill: 50, reqTool: 'lockpick_set', uniqueDrop: 'chemicals', cash: [38000, 120000], desc: 'Chemical refinery with industrial safes.' },
    { id: 'b_foundry', name: 'Foundry', district: 'Industrial', skill: 50, reqTool: 'jemmy', uniqueDrop: 'yasukuni_sword', cash: [45000, 150000], desc: 'Metal smelting plant with ceremonial armory.' },
    { id: 'b_old_factory', name: 'Old Factory', district: 'Industrial', skill: 50, reqTool: 'window_breaker', uniqueDrop: 'chocolate_box', cash: [30000, 95000], desc: 'Abandoned textile assembly floor.' },
    { id: 'b_paper_mill', name: 'Paper Mill', district: 'Industrial', skill: 50, reqTool: 'skeleton_key', uniqueDrop: 'blank_cards', cash: [34000, 115000], desc: 'High-grade security paper producer.' },
    { id: 'b_slaughterhouse', name: 'Slaughterhouse', district: 'Industrial', skill: 50, reqTool: 'window_breaker', uniqueDrop: 'machete', cash: [28000, 90000], desc: 'Chilled processing plant with cutting tools.' },
    { id: 'b_truckyard', name: 'Truckyard', district: 'Industrial', skill: 50, reqTool: 'skeleton_key', uniqueDrop: 'heavy_pistol', cash: [42000, 140000], desc: 'Freight staging area with locked trailers.' },
    { id: 'b_distribution_ctr', name: 'Distribution Center', district: 'Industrial', skill: 50, reqTool: 'jemmy', uniqueDrop: 'stim_pills', cash: [48000, 160000], desc: 'High-speed automated logistics hub.' },
    { id: 'b_storage_vault', name: 'Storage Vault', district: 'Industrial', skill: 50, reqTool: 'lockpick_set', uniqueDrop: 'diamond_ring', cash: [75000, 250000], desc: 'Reinforced concrete vault on the canal.' }
  ];

  /* ---- 6 SEARCH FOR CASH SUBCRIMES & UNIQUE OUTCOMES ---- */
  D.searchCashSubcrimes = [
    { id: 'trash', name: 'Search the Trash', nerve: 2, uniqueDrops: ['candy', 'morphine'], desc: 'Rummage through city waste bins and alley dumpsters.' },
    { id: 'subway', name: 'Search the Subway', nerve: 2, uniqueDrops: ['glasses', 'skimmer', 'ecstasy', 'laptop', 'xanax'], desc: 'Comb the subway platforms, train cars, and lost-and-found.' },
    { id: 'junkyard', name: 'Search the Junkyard', nerve: 2, uniqueDrops: ['mountain_bike', 'spray_can', 'high_drive'], desc: 'Scan crushed scrap heaps and vehicle chassis.' },
    { id: 'beach', name: 'Search the Beach', nerve: 2, uniqueDrops: ['beer', 'first_aid', 'silver_bead'], desc: 'Metal-detect the coastal tide line on the outer perimeter.' },
    { id: 'cemetery', name: 'Search the Cemetery', nerve: 2, uniqueDrops: ['speed', 'golden_wreath'], desc: 'Quietly inspect headstones and groundskeeper sheds.' },
    { id: 'fountain', name: 'Search the Fountain', nerve: 2, uniqueDrops: ['lucky_charm', 'pcp', 'ecstasy'], desc: 'Wade into the central municipal water basin under cover of darkness.' }
  ];

  /* ---- 12 DISPOSAL JOBS & 5 METHODS ---- */
  D.disposalMethods = [
    { id: 'abandon', name: 'Abandon', nerve: 6, reqItem: null, desc: 'Dump the cargo in a remote alleyway and walk away.' },
    { id: 'bury', name: 'Bury', nerve: 8, reqItem: 'shovel', desc: 'Dig a deep pit on the industrial outskirts (requires Shovel).' },
    { id: 'burn', name: 'Burn', nerve: 10, reqItem: 'gas_can', consumes: true, desc: 'Douse in fuel and incinerate (consumes Gasoline).' },
    { id: 'sink', name: 'Sink', nerve: 12, reqItem: null, desc: 'Weight with concrete and drop into the harbor channel.' },
    { id: 'dissolve', name: 'Dissolve', nerve: 14, reqItem: 'acid', consumes: true, desc: 'Submerge in chemical vat until nothing remains (consumes Acid).' }
  ];

  D.disposalJobs = [
    { id: 'appliance', name: 'Broken Appliance', reward: [3000, 6500], methods: ['abandon', 'bury', 'sink', 'dissolve'] },
    { id: 'bio_waste', name: 'Biological Waste', reward: [24200, 30800], methods: ['abandon', 'bury', 'burn', 'sink'] },
    { id: 'body_part', name: 'Body Part', reward: [56100, 86300], methods: ['abandon', 'bury', 'burn', 'sink', 'dissolve'] },
    { id: 'building_debris', name: 'Building Debris', reward: [7000, 13000], methods: ['abandon', 'bury', 'sink'] },
    { id: 'dead_body', name: 'Dead Body', reward: [101300, 157800], methods: ['abandon', 'burn', 'bury', 'sink', 'dissolve'] },
    { id: 'documents', name: 'Compromising Documents', reward: [6500, 12340], methods: ['abandon', 'bury', 'sink', 'dissolve'] },
    { id: 'firearms', name: 'Used Firearms', reward: [31900, 44300], methods: ['abandon', 'bury', 'sink', 'dissolve'] },
    { id: 'general_waste', name: 'General Waste', reward: [1000, 3000], methods: ['abandon', 'bury', 'burn', 'sink', 'dissolve'] },
    { id: 'industrial_waste', name: 'Industrial Waste', reward: [18100, 30000], methods: ['abandon', 'bury', 'sink'] },
    { id: 'murder_weapon', name: 'Murder Weapon', reward: [30300, 39400], methods: ['abandon', 'bury', 'sink', 'dissolve'] },
    { id: 'furniture', name: 'Old Furniture', reward: [4000, 9500], methods: ['abandon', 'bury', 'burn', 'sink', 'dissolve'] },
    { id: 'vehicle', name: 'Compromised Vehicle', reward: [35000, 65000], methods: ['abandon', 'burn', 'bury', 'sink'] }
  ];

  /* ---- 7 GRAFFITI DISTRICTS ---- */
  D.graffitiDistricts = [
    { id: 'east', name: 'East Side Industrial Wall', nerve: 3, reqTool: 'spray_can', reward: [80, 250], mod: 10, desc: 'Tag concrete factory retaining walls on the eastern perimeter.' },
    { id: 'west', name: 'West Side Freight Depot', nerve: 3, reqTool: 'spray_can', reward: [90, 280], mod: 8, desc: 'Spray freight cars staged on the rail line.' },
    { id: 'north', name: 'North Side Overpass', nerve: 3, reqTool: 'spray_can', reward: [100, 320], mod: 5, desc: 'Climb highway pillars and tag huge block letters.' },
    { id: 'res', name: 'Residential District Alley', nerve: 3, reqTool: 'spray_can', reward: [120, 380], mod: 2, desc: 'Mark garage doors and alley fences in the residential quarter.' },
    { id: 'redlight', name: 'Red-Light Promenade', nerve: 3, reqTool: 'spray_can', reward: [150, 450], mod: 0, desc: 'Paint vibrant neon insignias above club marquees.' },
    { id: 'fin', name: 'Financial District Plaza', nerve: 3, reqTool: 'spray_can', reward: [250, 650], mod: -8, desc: 'Hit polished marble plaza columns in high-security corporate territory.' },
    { id: 'centre', name: 'City Centre Civic Monument', nerve: 3, reqTool: 'spray_can', reward: [350, 950], mod: -15, desc: 'Tag the central municipal spire obelisk directly in front of the cameras.' }
  ];

  /* ---- 8 SHOPLIFTING TARGETS ---- */
  D.shopliftShops = [
    { id: 'sallys', name: "Sally's Sweet Shop", nerve: 4, uniqueDrop: 'candy', reward: [100, 350], mod: 10, desc: 'Pocket premium chocolate bars and imported hard candies.' },
    { id: 'bits', name: "Bits 'n' Bobs Hardware", nerve: 4, uniqueDrop: 'lockpick_set', reward: [120, 420], mod: 8, desc: 'Slip hardware fasteners, tension tools, and wire cutters into your sleeve.' },
    { id: 'clothing', name: "TC Clothing Boutique", nerve: 4, uniqueDrop: 'leather_jacket', reward: [180, 550], mod: 4, desc: 'Conceal branded leather jackets and designer apparel under an oversized coat.' },
    { id: 'supermarket', name: "City Supermarket", nerve: 4, uniqueDrop: 'coffee', reward: [140, 480], mod: 6, desc: 'Tuck energy drinks, coffee packs, and gourmet rations under groceries.' },
    { id: 'pharmacy', name: "Docks Pharmacy", nerve: 4, uniqueDrop: 'morphine', reward: [200, 650], mod: 2, desc: 'Snatch pharmaceutical grade painkillers and prescription stimulants.' },
    { id: 'jewellery', name: "Jewellery Emporium", nerve: 4, uniqueDrop: 'lucky_quarter', reward: [350, 1200], mod: -6, desc: 'Palm silver cufflinks and display-case gemstone rings.' },
    { id: 'bookshop', name: "Municipal Bookshop", nerve: 4, uniqueDrop: 'blueprints', reward: [110, 380], mod: 8, desc: 'Slip architectural technical manuals and city survey maps into your bag.' },
    { id: 'electronics', name: "Electronics Depot", nerve: 4, uniqueDrop: 'burner_phone', reward: [280, 850], mod: -4, desc: 'Lift solid-state drives, memory cards, and prepaid phones.' }
  ];

  /* ---- CARD SKIMMING ACTIONS ---- */
  D.cardSkimmingTargets = [
    { id: 'skim_transit', name: 'Install Skimmer on Transit Terminal ATM', nerve: 6, reqItem: 'skimmer', reward: [0, 0], desc: 'Affix magnetic reader overlay and pinhole lens to the busy commuter terminal ATM.' },
    { id: 'skim_gas', name: 'Install Skimmer on Gas Station ATM', nerve: 6, reqItem: 'skimmer', reward: [0, 0], desc: 'Place reader on the isolated dockside 24-hour service station terminal.' },
    { id: 'skim_casino', name: 'Install Skimmer on Casino Promenade ATM', nerve: 6, reqItem: 'skimmer', reward: [0, 0], desc: 'Slip reader onto the high-traffic cash machine near the casino floor.' },
    { id: 'skim_harvest', name: 'Harvest Stolen Magnetic Stripe Data', nerve: 2, reward: [800, 3200], desc: 'Download captured customer PINs and account numbers from active skimmers.' },
    { id: 'skim_sell', name: 'Sell Clone Data Batch to Syndicate', nerve: 6, reward: [4500, 22000], desc: 'Sell harvested card records and dumps to foreign carding rings.' }
  ];

  /* ---- BOOTLEGGING ACTIONS ---- */
  D.bootlegActions = [
    { id: 'copy_media', name: 'Burn Bootleg Media DVDs', nerve: 2, reward: [120, 300], producesItem: 'dvd', desc: 'Burn pirated movies, games, and cracked operating systems onto optical media discs.' },
    { id: 'sell_street', name: 'Sell DVDs on Street Corner', nerve: 5, reward: [450, 1100], reqItem: 'dvd', consumesItem: true, desc: 'Hawk bootleg media discs directly to pedestrians passing through the docks plaza.' }
  ];

  /* ---- HUSTLING GAMES ---- */
  D.hustlingGames = [
    { id: 'gather_crowd', name: 'Gather Boardwalk Crowd', nerve: 4, reward: [60, 280], mod: 8, desc: 'Use loud showmanship and fast chatter to assemble a circle of spectators.' },
    { id: 'monte', name: 'Three-Card Monte', nerve: 4, reward: [350, 1100], mod: 4, desc: 'Fast-paced bent corner card trick on a cardboard box table.' },
    { id: 'shell_game', name: 'Walnut Shell Game', nerve: 4, reward: [400, 1300], mod: 2, desc: 'Slide the foam pea between three deceptive walnut shells.' },
    { id: 'dice_toss', name: 'Street Dice Toss', nerve: 4, reward: [500, 1600], mod: 0, desc: 'Run weighted craps rolls on the asphalt alley.' },
    { id: 'find_lady', name: 'Find The Lady', nerve: 4, reward: [750, 2500], mod: -5, desc: 'High-stakes card shuffle fleecing confident marks.' }
  ];

  /* ---- CRACKING ACTIONS ---- */
  D.crackingActions = [
    { id: 'brute_hash', name: 'Brute-Force Hash Dictionary', nerve: 7, reward: [8000, 26000], desc: 'Run distributed GPU/CPU clusters against salted password databases.' },
    { id: 'crack_vault', name: 'Crack 256-Bit Corporate Vault', nerve: 5, reward: [14000, 52000], desc: 'Bypass multi-layer corporate encryption and extract financial ledger files.' }
  ];

  /* ---- FORGERY PROJECTS ---- */
  D.forgeryProjects = [
    { id: 'proj_license', name: "Driver's License", nerve: 5, reward: [4000, 12000], desc: 'Print holographic security overlays for municipal driver identification.' },
    { id: 'proj_customs', name: "Customs Clearance Manifest", nerve: 5, reward: [6500, 19000], desc: 'Stamp harbor freight manifests to move contraband past port inspectors.' },
    { id: 'proj_transit', name: "High-Security Transit Pass", nerve: 5, reward: [9000, 25000], desc: 'Emboss restricted Spire access credentials for corporate sub-levels.' },
    { id: 'proj_passport', name: "Diplomatic Passport", nerve: 5, reward: [16000, 48000], desc: 'Replicate gold foil seals and watermarks on consular travel papers.' },
    { id: 'proj_bond', name: "Bearer Bond Certificate", nerve: 5, reward: [28000, 85000], desc: 'Etch high-value financial corporate debt certificates on security paper.' }
  ];

  /* ---- SCAMMING ACTIONS ---- */
  D.scammingActions = [
    { id: 'farm_leads', name: 'Farm High-Net-Worth Leads', nerve: 8, reward: [600, 2200], desc: 'Scrape executive business registries and wealthy investor contact lists.' },
    { id: 'phish_spam', name: 'Blast Targeted Phishing Campaign', nerve: 8, reward: [2200, 8500], desc: 'Send deceptive inheritance notices and fake wire verification lures.' },
    { id: 'converse_mark', name: 'Converse With Mark & Close Wire', nerve: 3, reward: [15000, 75000], desc: 'Walk mark through overseas wire transfer to claim non-existent assets.' }
  ];

  /* ---- 7-STEP ARSON SEQUENCE ---- */
  D.arsonStages = [
    { id: 'arson_1_inquire', stage: 1, name: '1. Inquire on Target & Lock Bounty', nerve: 0, reward: [0, 0], desc: 'Consult syndicate broker and confirm insurance bounty on target warehouse.' },
    { id: 'arson_2_breach', stage: 2, name: '2. Breach Facility Perimeter', nerve: 3, reward: [600, 2400], desc: 'Cut outer fence and bypass security gates under cover of rain.' },
    { id: 'arson_3_place', stage: 3, name: '3. Place Accelerant & Evidence', nerve: 5, reqItem: 'gas_can', consumesItem: true, reward: [1200, 4500], desc: 'Distribute jerry cans of gasoline across structural load points.' },
    { id: 'arson_4_ignite', stage: 4, name: '4. Ignite Primary Blaze', nerve: 5, reward: [6000, 18000], desc: 'Drop flare and spark the fuel pools; exit immediately.' },
    { id: 'arson_5_stoke', stage: 5, name: '5. Stoke Fire & Fan Drafts', nerve: 5, reward: [9000, 28000], desc: 'Open bay doors and vent oxygen into the burning warehouse structure.' },
    { id: 'arson_6_dampen', stage: 6, name: '6. Dampen Smoke / Delay Responders', nerve: 5, reward: [14000, 42000], desc: 'Jam municipal hydrants and misdirect fire truck dispatches.' },
    { id: 'arson_7_collect', stage: 7, name: '7. Collect Syndicate Insurance Bounty', nerve: 2, reward: [45000, 280000], uniqueDrops: ['claymore_mine', 'yasukuni_sword', 'chandelier'], desc: 'Meet broker at the pier and collect the insurance payout.' }
  ];

  /* ---- MASTER CRIMES LIST (13 FAMILIES + LEGACY PASS-THROUGHS) ---- */
  D.crimes = [
    /* 1. Search for Cash */
    {
      id: 'search_cash', name: 'Search for Cash', family: 'Search for Cash', tier: 1, cl: 1, nerve: 2,
      base: 0.75, jail: [1, 3], wanted: 0, reward: [20, 250],
      target: 'area', tags: ['stealth'], enhancer: 'glasses', enhancerName: 'Reading Glasses',
      subcrimes: D.searchCashSubcrimes, uniqueDrops: ['glasses', 'lucky_charm', 'candy'],
      desc: 'Comb the streets, subways, junkyards, and fountains for lost currency and dropped goods.'
    },

    /* 2. Bootlegging */
    {
      id: 'bootlegging', name: 'Bootlegging', family: 'Bootlegging', tier: 1, cl: 1, nerve: 2,
      base: 0.70, jail: [2, 5], wanted: 1, reward: [100, 600],
      target: 'media', tags: ['electronics'], enhancer: 'high_drive', enhancerName: 'High-Speed Drive',
      subActions: [
        { id: 'copy_dvd', name: 'Copy Media DVDs', nerve: 2, reward: [100, 300] },
        { id: 'sell_dvd', name: 'Distribute on Street', nerve: 5, reward: [400, 950] }
      ],
      desc: 'Burn pirate software, music, and vids onto blank discs and hawk them on street corners.'
    },

    /* 3. Graffiti */
    {
      id: 'graffiti', name: 'Graffiti', family: 'Graffiti', tier: 1, cl: 1, nerve: 3,
      base: 0.65, jail: [3, 6], wanted: 1, reward: [80, 450],
      target: 'district', tags: ['street', 'stealth'], enhancer: 'paint_mask', enhancerName: 'Industrial Paint Mask',
      districts: ['East Side', 'West Side', 'North Side', 'Residential District', 'Red-Light Promenade', 'Financial District', 'City Centre'],
      desc: 'Tag syndicate insignias and murals across urban sectors to claim territory.'
    },

    /* 4. Shoplifting (Base Nerve: 4) */
    {
      id: 'shoplift', name: 'Shoplifting', family: 'Shoplifting', tier: 1, cl: 1, nerve: 4,
      base: 0.55, jail: [5, 10], wanted: 1, reward: [150, 800],
      target: 'store', tags: ['stealth'], enhancer: 'mountain_bike', enhancerName: 'Mountain Bike',
      shops: ["Sally's Sweet Shop", "Bits 'n' Bobs", "TC Clothing", "City Supermarket", "Docks Pharmacy", "Jewellery Store", "Bookshop", "Electronics Depot"],
      uniqueDrops: ['burner_phone'],
      desc: 'Conceal merchandise under your jacket and slip past the cash register.'
    },

    /* 5. Card Skimming (Base Nerve: 6) */
    {
      id: 'card_skimming', name: 'Card Skimming', family: 'Card Skimming', tier: 2, cl: 2, nerve: 6,
      base: 0.52, jail: [15, 30], wanted: 2, reward: [3000, 18000],
      target: 'atm', tags: ['electronics', 'stealth'], enhancer: 'duct_tape', enhancerName: 'Reinforced Duct Tape',
      actions: ['Install Skimmer (6N)', 'Check Skimmer', 'Recover Device', 'Sell Clone Data (6N)'],
      desc: 'Affix illicit magnetic reader overlays to ATM terminals and harvest client credentials.'
    },

    /* 6. Burglary (Base Nerve: 3 Scout / 6 Burglarize) */
    {
      id: 'burglary', name: 'Burglary', family: 'Burglary', tier: 3, cl: 3, nerve: 6,
      base: 0.45, jail: [25, 55], wanted: 3, reward: [5000, 85000],
      target: 'residence', tags: ['lock', 'stealth'], enhancer: 'flashlight', enhancerName: 'Heavy Flashlight',
      locations: D.burglaryLocations, uniqueDrops: ['gold_tooth', 'persian_rug', 'chandelier', 'yasukuni_sword'],
      desc: 'Scout, case, and breach residential homes, commercial businesses, and industrial warehouses.'
    },

    /* 7. Pickpocketing (Base Nerve: 5 - RESEARCH PARITY VERIFIED) */
    {
      id: 'pickpocket', name: 'Pickpocketing', family: 'Pickpocketing', tier: 2, cl: 1, nerve: 5,
      base: 0.58, jail: [3, 8], wanted: 1, reward: [150, 1500],
      target: 'person', tags: ['stealth', 'street'], enhancer: 'cut_razor', enhancerName: 'Cut-Throat Razor',
      targets: D.pickpocketTargets, uniqueDrops: ['rare_stamp', 'police_badge', 'high_heels', 'thong'],
      desc: 'Identify vulnerable pedestrians in crowds and slice pockets or slip wallets.'
    },

    /* 8. Hustling */
    {
      id: 'hustling', name: 'Hustling', family: 'Hustling', tier: 2, cl: 2, nerve: 4,
      base: 0.54, jail: [5, 12], wanted: 1, reward: [400, 2200],
      target: 'street', tags: ['street'], enhancer: 'megaphone', enhancerName: 'Megaphone',
      games: ['Gather Crowd (4N)', 'Three-Card Monte', 'Shell Game', 'Dice Toss', 'Find The Lady'],
      desc: 'Set up cardboard box gambling tables and fleece gullible tourists with sleight of hand.'
    },

    /* 9. Disposal */
    {
      id: 'disposal', name: 'Disposal', family: 'Disposal', tier: 3, cl: 3, nerve: 8,
      base: 0.48, jail: [20, 45], wanted: 2, reward: [5000, 45000],
      target: 'illicit', tags: ['street', 'stealth'], enhancer: 'latex_gloves', enhancerName: 'Latex Gloves',
      methods: D.disposalMethods, jobs: D.disposalJobs,
      desc: 'Get rid of hazardous biological waste, murder weapons, and bodies for syndicate syndicates.'
    },

    /* 10. Cracking */
    {
      id: 'cracking', name: 'Cracking', family: 'Cracking', tier: 4, cl: 4, nerve: 7,
      base: 0.42, jail: [30, 60], wanted: 3, reward: [8000, 65000],
      target: 'cyber', tags: ['electronics'], enhancer: 'office_chair', enhancerName: 'Ergonomic Office Chair',
      actions: ['Brute-force Hash (7N)', 'Crack Encryption (5N)'],
      desc: 'Run distributed computational rigs to breach encrypted corporate servers and databases.'
    },

    /* 11. Forgery */
    {
      id: 'forgery', name: 'Forgery', family: 'Forgery', tier: 4, cl: 4, nerve: 5,
      base: 0.46, jail: [15, 35], wanted: 2, reward: [4000, 35000],
      target: 'document', tags: ['forgery'], enhancer: 'magnifying_glass', enhancerName: 'Jeweler Magnifying Glass',
      projects: ["Driver's License", "Customs Clearance Manifest", "High-Security Transit Pass", "Diplomatic Passport", "Corporate Bond"],
      desc: 'Replicate municipal seals, identification badges, and banknotes under high magnification.'
    },

    /* 12. Scamming */
    {
      id: 'scamming', name: 'Scamming', family: 'Scamming', tier: 5, cl: 5, nerve: 8,
      base: 0.38, jail: [25, 50], wanted: 3, reward: [12000, 95000],
      target: 'cyber', tags: ['electronics'], enhancer: 'ergo_keyboard', enhancerName: 'Split Ergonomic Keyboard',
      actions: ['Farm Leads (8N)', 'Blast Phishing Spam (8N)', 'Converse With Marks (3N)'],
      desc: 'Run advance-fee social engineering schemes against high-net-worth foreign marks.'
    },

    /* 13. Arson */
    {
      id: 'arson', name: 'Arson', family: 'Arson', tier: 6, cl: 6, nerve: 5,
      base: 0.32, jail: [40, 80], wanted: 4, reward: [25000, 320000],
      target: 'building', tags: ['street', 'armed'], enhancer: 'lighter', enhancerName: 'Windproof Lighter',
      sequence: ['Inquire (0N)', 'Breach (3N)', 'Place Fuel (5N)', 'Ignite (5N)', 'Stoke Flames (5N)', 'Dampen (5N)', 'Collect Bounty (2N)'],
      desc: 'Torch warehouses, factories, and commercial stores for syndicate insurance bounties.'
    },

    /* ---- LEGACY COMPATIBILITY CRIMES (Keeps all existing saves & missions intact) ---- */
    {
      id: 'mugging', name: 'Mugging', family: 'Street Crime', tier: 2, cl: 2, nerve: 3,
      base: 0.50, jail: [10, 20], wanted: 2, reward: [200, 2000],
      target: 'person', tags: ['street'], enhancer: 'brass_knuckles', enhancerName: 'Brass Knuckles',
      desc: 'Corner an adult mark and demand what they are carrying.'
    },
    {
      id: 'bike_theft', name: 'Bike Theft', family: 'Vehicle Theft', tier: 2, cl: 2, nerve: 2,
      base: 0.65, jail: [5, 10], wanted: 1, reward: [200, 10000],
      target: 'vehicle', tags: ['lock'], enhancer: 'jemmy', enhancerName: 'Jemmy Crowbar',
      desc: 'Cut a lock, ride off, hope nobody looks up.'
    },
    {
      id: 'phone_snatch', name: 'Phone Snatching', family: 'Street Crime', tier: 2, cl: 2, nerve: 2,
      base: 0.70, jail: [5, 10], wanted: 1, reward: [300, 1000],
      target: 'person', tags: ['street'], enhancer: 'gloves', enhancerName: 'Work Gloves',
      desc: 'Take the device and sprint. Keep the sprint short.'
    },
    {
      id: 'car_theft', name: 'Car Theft', family: 'Grand Theft Auto', tier: 3, cl: 3, nerve: 5,
      base: 0.45, jail: [20, 40], wanted: 3, reward: [5000, 500000],
      target: 'vehicle', tags: ['lock', 'vehicle'], enhancer: 'lockpick_set', enhancerName: 'Lockpick Set',
      desc: 'Hotwire something with four wheels and a resale value.'
    },
    {
      id: 'store_robbery', name: 'Store Robbery', family: 'Armed Robbery', tier: 3, cl: 3, nerve: 6,
      base: 0.50, jail: [20, 40], wanted: 3, reward: [2000, 100000],
      target: 'store', tags: ['armed'], enhancer: 'ski_mask', enhancerName: 'Ski Mask',
      desc: 'Empty the till and whatever is in the back safe.'
    },
    {
      id: 'gas_station', name: 'Gas Station Robbery', family: 'Armed Robbery', tier: 4, cl: 4, nerve: 5,
      base: 0.55, jail: [15, 30], wanted: 3, reward: [2000, 50000],
      target: 'store', tags: ['armed'], enhancer: 'police_scanner', enhancerName: 'Police Scanner',
      desc: 'A quick late-shift till grab on the dock road.'
    },
    {
      id: 'armed_robbery', name: 'Armed Robbery', family: 'Armed Robbery', tier: 5, cl: 5, nerve: 10,
      base: 0.35, jail: [45, 90], wanted: 5, reward: [2000, 5000000],
      target: 'store', tags: ['armed', 'vehicle'], enhancer: 'getaway_car', enhancerName: 'Getaway Sedan',
      desc: 'Go in loud, go in fast, go in with a plan for the exit.'
    },
    {
      id: 'atm_skimming', name: 'ATM Skimming', family: 'Fraud', tier: 5, cl: 5, nerve: 3,
      base: 0.60, jail: [10, 20], wanted: 2, reward: [5000, 50000],
      target: 'atm', tags: ['electronics'], enhancer: 'duct_tape', enhancerName: 'Reinforced Duct Tape',
      desc: 'Fit a skimmer, wait, harvest the card data.'
    }
  ];

  D.crimeById = {};
  D.crimes.forEach(function (c) { D.crimeById[c.id] = c; });

  D.crimesByTier = {};
  D.crimes.forEach(function (c) {
    if (!D.crimesByTier[c.tier]) D.crimesByTier[c.tier] = [];
    D.crimesByTier[c.tier].push(c);
  });

  /* Short flavour lines written to the activity log after a job. */
  D.crimeFlavour = {
    ok: [
      'Clean. Nobody looked up.',
      'In and out before the street noticed.',
      'You walk away at a normal pace. Normal paces matter.',
      'The take is thin but the job was quiet.',
      'Somebody two blocks away is only now realising.'
    ],
    fail: [
      'A hand closes on your wrist.',
      'Someone shouts. Someone always shouts.',
      'The plan lasted eleven seconds.',
      'A camera you did not see was doing its job.',
      'You are halfway through the window when the light comes on.'
    ],
    crit: [
      'It goes wrong in a way that needs a doctor.',
      'You get clear of the scene but not of the damage.',
      'A fall, a crack, and a very long night.'
    ]
  };
})(window.CALIGO);
