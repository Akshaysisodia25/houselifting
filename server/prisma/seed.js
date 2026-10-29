import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting TDBD Engineering Database Seed ---');

  // 1. Seed Administrator
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Chief Engineer Sushil Sisodia';

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in server/.env for admin seeding');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: 'SUPERADMIN',
    },
  });
  console.log(`[SEED] Admin created/updated: ${admin.email}`);

  // 2. Seed Services
  const services = [
    {
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
      title: 'Building Lifting',
      slug: 'building-lifting',
      shortDescription: 'Multi-Storey & Heavy RCC Complexes',
      description: 'Engineered high-tonnage lifting systems designed specifically for multi-storey residential complexes, apartment blocks, schools, and reinforced concrete structures.',
      imageUrl: '/images/slider_photo2.jpg',
      icon: 'Building2',
      featured: true,
      specs: {
        capacity: '1,000 to 5,000+ Tons',
        elevation: '2.0 Ft to 7.0+ Ft',
        duration: '35 – 55 Working Days',
        idealFor: 'Multi-storey flats, hospitals, and heavy framed buildings'
      },
      features: [
        'Rigorous pre-lift structural weight and center-of-mass engineering calculations',
        'Heavy-duty synchronized hydraulic jacks interconnected with pressure manifolds',
        'Continuous laser level and electronic dial gauge deflection monitoring',
        'Preserves internal electrical conduits, plumbing shafts, and RCC columns'
      ]
    },
    {
      title: 'House Shifting',
      slug: 'house-shifting',
      shortDescription: 'Horizontal Structural Relocation',
      description: 'Specialized controlled horizontal relocation of intact residential and commercial buildings across plot boundaries to meet road widening or master plan realignment needs.',
      imageUrl: '/images/slider_photo3.jpg',
      icon: 'MoveRight',
      featured: true,
      specs: {
        capacity: 'Structures up to 3 Storeys',
        distance: '10 Ft to 100+ Ft Horizontally',
        duration: '30 – 50 Working Days',
        idealFor: 'Properties affected by highway widening or plot setbacks'
      },
      features: [
        'Heavy-duty low-friction rolled steel roller beam track assemblies',
        'Directional hydraulic thrust jacks equipped with mechanical safety brakes',
        'Completely eliminates the need to demolish when land acquisition occurs',
        'Smooth relocation to a newly cast reinforced foundation on the same parcel'
      ]
    },
    {
      title: 'Commercial Building Lifting',
      slug: 'commercial-building-lifting',
      shortDescription: 'Showrooms, Plazas & Institutional Assets',
      description: 'High-precision structural elevation tailored for commercial retail showrooms, plazas, warehouses, and institutional premises affected by roadway height escalation.',
      imageUrl: '/images/slider_photo4.jpg',
      icon: 'Store',
      featured: true,
      specs: {
        capacity: 'Large Span Commercial Floors',
        elevation: '2.0 Ft to 5.0+ Ft',
        duration: '30 – 45 Working Days',
        idealFor: 'Showrooms, shopping complexes, and commercial hubs'
      },
      features: [
        'Engineered to minimize commercial downtime and business revenue loss',
        'Custom load-bearing steel beam lattice assemblies for expansive column spans',
        'Accommodates modern storefront glass heights and heavy inventory floors',
        'Full compliance with municipal structural codes and commercial safety standards'
      ]
    },
    {
      title: 'Level Correction & Underpinning',
      slug: 'level-correction-underpinning',
      shortDescription: 'Rectifying Tilted & Settled Structures',
      description: 'Scientific realignment and releveling of structures experiencing differential foundation settlement, ground sinking, or structural tilt due to subsoil shifting.',
      imageUrl: '/images/house_lifting_1.jpg',
      icon: 'SlidersHorizontal',
      featured: false,
      specs: {
        capacity: 'Precision Hydraulic Calibration',
        alignment: 'Sub-millimeter Axis Realignment',
        duration: '20 – 30 Working Days',
        idealFor: 'Tilted buildings, uneven settlement, and sinking plinth lines'
      },
      features: [
        'Geotechnical inspection and load bearing verification of underlying strata',
        'Differential jacking rates calibrated to gently reverse structural tilt',
        'Eliminates progressive wall shear fractures and floor slope discrepancies',
        'Underpinning with high-grade RCC footings and pressure grouting'
      ]
    },
    {
      title: 'Stilt Parking & Basement Creation',
      slug: 'stilt-parking-basement-creation',
      shortDescription: 'Urban Space Optimization',
      description: 'Raising an entire building by 7 to 9 feet to insert dedicated stilt car parking or ground-floor storage spaces directly beneath existing residential and commercial properties.',
      imageUrl: '/images/house_lifting_2.jpg',
      icon: 'Maximize2',
      featured: false,
      specs: {
        capacity: 'Single & Multi-Storey Homes',
        elevation: '7.0 Ft to 9.5 Ft High Lift',
        duration: '40 – 60 Working Days',
        idealFor: 'Urban homes with severe street parking congestion'
      },
      features: [
        'Adds high-value covered car parking without acquiring additional costly land',
        'Casts reinforced RCC columns and grade beams directly beneath the raised structure',
        'Massive property valuation and rental income enhancement',
        'Ideal solution for congested urban residential colonies across Delhi NCR & India'
      ]
    }
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`[SEED] ${services.length} Services created/updated.`);

  // 3. Seed Projects
  const projects = [
    {
      title: 'Residential Double-Storey House Elevation',
      slug: 'residential-double-storey-elevation-yamunanagar',
      category: 'House Lifting',
      location: 'Yamunanagar, Haryana',
      liftHeight: '3.5 Feet Elevation',
      description: 'Complete non-destructive elevation of a 280-ton double-storey brick residential home sunken 3 feet below newly elevated state highway.',
      problem: 'Sunken 3 feet below newly elevated state highway, suffering annual monsoon water inundation and sewage reverse flow.',
      solution: 'Installed 120 synchronized hydraulic jacks with cross-sectional steel girder grid. Lifted 3.5 ft and built a high-grade reinforced brick plinth.',
      imageUrl: '/images/slider_photo.jpg',
      beforeImageUrl: '/images/house_lifting_12.jpg',
      afterImageUrl: '/images/slider_photo.jpg',
      featured: true,
      specs: {
        load: '280 Tons Dead Weight',
        jacks: '120 Synchronized Hydraulic Jacks',
        duration: '28 Working Days',
        result: '100% Flood & Road Clearance'
      }
    },
    {
      title: 'Multi-Storey RCC Commercial & Residential Building Lift',
      slug: 'multi-storey-rcc-commercial-residential-lift',
      category: 'Building Lifting',
      location: 'Ambala, Haryana',
      liftHeight: '4.0 Feet Elevation',
      description: 'Lifting of a 3-storey framed RCC residential and commercial structure affected by repetitive municipal asphalt road layering.',
      problem: 'Repeated municipal asphalt road layering over 15 years left ground-floor shops completely submerged during moderate rain.',
      solution: 'Fabricated heavy-duty needle beam assemblies through concrete columns; lifted 4 feet safely with centralized hydraulic controls.',
      imageUrl: '/images/slider_photo2.jpg',
      beforeImageUrl: '/images/house_lifting_1.jpg',
      afterImageUrl: '/images/slider_photo2.jpg',
      featured: true,
      specs: {
        load: '650 Tons RCC Structure',
        jacks: '210 Synchronized Cylinders',
        duration: '42 Working Days',
        result: 'Reclaimed Ground Floor Commercial Utility'
      }
    },
    {
      title: 'Historic Bungalow Heritage Preservation Lift',
      slug: 'historic-bungalow-heritage-preservation-lift',
      category: 'House Lifting',
      location: 'Patiala, Punjab',
      liftHeight: '3.0 Feet Elevation',
      description: 'Gentle phased elevation over 24 days, preserving antique wooden doorframes, heritage tile floors, and roofing intact.',
      problem: 'Sunken courtyard causing severe dampness in traditional load-bearing brick masonry with precious antique timber.',
      solution: 'Gentle phased elevation over 24 days, preserving antique wooden doorframes, heritage tile floors, and roofing intact.',
      imageUrl: '/images/slider_photo3.jpg',
      beforeImageUrl: '/images/house_lifting_3.jpg',
      afterImageUrl: '/images/slider_photo3.jpg',
      featured: true,
      specs: {
        load: '320 Tons Heritage Masonry',
        jacks: '135 Micro-Controlled Jacks',
        duration: '24 Working Days',
        result: '100% Heritage Preservation with Zero Cracks'
      }
    },
    {
      title: 'Commercial Complex Street Clearance Lift',
      slug: 'commercial-complex-street-clearance-lift',
      category: 'Commercial',
      location: 'Panipat, Haryana',
      liftHeight: '4.5 Feet Elevation',
      description: 'Raised the commercial front and expanded basement depth, completely resolving street drainage backflow.',
      problem: 'Showroom floor below street drain level; zero customer footfall during rain due to filthy water ponding.',
      solution: 'Raised the commercial front and expanded basement depth, completely resolving street drainage backflow.',
      imageUrl: '/images/slider_photo4.jpg',
      beforeImageUrl: '/images/house_lifting_4.jpg',
      afterImageUrl: '/images/slider_photo4.jpg',
      featured: true,
      specs: {
        load: '450 Tons Retail Structure',
        jacks: '140 Calibrated Jacks',
        duration: '35 Working Days',
        result: 'Complete Drainage Gravity Flow'
      }
    },
    {
      title: 'Residential Villa Elevation Against Flooding',
      slug: 'residential-villa-elevation-against-flooding-kerala',
      category: 'House Lifting',
      location: 'Alappuzha, Kerala',
      liftHeight: '4.0 Feet Elevation',
      description: 'Deployment of specialized coastal foundation underpinning and 4-foot uniform hydraulic raise above high flood mark.',
      problem: 'Low-lying coastal backwater basin subject to heavy monsoon inundation and rising canal levels.',
      solution: 'Deployment of specialized coastal foundation underpinning and 4-foot uniform hydraulic raise above high flood mark.',
      imageUrl: '/images/house_lifting_3.jpg',
      beforeImageUrl: '/images/house_lifting_5.jpg',
      afterImageUrl: '/images/house_lifting_3.jpg',
      featured: false,
      specs: {
        load: 'Coastal Ground Conditions',
        jacks: '110 Coastal Underpinning Jacks',
        duration: '32 Working Days',
        result: 'Elevated Above High Water Mark'
      }
    },
    {
      title: 'Multi-Family Residence Foundation Raising',
      slug: 'multi-family-residence-foundation-raising-punjab',
      category: 'Building Lifting',
      location: 'Ludhiana, Punjab',
      liftHeight: '3.5 Feet Elevation',
      description: 'Elevated structure to align flush with modern driveway, casting new reinforced plinth beams.',
      problem: 'Municipal road elevation rendered ground floor completely unusable, trapping parked vehicles inside.',
      solution: 'Elevated structure to align flush with modern driveway, casting new reinforced plinth beams.',
      imageUrl: '/images/house_lifting_7.jpg',
      beforeImageUrl: '/images/house_lifting_6.jpg',
      afterImageUrl: '/images/house_lifting_7.jpg',
      featured: false,
      specs: {
        load: '3-Storey Residential',
        jacks: '160 Coordinated Jacks',
        duration: '38 Working Days',
        result: 'Driveway Flush Alignment'
      }
    },
    {
      title: 'Controlled House Relocation & Setback Alignment',
      slug: 'controlled-house-relocation-setback-alignment',
      category: 'House Shifting',
      location: 'Kurukshetra, Haryana',
      liftHeight: 'Shifted 28 Feet Horizontally',
      description: 'Mounted building on heavy steel track rollers and shifted entire home 28 feet backward safely.',
      problem: 'Municipal master plan road widening required demolition of front porch and front 20 feet of the home.',
      solution: 'Mounted building on heavy steel track rollers and shifted entire home 28 feet backward safely.',
      imageUrl: '/images/house_lifting_10.jpg',
      beforeImageUrl: '/images/house_lifting_9.jpg',
      afterImageUrl: '/images/house_lifting_10.jpg',
      featured: true,
      specs: {
        load: '220 Tons Brick House',
        distance: '28 Feet Horizontal Relocation',
        duration: '30 Working Days',
        result: 'Saved Home from Road Demolition'
      }
    },
    {
      title: 'Ground Floor Elevation for Stilt Parking',
      slug: 'ground-floor-elevation-for-stilt-parking-delhi-ncr',
      category: 'Commercial',
      location: 'Delhi NCR',
      liftHeight: '7.5 Feet Elevation',
      description: 'Raised ground floor by 7.5 feet and installed RCC support columns, creating parking for 4 vehicles.',
      problem: 'Severe residential colony parking crunch; no off-street parking available for resident vehicles.',
      solution: 'Raised ground floor by 7.5 feet and installed RCC support columns, creating parking for 4 vehicles.',
      imageUrl: '/images/house_lifting_12.jpg',
      beforeImageUrl: '/images/house_lifting_11.jpg',
      afterImageUrl: '/images/house_lifting_12.jpg',
      featured: false,
      specs: {
        load: 'Raised 7.5 Feet High',
        columns: 'Reinforced RCC Stilt Columns',
        duration: '48 Working Days',
        result: 'Created 4-Car Covered Stilt Parking'
      }
    }
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`[SEED] ${projects.length} Projects created/updated.`);

  // 4. Seed Gallery Images
  const galleryItems = [
    { title: 'Heavy Hydraulic House Elevation in Action', imageUrl: '/images/slider_photo.jpg', category: 'Lifting', description: 'Synchronized multi-cylinder lifting operation.' },
    { title: 'Multi-Storey Complex Load Transfer Beams', imageUrl: '/images/slider_photo2.jpg', category: 'Commercial', description: 'Cross-grid rolled steel I-beam needle lattice.' },
    { title: 'Hydraulic Jack System Underpinning Setup', imageUrl: '/images/slider_photo3.jpg', category: 'Equipment', description: 'Calibrated 50-ton hydraulic cylinders seated on steel plates.' },
    { title: 'Masonry Wall Needle Beam Installation', imageUrl: '/images/slider_photo4.jpg', category: 'Process', description: 'Precision pocket needling through foundation brickwork.' },
    { title: 'House Elevated 3 Feet Above Street Level', imageUrl: '/images/house_lifting_1.jpg', category: 'Lifting', description: 'Elevation complete ready for plinth masonry infill.' },
    { title: 'Steel I-Beam Lattice Grid Network', imageUrl: '/images/house_lifting_2.jpg', category: 'Equipment', description: 'Primary and secondary structural steel grid.' },
    { title: 'Continuous Mechanical Cribbing Support', imageUrl: '/images/house_lifting_3.jpg', category: 'Safety', description: 'Hardwood and steel physical locking fail-safe.' },
    { title: 'Residential Villa Synchronized Raising', imageUrl: '/images/house_lifting_4.jpg', category: 'Lifting', description: 'Uniform elevation without damage to interior finishes.' },
    { title: 'Perimeter Jack Distribution Along Plinth', imageUrl: '/images/house_lifting_5.jpg', category: 'Equipment', description: 'Evenly distributed load centers along external walls.' },
    { title: 'Underpinning Brickwork Construction', imageUrl: '/images/house_lifting_6.jpg', category: 'Process', description: 'High-strength masonry plinth tied with mortar.' },
    { title: 'Two-Storey House Foundation Realignment', imageUrl: '/images/house_lifting_7.jpg', category: 'Lifting', description: 'Laser guided level alignment.' },
    { title: 'Precision Dial Gauge Structural Monitoring', imageUrl: '/images/house_lifting_8.jpg', category: 'Safety', description: 'Continuous deflection telemetry to prevent structural stress.' },
    { title: 'Controlled Horizontal Track Shifting', imageUrl: '/images/house_lifting_9.jpg', category: 'Shifting', description: 'Low-friction roller track assemblies.' },
    { title: 'Elevated Building Ready for Plinth Infill', imageUrl: '/images/house_lifting_10.jpg', category: 'Process', description: 'Building seated firmly above maximum flood line.' },
    { title: 'Stilt Car Parking Clearance Project', imageUrl: '/images/house_lifting_11.jpg', category: 'Commercial', description: 'Raised to 8 feet for 4-car covered parking.' },
    { title: 'Final Level Verification & Load Release', imageUrl: '/images/house_lifting_12.jpg', category: 'Lifting', description: 'Controlled de-jacking onto permanent foundation.' }
  ];

  await prisma.galleryImage.deleteMany();
  for (const g of galleryItems) {
    await prisma.galleryImage.create({ data: g });
  }
  console.log(`[SEED] ${galleryItems.length} Gallery Images created.`);

  // 5. Seed Testimonials
  const testimonials = [
    {
      name: 'Residential Client (Verified Property Owner)',
      location: 'Yamunanagar, Haryana',
      content: 'They are really amazing to watch and they really do know their job!! How often do you see people working together without yelling at one another — in fact, all I heard was singing and smooth teamwork! They saved our home from severe monsoon flooding without a single crack on the wall.',
      rating: 5,
      imageUrl: null,
      approved: true,
      outcome: 'Saved ₹18 Lakhs vs Demolition',
      projectType: 'House Lifting (3.5 Feet Elevation)'
    },
    {
      name: 'Coastal Residential Client',
      location: 'Kerala Project Site',
      content: 'Our home sat 4 feet below the newly paved highway. Every monsoon, sewer overflow and rainwater destroyed our ground floor. TDBD lifted our entire double-storey house safely above road level. By choosing this scientific method, we saved lakhs of rupees compared to demolition.',
      rating: 5,
      imageUrl: null,
      approved: true,
      outcome: '100% Gravity Drainage Restored',
      projectType: 'Flood Prevention Raising (4.0 Feet)'
    },
    {
      name: 'Heritage Property Custodian',
      location: 'Patiala, Punjab',
      content: 'Rebuilding involves a massive amount of money, time, and emotional pain. We were attached to our ancestral house and refused to demolish it. TDBD\'s team handled the jacks and steel beams with precision. Highly professional, time-bound, and safe execution.',
      rating: 5,
      imageUrl: null,
      approved: true,
      outcome: 'Ancestral Architecture Preserved',
      projectType: 'Heritage Structure Elevation (3.0 Feet)'
    },
    {
      name: 'Commercial Complex Owner',
      location: 'Panipat, Haryana',
      content: 'The road was raised twice in 15 years, leaving our commercial showroom in a ditch. TDBD elevated our building by over 4 feet within a few weeks. Our business was back in operation with zero downtime headaches compared to full rebuilding.',
      rating: 5,
      imageUrl: null,
      approved: true,
      outcome: 'Zero Commercial Disruption',
      projectType: 'Commercial Building Lifting (4.5 Feet)'
    }
  ];

  await prisma.testimonial.deleteMany();
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`[SEED] ${testimonials.length} Testimonials created.`);

  // 6. Seed FAQs
  const faqs = [
    {
      question: 'Is house lifting completely safe for the existing building?',
      answer: 'Yes, when executed using calibrated hydraulic systems, steel load-distribution needles, and synchronized pressure manifolds. The lifting pressure is uniformly distributed across multiple calculated load points so no individual wall or beam undergoes differential tension stress.',
      category: 'Safety',
      published: true
    },
    {
      question: 'How much height can a house or building be lifted?',
      answer: 'Most residential and commercial properties are lifted between 2 to 6 feet to clear elevated roads and eliminate rainwater backflow. However, structures can be lifted 7 to 9.5 feet if the property owner requires covered stilt car parking beneath the ground floor.',
      category: 'Feasibility',
      published: true
    },
    {
      question: 'How does lifting compare to demolishing and rebuilding?',
      answer: 'House lifting typically costs only 20% to 30% of what demolition and new construction would cost, saving homeowners 70% to 80% of their capital. Furthermore, lifting takes only 25 to 45 working days compared to 12 to 18 months for rebuilding.',
      category: 'Cost',
      published: true
    },
    {
      question: 'Do we need to empty or vacate all household goods?',
      answer: 'Heavy furniture, valuables, and breakable items should be safely packed or relocated to upper floors. In many single and multi-storey lifts, homeowners do not need to completely empty the building, as the lift is non-vibrational and smooth.',
      category: 'Process',
      published: true
    },
    {
      question: 'What happens to the existing foundation after the house is lifted?',
      answer: 'Once the building reaches the required target level, our masonry and RCC civil engineering teams construct a brand-new, reinforced concrete foundation, tie beams, and high-strength brick piers directly beneath the elevated structure.',
      category: 'Engineering',
      published: true
    },
    {
      question: 'Can multi-storey and commercial framed RCC structures be lifted?',
      answer: 'Yes. TDBD Engineering Works specializes in lifting single-storey, double-storey, and multi-storey RCC frame buildings, retail complexes, and schools using high-tonnage synchronized hydraulic cylinders.',
      category: 'Commercial',
      published: true
    },
    {
      question: 'What happens to internal plumbing and electrical lines during the lift?',
      answer: 'Plumbing supply, drainage pipes, and main electrical connections are temporarily disconnected during the active vertical lifting phase and reconnected/extended with flexible or permanent couplers once the final elevation is reached.',
      category: 'Process',
      published: true
    },
    {
      question: 'Does house lifting cause cracks on walls or floors?',
      answer: 'With our synchronized multi-point hydraulic technology, hairline stress fractures are virtually non-existent. Because all jacks advance at the exact same millimeter stroke under continuous deflection monitoring, the building moves as a monolithic unit.',
      category: 'Safety',
      published: true
    },
    {
      question: 'How do I know if my building is suitable for lifting?',
      answer: 'Our senior structural engineers perform a preliminary site inspection to examine soil conditions, wall thicknesses, foundation depth, and street height differential before providing a formal technical feasibility report.',
      category: 'Feasibility',
      published: true
    }
  ];

  await prisma.fAQ.deleteMany();
  for (const f of faqs) {
    await prisma.fAQ.create({ data: f });
  }
  console.log(`[SEED] ${faqs.length} FAQs created.`);

  // 7. Seed Sample Enquiry
  const sampleEnquiry = await prisma.enquiry.create({
    data: {
      name: 'Ramesh Verma',
      phone: '+91 98765 43210',
      email: 'ramesh.verma@example.com',
      city: 'Yamunanagar, Haryana',
      service: 'House Lifting',
      message: 'Need to elevate 2-storey house by 3.5 feet because highway level was raised recently.',
      status: 'NEW',
    },
  });
  console.log(`[SEED] Sample enquiry created (ID: ${sampleEnquiry.id}).`);

  console.log('--- Database Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

