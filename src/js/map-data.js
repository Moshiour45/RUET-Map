// ============================================================
//  RUET CAMPUS MAP — Generated Map Data from RUET Map.kml
//  Strictly aligned to roads and landmarks defined in KML file.
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

  // ── Buildings parsed from RUET Infrastructure folder in KML ──
  const BUILDINGS = [
  {
    "id": "building_admin",
    "name": "Rajshahi University of Engineering & Technology(RUET)",
    "category": "admin",
    "latlng": [
      24.3635683,
      88.6283773
    ],
    "desc": "Central administrative core housing the VC office, Registrar, Controller of Examinations, and foundational science faculties."
  },
  {
    "id": "main-gate",
    "name": "RUET Main Gate",
    "category": "landmark",
    "latlng": [
      24.3625809,
      88.6289721
    ],
    "desc": "Primary entrance to RUET campus from Rajshahi-Natore-Dhaka Highway."
  },
  {
    "id": "cafeteria",
    "name": "RUET Cafeteria",
    "category": "facility",
    "latlng": [
      24.3633958,
      88.6298398
    ],
    "desc": "Main cafeteria serving meals and snacks. Popular student gathering spot."
  },
  {
    "id": "auditorium",
    "name": "RUET Auditorium",
    "category": "facility",
    "latlng": [
      24.3635732,
      88.6295357
    ],
    "desc": "Convocations, seminars, cultural programs. Seats 1000+."
  },
  {
    "id": "building_01",
    "name": "CSE Building, RUET",
    "category": "academic",
    "latlng": [
      24.3641296,
      88.6299028
    ],
    "desc": "Houses the departments of CSE, ETE, and ECE. Premier computing and telecommunications hub."
  },
  {
    "id": "civil_amtola",
    "name": "Civil Amtola",
    "category": "landmark",
    "latlng": [
      24.3639553,
      88.6276588
    ],
    "desc": "Civil Amtola parsed from KML."
  },
  {
    "id": "building_04",
    "name": "Civil Building, RUET",
    "category": "academic",
    "latlng": [
      24.3638651,
      88.6271277
    ],
    "desc": "Houses the Dept. of Civil Engineering and BECM. Equipped with high-capacity structural testing halls."
  },
  {
    "id": "department_of_eee__electrical_and_electronic_engineering___rajshahi_university_of_engineering___technology__ruet_",
    "name": "Department of EEE (Electrical and Electronic Engineering), Rajshahi University of Engineering & Technology (RUET)",
    "category": "landmark",
    "latlng": [
      24.3650559,
      88.6297315
    ],
    "desc": "Department of EEE (Electrical and Electronic Engineering), Rajshahi University of Engineering & Technology (RUET) parsed from KML."
  },
  {
    "id": "department_of_urp__ruet",
    "name": "Department of URP, RUET",
    "category": "landmark",
    "latlng": [
      24.3646635,
      88.6270811
    ],
    "desc": "Department of URP, RUET parsed from KML."
  },
  {
    "id": "department_of_becm__ruet",
    "name": "Department of BECM, RUET",
    "category": "landmark",
    "latlng": [
      24.3649897,
      88.6270275
    ],
    "desc": "Department of BECM, RUET parsed from KML."
  },
  {
    "id": "building_03",
    "name": "Academic Building 3 | GCE Building Department of Glass and Ceramic Engineering",
    "category": "academic",
    "latlng": [
      24.3648106,
      88.6286752
    ],
    "desc": "Houses the Departments of CME, MTE, and MSE. Features specialized material labs."
  },
  {
    "id": "building_me",
    "name": "Heat Engine lab & Classrooms, Mechanical Department, RUET",
    "category": "academic",
    "latlng": [
      24.3651207,
      88.6284605
    ],
    "desc": "Mechanical Engineering Building. Equipped with thermodynamics, machinery, and production workshops."
  },
  {
    "id": "library",
    "name": "RUET Central Library",
    "category": "facility",
    "latlng": [
      24.3658329,
      88.627762
    ],
    "desc": "50,000+ books, e-journals, Wi-Fi study spaces, digital resources."
  },
  {
    "id": "zia-hall",
    "name": "Shahid President Ziaur Rahman Hall",
    "category": "hall",
    "latlng": [
      24.3654579,
      88.6264287
    ],
    "desc": "Large male residential hall with expanded student capacity."
  },
  {
    "id": "guesthouse",
    "name": "Guest House Ruet",
    "category": "facility",
    "latlng": [
      24.3669038,
      88.6292027
    ],
    "desc": "Accommodation for visiting dignitaries and academics."
  },
  {
    "id": "central-field",
    "name": "Central Playground, RUET",
    "category": "sports",
    "latlng": [
      24.3673405,
      88.6281876
    ],
    "desc": "Main playground for football, cricket, and athletics."
  },
  {
    "id": "sahidul-hall",
    "name": "Shahid Shahidul Islam Hall",
    "category": "hall",
    "latlng": [
      24.3667557,
      88.6258996
    ],
    "desc": "Male residential hall with modern amenities, canteen, and reading room."
  },
  {
    "id": "courts",
    "name": "RUET Basketball Ground",
    "category": "sports",
    "latlng": [
      24.3676865,
      88.627285
    ],
    "desc": "Basketball and sports ground."
  },
  {
    "id": "selim-hall",
    "name": "Shahid Lt. Selim Hall",
    "category": "hall",
    "latlng": [
      24.3682449,
      88.6257937
    ],
    "desc": "Male residential hall named after Lt. Selim, a 1971 Liberation War martyr."
  },
  {
    "id": "mosque",
    "name": "RUET Central Mosque - Rajshahi",
    "category": "religious",
    "latlng": [
      24.3686507,
      88.6271321
    ],
    "desc": "Central campus mosque for daily prayers and congregations."
  },
  {
    "id": "rh-gate",
    "name": "RH Gate, RUET",
    "category": "landmark",
    "latlng": [
      24.3689963,
      88.6245957
    ],
    "desc": "RH Gate, RUET parsed from KML."
  },
  {
    "id": "teachers-quarter",
    "name": "Lecturer's Residential Area",
    "category": "residential",
    "latlng": [
      24.3702994,
      88.6271506
    ],
    "desc": "Faculty housing with community spaces."
  },
  {
    "id": "new-hall",
    "name": "RUET Male Hall - 2",
    "category": "hall",
    "latlng": [
      24.3699088,
      88.6255625
    ],
    "desc": "Male student residential hall (Bangabandhu Hall / Hall 2)."
  },
  {
    "id": "quarter-playground",
    "name": "Ruet Quarter Playground",
    "category": "sports",
    "latlng": [
      24.3697996,
      88.6275505
    ],
    "desc": "Ruet Quarter Playground parsed from KML."
  },
  {
    "id": "building_05",
    "name": "Department of Architecture, Rajshahi University of Engineering & Technology",
    "category": "academic",
    "latlng": [
      24.363835,
      88.6266166
    ],
    "desc": "Houses the Dept. of Architecture and URP. Features luminous design studios and planning exhibition halls."
  },
  {
    "id": "building_becm",
    "name": "Department of Building Engineering & Construction Management,RUET",
    "category": "academic",
    "latlng": [
      24.3641391,
      88.6264763
    ],
    "desc": "Department of Building Engineering & Construction Management,RUET parsed from KML."
  },
  {
    "id": "pocket-gate",
    "name": "RUET Pocket Gate",
    "category": "landmark",
    "latlng": [
      24.3642571,
      88.626254
    ],
    "desc": "RUET Pocket Gate parsed from KML."
  },
  {
    "id": "atm",
    "name": "Rupali Bank Limited ATM",
    "category": "facility",
    "latlng": [
      24.3628045,
      88.6288655
    ],
    "desc": "Rupali Bank Limited ATM parsed from KML."
  },
  {
    "id": "shaheed-minar",
    "name": "RUET Shaheed Minar",
    "category": "landmark",
    "latlng": [
      24.3630323,
      88.629353
    ],
    "desc": "Iconic monument commemorating the Language Movement martyrs of 1952."
  },
  {
    "id": "rag-wall",
    "name": "Rag Wall, RUET",
    "category": "landmark",
    "latlng": [
      24.3634523,
      88.6295843
    ],
    "desc": "Rag Wall, RUET parsed from KML."
  },
  {
    "id": "bus-stand",
    "name": "Bus Stand",
    "category": "facility",
    "latlng": [
      24.3625321,
      88.6290126
    ],
    "desc": "Campus bus stand for university transport near main gate."
  }
];

  // ── Road centerline network nodes parsed from LineString coordinates in KML ──
  const ROAD_NODES = {
  "N_000": {
    "lat": 24.36253,
    "lng": 88.62901
  },
  "N_001": {
    "lat": 24.36258,
    "lng": 88.6291
  },
  "N_002": {
    "lat": 24.36342,
    "lng": 88.62882
  },
  "N_003": {
    "lat": 24.36344,
    "lng": 88.62894
  },
  "N_004": {
    "lat": 24.36346,
    "lng": 88.62915
  },
  "N_005": {
    "lat": 24.36352,
    "lng": 88.62925
  },
  "N_006": {
    "lat": 24.36353,
    "lng": 88.62925
  },
  "N_007": {
    "lat": 24.36354,
    "lng": 88.62925
  },
  "N_008": {
    "lat": 24.36355,
    "lng": 88.62925
  },
  "N_009": {
    "lat": 24.36356,
    "lng": 88.62925
  },
  "N_010": {
    "lat": 24.36356,
    "lng": 88.62926
  },
  "N_011": {
    "lat": 24.36357,
    "lng": 88.62926
  },
  "N_012": {
    "lat": 24.36358,
    "lng": 88.62926
  },
  "N_013": {
    "lat": 24.36358,
    "lng": 88.62927
  },
  "N_014": {
    "lat": 24.36359,
    "lng": 88.62927
  },
  "N_015": {
    "lat": 24.36359,
    "lng": 88.62928
  },
  "N_016": {
    "lat": 24.36359,
    "lng": 88.62929
  },
  "N_017": {
    "lat": 24.3636,
    "lng": 88.62929
  },
  "N_018": {
    "lat": 24.3636,
    "lng": 88.6293
  },
  "N_019": {
    "lat": 24.3636,
    "lng": 88.62931
  },
  "N_020": {
    "lat": 24.36367,
    "lng": 88.6293
  },
  "N_021": {
    "lat": 24.36373,
    "lng": 88.6293
  },
  "N_022": {
    "lat": 24.36375,
    "lng": 88.62932
  },
  "N_023": {
    "lat": 24.36377,
    "lng": 88.62935
  },
  "N_024": {
    "lat": 24.36378,
    "lng": 88.62941
  },
  "N_025": {
    "lat": 24.36386,
    "lng": 88.62964
  },
  "N_026": {
    "lat": 24.36456,
    "lng": 88.6293
  },
  "N_027": {
    "lat": 24.36459,
    "lng": 88.62929
  },
  "N_028": {
    "lat": 24.36478,
    "lng": 88.62922
  },
  "N_029": {
    "lat": 24.36492,
    "lng": 88.62974
  },
  "N_030": {
    "lat": 24.36496,
    "lng": 88.62975
  },
  "N_031": {
    "lat": 24.36498,
    "lng": 88.62974
  },
  "N_032": {
    "lat": 24.36499,
    "lng": 88.62973
  },
  "N_033": {
    "lat": 24.36484,
    "lng": 88.6292
  },
  "N_034": {
    "lat": 24.36521,
    "lng": 88.62907
  },
  "N_035": {
    "lat": 24.3654,
    "lng": 88.62901
  },
  "N_036": {
    "lat": 24.3655,
    "lng": 88.62898
  },
  "N_037": {
    "lat": 24.36583,
    "lng": 88.62887
  },
  "N_038": {
    "lat": 24.36569,
    "lng": 88.6284
  },
  "N_039": {
    "lat": 24.36567,
    "lng": 88.62832
  },
  "N_040": {
    "lat": 24.36557,
    "lng": 88.62798
  },
  "N_041": {
    "lat": 24.36524,
    "lng": 88.62809
  },
  "N_042": {
    "lat": 24.36521,
    "lng": 88.62811
  },
  "N_043": {
    "lat": 24.36494,
    "lng": 88.6282
  },
  "N_044": {
    "lat": 24.3648,
    "lng": 88.62825
  },
  "N_045": {
    "lat": 24.36468,
    "lng": 88.62829
  },
  "N_046": {
    "lat": 24.36435,
    "lng": 88.6284
  },
  "N_047": {
    "lat": 24.36445,
    "lng": 88.62878
  },
  "N_048": {
    "lat": 24.36391,
    "lng": 88.62978
  },
  "N_049": {
    "lat": 24.36396,
    "lng": 88.62998
  },
  "N_050": {
    "lat": 24.36349,
    "lng": 88.62926
  },
  "N_051": {
    "lat": 24.36348,
    "lng": 88.62927
  },
  "N_052": {
    "lat": 24.36348,
    "lng": 88.62928
  },
  "N_053": {
    "lat": 24.36347,
    "lng": 88.62928
  },
  "N_054": {
    "lat": 24.36347,
    "lng": 88.62929
  },
  "N_055": {
    "lat": 24.36347,
    "lng": 88.6293
  },
  "N_056": {
    "lat": 24.36346,
    "lng": 88.6293
  },
  "N_057": {
    "lat": 24.36346,
    "lng": 88.62931
  },
  "N_058": {
    "lat": 24.36346,
    "lng": 88.62932
  },
  "N_059": {
    "lat": 24.36346,
    "lng": 88.62933
  },
  "N_060": {
    "lat": 24.36346,
    "lng": 88.62934
  },
  "N_061": {
    "lat": 24.36346,
    "lng": 88.62935
  },
  "N_062": {
    "lat": 24.36347,
    "lng": 88.62935
  },
  "N_063": {
    "lat": 24.36347,
    "lng": 88.62936
  },
  "N_064": {
    "lat": 24.36325,
    "lng": 88.62956
  },
  "N_065": {
    "lat": 24.36324,
    "lng": 88.62959
  },
  "N_066": {
    "lat": 24.36324,
    "lng": 88.62962
  },
  "N_067": {
    "lat": 24.36324,
    "lng": 88.62964
  },
  "N_068": {
    "lat": 24.36324,
    "lng": 88.62966
  },
  "N_069": {
    "lat": 24.36325,
    "lng": 88.62969
  },
  "N_070": {
    "lat": 24.36327,
    "lng": 88.62973
  },
  "N_071": {
    "lat": 24.36357,
    "lng": 88.62939
  },
  "N_072": {
    "lat": 24.36356,
    "lng": 88.62939
  },
  "N_073": {
    "lat": 24.36356,
    "lng": 88.6294
  },
  "N_074": {
    "lat": 24.36355,
    "lng": 88.6294
  },
  "N_075": {
    "lat": 24.36354,
    "lng": 88.6294
  },
  "N_076": {
    "lat": 24.36353,
    "lng": 88.6294
  },
  "N_077": {
    "lat": 24.36352,
    "lng": 88.6294
  },
  "N_078": {
    "lat": 24.36351,
    "lng": 88.6294
  },
  "N_079": {
    "lat": 24.36351,
    "lng": 88.62939
  },
  "N_080": {
    "lat": 24.3635,
    "lng": 88.62939
  },
  "N_081": {
    "lat": 24.36349,
    "lng": 88.62939
  },
  "N_082": {
    "lat": 24.36349,
    "lng": 88.62938
  },
  "N_083": {
    "lat": 24.36348,
    "lng": 88.62938
  },
  "N_084": {
    "lat": 24.36348,
    "lng": 88.62937
  },
  "N_085": {
    "lat": 24.36347,
    "lng": 88.62937
  },
  "N_086": {
    "lat": 24.3635,
    "lng": 88.62926
  },
  "N_087": {
    "lat": 24.3635,
    "lng": 88.62925
  },
  "N_088": {
    "lat": 24.36351,
    "lng": 88.62925
  },
  "N_089": {
    "lat": 24.3636,
    "lng": 88.62932
  },
  "N_090": {
    "lat": 24.3636,
    "lng": 88.62933
  },
  "N_091": {
    "lat": 24.3636,
    "lng": 88.62934
  },
  "N_092": {
    "lat": 24.3636,
    "lng": 88.62935
  },
  "N_093": {
    "lat": 24.36359,
    "lng": 88.62936
  },
  "N_094": {
    "lat": 24.36359,
    "lng": 88.62937
  },
  "N_095": {
    "lat": 24.36358,
    "lng": 88.62937
  },
  "N_096": {
    "lat": 24.36358,
    "lng": 88.62938
  },
  "N_097": {
    "lat": 24.36296,
    "lng": 88.62897
  },
  "N_098": {
    "lat": 24.36295,
    "lng": 88.62897
  },
  "N_099": {
    "lat": 24.36366,
    "lng": 88.62873
  },
  "N_100": {
    "lat": 24.36369,
    "lng": 88.62872
  },
  "N_101": {
    "lat": 24.3637,
    "lng": 88.62871
  },
  "N_102": {
    "lat": 24.36371,
    "lng": 88.6287
  },
  "N_103": {
    "lat": 24.36372,
    "lng": 88.6287
  },
  "N_104": {
    "lat": 24.36372,
    "lng": 88.62869
  },
  "N_105": {
    "lat": 24.36373,
    "lng": 88.62868
  },
  "N_106": {
    "lat": 24.36373,
    "lng": 88.62867
  },
  "N_107": {
    "lat": 24.36373,
    "lng": 88.62864
  },
  "N_108": {
    "lat": 24.36373,
    "lng": 88.62862
  },
  "N_109": {
    "lat": 24.36381,
    "lng": 88.6286
  },
  "N_110": {
    "lat": 24.36475,
    "lng": 88.62856
  },
  "N_111": {
    "lat": 24.36476,
    "lng": 88.62858
  },
  "N_112": {
    "lat": 24.36477,
    "lng": 88.62858
  },
  "N_113": {
    "lat": 24.36478,
    "lng": 88.62859
  },
  "N_114": {
    "lat": 24.36479,
    "lng": 88.62859
  },
  "N_115": {
    "lat": 24.3648,
    "lng": 88.62859
  },
  "N_116": {
    "lat": 24.36481,
    "lng": 88.62859
  },
  "N_117": {
    "lat": 24.36484,
    "lng": 88.62858
  },
  "N_118": {
    "lat": 24.36485,
    "lng": 88.62857
  },
  "N_119": {
    "lat": 24.36486,
    "lng": 88.62857
  },
  "N_120": {
    "lat": 24.36486,
    "lng": 88.62856
  },
  "N_121": {
    "lat": 24.36487,
    "lng": 88.62855
  },
  "N_122": {
    "lat": 24.36487,
    "lng": 88.62854
  },
  "N_123": {
    "lat": 24.36487,
    "lng": 88.62853
  },
  "N_124": {
    "lat": 24.36487,
    "lng": 88.62852
  },
  "N_125": {
    "lat": 24.36503,
    "lng": 88.6285
  },
  "N_126": {
    "lat": 24.36542,
    "lng": 88.62745
  },
  "N_127": {
    "lat": 24.3653,
    "lng": 88.62704
  },
  "N_128": {
    "lat": 24.36497,
    "lng": 88.62715
  },
  "N_129": {
    "lat": 24.36436,
    "lng": 88.62734
  },
  "N_130": {
    "lat": 24.36397,
    "lng": 88.62747
  },
  "N_131": {
    "lat": 24.36387,
    "lng": 88.6275
  },
  "N_132": {
    "lat": 24.36384,
    "lng": 88.62752
  },
  "N_133": {
    "lat": 24.36381,
    "lng": 88.62756
  },
  "N_134": {
    "lat": 24.36378,
    "lng": 88.62753
  },
  "N_135": {
    "lat": 24.36377,
    "lng": 88.62752
  },
  "N_136": {
    "lat": 24.36373,
    "lng": 88.62743
  },
  "N_137": {
    "lat": 24.36363,
    "lng": 88.62708
  },
  "N_138": {
    "lat": 24.36362,
    "lng": 88.62705
  },
  "N_139": {
    "lat": 24.36364,
    "lng": 88.62701
  },
  "N_140": {
    "lat": 24.36376,
    "lng": 88.62698
  },
  "N_141": {
    "lat": 24.36428,
    "lng": 88.62682
  },
  "N_142": {
    "lat": 24.36475,
    "lng": 88.62668
  },
  "N_143": {
    "lat": 24.3647,
    "lng": 88.62667
  },
  "N_144": {
    "lat": 24.36466,
    "lng": 88.62665
  },
  "N_145": {
    "lat": 24.3644,
    "lng": 88.62657
  },
  "N_146": {
    "lat": 24.36433,
    "lng": 88.6265
  },
  "N_147": {
    "lat": 24.36429,
    "lng": 88.6264
  },
  "N_148": {
    "lat": 24.36426,
    "lng": 88.62633
  },
  "N_149": {
    "lat": 24.36426,
    "lng": 88.6262
  },
  "N_150": {
    "lat": 24.36437,
    "lng": 88.62617
  },
  "N_151": {
    "lat": 24.36436,
    "lng": 88.62609
  },
  "N_152": {
    "lat": 24.36398,
    "lng": 88.62621
  },
  "N_153": {
    "lat": 24.364,
    "lng": 88.62628
  },
  "N_154": {
    "lat": 24.36483,
    "lng": 88.62665
  },
  "N_155": {
    "lat": 24.36516,
    "lng": 88.62655
  },
  "N_156": {
    "lat": 24.36527,
    "lng": 88.62644
  },
  "N_157": {
    "lat": 24.36561,
    "lng": 88.62741
  },
  "N_158": {
    "lat": 24.36584,
    "lng": 88.62733
  },
  "N_159": {
    "lat": 24.36597,
    "lng": 88.62727
  },
  "N_160": {
    "lat": 24.36631,
    "lng": 88.62715
  },
  "N_161": {
    "lat": 24.36635,
    "lng": 88.62713
  },
  "N_162": {
    "lat": 24.36649,
    "lng": 88.62708
  },
  "N_163": {
    "lat": 24.3666,
    "lng": 88.62704
  },
  "N_164": {
    "lat": 24.36687,
    "lng": 88.62695
  },
  "N_165": {
    "lat": 24.36714,
    "lng": 88.62686
  },
  "N_166": {
    "lat": 24.36694,
    "lng": 88.62616
  },
  "N_167": {
    "lat": 24.36755,
    "lng": 88.62671
  },
  "N_168": {
    "lat": 24.36768,
    "lng": 88.62667
  },
  "N_169": {
    "lat": 24.36774,
    "lng": 88.62665
  },
  "N_170": {
    "lat": 24.36829,
    "lng": 88.62645
  },
  "N_171": {
    "lat": 24.36827,
    "lng": 88.62638
  },
  "N_172": {
    "lat": 24.3682,
    "lng": 88.6261
  },
  "N_173": {
    "lat": 24.36816,
    "lng": 88.62603
  },
  "N_174": {
    "lat": 24.36809,
    "lng": 88.62595
  },
  "N_175": {
    "lat": 24.36778,
    "lng": 88.627
  },
  "N_176": {
    "lat": 24.36812,
    "lng": 88.62688
  },
  "N_177": {
    "lat": 24.36797,
    "lng": 88.62764
  },
  "N_178": {
    "lat": 24.36851,
    "lng": 88.62746
  },
  "N_179": {
    "lat": 24.36851,
    "lng": 88.62741
  },
  "N_180": {
    "lat": 24.36848,
    "lng": 88.62727
  },
  "N_181": {
    "lat": 24.36846,
    "lng": 88.62714
  },
  "N_182": {
    "lat": 24.36829,
    "lng": 88.62719
  },
  "N_183": {
    "lat": 24.36837,
    "lng": 88.62676
  },
  "N_184": {
    "lat": 24.3686,
    "lng": 88.62637
  },
  "N_185": {
    "lat": 24.36862,
    "lng": 88.62648
  },
  "N_186": {
    "lat": 24.36863,
    "lng": 88.6265
  },
  "N_187": {
    "lat": 24.36863,
    "lng": 88.62653
  },
  "N_188": {
    "lat": 24.36863,
    "lng": 88.62654
  },
  "N_189": {
    "lat": 24.36863,
    "lng": 88.62656
  },
  "N_190": {
    "lat": 24.36863,
    "lng": 88.62657
  },
  "N_191": {
    "lat": 24.36862,
    "lng": 88.62658
  },
  "N_192": {
    "lat": 24.3686,
    "lng": 88.62659
  },
  "N_193": {
    "lat": 24.36857,
    "lng": 88.6266
  },
  "N_194": {
    "lat": 24.36866,
    "lng": 88.62635
  },
  "N_195": {
    "lat": 24.36855,
    "lng": 88.62591
  },
  "N_196": {
    "lat": 24.36926,
    "lng": 88.62618
  },
  "N_197": {
    "lat": 24.36917,
    "lng": 88.62577
  },
  "N_198": {
    "lat": 24.36909,
    "lng": 88.6254
  },
  "N_199": {
    "lat": 24.36908,
    "lng": 88.62535
  },
  "N_200": {
    "lat": 24.36906,
    "lng": 88.62525
  },
  "N_201": {
    "lat": 24.36905,
    "lng": 88.62521
  },
  "N_202": {
    "lat": 24.36904,
    "lng": 88.62513
  },
  "N_203": {
    "lat": 24.36901,
    "lng": 88.62498
  },
  "N_204": {
    "lat": 24.36902,
    "lng": 88.62484
  },
  "N_205": {
    "lat": 24.36902,
    "lng": 88.62465
  },
  "N_206": {
    "lat": 24.36904,
    "lng": 88.62441
  },
  "N_207": {
    "lat": 24.36904,
    "lng": 88.62423
  },
  "N_208": {
    "lat": 24.36911,
    "lng": 88.62419
  },
  "N_209": {
    "lat": 24.36909,
    "lng": 88.62413
  },
  "N_210": {
    "lat": 24.36889,
    "lng": 88.62422
  },
  "N_211": {
    "lat": 24.36882,
    "lng": 88.62413
  },
  "N_212": {
    "lat": 24.36887,
    "lng": 88.62358
  },
  "N_213": {
    "lat": 24.36966,
    "lng": 88.62638
  },
  "N_214": {
    "lat": 24.36972,
    "lng": 88.62641
  },
  "N_215": {
    "lat": 24.36977,
    "lng": 88.62646
  },
  "N_216": {
    "lat": 24.36979,
    "lng": 88.6265
  },
  "N_217": {
    "lat": 24.36998,
    "lng": 88.62644
  },
  "N_218": {
    "lat": 24.37009,
    "lng": 88.62692
  },
  "N_219": {
    "lat": 24.37043,
    "lng": 88.62626
  },
  "N_220": {
    "lat": 24.37051,
    "lng": 88.62655
  },
  "N_221": {
    "lat": 24.37089,
    "lng": 88.62608
  },
  "N_222": {
    "lat": 24.37119,
    "lng": 88.62599
  },
  "N_223": {
    "lat": 24.37153,
    "lng": 88.62722
  },
  "N_224": {
    "lat": 24.37049,
    "lng": 88.62759
  },
  "N_225": {
    "lat": 24.36963,
    "lng": 88.62789
  },
  "N_226": {
    "lat": 24.37194,
    "lng": 88.62571
  },
  "N_227": {
    "lat": 24.37182,
    "lng": 88.62514
  },
  "N_228": {
    "lat": 24.3718,
    "lng": 88.62508
  },
  "N_229": {
    "lat": 24.37173,
    "lng": 88.62476
  },
  "N_230": {
    "lat": 24.37164,
    "lng": 88.62437
  },
  "N_231": {
    "lat": 24.37152,
    "lng": 88.62386
  },
  "N_232": {
    "lat": 24.3715,
    "lng": 88.62365
  },
  "N_233": {
    "lat": 24.37144,
    "lng": 88.6234
  },
  "N_234": {
    "lat": 24.37142,
    "lng": 88.62334
  },
  "N_235": {
    "lat": 24.37137,
    "lng": 88.62323
  },
  "N_236": {
    "lat": 24.3713,
    "lng": 88.62308
  },
  "N_237": {
    "lat": 24.37098,
    "lng": 88.62326
  },
  "N_238": {
    "lat": 24.37037,
    "lng": 88.62357
  },
  "N_239": {
    "lat": 24.37001,
    "lng": 88.62375
  },
  "N_240": {
    "lat": 24.36972,
    "lng": 88.6239
  },
  "N_241": {
    "lat": 24.36969,
    "lng": 88.62671
  },
  "N_242": {
    "lat": 24.36959,
    "lng": 88.6269
  },
  "N_243": {
    "lat": 24.36956,
    "lng": 88.62696
  },
  "N_244": {
    "lat": 24.36952,
    "lng": 88.62704
  },
  "N_245": {
    "lat": 24.36947,
    "lng": 88.62711
  },
  "N_246": {
    "lat": 24.36945,
    "lng": 88.62714
  },
  "N_247": {
    "lat": 24.3694,
    "lng": 88.62716
  },
  "N_248": {
    "lat": 24.36937,
    "lng": 88.62717
  },
  "N_249": {
    "lat": 24.36915,
    "lng": 88.62725
  },
  "N_250": {
    "lat": 24.36905,
    "lng": 88.62679
  },
  "N_251": {
    "lat": 24.36789,
    "lng": 88.62765
  },
  "N_252": {
    "lat": 24.3678,
    "lng": 88.62765
  },
  "N_253": {
    "lat": 24.36763,
    "lng": 88.6277
  },
  "N_254": {
    "lat": 24.36747,
    "lng": 88.62772
  },
  "N_255": {
    "lat": 24.36729,
    "lng": 88.62781
  },
  "N_256": {
    "lat": 24.36728,
    "lng": 88.62781
  },
  "N_257": {
    "lat": 24.36689,
    "lng": 88.62795
  },
  "N_258": {
    "lat": 24.36676,
    "lng": 88.628
  },
  "N_259": {
    "lat": 24.36663,
    "lng": 88.62805
  },
  "N_260": {
    "lat": 24.36637,
    "lng": 88.62814
  },
  "N_261": {
    "lat": 24.3662,
    "lng": 88.62821
  },
  "N_262": {
    "lat": 24.36591,
    "lng": 88.62832
  },
  "N_263": {
    "lat": 24.3659,
    "lng": 88.6291
  },
  "N_264": {
    "lat": 24.36594,
    "lng": 88.62922
  },
  "N_265": {
    "lat": 24.36602,
    "lng": 88.62926
  },
  "N_266": {
    "lat": 24.36611,
    "lng": 88.62925
  },
  "N_267": {
    "lat": 24.36621,
    "lng": 88.62925
  },
  "N_268": {
    "lat": 24.36632,
    "lng": 88.62924
  },
  "N_269": {
    "lat": 24.36635,
    "lng": 88.62923
  },
  "N_270": {
    "lat": 24.36675,
    "lng": 88.6291
  },
  "N_271": {
    "lat": 24.36693,
    "lng": 88.62904
  },
  "N_272": {
    "lat": 24.36701,
    "lng": 88.62901
  },
  "N_273": {
    "lat": 24.36579,
    "lng": 88.62791
  },
  "N_274": {
    "lat": 24.36253,
    "lng": 88.62902
  },
  "N_275": {
    "lat": 24.36372,
    "lng": 88.6286
  },
  "N_276": {
    "lat": 24.36371,
    "lng": 88.62857
  },
  "N_277": {
    "lat": 24.3637,
    "lng": 88.62856
  },
  "N_278": {
    "lat": 24.36368,
    "lng": 88.62854
  },
  "N_279": {
    "lat": 24.36366,
    "lng": 88.62854
  },
  "N_280": {
    "lat": 24.36364,
    "lng": 88.62853
  },
  "N_281": {
    "lat": 24.36358,
    "lng": 88.62855
  },
  "N_282": {
    "lat": 24.3634,
    "lng": 88.62861
  },
  "N_283": {
    "lat": 24.3631,
    "lng": 88.62871
  },
  "N_284": {
    "lat": 24.3627,
    "lng": 88.62885
  },
  "N_285": {
    "lat": 24.36267,
    "lng": 88.62887
  },
  "N_286": {
    "lat": 24.3625,
    "lng": 88.62894
  },
  "N_287": {
    "lat": 24.36233,
    "lng": 88.62859
  },
  "N_288": {
    "lat": 24.36239,
    "lng": 88.62855
  },
  "N_289": {
    "lat": 24.36242,
    "lng": 88.62852
  },
  "N_290": {
    "lat": 24.36244,
    "lng": 88.62849
  },
  "N_291": {
    "lat": 24.36246,
    "lng": 88.62845
  },
  "N_292": {
    "lat": 24.36247,
    "lng": 88.6284
  },
  "N_293": {
    "lat": 24.36247,
    "lng": 88.62837
  },
  "N_294": {
    "lat": 24.36247,
    "lng": 88.62829
  },
  "N_295": {
    "lat": 24.36245,
    "lng": 88.62823
  },
  "N_296": {
    "lat": 24.36243,
    "lng": 88.62813
  },
  "N_297": {
    "lat": 24.36242,
    "lng": 88.62808
  },
  "N_298": {
    "lat": 24.36242,
    "lng": 88.62804
  },
  "N_299": {
    "lat": 24.36241,
    "lng": 88.62801
  },
  "N_300": {
    "lat": 24.36242,
    "lng": 88.62799
  },
  "N_301": {
    "lat": 24.36242,
    "lng": 88.62797
  },
  "N_302": {
    "lat": 24.36242,
    "lng": 88.62796
  },
  "N_303": {
    "lat": 24.36243,
    "lng": 88.62795
  },
  "N_304": {
    "lat": 24.36244,
    "lng": 88.62794
  },
  "N_305": {
    "lat": 24.36246,
    "lng": 88.62792
  },
  "N_306": {
    "lat": 24.36251,
    "lng": 88.6279
  },
  "N_307": {
    "lat": 24.36257,
    "lng": 88.62788
  },
  "N_308": {
    "lat": 24.36269,
    "lng": 88.62783
  },
  "N_309": {
    "lat": 24.36274,
    "lng": 88.62781
  },
  "N_310": {
    "lat": 24.36276,
    "lng": 88.62781
  },
  "N_311": {
    "lat": 24.36278,
    "lng": 88.62781
  },
  "N_312": {
    "lat": 24.3628,
    "lng": 88.62782
  },
  "N_313": {
    "lat": 24.36281,
    "lng": 88.62785
  },
  "N_314": {
    "lat": 24.36283,
    "lng": 88.62787
  },
  "N_315": {
    "lat": 24.36284,
    "lng": 88.62792
  },
  "N_316": {
    "lat": 24.36285,
    "lng": 88.62796
  },
  "N_317": {
    "lat": 24.36291,
    "lng": 88.62814
  },
  "N_318": {
    "lat": 24.36292,
    "lng": 88.62815
  },
  "N_319": {
    "lat": 24.36301,
    "lng": 88.62843
  },
  "N_320": {
    "lat": 24.36256,
    "lng": 88.62892
  }
};

  // ── Road network edges built directly from the connected LineString paths in KML ──
  const ROAD_EDGES = [
  [
    "N_000",
    "N_001",
    {
      "drive": true
    }
  ],
  [
    "N_001",
    "N_002",
    {
      "drive": true
    }
  ],
  [
    "N_002",
    "N_003",
    {
      "drive": true
    }
  ],
  [
    "N_003",
    "N_004",
    {
      "drive": true
    }
  ],
  [
    "N_004",
    "N_005",
    {
      "drive": true
    }
  ],
  [
    "N_005",
    "N_006",
    {
      "drive": true
    }
  ],
  [
    "N_006",
    "N_007",
    {
      "drive": true
    }
  ],
  [
    "N_007",
    "N_008",
    {
      "drive": true
    }
  ],
  [
    "N_008",
    "N_009",
    {
      "drive": true
    }
  ],
  [
    "N_009",
    "N_010",
    {
      "drive": true
    }
  ],
  [
    "N_010",
    "N_011",
    {
      "drive": true
    }
  ],
  [
    "N_011",
    "N_012",
    {
      "drive": true
    }
  ],
  [
    "N_012",
    "N_013",
    {
      "drive": true
    }
  ],
  [
    "N_013",
    "N_014",
    {
      "drive": true
    }
  ],
  [
    "N_014",
    "N_015",
    {
      "drive": true
    }
  ],
  [
    "N_015",
    "N_016",
    {
      "drive": true
    }
  ],
  [
    "N_016",
    "N_017",
    {
      "drive": true
    }
  ],
  [
    "N_017",
    "N_018",
    {
      "drive": true
    }
  ],
  [
    "N_018",
    "N_019",
    {
      "drive": true
    }
  ],
  [
    "N_019",
    "N_020",
    {
      "drive": true
    }
  ],
  [
    "N_020",
    "N_021",
    {
      "drive": true
    }
  ],
  [
    "N_021",
    "N_022",
    {
      "drive": true
    }
  ],
  [
    "N_022",
    "N_023",
    {
      "drive": true
    }
  ],
  [
    "N_023",
    "N_024",
    {
      "drive": true
    }
  ],
  [
    "N_024",
    "N_025",
    {
      "drive": true
    }
  ],
  [
    "N_025",
    "N_026",
    {
      "drive": true
    }
  ],
  [
    "N_026",
    "N_027",
    {
      "drive": true
    }
  ],
  [
    "N_027",
    "N_028",
    {
      "drive": true
    }
  ],
  [
    "N_028",
    "N_029",
    {
      "drive": true
    }
  ],
  [
    "N_029",
    "N_030",
    {
      "drive": true
    }
  ],
  [
    "N_030",
    "N_031",
    {
      "drive": true
    }
  ],
  [
    "N_031",
    "N_032",
    {
      "drive": true
    }
  ],
  [
    "N_032",
    "N_033",
    {
      "drive": true
    }
  ],
  [
    "N_033",
    "N_034",
    {
      "drive": true
    }
  ],
  [
    "N_034",
    "N_035",
    {
      "drive": true
    }
  ],
  [
    "N_035",
    "N_036",
    {
      "drive": true
    }
  ],
  [
    "N_036",
    "N_037",
    {
      "drive": true
    }
  ],
  [
    "N_037",
    "N_038",
    {
      "drive": true
    }
  ],
  [
    "N_038",
    "N_039",
    {
      "drive": true
    }
  ],
  [
    "N_039",
    "N_040",
    {
      "drive": true
    }
  ],
  [
    "N_040",
    "N_041",
    {
      "drive": true
    }
  ],
  [
    "N_041",
    "N_042",
    {
      "drive": true
    }
  ],
  [
    "N_042",
    "N_043",
    {
      "drive": true
    }
  ],
  [
    "N_043",
    "N_044",
    {
      "drive": true
    }
  ],
  [
    "N_044",
    "N_045",
    {
      "drive": true
    }
  ],
  [
    "N_045",
    "N_046",
    {
      "drive": true
    }
  ],
  [
    "N_046",
    "N_047",
    {
      "drive": true
    }
  ],
  [
    "N_047",
    "N_027",
    {
      "drive": true
    }
  ],
  [
    "N_025",
    "N_048",
    {
      "drive": true
    }
  ],
  [
    "N_048",
    "N_049",
    {
      "drive": true
    }
  ],
  [
    "N_050",
    "N_051",
    {
      "drive": true
    }
  ],
  [
    "N_051",
    "N_052",
    {
      "drive": true
    }
  ],
  [
    "N_052",
    "N_053",
    {
      "drive": true
    }
  ],
  [
    "N_053",
    "N_054",
    {
      "drive": true
    }
  ],
  [
    "N_054",
    "N_055",
    {
      "drive": true
    }
  ],
  [
    "N_055",
    "N_056",
    {
      "drive": true
    }
  ],
  [
    "N_056",
    "N_057",
    {
      "drive": true
    }
  ],
  [
    "N_057",
    "N_058",
    {
      "drive": true
    }
  ],
  [
    "N_058",
    "N_059",
    {
      "drive": true
    }
  ],
  [
    "N_059",
    "N_060",
    {
      "drive": true
    }
  ],
  [
    "N_060",
    "N_061",
    {
      "drive": true
    }
  ],
  [
    "N_061",
    "N_062",
    {
      "drive": true
    }
  ],
  [
    "N_062",
    "N_063",
    {
      "drive": true
    }
  ],
  [
    "N_063",
    "N_064",
    {
      "drive": true
    }
  ],
  [
    "N_064",
    "N_065",
    {
      "drive": true
    }
  ],
  [
    "N_065",
    "N_066",
    {
      "drive": true
    }
  ],
  [
    "N_066",
    "N_067",
    {
      "drive": true
    }
  ],
  [
    "N_067",
    "N_068",
    {
      "drive": true
    }
  ],
  [
    "N_068",
    "N_069",
    {
      "drive": true
    }
  ],
  [
    "N_069",
    "N_070",
    {
      "drive": true
    }
  ],
  [
    "N_071",
    "N_072",
    {
      "drive": true
    }
  ],
  [
    "N_072",
    "N_073",
    {
      "drive": true
    }
  ],
  [
    "N_073",
    "N_074",
    {
      "drive": true
    }
  ],
  [
    "N_074",
    "N_075",
    {
      "drive": true
    }
  ],
  [
    "N_075",
    "N_076",
    {
      "drive": true
    }
  ],
  [
    "N_076",
    "N_077",
    {
      "drive": true
    }
  ],
  [
    "N_077",
    "N_078",
    {
      "drive": true
    }
  ],
  [
    "N_078",
    "N_079",
    {
      "drive": true
    }
  ],
  [
    "N_079",
    "N_080",
    {
      "drive": true
    }
  ],
  [
    "N_080",
    "N_081",
    {
      "drive": true
    }
  ],
  [
    "N_081",
    "N_082",
    {
      "drive": true
    }
  ],
  [
    "N_082",
    "N_083",
    {
      "drive": true
    }
  ],
  [
    "N_083",
    "N_084",
    {
      "drive": true
    }
  ],
  [
    "N_084",
    "N_085",
    {
      "drive": true
    }
  ],
  [
    "N_085",
    "N_063",
    {
      "drive": true
    }
  ],
  [
    "N_050",
    "N_086",
    {
      "drive": true
    }
  ],
  [
    "N_086",
    "N_087",
    {
      "drive": true
    }
  ],
  [
    "N_087",
    "N_088",
    {
      "drive": true
    }
  ],
  [
    "N_088",
    "N_005",
    {
      "drive": true
    }
  ],
  [
    "N_019",
    "N_089",
    {
      "drive": true
    }
  ],
  [
    "N_089",
    "N_090",
    {
      "drive": true
    }
  ],
  [
    "N_090",
    "N_091",
    {
      "drive": true
    }
  ],
  [
    "N_091",
    "N_092",
    {
      "drive": true
    }
  ],
  [
    "N_092",
    "N_093",
    {
      "drive": true
    }
  ],
  [
    "N_093",
    "N_094",
    {
      "drive": true
    }
  ],
  [
    "N_094",
    "N_095",
    {
      "drive": true
    }
  ],
  [
    "N_095",
    "N_096",
    {
      "drive": true
    }
  ],
  [
    "N_097",
    "N_098",
    {
      "drive": true
    }
  ],
  [
    "N_098",
    "N_002",
    {
      "drive": true
    }
  ],
  [
    "N_002",
    "N_099",
    {
      "drive": true
    }
  ],
  [
    "N_099",
    "N_100",
    {
      "drive": true
    }
  ],
  [
    "N_100",
    "N_101",
    {
      "drive": true
    }
  ],
  [
    "N_101",
    "N_102",
    {
      "drive": true
    }
  ],
  [
    "N_102",
    "N_103",
    {
      "drive": true
    }
  ],
  [
    "N_103",
    "N_104",
    {
      "drive": true
    }
  ],
  [
    "N_104",
    "N_105",
    {
      "drive": true
    }
  ],
  [
    "N_105",
    "N_106",
    {
      "drive": true
    }
  ],
  [
    "N_106",
    "N_107",
    {
      "drive": true
    }
  ],
  [
    "N_107",
    "N_108",
    {
      "drive": true
    }
  ],
  [
    "N_108",
    "N_109",
    {
      "drive": true
    }
  ],
  [
    "N_109",
    "N_046",
    {
      "drive": true
    }
  ],
  [
    "N_045",
    "N_110",
    {
      "drive": true
    }
  ],
  [
    "N_110",
    "N_111",
    {
      "drive": true
    }
  ],
  [
    "N_111",
    "N_112",
    {
      "drive": true
    }
  ],
  [
    "N_112",
    "N_113",
    {
      "drive": true
    }
  ],
  [
    "N_113",
    "N_114",
    {
      "drive": true
    }
  ],
  [
    "N_114",
    "N_115",
    {
      "drive": true
    }
  ],
  [
    "N_115",
    "N_116",
    {
      "drive": true
    }
  ],
  [
    "N_116",
    "N_117",
    {
      "drive": true
    }
  ],
  [
    "N_117",
    "N_118",
    {
      "drive": true
    }
  ],
  [
    "N_118",
    "N_119",
    {
      "drive": true
    }
  ],
  [
    "N_119",
    "N_120",
    {
      "drive": true
    }
  ],
  [
    "N_120",
    "N_121",
    {
      "drive": true
    }
  ],
  [
    "N_121",
    "N_122",
    {
      "drive": true
    }
  ],
  [
    "N_122",
    "N_123",
    {
      "drive": true
    }
  ],
  [
    "N_123",
    "N_124",
    {
      "drive": true
    }
  ],
  [
    "N_124",
    "N_044",
    {
      "drive": true
    }
  ],
  [
    "N_043",
    "N_125",
    {
      "drive": true
    }
  ],
  [
    "N_040",
    "N_126",
    {
      "drive": true
    }
  ],
  [
    "N_126",
    "N_127",
    {
      "drive": true
    }
  ],
  [
    "N_127",
    "N_128",
    {
      "drive": true
    }
  ],
  [
    "N_128",
    "N_129",
    {
      "drive": true
    }
  ],
  [
    "N_129",
    "N_130",
    {
      "drive": true
    }
  ],
  [
    "N_130",
    "N_131",
    {
      "drive": true
    }
  ],
  [
    "N_131",
    "N_132",
    {
      "drive": true
    }
  ],
  [
    "N_132",
    "N_133",
    {
      "drive": true
    }
  ],
  [
    "N_133",
    "N_134",
    {
      "drive": true
    }
  ],
  [
    "N_134",
    "N_135",
    {
      "drive": true
    }
  ],
  [
    "N_135",
    "N_136",
    {
      "drive": true
    }
  ],
  [
    "N_136",
    "N_137",
    {
      "drive": true
    }
  ],
  [
    "N_137",
    "N_138",
    {
      "drive": true
    }
  ],
  [
    "N_138",
    "N_139",
    {
      "drive": true
    }
  ],
  [
    "N_139",
    "N_140",
    {
      "drive": true
    }
  ],
  [
    "N_140",
    "N_141",
    {
      "drive": true
    }
  ],
  [
    "N_141",
    "N_142",
    {
      "drive": true
    }
  ],
  [
    "N_142",
    "N_143",
    {
      "drive": true
    }
  ],
  [
    "N_143",
    "N_144",
    {
      "drive": true
    }
  ],
  [
    "N_144",
    "N_145",
    {
      "drive": true
    }
  ],
  [
    "N_145",
    "N_146",
    {
      "drive": true
    }
  ],
  [
    "N_146",
    "N_147",
    {
      "drive": true
    }
  ],
  [
    "N_147",
    "N_148",
    {
      "drive": true
    }
  ],
  [
    "N_148",
    "N_149",
    {
      "drive": true
    }
  ],
  [
    "N_149",
    "N_150",
    {
      "drive": true
    }
  ],
  [
    "N_150",
    "N_151",
    {
      "drive": true
    }
  ],
  [
    "N_151",
    "N_152",
    {
      "drive": true
    }
  ],
  [
    "N_152",
    "N_153",
    {
      "drive": true
    }
  ],
  [
    "N_153",
    "N_149",
    {
      "drive": true
    }
  ],
  [
    "N_142",
    "N_154",
    {
      "drive": true
    }
  ],
  [
    "N_154",
    "N_155",
    {
      "drive": true
    }
  ],
  [
    "N_155",
    "N_156",
    {
      "drive": true
    }
  ],
  [
    "N_155",
    "N_127",
    {
      "drive": true
    }
  ],
  [
    "N_126",
    "N_157",
    {
      "drive": true
    }
  ],
  [
    "N_157",
    "N_158",
    {
      "drive": true
    }
  ],
  [
    "N_158",
    "N_159",
    {
      "drive": true
    }
  ],
  [
    "N_159",
    "N_160",
    {
      "drive": true
    }
  ],
  [
    "N_160",
    "N_161",
    {
      "drive": true
    }
  ],
  [
    "N_161",
    "N_162",
    {
      "drive": true
    }
  ],
  [
    "N_162",
    "N_163",
    {
      "drive": true
    }
  ],
  [
    "N_163",
    "N_164",
    {
      "drive": true
    }
  ],
  [
    "N_164",
    "N_165",
    {
      "drive": true
    }
  ],
  [
    "N_165",
    "N_166",
    {
      "drive": true
    }
  ],
  [
    "N_165",
    "N_167",
    {
      "drive": true
    }
  ],
  [
    "N_167",
    "N_168",
    {
      "drive": true
    }
  ],
  [
    "N_168",
    "N_169",
    {
      "drive": true
    }
  ],
  [
    "N_169",
    "N_170",
    {
      "drive": true
    }
  ],
  [
    "N_170",
    "N_171",
    {
      "drive": true
    }
  ],
  [
    "N_171",
    "N_172",
    {
      "drive": true
    }
  ],
  [
    "N_172",
    "N_173",
    {
      "drive": true
    }
  ],
  [
    "N_173",
    "N_174",
    {
      "drive": true
    }
  ],
  [
    "N_168",
    "N_175",
    {
      "drive": true
    }
  ],
  [
    "N_175",
    "N_176",
    {
      "drive": true
    }
  ],
  [
    "N_175",
    "N_177",
    {
      "drive": true
    }
  ],
  [
    "N_177",
    "N_178",
    {
      "drive": true
    }
  ],
  [
    "N_178",
    "N_179",
    {
      "drive": true
    }
  ],
  [
    "N_179",
    "N_180",
    {
      "drive": true
    }
  ],
  [
    "N_180",
    "N_181",
    {
      "drive": true
    }
  ],
  [
    "N_181",
    "N_182",
    {
      "drive": true
    }
  ],
  [
    "N_181",
    "N_183",
    {
      "drive": true
    }
  ],
  [
    "N_183",
    "N_170",
    {
      "drive": true
    }
  ],
  [
    "N_170",
    "N_184",
    {
      "drive": true
    }
  ],
  [
    "N_184",
    "N_185",
    {
      "drive": true
    }
  ],
  [
    "N_185",
    "N_186",
    {
      "drive": true
    }
  ],
  [
    "N_186",
    "N_187",
    {
      "drive": true
    }
  ],
  [
    "N_187",
    "N_188",
    {
      "drive": true
    }
  ],
  [
    "N_188",
    "N_189",
    {
      "drive": true
    }
  ],
  [
    "N_189",
    "N_190",
    {
      "drive": true
    }
  ],
  [
    "N_190",
    "N_191",
    {
      "drive": true
    }
  ],
  [
    "N_191",
    "N_192",
    {
      "drive": true
    }
  ],
  [
    "N_192",
    "N_193",
    {
      "drive": true
    }
  ],
  [
    "N_184",
    "N_194",
    {
      "drive": true
    }
  ],
  [
    "N_194",
    "N_195",
    {
      "drive": true
    }
  ],
  [
    "N_194",
    "N_196",
    {
      "drive": true
    }
  ],
  [
    "N_196",
    "N_197",
    {
      "drive": true
    }
  ],
  [
    "N_197",
    "N_198",
    {
      "drive": true
    }
  ],
  [
    "N_198",
    "N_199",
    {
      "drive": true
    }
  ],
  [
    "N_199",
    "N_200",
    {
      "drive": true
    }
  ],
  [
    "N_200",
    "N_201",
    {
      "drive": true
    }
  ],
  [
    "N_201",
    "N_202",
    {
      "drive": true
    }
  ],
  [
    "N_202",
    "N_203",
    {
      "drive": true
    }
  ],
  [
    "N_203",
    "N_204",
    {
      "drive": true
    }
  ],
  [
    "N_204",
    "N_205",
    {
      "drive": true
    }
  ],
  [
    "N_205",
    "N_206",
    {
      "drive": true
    }
  ],
  [
    "N_206",
    "N_207",
    {
      "drive": true
    }
  ],
  [
    "N_207",
    "N_208",
    {
      "drive": true
    }
  ],
  [
    "N_208",
    "N_209",
    {
      "drive": true
    }
  ],
  [
    "N_209",
    "N_210",
    {
      "drive": true
    }
  ],
  [
    "N_210",
    "N_211",
    {
      "drive": true
    }
  ],
  [
    "N_211",
    "N_212",
    {
      "drive": true
    }
  ],
  [
    "N_196",
    "N_213",
    {
      "drive": true
    }
  ],
  [
    "N_213",
    "N_214",
    {
      "drive": true
    }
  ],
  [
    "N_214",
    "N_215",
    {
      "drive": true
    }
  ],
  [
    "N_215",
    "N_216",
    {
      "drive": true
    }
  ],
  [
    "N_216",
    "N_217",
    {
      "drive": true
    }
  ],
  [
    "N_217",
    "N_218",
    {
      "drive": true
    }
  ],
  [
    "N_217",
    "N_219",
    {
      "drive": true
    }
  ],
  [
    "N_219",
    "N_220",
    {
      "drive": true
    }
  ],
  [
    "N_219",
    "N_221",
    {
      "drive": true
    }
  ],
  [
    "N_221",
    "N_222",
    {
      "drive": true
    }
  ],
  [
    "N_222",
    "N_223",
    {
      "drive": true
    }
  ],
  [
    "N_223",
    "N_224",
    {
      "drive": true
    }
  ],
  [
    "N_224",
    "N_225",
    {
      "drive": true
    }
  ],
  [
    "N_222",
    "N_226",
    {
      "drive": true
    }
  ],
  [
    "N_226",
    "N_227",
    {
      "drive": true
    }
  ],
  [
    "N_227",
    "N_228",
    {
      "drive": true
    }
  ],
  [
    "N_228",
    "N_229",
    {
      "drive": true
    }
  ],
  [
    "N_229",
    "N_230",
    {
      "drive": true
    }
  ],
  [
    "N_230",
    "N_231",
    {
      "drive": true
    }
  ],
  [
    "N_231",
    "N_232",
    {
      "drive": true
    }
  ],
  [
    "N_232",
    "N_233",
    {
      "drive": true
    }
  ],
  [
    "N_233",
    "N_234",
    {
      "drive": true
    }
  ],
  [
    "N_234",
    "N_235",
    {
      "drive": true
    }
  ],
  [
    "N_235",
    "N_236",
    {
      "drive": true
    }
  ],
  [
    "N_236",
    "N_237",
    {
      "drive": true
    }
  ],
  [
    "N_237",
    "N_238",
    {
      "drive": true
    }
  ],
  [
    "N_238",
    "N_239",
    {
      "drive": true
    }
  ],
  [
    "N_239",
    "N_240",
    {
      "drive": true
    }
  ],
  [
    "N_240",
    "N_208",
    {
      "drive": true
    }
  ],
  [
    "N_216",
    "N_241",
    {
      "drive": true
    }
  ],
  [
    "N_241",
    "N_242",
    {
      "drive": true
    }
  ],
  [
    "N_242",
    "N_243",
    {
      "drive": true
    }
  ],
  [
    "N_243",
    "N_244",
    {
      "drive": true
    }
  ],
  [
    "N_244",
    "N_245",
    {
      "drive": true
    }
  ],
  [
    "N_245",
    "N_246",
    {
      "drive": true
    }
  ],
  [
    "N_246",
    "N_247",
    {
      "drive": true
    }
  ],
  [
    "N_247",
    "N_248",
    {
      "drive": true
    }
  ],
  [
    "N_248",
    "N_249",
    {
      "drive": true
    }
  ],
  [
    "N_249",
    "N_250",
    {
      "drive": true
    }
  ],
  [
    "N_249",
    "N_178",
    {
      "drive": true
    }
  ],
  [
    "N_177",
    "N_251",
    {
      "drive": true
    }
  ],
  [
    "N_251",
    "N_252",
    {
      "drive": true
    }
  ],
  [
    "N_252",
    "N_253",
    {
      "drive": true
    }
  ],
  [
    "N_253",
    "N_254",
    {
      "drive": true
    }
  ],
  [
    "N_254",
    "N_255",
    {
      "drive": true
    }
  ],
  [
    "N_255",
    "N_256",
    {
      "drive": true
    }
  ],
  [
    "N_256",
    "N_257",
    {
      "drive": true
    }
  ],
  [
    "N_257",
    "N_258",
    {
      "drive": true
    }
  ],
  [
    "N_258",
    "N_259",
    {
      "drive": true
    }
  ],
  [
    "N_259",
    "N_260",
    {
      "drive": true
    }
  ],
  [
    "N_260",
    "N_261",
    {
      "drive": true
    }
  ],
  [
    "N_261",
    "N_262",
    {
      "drive": true
    }
  ],
  [
    "N_262",
    "N_038",
    {
      "drive": true
    }
  ],
  [
    "N_037",
    "N_263",
    {
      "drive": true
    }
  ],
  [
    "N_263",
    "N_264",
    {
      "drive": true
    }
  ],
  [
    "N_264",
    "N_265",
    {
      "drive": true
    }
  ],
  [
    "N_265",
    "N_266",
    {
      "drive": true
    }
  ],
  [
    "N_266",
    "N_267",
    {
      "drive": true
    }
  ],
  [
    "N_267",
    "N_268",
    {
      "drive": true
    }
  ],
  [
    "N_268",
    "N_269",
    {
      "drive": true
    }
  ],
  [
    "N_269",
    "N_270",
    {
      "drive": true
    }
  ],
  [
    "N_270",
    "N_271",
    {
      "drive": true
    }
  ],
  [
    "N_271",
    "N_272",
    {
      "drive": true
    }
  ],
  [
    "N_040",
    "N_273",
    {
      "drive": true
    }
  ],
  [
    "N_000",
    "N_274",
    {
      "drive": true
    }
  ],
  [
    "N_275",
    "N_276",
    {
      "drive": true
    }
  ],
  [
    "N_276",
    "N_277",
    {
      "drive": true
    }
  ],
  [
    "N_277",
    "N_278",
    {
      "drive": true
    }
  ],
  [
    "N_278",
    "N_279",
    {
      "drive": true
    }
  ],
  [
    "N_279",
    "N_280",
    {
      "drive": true
    }
  ],
  [
    "N_280",
    "N_281",
    {
      "drive": true
    }
  ],
  [
    "N_281",
    "N_282",
    {
      "drive": true
    }
  ],
  [
    "N_282",
    "N_283",
    {
      "drive": true
    }
  ],
  [
    "N_283",
    "N_284",
    {
      "drive": true
    }
  ],
  [
    "N_284",
    "N_285",
    {
      "drive": true
    }
  ],
  [
    "N_285",
    "N_286",
    {
      "drive": true
    }
  ],
  [
    "N_286",
    "N_287",
    {
      "drive": true
    }
  ],
  [
    "N_287",
    "N_288",
    {
      "drive": true
    }
  ],
  [
    "N_288",
    "N_289",
    {
      "drive": true
    }
  ],
  [
    "N_289",
    "N_290",
    {
      "drive": true
    }
  ],
  [
    "N_290",
    "N_291",
    {
      "drive": true
    }
  ],
  [
    "N_291",
    "N_292",
    {
      "drive": true
    }
  ],
  [
    "N_292",
    "N_293",
    {
      "drive": true
    }
  ],
  [
    "N_293",
    "N_294",
    {
      "drive": true
    }
  ],
  [
    "N_294",
    "N_295",
    {
      "drive": true
    }
  ],
  [
    "N_295",
    "N_296",
    {
      "drive": true
    }
  ],
  [
    "N_296",
    "N_297",
    {
      "drive": true
    }
  ],
  [
    "N_297",
    "N_298",
    {
      "drive": true
    }
  ],
  [
    "N_298",
    "N_299",
    {
      "drive": true
    }
  ],
  [
    "N_299",
    "N_300",
    {
      "drive": true
    }
  ],
  [
    "N_300",
    "N_301",
    {
      "drive": true
    }
  ],
  [
    "N_301",
    "N_302",
    {
      "drive": true
    }
  ],
  [
    "N_302",
    "N_303",
    {
      "drive": true
    }
  ],
  [
    "N_303",
    "N_304",
    {
      "drive": true
    }
  ],
  [
    "N_304",
    "N_305",
    {
      "drive": true
    }
  ],
  [
    "N_305",
    "N_306",
    {
      "drive": true
    }
  ],
  [
    "N_306",
    "N_307",
    {
      "drive": true
    }
  ],
  [
    "N_307",
    "N_308",
    {
      "drive": true
    }
  ],
  [
    "N_308",
    "N_309",
    {
      "drive": true
    }
  ],
  [
    "N_309",
    "N_310",
    {
      "drive": true
    }
  ],
  [
    "N_310",
    "N_311",
    {
      "drive": true
    }
  ],
  [
    "N_311",
    "N_312",
    {
      "drive": true
    }
  ],
  [
    "N_312",
    "N_313",
    {
      "drive": true
    }
  ],
  [
    "N_313",
    "N_314",
    {
      "drive": true
    }
  ],
  [
    "N_314",
    "N_315",
    {
      "drive": true
    }
  ],
  [
    "N_315",
    "N_316",
    {
      "drive": true
    }
  ],
  [
    "N_316",
    "N_317",
    {
      "drive": true
    }
  ],
  [
    "N_317",
    "N_318",
    {
      "drive": true
    }
  ],
  [
    "N_318",
    "N_319",
    {
      "drive": true
    }
  ],
  [
    "N_319",
    "N_283",
    {
      "drive": true
    }
  ],
  [
    "N_285",
    "N_320",
    {
      "drive": true
    }
  ]
];

  // ── Building connections auto-calculated by proximity to KML road tracks ──
  const BUILDING_CONNECTIONS = {
  "building_admin": [
    "N_280",
    "N_281"
  ],
  "main-gate": [
    "N_320",
    "N_000"
  ],
  "cafeteria": [
    "N_070",
    "N_069"
  ],
  "auditorium": [
    "N_073",
    "N_074"
  ],
  "building_01": [
    "N_049",
    "N_048"
  ],
  "civil_amtola": [
    "N_131",
    "N_133"
  ],
  "building_04": [
    "N_140",
    "N_137"
  ],
  "department_of_eee__electrical_and_electronic_engineering___rajshahi_university_of_engineering___technology__ruet_": [
    "N_032",
    "N_031"
  ],
  "department_of_urp__ruet": [
    "N_128",
    "N_142"
  ],
  "department_of_becm__ruet": [
    "N_128"
  ],
  "building_03": [
    "N_116",
    "N_115"
  ],
  "building_me": [
    "N_125"
  ],
  "library": [
    "N_273"
  ],
  "zia-hall": [
    "N_156",
    "N_155"
  ],
  "guesthouse": [
    "N_271",
    "N_270"
  ],
  "central-field": [
    "N_255",
    "N_256"
  ],
  "sahidul-hall": [
    "N_166"
  ],
  "courts": [
    "N_175",
    "N_252"
  ],
  "selim-hall": [
    "N_174",
    "N_173"
  ],
  "mosque": [
    "N_181",
    "N_180"
  ],
  "rh-gate": [
    "N_205",
    "N_206"
  ],
  "teachers-quarter": [
    "N_218"
  ],
  "new-hall": [
    "N_197",
    "N_213"
  ],
  "quarter-playground": [
    "N_225"
  ],
  "building_05": [
    "N_140",
    "N_153"
  ],
  "building_becm": [
    "N_147",
    "N_148"
  ],
  "pocket-gate": [
    "N_149",
    "N_148"
  ],
  "atm": [
    "N_284",
    "N_285"
  ],
  "shaheed-minar": [
    "N_064",
    "N_065"
  ],
  "rag-wall": [
    "N_078",
    "N_081"
  ],
  "bus-stand": [
    "N_000",
    "N_274"
  ]
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
