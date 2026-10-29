import bcrypt from 'bcryptjs';

const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'tdbd_secure_admin_2026';
const defaultAdminHash = bcrypt.hashSync(defaultAdminPassword, 10);

export const fallbackStore = {
  admin: {
    id: 1,
    name: process.env.ADMIN_NAME || 'Chief Engineer Sushil Sisodia',
    email: process.env.ADMIN_EMAIL || 'admin@houselifting.in',
    passwordHash: defaultAdminHash,
    role: 'SUPERADMIN',
    createdAt: new Date().toISOString()
  },
  services: [
    {
      id: 1,
      title: 'House Lifting',
      slug: 'house-lifting',
      shortDescription: 'Residential Structural Elevation',
      description: 'Synchronized hydraulic raising of existing single and double-storey residential houses to required safe heights above municipal road levels without causing structural trauma or cracking.',
      imageUrl: '/images/slider_photo.jpg',
      icon: 'Home',
      featured: true,
      specs: {
        capacity: 'Up to 500+ Tons Dead Weight',
        elevation: '1.0 Ft to 6.0+ Ft',
        duration: '25 – 35 Working Days',
        idealFor: 'Houses sunken below newly paved state/municipal highways'
      },
      features: [
        'Uniform multi-point hydraulic elevation using calibrated steel jacks',
        'Zero requirement to dismantle roof slabs, load-bearing walls, or ceilings',
        'Permanent protection against street stormwater and sewer line backflow',
        'Complete underpinning with high-grade reinforced brickwork and concrete plinth'
      ]
    },
    {
      id: 2,
      title: 'Building Lifting',
      slug: 'building-lifting',
      shortDescription: 'Multi-Storey & Heavy RCC Complexes',
      description: 'Engineering elevation of commercial plazas, educational buildings, hospital wings, and multi-storey apartment blocks with computer-monitored hydraulic manifold clusters.',
      imageUrl: '/images/slider_photo1.jpg',
      icon: 'Building2',
      featured: true,
      specs: {
        capacity: '1,000 – 3,500+ Tons Dead Load',
        elevation: 'Up to 5.5 Ft',
        duration: '40 – 60 Days',
        idealFor: 'Commercial complexes, retail shops, multi-level RCC structures'
      },
      features: [
        'Manifold-controlled distributed hydraulic jacking matrix',
        'Preservation of architectural facade and interior finishes',
        'Foundation retrofitting with continuous RCC grade beams',
        'Complete regulatory engineering sign-off and safety audit'
      ]
    },
    {
      id: 3,
      title: 'House Shifting & Relocation',
      slug: 'house-shifting',
      shortDescription: 'Horizontal Structural Movement',
      description: 'Precise horizontal shifting of entire constructed buildings across distances from 10 feet up to 250+ feet to clear road widening alignments or optimize boundary plots.',
      imageUrl: '/images/slider_photo2.jpg',
      icon: 'MoveHorizontal',
      featured: true,
      specs: {
        capacity: 'Full 1 to 3 Storey Houses',
        shiftDistance: '10 to 250+ Feet',
        trackSystem: 'Heavy-Duty Calibrated Steel Roller Tracks',
        idealFor: 'Properties impacted by highway widening, bypass corridors, or setback disputes'
      },
      features: [
        'Precision rail track beam installation beneath ground beams',
        'Hydraulic push-pull rams with millimeter positioning control',
        '100% preservation of plumbing channels and internal partitions',
        'Re-anchoring onto pre-cast engineered foundation piles'
      ]
    },
    {
      id: 4,
      title: 'Commercial Structural Shifting',
      slug: 'commercial-structural-shifting',
      shortDescription: 'Industrial & Institutional Relocation',
      description: 'Engineered relocation of heavy commercial structures, warehouses, factory bays, and heritage monuments without demolition or business interruption.',
      imageUrl: '/images/slider_photo3.jpg',
      icon: 'Factory',
      featured: false,
      specs: {
        capacity: 'Heavy Structural Steel & Masonry',
        equipment: 'Multi-Directional Roller Skates & Sync Rams',
        duration: 'Site Survey Dependent',
        idealFor: 'Factories, institutional halls, retail complexes'
      },
      features: [
        'Detailed finite element structural load analysis prior to movement',
        'Modular rail guides with automatic hydraulic leveling',
        'Zero structural downtime or costly total demolition',
        'Insurance-backed structural integrity warranty'
      ]
    },
    {
      id: 5,
      title: 'Foundation Underpinning & Strengthening',
      slug: 'foundation-underpinning',
      shortDescription: 'Sub-Structure Reinforcement',
      description: 'Deep foundation reinforcement, micro-piling, and RCC beam insertion beneath sinking or stressed footings to permanently stabilize compromised structures.',
      imageUrl: '/images/slider_photo4.jpg',
      icon: 'ShieldCheck',
      featured: false,
      specs: {
        technique: 'Continuous Mass Concrete & Needle Beams',
        depthExtension: 'Up to 12 Feet Additional Depth',
        duration: '15 – 25 Days',
        idealFor: 'Settling foundations, weak sub-soil, foundation cracking'
      },
      features: [
        'Excavation in controlled sequential pin bays',
        'Insertion of high-tensile steel needle support girders',
        'High-early-strength structural grade concrete pour',
        'Elimination of future differential settlement risk'
      ]
    },
    {
      id: 6,
      title: 'Basement Excavation Under Existing Building',
      slug: 'basement-excavation',
      shortDescription: 'Sub-Grade Space Creation',
      description: 'Excavation and construction of brand new basement levels directly beneath existing operational buildings while securely suspended on engineered steel shoring towers.',
      imageUrl: '/images/slider_photo.jpg',
      icon: 'Layers',
      featured: false,
      specs: {
        depth: '8 to 12 Ft Clear Headroom',
        shoring: 'Heavy Steel Crib Towers & Braced Struts',
        duration: '45 – 65 Days',
        idealFor: 'Adding parking, storage, or commercial retail floor space'
      },
      features: [
        'Temporary hydraulic load transfer to heavy steel towers',
        'Excavation using compact specialized machinery',
        'Waterproofed RCC retaining walls and floor raft slab',
        'Massive increase in property usable area and market valuation'
      ]
    }
  ],
  projects: [
    {
      id: 1,
      title: '2-Storey Residential House Lifting — 4.5 Ft Elevation',
      slug: 'residential-lifting-yamunanagar',
      location: 'Yamunanagar, Haryana',
      category: 'House Lifting',
      imageUrl: '/images/slider_photo.jpg',
      beforeImageUrl: '/images/slider_photo4.jpg',
      afterImageUrl: '/images/slider_photo.jpg',
      liftHeight: '4.5 Feet',
      featured: true,
      description: 'Sunken 2-storey brick-masonry home plagued by knee-deep monsoon waterlogging following state highway elevation. Lifted uniformly 4.5 feet above street datum and reinforced with a new monolithic RCC beam.',
      problem: 'Repeated monsoon flooding with 2.5 ft sewer water entering living areas each year.',
      solution: 'Deployed 140 calibrated synchronized screw jacks, raised structure 4.5 feet, reinforced foundation with M25 concrete beam.',
      specs: {
        area: '2,400 Sq Ft',
        deadWeight: '380 Tons',
        elevationHeight: '4.5 Feet',
        duration: '32 Working Days',
        equipment: '140 Heavy-Duty Synchronized Mechanical Jacks'
      }
    },
    {
      id: 2,
      title: 'Commercial Complex Elevation — 3-Storey Retail Arcade',
      slug: 'commercial-lifting-panipat',
      location: 'Panipat, Haryana',
      category: 'Building Lifting',
      imageUrl: '/images/slider_photo1.jpg',
      beforeImageUrl: '/images/slider_photo3.jpg',
      afterImageUrl: '/images/slider_photo1.jpg',
      liftHeight: '3.8 Feet',
      featured: true,
      description: '3-storey commercial shopping complex lifted 3.8 feet after municipal road repaving left storefronts 3 feet below street grade. Ground-floor showrooms remained completely intact.',
      problem: 'Ground-floor shops lost footfall and suffered recurrent drain overflow following new flyover approach road.',
      solution: 'Engineered multi-point unified hydraulic jacking grid raising 1,800 tons dead weight with zero masonry fracture.',
      specs: {
        area: '5,200 Sq Ft',
        deadWeight: '1,850 Tons',
        elevationHeight: '3.8 Feet',
        duration: '48 Working Days',
        equipment: '320 Hydraulic Jack Matrix with Central Manifold Control'
      }
    },
    {
      id: 3,
      title: 'Highway Widening Relocation — 85 Ft Horizontal Shift',
      slug: 'house-shifting-karnal',
      location: 'Karnal, Haryana',
      category: 'House Shifting',
      imageUrl: '/images/slider_photo2.jpg',
      beforeImageUrl: '/images/slider_photo.jpg',
      afterImageUrl: '/images/slider_photo2.jpg',
      liftHeight: '85 Ft Horizontal Shift',
      featured: true,
      description: 'Two-storey ancestral residence slated for government demolition for 4-lane highway expansion. Shifted 85 feet backward into adjacent property on specialized steel roller tracks.',
      problem: 'State highway acquisition line intersected 70% of building footprint. Demolition would cause severe financial and sentimental loss.',
      solution: 'Excavated foundation, inserted grid of heavy I-beams, placed house on hardened steel roller tracks, shifted 85 feet in 18 days.',
      specs: {
        area: '3,100 Sq Ft',
        deadWeight: '520 Tons',
        shiftDistance: '85 Feet Horizontal',
        duration: '38 Working Days',
        equipment: 'Calibrated Steel Track Beams & Hydraulic Push Rams'
      }
    },
    {
      id: 4,
      title: 'Residential Villa Raising Above New Municipal Drain Level',
      slug: 'villa-raising-ludhiana',
      location: 'Ludhiana, Punjab',
      category: 'House Lifting',
      imageUrl: '/images/slider_photo3.jpg',
      beforeImageUrl: '/images/slider_photo1.jpg',
      afterImageUrl: '/images/slider_photo3.jpg',
      liftHeight: '5.0 Feet',
      featured: true,
      description: 'Luxury villa constructed in 2008 left 4 feet below road grade following consecutive asphalt overlays. Elevated 5 feet and anchored to high-grade reinforced concrete grade beams.',
      problem: 'Continuous dampness, foundation efflorescence, and property devaluation due to low plinth level.',
      solution: 'Lifted 5.0 feet using computerized multi-jack synchronization. Fully eliminated rainwater entry risk.',
      specs: {
        area: '3,800 Sq Ft',
        deadWeight: '620 Tons',
        elevationHeight: '5.0 Feet',
        duration: '42 Working Days',
        equipment: '190 Calibrated Jacks & Structural Steel Support Grid'
      }
    },
    {
      id: 5,
      title: 'Institutional School Wing Raising & Foundation Underpinning',
      slug: 'school-building-lifting-meerut',
      location: 'Meerut, Uttar Pradesh',
      category: 'Building Lifting',
      imageUrl: '/images/slider_photo4.jpg',
      beforeImageUrl: '/images/slider_photo2.jpg',
      afterImageUrl: '/images/slider_photo4.jpg',
      liftHeight: '3.2 Feet',
      featured: false,
      description: 'Two-storey institutional academic wing lifted 3.2 feet during summer recess to prevent campus flooding from nearby stormwater canal overflow.',
      problem: 'Campus ground level sunken relative to state highway culvert.',
      solution: 'Synchronous hydraulic elevation carried out in 28 days with zero impact on classroom structural integrity.',
      specs: {
        area: '6,400 Sq Ft',
        deadWeight: '1,400 Tons',
        elevationHeight: '3.2 Feet',
        duration: '28 Working Days',
        equipment: '240 Heavy Hydraulic Jacks'
      }
    },
    {
      id: 6,
      title: 'Corner Plot Property Relocation — 45 Ft Shifting',
      slug: 'house-shifting-jaipur',
      location: 'Jaipur, Rajasthan',
      category: 'House Shifting',
      imageUrl: '/images/slider_photo.jpg',
      beforeImageUrl: '/images/slider_photo3.jpg',
      afterImageUrl: '/images/slider_photo.jpg',
      liftHeight: '45 Ft Horizontal Shift',
      featured: false,
      description: 'Residential property shifted 45 feet back and 12 feet sideways to comply with municipal master plan setback rules without loss of building.',
      problem: 'Municipal setback violation notice threatened partial demolition.',
      solution: 'Dual-axis track shifting system mobilized to reposition building onto approved legal coordinates.',
      specs: {
        area: '2,200 Sq Ft',
        deadWeight: '340 Tons',
        shiftDistance: '45 Ft Back + 12 Ft Lateral',
        duration: '34 Working Days',
        equipment: 'Multi-Directional Roller Skates & Hydraulic Rams'
      }
    },
    {
      id: 7,
      title: 'Dual-Storey Residential House Lifting — 4.0 Ft Elevation',
      slug: 'house-lifting-kerala',
      location: 'Alappuzha, Kerala',
      category: 'House Lifting',
      imageUrl: '/images/slider_photo1.jpg',
      beforeImageUrl: '/images/slider_photo4.jpg',
      afterImageUrl: '/images/slider_photo1.jpg',
      liftHeight: '4.0 Feet',
      featured: false,
      description: 'Coastal home vulnerable to high tide and monsoon canal flooding lifted 4.0 feet on reinforced grade beams.',
      problem: 'Water table rise and tidal backflow inundated ground floor during monsoons.',
      solution: 'Elevated 4 feet with integrated waterproof plinth band construction.',
      specs: {
        area: '2,600 Sq Ft',
        deadWeight: '410 Tons',
        elevationHeight: '4.0 Feet',
        duration: '35 Working Days',
        equipment: '160 Calibrated Mechanical & Hydraulic Jacks'
      }
    },
    {
      id: 8,
      title: 'Industrial Warehouse Ground Sunk Elevation',
      slug: 'warehouse-lifting-gurgaon',
      location: 'Gurugram, Haryana',
      category: 'Commercial Lifting',
      imageUrl: '/images/slider_photo2.jpg',
      beforeImageUrl: '/images/slider_photo.jpg',
      afterImageUrl: '/images/slider_photo2.jpg',
      liftHeight: '3.5 Feet',
      featured: false,
      description: 'Steel-framed storage facility lifted 3.5 feet to restore dock loading ramp heights to standard 1.2m trailer level.',
      problem: 'Dock bay sunken relative to new logistics park concrete access road.',
      solution: 'Structural column base plates elevated with synchronized jack clusters.',
      specs: {
        area: '8,000 Sq Ft',
        deadWeight: '950 Tons',
        elevationHeight: '3.5 Feet',
        duration: '22 Working Days',
        equipment: 'Synchronized Hydraulic Port Jacks'
      }
    }
  ],
  gallery: [
    { id: 1, title: 'Multi-Point Hydraulic Jack Cluster Under Foundation Beam', category: 'Lifting', imageUrl: '/images/slider_photo.jpg', description: 'Calibrated 50-ton mechanical jacks uniformly loaded under primary brick foundation plinth.' },
    { id: 2, title: 'Commercial Plaza Elevation in Progress — Front View', category: 'Lifting', imageUrl: '/images/slider_photo1.jpg', description: '3-storey commercial building raised 3.8 feet with zero glass breakage.' },
    { id: 3, title: 'High-Tensile Steel Track Roller Shifting Grid', category: 'Shifting', imageUrl: '/images/slider_photo2.jpg', description: 'Machined roller assemblies inserted beneath main load-bearing I-beams for horizontal travel.' },
    { id: 4, title: 'Underpinning & New Reinforced Monolithic Plinth Beam', category: 'Underpinning', imageUrl: '/images/slider_photo3.jpg', description: 'Continuous RCC grade beam cast under elevated house before lowering onto final seatings.' },
    { id: 5, title: 'Steel Needle Beam Insertion Phase', category: 'Equipment', imageUrl: '/images/slider_photo4.jpg', description: 'Cross-running heavy steel beams transferring structural loads to lifting cribs.' },
    { id: 6, title: 'Hydraulic Manifold Distribution Control Unit', category: 'Equipment', imageUrl: '/images/slider_photo.jpg', description: 'Centralized hydraulic valve manifold ensuring uniform pressure distribution across jack rows.' },
    { id: 7, title: 'Residential House Shifting — 60 Feet Lateral Travel', category: 'Shifting', imageUrl: '/images/slider_photo1.jpg', description: 'Continuous controlled relocation to expand front roadway clearance.' },
    { id: 8, title: 'Pre-Lift Structural Diagnostic & Precision Leveling Audit', category: 'Engineering', imageUrl: '/images/slider_photo2.jpg', description: 'Laser leveling survey benchmark established prior to any load transfer.' },
    { id: 9, title: 'Sub-Grade Excavation Beneath Suspended Structure', category: 'Underpinning', imageUrl: '/images/slider_photo3.jpg', description: 'Controlled soil excavation beneath building suspended on certified steel crib towers.' },
    { id: 10, title: 'Completed 5-Foot House Elevation — Restored Drainage', category: 'Completed', imageUrl: '/images/slider_photo4.jpg', description: 'Finished elevation with clean masonry underpinning, zero cracks, and full street clearance.' },
    { id: 11, title: 'Precision Heavy-Duty Mechanical Screw Jacks', category: 'Equipment', imageUrl: '/images/slider_photo.jpg', description: 'Individual mechanical locking collars guaranteeing zero slippage even under total power loss.' },
    { id: 12, title: 'Multi-Storey Elevation Plinth Anchoring', category: 'Completed', imageUrl: '/images/slider_photo1.jpg', description: 'Completed commercial project ready for commercial occupancy after full structural sign-off.' }
  ],
  testimonials: [
    {
      id: 1,
      name: 'Dr. R. K. Sharma',
      location: 'Yamunanagar, Haryana',
      content: 'When the municipal road was raised by 3 feet, rainwater entered our ground floor every monsoon. TDBD Engineering lifted our 2-storey house by 4.5 feet with total precision. Not a single tile or plaster crack appeared. Sushil ji and his team are true structural masters.',
      rating: 5,
      imageUrl: '/images/slider_photo.jpg',
      approved: true,
      outcome: 'Lifted 4.5 Feet with Zero Cracks',
      projectType: '2-Storey Residential House'
    },
    {
      id: 2,
      name: 'Er. Satish Verma',
      location: 'Karnal, Haryana',
      content: 'Our ancestral home stood directly in the expansion zone of the highway. Government officials told us demolition was inevitable. TDBD shifted our entire 3,000 sq ft home 85 feet backward into our garden. Outstanding civil engineering execution and complete peace of mind.',
      rating: 5,
      imageUrl: '/images/slider_photo2.jpg',
      approved: true,
      outcome: 'Shifted 85 Feet Backwards',
      projectType: 'Ancestral Brick Residence'
    },
    {
      id: 3,
      name: 'Mohinder Singh Chawla',
      location: 'Panipat, Haryana',
      content: 'We had 6 retail shops on the ground floor facing severe customer drop after road heightening. TDBD lifted the whole 3-storey building by 3.8 feet. Their synchronized hydraulic system is remarkable. Saved us crores compared to rebuilding.',
      rating: 5,
      imageUrl: '/images/slider_photo1.jpg',
      approved: true,
      outcome: 'Commercial Plaza Raised 3.8 Ft',
      projectType: 'Commercial Shopping Complex'
    },
    {
      id: 4,
      name: 'Gurcharan Singh Brar',
      location: 'Ludhiana, Punjab',
      content: 'Professional, disciplined, and strictly adheres to safety protocols. They provided a written legal agreement with full structural safety guarantee before starting. Today our house sits proudly above street level, permanently flood-free.',
      rating: 5,
      imageUrl: '/images/slider_photo3.jpg',
      approved: true,
      outcome: '5.0 Feet Elevation Above Road',
      projectType: 'Independent Luxury Villa'
    }
  ],
  faqs: [
    {
      id: 1,
      question: 'Is it completely safe to lift an existing house? Can walls or slabs crack?',
      answer: 'Yes, it is 100% structurally safe when performed by experienced licensed structural engineers. At TDBD Engineering Works, we distribute the total dead weight across dozens or hundreds of synchronized heavy-duty jacks placed at calculated intervals under all load-bearing walls and RCC columns. The entire structure elevates uniformly in fractions of an inch, preventing differential stress, wall cracks, or slab deflection. We back every project with an official written legal guarantee.',
      category: 'Safety',
      published: true
    },
    {
      id: 2,
      question: 'How much does house lifting cost compared to demolishing and rebuilding?',
      answer: 'House lifting typically costs between 15% and 25% of the total cost of demolition and new construction. For example, rebuilding a 2,000 sq ft house today can easily exceed ₹35–45 Lakhs plus demolition expenses, whereas non-destructive lifting and new foundation underpinning typically ranges from ₹2.5 to ₹6.5 Lakhs depending on size, height, and location. It saves up to 75–85% of your money and months of time.',
      category: 'Cost & Feasibility',
      published: true
    },
    {
      id: 3,
      question: 'How high can a house or building be lifted?',
      answer: 'We routinely lift houses from 1 foot up to 6+ feet above existing grade. Most clients require between 3 to 5 feet of elevation to comfortably overcome newly paved roads and accommodate future road asphalt layers. In commercial applications, higher elevations can be achieved with engineered steel shoring towers.',
      category: 'Technical',
      published: true
    },
    {
      id: 4,
      question: 'Do we have to vacate the house during the lifting work?',
      answer: 'For safety reasons and comfort, we recommend vacating the property during the actual lifting phase (which typically takes 7–15 days). However, furniture and heavy household belongings do not need to be removed from upper floors. Once the structure is elevated and the new foundation walls are securely cured, normal occupancy can resume.',
      category: 'Process',
      published: true
    },
    {
      id: 5,
      question: 'Can houses with old brick foundations or no RCC columns be lifted?',
      answer: 'Yes. In fact, a significant portion of our portfolio includes 30-to-50-year-old load-bearing brick masonry structures built without modern RCC frame columns. We install continuous steel I-beam girders and needle supports beneath the foundation plinth to form a rigid temporary load cradle before initiating the lift.',
      category: 'Technical',
      published: true
    },
    {
      id: 6,
      question: 'How long does a complete house lifting project take from start to finish?',
      answer: 'A standard 1,500–2,500 sq ft residential house lifting project generally takes between 25 and 40 working days. This includes preliminary soil & foundation excavation (7–10 days), hydraulic beam setup (3–5 days), the synchronized lift (5–10 days), and constructing the new reinforced concrete/brick plinth wall and curing (10–15 days).',
      category: 'Process',
      published: true
    },
    {
      id: 7,
      question: 'What happens to internal plumbing, electrical, and drainage connections?',
      answer: 'Before lifting begins, all underground incoming plumbing lines, drain pipes, and utility conduits are safely disconnected. Once the house reaches its final elevated datum and the new foundation is constructed, high-quality flexible or extended PVC/CPVC plumbing and drainage lines are reconnected to the municipal or septic systems at proper downward slope gradients.',
      category: 'Process',
      published: true
    },
    {
      id: 8,
      question: 'Can you shift a house horizontally if it falls in a road widening corridor?',
      answer: 'Yes! TDBD Engineering is a pioneer in India for structural shifting. We can move entire constructed houses 10 feet to over 200 feet horizontally along precision-leveled heavy steel rail tracks using hydraulic push-pull rams. This saves homes from government demolition during highway widening or setback clearances.',
      category: 'Shifting',
      published: true
    },
    {
      id: 9,
      question: 'Do you offer services outside Haryana? Which areas in India do you cover?',
      answer: 'Yes, TDBD Engineering Works executes projects Pan-India. We have successfully completed projects across Haryana, Punjab, Delhi NCR, Uttar Pradesh, Rajasthan, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Maharashtra, and Gujarat. Our mobile engineering crews and specialized equipment travel across the country.',
      category: 'Service Areas',
      published: true
    }
  ],
  enquiries: [
    {
      id: 1,
      name: 'Rameshwar Dayal',
      phone: '+91 98123 45678',
      email: 'rameshwar.d@gmail.com',
      city: 'Yamunanagar, Haryana',
      service: 'House Lifting',
      message: 'Need to lift 2400 sq ft double storey house by 4 feet due to road raising. Urgent survey required.',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

