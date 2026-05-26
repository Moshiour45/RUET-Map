// ============================================================
//  RUET CAMPUS MAP — Static Data (Geographically Correct)
//  Buildings, Road Network, Connections, Category Colors
// ============================================================
(function () {
  'use strict';

  // ── Category color definitions ──
  const CAT_COLORS = {
    academic:    { fill: '#eab308', border: '#ca8a04', label: 'Academic Building' },
    hall:        { fill: '#ef4444', border: '#dc2626', label: 'Student Hall' },
    facility:    { fill: '#38bdf8', border: '#0ea5e9', label: 'Campus Facility' },
    admin:       { fill: '#f59e0b', border: '#d97706', label: 'Administrative' },
    residential: { fill: '#fb923c', border: '#ea580c', label: 'Residential Quarter' },
    sports:      { fill: '#3b82f6', border: '#2563eb', label: 'Sports Facility' },
    landmark:    { fill: '#4ade80', border: '#22c55e', label: 'Campus Landmark' },
    religious:   { fill: '#c084fc', border: '#a855f7', label: 'Religious' }
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

  // ── Road Network Nodes (Geographically Corrected to match map roads) ──
  const ROAD_NODES = {
    GATE:  { lat: 24.36274, lng: 88.62889 }, // Main Gate
    M1:    { lat: 24.36300, lng: 88.62885 }, // Just north of gate
    M2:    { lat: 24.36345, lng: 88.62880 }, // ECE Road / Main Road intersection

    // The curved ECE Road (matching the user's hand-drawn red path!)
    ECE_1: { lat: 24.36365, lng: 88.62920 }, // Curved ECE road near Minar
    ECE_2: { lat: 24.36380, lng: 88.62950 }, // ECE road near Post Office curve
    ECE_3: { lat: 24.36410, lng: 88.62970 }, // ECE road near Employees' Association
    ECE_4: { lat: 24.36435, lng: 88.62985 }, // Directly in front of Academic Building 1
    ECE_5: { lat: 24.36490, lng: 88.62965 }, // Directly in front of Academic Building 2
    ECE_6: { lat: 24.36560, lng: 88.62955 }, // In front of CSE/ECE building (ECE road north)

    M3:    { lat: 24.36410, lng: 88.62875 }, // Main academic intersection (West ME)
    M4:    { lat: 24.36480, lng: 88.62870 }, // Near Mechanical/GCE
    M5:    { lat: 24.36590, lng: 88.62870 }, // Near Central Library
    M6:    { lat: 24.36679, lng: 88.62870 }, // Near Guest House
    M7:    { lat: 24.36800, lng: 88.62870 }, // North boundary road

    W1:    { lat: 24.36390, lng: 88.62726 }, // Civil Road intersection
    W2:    { lat: 24.36394, lng: 88.62768 }, // Central Mosque road
    W3:    { lat: 24.36393, lng: 88.62660 }, // Architecture Building intersection
    W4:    { lat: 24.36420, lng: 88.62690 }, // URP intersection
    W5:    { lat: 24.36499, lng: 88.62696 }, // BECM/ETE road intersection

    H1:    { lat: 24.36559, lng: 88.62642 }, // Zia Hall intersection
    H2:    { lat: 24.36622, lng: 88.62615 }, // Hamid Hall intersection
    H3:    { lat: 24.36659, lng: 88.62661 }, // Tinshed Hall intersection
    H4:    { lat: 24.36680, lng: 88.62594 }, // Sahidul Hall intersection
    H5:    { lat: 24.36793, lng: 88.62570 }, // Selim Hall intersection

    N1:    { lat: 24.36658, lng: 88.62754 }, // Gym intersection
    N2:    { lat: 24.36599, lng: 88.62785 }, // Library road
    N3:    { lat: 24.36748, lng: 88.62808 }, // Playground edge node

    E1:    { lat: 24.36659, lng: 88.62944 }, // Teachers' quarters intersection
    E2:    { lat: 24.36699, lng: 88.62934 }, // Guest house node
    E3:    { lat: 24.36600, lng: 88.63100 }, // Flower garden intersection
    E4:    { lat: 24.36600, lng: 88.63200 }, // Staff quarters intersection
    E5:    { lat: 24.36712, lng: 88.63270 }, // Tennis courts node
    E6:    { lat: 24.36350, lng: 88.63400 }, // Water plant node
    E7:    { lat: 24.36300, lng: 88.63450 }, // VC bungalow node
    E8:    { lat: 24.36220, lng: 88.63470 }, // Agrani school node
    E9:    { lat: 24.36400, lng: 88.63550 }  // Officers' club node
  };

  // ── Road Edges ──
  const ROAD_EDGES = [
    // Main entrance spine (drivable)
    ['GATE', 'M1', { drive: true }], ['M1', 'M2', { drive: true }], ['M2', 'M3', { drive: true }], ['M3', 'M4', { drive: true }], ['M4', 'M5', { drive: true }], ['M5', 'M6', { drive: true }], ['M6', 'M7', { drive: true }],

    // Curved ECE Road (drivable)
    ['M2', 'ECE_1', { drive: true }], ['ECE_1', 'ECE_2', { drive: true }], ['ECE_2', 'ECE_3', { drive: true }], ['ECE_3', 'ECE_4', { drive: true }], 
    ['ECE_4', 'ECE_5', { drive: true }], ['ECE_5', 'ECE_6', { drive: true }], ['ECE_6', 'E1', { drive: true }],

    // Horizontal connectors from ECE Road back to Main Road (drivable)
    ['M3', 'ECE_3', { drive: true }], ['M4', 'ECE_5', { drive: true }], ['M5', 'ECE_6', { drive: true }],

    // West academic loops (walk/bike only, NO driving allowed)
    ['M3', 'W2'], ['W2', 'W1'], ['W1', 'W3'], ['W3', 'W4'], ['W4', 'W5'], ['W5', 'M4'],

    // West residential hall connectors (walk/bike only, NO driving allowed)
    ['W3', 'H1'], ['H1', 'H2'], ['H2', 'H3'], ['H3', 'H4'], ['H4', 'H5'], ['H5', 'M7'],
    ['W5', 'H1'], ['H3', 'N1'],

    // Central North / Gym connector (walk/bike only)
    ['M5', 'N2'], ['N2', 'N1'], ['N1', 'N3'], ['N3', 'M7'],

    // Eastern zones connectors (drivable and staff residential connectors)
    ['M5', 'E1', { drive: true }], ['E1', 'E2', { drive: true }], ['E2', 'M6', { drive: true }],
    ['E1', 'E3', { drive: true }], ['E3', 'E4', { drive: true }], ['E4', 'E5'],
    ['M3', 'E3', { drive: true }], ['M2', 'E6', { drive: true }], ['E6', 'E7', { drive: true }], ['E7', 'E8', { drive: true }], ['E4', 'E9', { drive: true }], ['E9', 'E8', { drive: true }]
  ];

  // ── Building → nearest Road Node(s) connections ──
  const BUILDING_CONNECTIONS = {
    'main-gate': ['GATE'],
    'building_admin': ['M1', 'GATE'],
    'bus-stand': ['GATE'],
    'building_01': ['ECE_4'], // Connects directly to the terminal point of the user's red path!
    'building_02': ['ECE_5'], // Connects to ECE Road North
    'building_03': ['M4', 'ECE_5'],
    'building_04': ['W1'],
    'building_05': ['W3'],
    'building_me': ['M3', 'ECE_3'],
    'workshop': ['W5', 'N2'],
    'library': ['N2', 'M5'],
    'auditorium': ['M2', 'ECE_1'],
    'cafeteria': ['ECE_2'],
    'medical': ['ECE_3', 'E3'],
    'shaheed-minar': ['M1', 'M2'],
    'botanical': ['E3'],
    'flower-garden': ['E3'],
    'pond-west': ['W2'],
    'pond-east': ['E5'],
    'power': ['M5', 'E1'],
    'central-field': ['N3', 'M7'],
    'gym': ['N1'],
    'pool': ['N1'],
    'cricket': ['E5'],
    'courts': ['E5'],
    'selim-hall': ['H5'],
    'hamid-hall': ['H2'],
    'sahidul-hall': ['H4'],
    'zia-hall': ['H1'],
    'ladies-hall': ['W3', 'H1'],
    'tin-shade': ['H3'],
    'new-hall': ['H4', 'H5'],
    'mosque': ['W2', 'W1'],
    'teachers-quarter': ['E1'],
    'canteen-teachers': ['E1'],
    'guesthouse': ['E2'],
    'staff-quarter': ['E4'],
    'ansars-quarter': ['E4'],
    'emp-assoc': ['M3'],
    'water-plant': ['E6'],
    'vc-bungalow': ['E7'],
    'agrani': ['E8'],
    'club': ['E9']
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
