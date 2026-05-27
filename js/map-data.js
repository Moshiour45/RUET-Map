// ============================================================
//  RUET CAMPUS MAP — Static Data (Geographically Correct)
//  Buildings, Road Network, Connections, Category Colors
// ============================================================
(function () {
  'use strict';

  // ── Category color definitions ──
  const CAT_COLORS = {
    academic: { fill: '#eab308', border: '#ca8a04', label: 'Academic Building' },
    hall: { fill: '#ef4444', border: '#dc2626', label: 'Student Hall' },
    facility: { fill: '#38bdf8', border: '#0ea5e9', label: 'Campus Facility' },
    admin: { fill: '#f59e0b', border: '#d97706', label: 'Administrative' },
    residential: { fill: '#fb923c', border: '#ea580c', label: 'Residential Quarter' },
    sports: { fill: '#3b82f6', border: '#2563eb', label: 'Sports Facility' },
    landmark: { fill: '#4ade80', border: '#22c55e', label: 'Campus Landmark' },
    religious: { fill: '#c084fc', border: '#a855f7', label: 'Religious' }
  };

  // ── All campus buildings mapped to exact real-world OpenStreetMap coordinates ──
  const BUILDINGS = [
    // ── Gate & Admin ──
    { id: 'main-gate', name: 'Main Gate', category: 'landmark', latlng: [24.36274, 88.62889], desc: 'Primary entrance to RUET campus from Rajshahi-Natore-Dhaka Highway.' },
    {
      id: 'building_admin',
      name: 'Administrative Building Blocks',
      category: 'admin',
      latlng: [24.36320, 88.62840],
      departments: [
        { code: 'Chem', full_name: 'Chemistry' },
        { code: 'Math', full_name: 'Mathematics' },
        { code: 'Phy', full_name: 'Physics' },
        { code: 'Hum', full_name: 'Humanities' }
      ],
      desc: 'Central administrative core housing the VC office, Registrar, Controller of Examinations, and the foundational science faculties including Chemistry, Physics, Mathematics, and Humanities.'
    },
    { id: 'bus-stand', name: 'Bus Stand', category: 'facility', latlng: [24.36260, 88.62850], desc: 'Campus bus stand for university transport to Rajshahi city center.' },

    // ── Academic Buildings ──
    {
      id: 'building_01',
      name: 'Academic Building 1',
      category: 'academic',
      latlng: [24.36420, 88.62990],
      departments: [
        { code: 'CSE', full_name: 'Computer Science & Engineering' },
        { code: 'ETE', full_name: 'Electronics & Telecommunication Engineering' },
        { code: 'ECE', full_name: 'Electrical & Computer Engineering' }
      ],
      desc: 'Houses the departments of CSE, ETE, and ECE. A premier hub for high-performance computing labs, telecommunications design, signal processing, and AI/ML research.'
    },
    {
      id: 'building_02',
      name: 'Academic Building 2',
      category: 'academic',
      latlng: [24.36497, 88.62973],
      departments: [
        { code: 'EEE', full_name: 'Electrical & Electronic Engineering' }
      ],
      desc: 'Dedicated exclusively to the Department of Electrical & Electronic Engineering. Houses advanced machine labs, power system simulators, and electronics laboratories.'
    },
    {
      id: 'building_03',
      name: 'Academic Building 3 (Former GCE Building)',
      category: 'academic',
      latlng: [24.36488, 88.62879],
      departments: [
        { code: 'CME', full_name: 'Ceramic & Metallurgical Engineering' },
        { code: 'MTE', full_name: 'Mechatronics Engineering' },
        { code: 'MSE', full_name: 'Materials Science & Engineering' }
      ],
      desc: 'Houses the Departments of CME, MTE, and MSE. Features specialized kilns, material characterization microscopes, and advanced mechatronic control labs.'
    },
    {
      id: 'building_04',
      name: 'Academic Building 4 (Civil Engineering Building)',
      category: 'academic',
      latlng: [24.36391, 88.62726],
      departments: [
        { code: 'CE', full_name: 'Civil Engineering' },
        { code: 'BECM', full_name: 'Building Engineering & Construction Management' }
      ],
      desc: 'Houses the Dept. of Civil Engineering and BECM. Equipped with high-capacity structural testing halls, fluid mechanics channels, and construction design studios.'
    },
    {
      id: 'building_05',
      name: 'Academic Building 5 (Architecture Building)',
      category: 'academic',
      latlng: [24.36393, 88.62660],
      departments: [
        { code: 'Arch', full_name: 'Architecture' },
        { code: 'URP', full_name: 'Urban & Regional Planning' }
      ],
      desc: 'Houses the Dept. of Architecture and URP. Features luminous design studios, physical model crafting workshops, GIS computing clusters, and planning exhibition halls.'
    },
    {
      id: 'building_me',
      name: 'Mechanical Engineering Building',
      category: 'academic',
      latlng: [24.36418, 88.62896],
      departments: [
        { code: 'ME', full_name: 'Mechanical Engineering' },
        { code: 'IPE', full_name: 'Industrial & Production Engineering' },
        { code: 'ChE', full_name: 'Chemical Engineering' }
      ],
      desc: 'Houses the Departments of ME, IPE, and ChE. Equipped with thermodynamics labs, fluid machinery, manufacturing workshops, and chemical reaction process rigs.'
    },

    // ── Central Facilities ──
    { id: 'workshop', name: 'Central Workshop', category: 'facility', latlng: [24.36580, 88.62710], desc: 'Practical engineering training — machine shop, welding, carpentry, foundry.' },
    { id: 'library', name: 'Central Library', category: 'facility', latlng: [24.36599, 88.62785], desc: '50,000+ books, e-journals, Wi-Fi study spaces, digital resources.' },
    { id: 'auditorium', name: 'Central Auditorium', category: 'facility', latlng: [24.36358, 88.62960], desc: 'Convocations, seminars, cultural programs. Seats 1000+.' },
    { id: 'cafeteria', name: 'Central Cafeteria', category: 'facility', latlng: [24.36333, 88.62995], desc: 'Main cafeteria serving meals and snacks. Popular gathering spot.' },
    { id: 'medical', name: 'Medical Center', category: 'facility', latlng: [24.36380, 88.63050], desc: 'Campus health center — primary care, emergency, checkups.' },

    // ── Landmarks ──
    { id: 'shaheed-minar', name: 'Central Shaheed Minar', category: 'landmark', latlng: [24.36302, 88.62933], desc: 'Iconic monument commemorating the Language Movement martyrs of 1952.' },
    { id: 'botanical', name: 'Botanical Garden', category: 'landmark', latlng: [24.36510, 88.63150], desc: 'Diverse plant species, walking paths, shaded study areas.' },
    { id: 'flower-garden', name: 'Flower Garden', category: 'landmark', latlng: [24.36600, 88.63100], desc: 'Scenic flower garden near eastern campus roundabout.' },
    { id: 'pond-west', name: 'Campus Pond (West)', category: 'landmark', latlng: [24.36456, 88.62776], desc: 'Scenic pond on the western campus.' },
    { id: 'pond-east', name: 'Campus Pond (East)', category: 'landmark', latlng: [24.36805, 88.63349], desc: 'Large pond in eastern campus — aquaculture & scenery.' },
    { id: 'power', name: 'Power Sub-station', category: 'facility', latlng: [24.36530, 88.63000], desc: 'Electrical sub-station powering the entire campus.' },

    // ── Sports ──
    { id: 'central-field', name: 'Central Playground', category: 'sports', latlng: [24.36748, 88.62808], desc: 'Main sports ground — football, cricket, athletics, tournaments.' },
    { id: 'gym', name: 'Gymnasium', category: 'sports', latlng: [24.36658, 88.62754], desc: 'Indoor gym, badminton, table tennis, athlete training.' },
    { id: 'pool', name: 'Swimming Pool', category: 'sports', latlng: [24.36670, 88.62800], desc: 'Campus swimming pool for recreation and competitions.' },
    { id: 'cricket', name: 'Cricket Ground', category: 'sports', latlng: [24.36666, 88.63693], desc: 'Dedicated cricket ground for practice matches and departmental tournaments.' },
    { id: 'courts', name: 'Tennis & Basketball Courts', category: 'sports', latlng: [24.36712, 88.63270], desc: 'Outdoor courts for tennis, basketball, inter-hall games.' },

    // ── Student Halls ──
    { id: 'selim-hall', name: 'Shahid Lt. Selim Hall', category: 'hall', latlng: [24.36793, 88.62570], desc: 'Male hall named after Lt. Selim, a 1971 Liberation War martyr.' },
    { id: 'hamid-hall', name: 'Shahid Abdul Hamid Hall', category: 'hall', latlng: [24.36622, 88.62615], desc: 'Male hall near the Shaheed Minar. Strong cultural traditions.' },
    { id: 'sahidul-hall', name: 'Shahid Sahidul Islam Hall', category: 'hall', latlng: [24.36680, 88.62594], desc: 'Male residential hall with modern amenities, canteen, reading room.' },
    { id: 'zia-hall', name: 'Shahid President Ziaur Rahman Hall', category: 'hall', latlng: [24.36559, 88.62642], desc: 'Large male dormitory with expanded capacity.' },
    { id: 'ladies-hall', name: 'Ladies Hall', category: 'hall', latlng: [24.36380, 88.62600], desc: 'Female residential hall with dedicated facilities and security.' },
    { id: 'tin-shade', name: 'Tin Shade Hall', category: 'hall', latlng: [24.36659, 88.62661], desc: 'Additional student accommodation.' },
    { id: 'new-hall', name: 'New Hall (Bangabandhu Hall)', category: 'hall', latlng: [24.36743, 88.62627], desc: 'Newly constructed student residential hall with modern infrastructure.' },

    // ── Religious ──
    { id: 'mosque', name: 'Campus Mosque', category: 'religious', latlng: [24.36394, 88.62768], desc: 'Central mosque — daily prayers and Friday congregations.' },

    // ── Residential Quarters (East) ──
    { id: 'teachers-quarter', name: "Teachers' Quarter", category: 'residential', latlng: [24.36659, 88.62944], desc: 'Faculty housing with gardens and community spaces.' },
    { id: 'canteen-teachers', name: "Teachers' Canteen", category: 'facility', latlng: [24.36630, 88.62940], desc: 'Canteen for faculty and staff near residential area.' },
    { id: 'guesthouse', name: 'Guest House', category: 'facility', latlng: [24.36699, 88.62934], desc: 'Accommodation for visiting dignitaries and academics.' },
    { id: 'staff-quarter', name: 'Staff Quarter', category: 'residential', latlng: [24.36600, 88.63200], desc: 'Staff residential area near campus core.' },
    { id: 'ansars-quarter', name: "Ansars' Quarter", category: 'residential', latlng: [24.36610, 88.63250], desc: 'Campus security personnel housing.' },
    { id: 'emp-assoc', name: "Employees' Association", category: 'facility', latlng: [24.36391, 88.62913], desc: 'Staff welfare and social activities building.' },

    // ── Far East ──
    { id: 'water-plant', name: 'Water Treatment Plant', category: 'facility', latlng: [24.36350, 88.63400], desc: 'Water purification facility for the entire campus.' },
    { id: 'vc-bungalow', name: 'VC Bungalow', category: 'admin', latlng: [24.36300, 88.63450], desc: 'Official residence of the Vice Chancellor.' },
    { id: 'agrani', name: 'Agrani School & College', category: 'facility', latlng: [24.36220, 88.63470], desc: 'Campus school providing education for faculty children and locals.' },
    { id: 'club', name: "Officers' Club", category: 'facility', latlng: [24.36400, 88.63550], desc: 'Social and recreational club for officers and faculty.' }
  ];

  // ── Road Network Nodes (from OpenStreetMap Overpass API — exact road centerline coordinates) ──
  const ROAD_NODES = {
    // === RUET Main Road (Way 188289232 — "RUET Main Road", living_street, concrete) ===
    // This is the main north-south campus spine from the gate entrance heading NNW
    MR_00: { lat: 24.3637650, lng: 88.6285401 }, // South end near gate approach
    MR_01: { lat: 24.3639694, lng: 88.6284722 }, // Main Gate entrance road
    MR_02: { lat: 24.3642897, lng: 88.6283614 }, // EEE Road / Main Road junction
    MR_03: { lat: 24.3645455, lng: 88.6282701 }, // Main Road continuing north
    MR_04: { lat: 24.3647169, lng: 88.6282090 }, // Main Road
    MR_05: { lat: 24.3648598, lng: 88.6281580 }, // Main Road
    MR_06: { lat: 24.3649330, lng: 88.6281324 }, // Main Road
    MR_07: { lat: 24.3651865, lng: 88.6280436 }, // Main Road near Auditorium area
    MR_08: { lat: 24.3655300, lng: 88.6279242 }, // Central junction — ECE Road branches east here
    MR_09: { lat: 24.3654102, lng: 88.6274530 }, // Main Road turns NW after central junction
    MR_10: { lat: 24.3656367, lng: 88.6273881 }, // Library Road branches east here
    MR_11: { lat: 24.3658473, lng: 88.6273278 }, // Library Road junction
    MR_12: { lat: 24.3659992, lng: 88.6272724 }, // Main Road continuing NW
    MR_13: { lat: 24.3661497, lng: 88.6272175 }, // Main Road
    MR_14: { lat: 24.3663456, lng: 88.6271531 }, // Main Road
    MR_15: { lat: 24.3664824, lng: 88.6271082 }, // Main Road
    MR_16: { lat: 24.3665728, lng: 88.6270785 }, // Hamid Hall Road branches west here
    MR_17: { lat: 24.3666159, lng: 88.6270636 }, // Main Road
    MR_18: { lat: 24.3671205, lng: 88.6268811 }, // Main Road continuing NW
    MR_19: { lat: 24.3674848, lng: 88.6267519 }, // Main Road
    MR_20: { lat: 24.3676406, lng: 88.6266966 }, // Road 18 branches east here
    MR_21: { lat: 24.3679371, lng: 88.6265910 }, // Main Road
    MR_22: { lat: 24.3683246, lng: 88.6264531 }, // Main Road (driveway junction)
    MR_23: { lat: 24.3686526, lng: 88.6263497 }, // Main Road near quarters
    MR_24: { lat: 24.3692510, lng: 88.6261679 }, // Main Road far north
    MR_25: { lat: 24.3694809, lng: 88.6263019 }, // Main Road curves east
    MR_26: { lat: 24.3696511, lng: 88.6264115 }, // Main Road
    MR_27: { lat: 24.3698157, lng: 88.6265087 }, // North end — joins Way 370078885

    // === Way 370078885 — Road heading further NW from MR_27 ===
    NW_01: { lat: 24.3708708, lng: 88.6261011 }, // NW road
    NW_02: { lat: 24.3711985, lng: 88.6259807 }, // NW road  
    NW_03: { lat: 24.3719735, lng: 88.6257081 }, // NW road near far fields
    NW_04: { lat: 24.3725773, lng: 88.6255112 }, // NW road
    NW_05: { lat: 24.3728853, lng: 88.6254041 }, // NW road
    NW_06: { lat: 24.3731154, lng: 88.6253221 }, // NW road
    // Way 370078885 also goes SE from MR_27:
    SE_01: { lat: 24.3694768, lng: 88.6271228 }, // SE branch  
    SE_02: { lat: 24.3687978, lng: 88.6273637 }, // SE branch  
    SE_03: { lat: 24.3685536, lng: 88.6274504 }, // SE branch
    SE_04: { lat: 24.3684224, lng: 88.6274969 }, // SE branch meets Road 18

    // === ECE Road (Way 188290317 — "ECE Road", service road) ===
    // Branches east from MR_08, loops south and reconnects at MR_02 via EEE Road
    ECE_01: { lat: 24.3656644, lng: 88.6283938 }, // ECE Road starts east of MR_08
    ECE_02: { lat: 24.3658305, lng: 88.6289745 }, // ECE Road going further east (northernmost point)
    ECE_03: { lat: 24.3655018, lng: 88.6290818 }, // ECE Road turns south
    ECE_04: { lat: 24.3654465, lng: 88.6291002 }, // ECE Road
    ECE_05: { lat: 24.3652205, lng: 88.6291754 }, // ECE Road
    ECE_06: { lat: 24.3649309, lng: 88.6292718 }, // ECE Road  
    ECE_07: { lat: 24.3648072, lng: 88.6293130 }, // ECE Road
    ECE_08: { lat: 24.3645958, lng: 88.6293834 }, // ECE Road south end — joins EEE Road junction
    ECE_08_mid: { lat: 24.3642000, lng: 88.6295000 }, // ECE Road waypoint directly in front of Academic Building 1 (invisible to user)
    ECE_09: { lat: 24.3638541, lng: 88.6296199 }, // ECE Road furthest south tip

    // === EEE Road (Way 188166269 — "EEE Road", service road) ===
    // Short connector from ECE_08 west to MR_02
    // ECE_08 (1987920200) connects to MR_02 (1987920167) directly
    EEE_01: { lat: 24.3642897, lng: 88.6289000 }, // EEE Road intermediate waypoint to trace road shape correctly (invisible to user)

    // === RUET Library Road (Way 188290348 — footway) ===
    // Branches east from MR_11
    LIB_01: { lat: 24.3659005, lng: 88.6275273 }, // Library Road
    LIB_02: { lat: 24.3659441, lng: 88.6276908 }, // Library Road
    LIB_03: { lat: 24.3659641, lng: 88.6277554 }, // Library Road end

    // === Hamid Hall Road (Way 188290346 — service road) ===
    // Branches west from MR_16
    HH_01: { lat: 24.3665586, lng: 88.6270198 }, // Hamid Hall Road
    HH_02: { lat: 24.3664045, lng: 88.6264621 }, // Hamid Hall Road  
    HH_03: { lat: 24.3663564, lng: 88.6263115 }, // Hamid Hall Road end

    // === Road 18 / সড়ক ১৮ (Way 349620186 — living_street) ===
    // Branches east from MR_20 towards eastern residential area
    R18_01: { lat: 24.3676714, lng: 88.6267873 }, // Road 18 start
    R18_02: { lat: 24.3679519, lng: 88.6276060 }, // Road 18 
    R18_03: { lat: 24.3679696, lng: 88.6276576 }, // Road 18 (meets SE_04 branch)
    R18_04: { lat: 24.3682275, lng: 88.6285540 }, // Road 18 east
    R18_05: { lat: 24.3682905, lng: 88.6287519 }, // Road 18 far east end

    // === West campus driveway (Way 188166267 — service driveway) ===
    WD_01: { lat: 24.3686526, lng: 88.6263497 }, // Same as MR_23
    WD_02: { lat: 24.3685332, lng: 88.6259579 }, // West driveway
    WD_03: { lat: 24.3682555, lng: 88.6260667 }, // West driveway
    WD_04: { lat: 24.3682144, lng: 88.6260893 }, // West driveway
    WD_05: { lat: 24.3683246, lng: 88.6264531 }  // Same as MR_22 (loop back)
  };

  // ── Road Edges (all connections follow actual OSM road geometry) ──
  const ROAD_EDGES = [
    // === RUET Main Road spine — south to north (drivable) ===
    ['MR_00', 'MR_01', { drive: true }],
    ['MR_01', 'MR_02', { drive: true }],
    ['MR_02', 'MR_03', { drive: true }],
    ['MR_03', 'MR_04', { drive: true }],
    ['MR_04', 'MR_05', { drive: true }],
    ['MR_05', 'MR_06', { drive: true }],
    ['MR_06', 'MR_07', { drive: true }],
    ['MR_07', 'MR_08', { drive: true }],
    ['MR_08', 'MR_09', { drive: true }],
    ['MR_09', 'MR_10', { drive: true }],
    ['MR_10', 'MR_11', { drive: true }],
    ['MR_11', 'MR_12', { drive: true }],
    ['MR_12', 'MR_13', { drive: true }],
    ['MR_13', 'MR_14', { drive: true }],
    ['MR_14', 'MR_15', { drive: true }],
    ['MR_15', 'MR_16', { drive: true }],
    ['MR_16', 'MR_17', { drive: true }],
    ['MR_17', 'MR_18', { drive: true }],
    ['MR_18', 'MR_19', { drive: true }],
    ['MR_19', 'MR_20', { drive: true }],
    ['MR_20', 'MR_21', { drive: true }],
    ['MR_21', 'MR_22', { drive: true }],
    ['MR_22', 'MR_23', { drive: true }],
    ['MR_23', 'MR_24', { drive: true }],
    ['MR_24', 'MR_25', { drive: true }],
    ['MR_25', 'MR_26', { drive: true }],
    ['MR_26', 'MR_27', { drive: true }],

    // === NW road from MR_27 (drivable) ===
    ['MR_27', 'NW_01', { drive: true }],
    ['NW_01', 'NW_02', { drive: true }],
    ['NW_02', 'NW_03', { drive: true }],
    ['NW_03', 'NW_04', { drive: true }],
    ['NW_04', 'NW_05', { drive: true }],
    ['NW_05', 'NW_06', { drive: true }],

    // === SE branch from MR_27 ===
    ['MR_27', 'SE_01'],
    ['SE_01', 'SE_02'],
    ['SE_02', 'SE_03'],
    ['SE_03', 'SE_04'],
    ['SE_04', 'R18_03'], // Connects to Road 18

    // === ECE Road — east from MR_08, loops south (drivable) ===
    ['MR_08', 'ECE_01', { drive: true }],
    ['ECE_01', 'ECE_02', { drive: true }],
    ['ECE_02', 'ECE_03', { drive: true }],
    ['ECE_03', 'ECE_04', { drive: true }],
    ['ECE_04', 'ECE_05', { drive: true }],
    ['ECE_05', 'ECE_06', { drive: true }],
    ['ECE_06', 'ECE_07', { drive: true }],
    ['ECE_07', 'ECE_08', { drive: true }],
    ['ECE_08', 'ECE_08_mid', { drive: true }],
    ['ECE_08_mid', 'ECE_09', { drive: true }],

    // === EEE Road — connector from ECE_08 west to MR_02 (drivable) ===
    ['MR_02', 'EEE_01', { drive: true }],
    ['EEE_01', 'ECE_08', { drive: true }],

    // === RUET Library Road — east from MR_11 (walk/bike) ===
    ['MR_11', 'LIB_01'],
    ['LIB_01', 'LIB_02'],
    ['LIB_02', 'LIB_03'],

    // === Hamid Hall Road — west from MR_16 (walk/bike) ===
    ['MR_16', 'HH_01'],
    ['HH_01', 'HH_02'],
    ['HH_02', 'HH_03'],

    // === Road 18 — east from MR_20 (living_street) ===
    ['MR_20', 'R18_01', { drive: true }],
    ['R18_01', 'R18_02', { drive: true }],
    ['R18_02', 'R18_03', { drive: true }],
    ['R18_03', 'R18_04', { drive: true }],
    ['R18_04', 'R18_05', { drive: true }],

    // === West campus driveway loop ===
    ['MR_23', 'WD_02'],
    ['WD_02', 'WD_03'],
    ['WD_03', 'WD_04'],
    ['WD_04', 'MR_22']
  ];

  // ── Building → nearest Road Node(s) connections ──
  const BUILDING_CONNECTIONS = {
    'main-gate': ['MR_00', 'MR_01'],
    'building_admin': ['MR_00', 'MR_01'],
    'bus-stand': ['MR_00'],
    'building_01': ['ECE_08_mid'],    // Academic Building 1 — snaps perfectly directly to the road waypoint ECE_08_mid
    'building_02': ['ECE_05', 'ECE_06'],    // Academic Building 2 — on ECE Road north-east
    'building_03': ['MR_05', 'MR_06', 'ECE_05', 'ECE_06'], // Academic Building 3 — between Main Road and ECE Road
    'building_04': ['MR_02', 'MR_03'],      // Civil Engineering — on Main Road west side
    'building_05': ['MR_02', 'MR_03'],      // Architecture Building — on Main Road west side
    'building_me': ['MR_02', 'MR_03', 'ECE_08'], // ME Building — near central junction
    'workshop': ['MR_10', 'MR_11'],         // Workshop — on Main Road
    'library': ['LIB_02', 'LIB_03'],        // Library — on Library Road
    'auditorium': ['ECE_09', 'MR_00', 'MR_01'], // Auditorium — next to ECE Road / Main Gate approach
    'cafeteria': ['ECE_09'],                // Cafeteria — on ECE Road south
    'medical': ['ECE_09'],                  // Medical Center — on ECE Road south
    'shaheed-minar': ['MR_00', 'MR_01'],    // Shaheed Minar — near Main Gate
    'botanical': ['R18_02', 'R18_03'],      // Botanical Garden — near Road 18
    'flower-garden': ['R18_02'],            // Flower Garden — near Road 18
    'pond-west': ['MR_03', 'MR_04'],        // Pond West — near Main Road
    'pond-east': ['R18_05'],                // Pond East — far east
    'power': ['ECE_03', 'ECE_04'],          // Power station — near ECE Road
    'central-field': ['R18_02', 'R18_03'],  // Central Playground — near Road 18
    'gym': ['MR_16', 'MR_17'],             // Gym — on Main Road
    'pool': ['MR_17', 'MR_18'],            // Pool — on Main Road
    'cricket': ['R18_05'],                  // Cricket Ground — far east
    'courts': ['R18_04', 'R18_05'],        // Tennis/Basketball — Road 18
    'selim-hall': ['WD_02', 'WD_03'],       // Shahid Lt. Selim Hall — north-west campus
    'hamid-hall': ['HH_02', 'HH_03'],      // Hamid Hall — on Hamid Hall Road
    'sahidul-hall': ['HH_01', 'MR_16'],    // Sahidul Hall — near Hamid Hall junction
    'zia-hall': ['HH_02', 'HH_03'],        // Zia Hall — on Hamid Hall Road / Main Road area
    'ladies-hall': ['MR_01', 'MR_02'],      // Ladies Hall — near Main Road
    'tin-shade': ['HH_01', 'HH_02'],      // Tin Shade Hall — on Hamid Hall Road
    'new-hall': ['WD_03', 'WD_04'],        // New Hall — north-west campus
    'mosque': ['MR_01', 'MR_02'],          // Mosque — on Main Road
    'teachers-quarter': ['ECE_05', 'ECE_06'], // Teachers Quarter — near ECE Road
    'canteen-teachers': ['ECE_06', 'ECE_07'], // Teachers Canteen — near ECE Road
    'guesthouse': ['ECE_05', 'ECE_06'],     // Guest House — near ECE Road
    'staff-quarter': ['R18_04', 'R18_05'], // Staff Quarter — Road 18
    'ansars-quarter': ['R18_04'],          // Ansars Quarter — Road 18
    'emp-assoc': ['ECE_08', 'ECE_09'],      // Employees Association — near ECE Road
    'water-plant': ['ECE_09'],             // Water Plant — south ECE Road
    'vc-bungalow': ['ECE_09'],             // VC Bungalow — south ECE Road area
    'agrani': ['ECE_09'],                  // Agrani School — south ECE area
    'club': ['R18_05']                     // Officers Club — far east
  };

  // ── Expose to global scope ──
  window.RuetData = {
    BUILDINGS,
    CAT_COLORS,
    ROAD_NODES,
    ROAD_EDGES,
    BUILDING_CONNECTIONS,
    CAMPUS_CENTER: [24.3653, 88.6290]
  };
})();
