// Initial realistic mock data for SmartWaste platform

export const SAMPLE_IMAGES = {
  plastic: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
  dumpster: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
  construction: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
  organic: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
  mixed: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
  cleaned: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
  cleanedPark: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80"
};

export const INITIAL_VEHICLES = [
  {
    id: "SW-TRUCK-01",
    name: "Fleet Heavy Compactor #01",
    type: "Heavy Compactor Truck",
    driverName: "Rajesh Kumar",
    driverPhone: "+91 98765 43210",
    driverEmail: "rajesh.driver@fleet.gov.in",
    capacityKg: 8000,
    currentLoadKg: 3400,
    status: "on_route", // available | on_route | loading | maintenance
    location: {
      lat: 28.6180,
      lng: 77.2150,
      address: "Outer Ring Rd, Ward 7"
    },
    assignedTasks: ["SW-2026-1002"],
    fuelEfficiencyKmPerL: 4.2,
    serviceZone: "Central & North Zones",
    rating: 4.9
  },
  {
    id: "SW-COMPACT-02",
    name: "Medium Compactor Unit #02",
    type: "Medium Compactor",
    driverName: "Amit Singh",
    driverPhone: "+91 98111 22334",
    driverEmail: "amit.driver@fleet.gov.in",
    capacityKg: 5000,
    currentLoadKg: 1200,
    status: "available",
    location: {
      lat: 28.6250,
      lng: 77.2220,
      address: "Civil Lines Municipal Yard"
    },
    assignedTasks: [],
    fuelEfficiencyKmPerL: 5.5,
    serviceZone: "East & Central Zones",
    rating: 4.8
  },
  {
    id: "SW-TIPPER-03",
    name: "Heavy Tipper (Debris) #03",
    type: "Tipper Truck",
    driverName: "Vikram Rathore",
    driverPhone: "+91 97222 33445",
    driverEmail: "vikram.driver@fleet.gov.in",
    capacityKg: 10000,
    currentLoadKg: 7800,
    status: "loading",
    location: {
      lat: 28.6090,
      lng: 77.1980,
      address: "Industrial Ward Depot"
    },
    assignedTasks: ["SW-2026-1004"],
    fuelEfficiencyKmPerL: 3.6,
    serviceZone: "West & Industrial Zones",
    rating: 4.7
  },
  {
    id: "SW-EV-04",
    name: "Electric Eco-Van #04",
    type: "Electric Van",
    driverName: "Sunil Verma",
    driverPhone: "+91 96333 44556",
    driverEmail: "sunil.driver@fleet.gov.in",
    capacityKg: 1500,
    currentLoadKg: 400,
    status: "available",
    location: {
      lat: 28.6320,
      lng: 77.2110,
      address: "Connaught Green Station"
    },
    assignedTasks: [],
    fuelEfficiencyKmPerL: 9.8,
    serviceZone: "Commercial High Streets",
    rating: 4.95
  }
];

export const INITIAL_REPORTS = [
  {
    id: "SW-2026-1001",
    title: "Massive Commercial Plastic Dumping at Market Corner",
    category: "plastic",
    description: "Plastic packaging, single-use bags, and styrofoam accumulated behind Market Gate 4. Blocking pedestrian pathway.",
    imageUrl: SAMPLE_IMAGES.plastic,
    afterImageUrl: null,
    location: {
      lat: 28.6285,
      lng: 77.2185,
      address: "Behind Market Gate 4, Sector 18 Commercial Complex",
      ward: "Ward 7 - Civil Lines"
    },
    status: "verified",
    priority: "critical",
    priorityScore: 92,
    priorityReason: "Critical: High WQI (88/100) due to 4.2m3 non-biodegradable plastic blocking active commercial corridor. 3 recurring reports in 14 days.",
    wqi: {
      total: 88,
      volumeScore: 36,
      areaScore: 23,
      hazardScore: 16,
      recurrenceScore: 13,
      severityLevel: "Critical",
      estimatedVolumeM3: 4.2,
      estimatedAreaM2: 14.5,
      aiConfidence: 96.4,
      recommendedVehicle: "Heavy Compactor Truck",
      urgency: "Immediate Dispatch (Within 2 Hours)"
    },
    duplicateInfo: {
      isDuplicate: false,
      parentReportId: null,
      corroborationCount: 4,
      linkedReports: ["SW-2026-1001-A", "SW-2026-1001-B", "SW-2026-1001-C"]
    },
    assignedVehicleId: null,
    assignedDriverName: null,
    citizenId: "CIT-8821",
    citizenName: "Priya Sharma",
    citizenEmail: "priya.sharma@example.com",
    createdAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(), actor: "Citizen (Priya Sharma)", note: "Report lodged with geocoded photograph" },
      { status: "verified", timestamp: new Date(Date.now() - 2.8 * 3600 * 1000).toISOString(), actor: "Admin (Director Verma)", note: "Verified priority as Critical. WQI 88 confirmed." }
    ]
  },
  {
    id: "SW-2026-1002",
    title: "Overflowing Mixed Garbage Dump near Hospital Alley",
    category: "mixed",
    description: "Rotting food waste, discarded cardboard and mixed litter spilling onto road. Attracting stray animals.",
    imageUrl: SAMPLE_IMAGES.dumpster,
    afterImageUrl: null,
    location: {
      lat: 28.6195,
      lng: 77.2120,
      address: "Lane 2, Adjacent to City General Hospital, Ward 12",
      ward: "Ward 12 - South Ridge"
    },
    status: "on_the_way",
    priority: "high",
    priorityScore: 79,
    priorityReason: "High Priority: Organic decay & bio-hazard proximity near healthcare entrance. WQI 74/100.",
    wqi: {
      total: 74,
      volumeScore: 31,
      areaScore: 19,
      hazardScore: 14,
      recurrenceScore: 10,
      severityLevel: "High",
      estimatedVolumeM3: 2.9,
      estimatedAreaM2: 9.0,
      aiConfidence: 93.8,
      recommendedVehicle: "Heavy Compactor Truck",
      urgency: "Collect within 4 Hours"
    },
    duplicateInfo: {
      isDuplicate: false,
      parentReportId: null,
      corroborationCount: 2,
      linkedReports: ["SW-2026-1002-A"]
    },
    assignedVehicleId: "SW-TRUCK-01",
    assignedDriverName: "Rajesh Kumar",
    citizenId: "CIT-8821",
    citizenName: "Priya Sharma",
    citizenEmail: "priya.sharma@example.com",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), actor: "Citizen (Priya Sharma)", note: "Report submitted" },
      { status: "verified", timestamp: new Date(Date.now() - 4.2 * 3600 * 1000).toISOString(), actor: "Admin (Director Verma)", note: "Priority evaluated to High (79/100)" },
      { status: "assigned", timestamp: new Date(Date.now() - 3.1 * 3600 * 1000).toISOString(), actor: "Admin Dispatch", note: "Assigned to Fleet Compactor #01" },
      { status: "on_the_way", timestamp: new Date(Date.now() - 0.6 * 3600 * 1000).toISOString(), actor: "Driver (Rajesh Kumar)", note: "Departed depot, ETA 15 mins" }
    ]
  },
  {
    id: "SW-2026-1003",
    title: "Illegal Concrete & Demolition Waste on Vacant Plot",
    category: "construction",
    description: "Cement blocks, broken bricks, and tile fragments dumped overnight next to school boundary wall.",
    imageUrl: SAMPLE_IMAGES.construction,
    afterImageUrl: null,
    location: {
      lat: 28.6080,
      lng: 77.2280,
      address: "Plot 44, Near Kendriya Vidyalaya, Ward 4",
      ward: "Ward 4 - East Extension"
    },
    status: "pending",
    priority: "high",
    priorityScore: 71,
    priorityReason: "High Priority: Heavy construction debris (6.5 tons estimated) near school perimeter. Requires Tipper Truck.",
    wqi: {
      total: 71,
      volumeScore: 33,
      areaScore: 18,
      hazardScore: 12,
      recurrenceScore: 8,
      severityLevel: "High",
      estimatedVolumeM3: 5.8,
      estimatedAreaM2: 12.0,
      aiConfidence: 95.1,
      recommendedVehicle: "Tipper Truck",
      urgency: "Scheduled today"
    },
    duplicateInfo: {
      isDuplicate: false,
      parentReportId: null,
      corroborationCount: 1,
      linkedReports: []
    },
    assignedVehicleId: null,
    assignedDriverName: null,
    citizenId: "CIT-5519",
    citizenName: "Anil Khurana",
    citizenEmail: "anil.k@gmail.com",
    createdAt: new Date(Date.now() - 1.2 * 3600 * 1000).toISOString(),
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 1.2 * 3600 * 1000).toISOString(), actor: "Citizen (Anil Khurana)", note: "Reported with photos" }
    ]
  },
  {
    id: "SW-2026-1004",
    title: "Organic Vegetable Market Waste Accumulation",
    category: "organic",
    description: "Discarded rotten vegetables and wet organic waste near Subzi Mandi gate 2. Mild odor.",
    imageUrl: SAMPLE_IMAGES.organic,
    afterImageUrl: null,
    location: {
      lat: 28.6140,
      lng: 77.2020,
      address: "Wholesale Mandi Gate 2, Ring Road",
      ward: "Ward 15 - West Hub"
    },
    status: "assigned",
    priority: "medium",
    priorityScore: 54,
    priorityReason: "Medium Priority: Biodegradable wet waste. WQI 51/100. Rapid decomposition risk during warm daytime.",
    wqi: {
      total: 51,
      volumeScore: 22,
      areaScore: 14,
      hazardScore: 8,
      recurrenceScore: 7,
      severityLevel: "Medium",
      estimatedVolumeM3: 1.8,
      estimatedAreaM2: 6.2,
      aiConfidence: 91.2,
      recommendedVehicle: "Medium Compactor",
      urgency: "Routine Daily Clearance"
    },
    duplicateInfo: {
      isDuplicate: false,
      parentReportId: null,
      corroborationCount: 1,
      linkedReports: []
    },
    assignedVehicleId: "SW-TIPPER-03",
    assignedDriverName: "Vikram Rathore",
    citizenId: "CIT-3302",
    citizenName: "Ritu Nambiar",
    citizenEmail: "ritu.n@example.com",
    createdAt: new Date(Date.now() - 6.5 * 3600 * 1000).toISOString(),
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 6.5 * 3600 * 1000).toISOString(), actor: "Citizen (Ritu Nambiar)", note: "Report submitted" },
      { status: "verified", timestamp: new Date(Date.now() - 5.1 * 3600 * 1000).toISOString(), actor: "Admin (Director Verma)", note: "Approved assignment" },
      { status: "assigned", timestamp: new Date(Date.now() - 4.0 * 3600 * 1000).toISOString(), actor: "Admin Dispatch", note: "Assigned to Fleet Tipper #03" }
    ]
  },
  {
    id: "SW-2026-1005",
    title: "Cleaned Public Promenade & Park Walkway",
    category: "mixed",
    description: "Successfully cleared road intersection after citizen complaint. 2.4 tons removed.",
    imageUrl: SAMPLE_IMAGES.mixed,
    afterImageUrl: SAMPLE_IMAGES.cleaned,
    location: {
      lat: 28.6220,
      lng: 77.2190,
      address: "Sector 14 Central Circle, Ward 7",
      ward: "Ward 7 - Civil Lines"
    },
    status: "resolved",
    priority: "medium",
    priorityScore: 48,
    priorityReason: "Successfully Resolved. Verified before/after photographic proof on record.",
    wqi: {
      total: 48,
      volumeScore: 20,
      areaScore: 12,
      hazardScore: 9,
      recurrenceScore: 7,
      severityLevel: "Medium",
      estimatedVolumeM3: 1.5,
      estimatedAreaM2: 5.0,
      aiConfidence: 94.0,
      recommendedVehicle: "Medium Compactor",
      urgency: "Resolved"
    },
    duplicateInfo: {
      isDuplicate: false,
      parentReportId: null,
      corroborationCount: 2,
      linkedReports: []
    },
    assignedVehicleId: "SW-TRUCK-01",
    assignedDriverName: "Rajesh Kumar",
    citizenId: "CIT-8821",
    citizenName: "Priya Sharma",
    citizenEmail: "priya.sharma@example.com",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), actor: "Citizen (Priya Sharma)", note: "Report filed" },
      { status: "verified", timestamp: new Date(Date.now() - 22 * 3600 * 1000).toISOString(), actor: "Admin", note: "Verified" },
      { status: "assigned", timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), actor: "Dispatch", note: "Assigned to Truck #01" },
      { status: "on_the_way", timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), actor: "Driver (Rajesh Kumar)", note: "En route" },
      { status: "arrived", timestamp: new Date(Date.now() - 17.5 * 3600 * 1000).toISOString(), actor: "Driver (Rajesh Kumar)", note: "Arrived at location" },
      { status: "collected", timestamp: new Date(Date.now() - 16.8 * 3600 * 1000).toISOString(), actor: "Driver (Rajesh Kumar)", note: "Waste collected. After-cleaning photo submitted." },
      { status: "resolved", timestamp: new Date(Date.now() - 16.0 * 3600 * 1000).toISOString(), actor: "Admin (Director Verma)", note: "Photographic proof verified. +50 Citizen points awarded." }
    ]
  },
  {
    id: "SW-2026-1006",
    title: "Light Leaf Litter & Dry Garden Prunings",
    category: "organic",
    description: "Dry leaves and lawn clippings piled beside community garden path.",
    imageUrl: SAMPLE_IMAGES.cleanedPark,
    afterImageUrl: null,
    location: {
      lat: 28.6360,
      lng: 77.2140,
      address: "Nehru Park West Gate, Ward 2",
      ward: "Ward 2 - Parkside"
    },
    status: "pending",
    priority: "low",
    priorityScore: 24,
    priorityReason: "Low Priority: Dry horticultural waste, negligible bio-hazard. WQI 21/100.",
    wqi: {
      total: 21,
      volumeScore: 8,
      areaScore: 6,
      hazardScore: 4,
      recurrenceScore: 3,
      severityLevel: "Low",
      estimatedVolumeM3: 0.8,
      estimatedAreaM2: 3.5,
      aiConfidence: 89.5,
      recommendedVehicle: "Electric Van",
      urgency: "Standard 48-Hour Pickup"
    },
    duplicateInfo: {
      isDuplicate: false,
      parentReportId: null,
      corroborationCount: 1,
      linkedReports: []
    },
    assignedVehicleId: null,
    assignedDriverName: null,
    citizenId: "CIT-9011",
    citizenName: "Sanjay Mehta",
    citizenEmail: "sanjay.m@outlook.com",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), actor: "Citizen (Sanjay Mehta)", note: "Report submitted" }
    ]
  }
];

export const CITIZEN_LEADERBOARD = [
  { rank: 1, name: "Priya Sharma", email: "priya.sharma@example.com", ward: "Ward 7", points: 420, verifiedReports: 9, badge: "Eco Champion" },
  { rank: 2, name: "Anil Khurana", email: "anil.k@gmail.com", ward: "Ward 4", points: 310, verifiedReports: 6, badge: "Green Guardian" },
  { rank: 3, name: "Dr. Meenakshi Iyer", email: "m.iyer@health.org", ward: "Ward 12", points: 280, verifiedReports: 5, badge: "Civic Hero" },
  { rank: 4, name: "Ritu Nambiar", email: "ritu.n@example.com", ward: "Ward 15", points: 240, verifiedReports: 4, badge: "Clean Streets Scout" },
  { rank: 5, name: "Sanjay Mehta", email: "sanjay.m@outlook.com", ward: "Ward 2", points: 190, verifiedReports: 3, badge: "Community Scout" }
];

export const WARD_STATISTICS = [
  { ward: "Ward 7 - Civil Lines", totalReports: 24, resolved: 21, pending: 3, avgResolutionHours: 3.2, cleanRank: 1, score: 94 },
  { ward: "Ward 2 - Parkside", totalReports: 18, resolved: 16, pending: 2, avgResolutionHours: 4.1, cleanRank: 2, score: 91 },
  { ward: "Ward 12 - South Ridge", totalReports: 32, resolved: 27, pending: 5, avgResolutionHours: 5.4, cleanRank: 3, score: 86 },
  { ward: "Ward 4 - East Extension", totalReports: 29, resolved: 23, pending: 6, avgResolutionHours: 6.0, cleanRank: 4, score: 82 },
  { ward: "Ward 15 - West Hub", totalReports: 45, resolved: 34, pending: 11, avgResolutionHours: 7.8, cleanRank: 5, score: 76 }
];

export const CLEANUP_EVENTS = [
  {
    id: "EVT-101",
    title: "Yamuna Riverfront Clean-Up Drive",
    date: "This Saturday, 7:00 AM",
    location: "Kashmiri Gate Ghat Section",
    volunteersCount: 48,
    maxSlots: 60,
    tags: ["Plastic Diversion", "Gloves & Kits Provided", "+100 EcoPoints"]
  },
  {
    id: "EVT-102",
    title: "Sector 18 Market Zero-Waste Sunday",
    date: "Sunday, 8:30 AM",
    location: "Commercial Complex Plaza",
    volunteersCount: 32,
    maxSlots: 40,
    tags: ["Segregation Awareness", "Certificates Provided", "+80 EcoPoints"]
  }
];

export const DEMO_USERS = {
  citizen: {
    id: "CIT-8821",
    name: "Priya Sharma",
    role: "citizen",
    email: "priya.sharma@example.com",
    ward: "Ward 7 - Civil Lines",
    points: 420,
    phone: "+91 98101 23456",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  admin: {
    id: "ADM-001",
    name: "Director Rajiv Verma",
    role: "admin",
    email: "rajiv.verma@citywaste.gov.in",
    department: "Municipal Solid Waste Management Directorate",
    designation: "Chief Sanitation Controller",
    phone: "+91 98200 99887",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  },
  driver: {
    id: "DRV-104",
    name: "Rajesh Kumar",
    role: "driver",
    email: "rajesh.driver@fleet.gov.in",
    assignedTruckId: "SW-TRUCK-01",
    vehicleName: "Fleet Heavy Compactor #01",
    licenseNo: "DL-04-2018-0098231",
    phone: "+91 98765 43210",
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }
};
