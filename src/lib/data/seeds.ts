export interface SeedEventBundle {
  event: {
    id: string;
    event_type: 'wedding' | 'birthday' | 'community_event';
    title: string;
    city: string;
    event_date: string;
    guest_count: number;
    total_budget: number;
    currency: string;
    style: string;
    dietary_needs: string[];
    accessibility_needs: string[];
    special_requests: string;
    status: 'draft' | 'planning' | 'confirmed' | 'completed';
    is_demo: boolean;
  };
  budgetItems: Array<{
    category:
      | 'venue'
      | 'catering'
      | 'decor'
      | 'photography'
      | 'entertainment'
      | 'apparel_makeup'
      | 'invitations_favors'
      | 'logistics_permits'
      | 'contingency';
    planned_amount: number;
    actual_amount: number;
    notes: string;
  }>;
  timelineTasks: Array<{
    title: string;
    description: string;
    owner: string;
    due_date: string;
    status: 'todo' | 'in_progress' | 'done' | 'overdue';
    priority: 'low' | 'medium' | 'high' | 'critical';
    is_ai_generated: boolean;
  }>;
  vendors: Array<{
    vendor_type: string;
    name: string;
    contact: string;
    quote_amount: number;
    status: 'shortlisted' | 'contacted' | 'quoted' | 'booked' | 'cancelled';
    booking_deadline: string;
    questions: string[];
    notes: string;
  }>;
  ideas: Array<{
    kind: 'theme' | 'menu' | 'risk' | 'run_sheet' | 'saving_tip';
    content: any;
  }>;
}

export const BENGALURU_DEMO_EVENTS: SeedEventBundle[] = [
  // --------------------------------------------------------------------------
  // 1. Wedding: Ananya & Vikram's Traditional-Meets-Contemporary Kannada Wedding
  // --------------------------------------------------------------------------
  {
    event: {
      id: '11111111-1111-4111-8111-111111111111',
      event_type: 'wedding',
      title: "Ananya & Vikram's Heritage Kannada Wedding",
      city: 'Bengaluru',
      event_date: '2026-11-20',
      guest_count: 350,
      total_budget: 2500000, // ₹25,00,000 INR
      currency: 'INR',
      style: 'Grand Heritage & Contemporary Floral Fusion',
      dietary_needs: [
        'Traditional South Indian Pure Veg (Udupi style)',
        'Strict Jain options',
        'Specialty Mysore Filter Coffee bar',
      ],
      accessibility_needs: [
        'Wheelchair ramp to elevated Mandap',
        'Golf cart buggy for elderly relatives',
        'Step-free dining hall access',
      ],
      special_requests:
        'Early morning Muhurtham at 7:30 AM with traditional Nadaswaram, followed by 24-dish plantain leaf feast. Evening reception with acoustic Kannada fusion band.',
      status: 'planning',
      is_demo: true,
    },
    budgetItems: [
      {
        category: 'venue',
        planned_amount: 750000,
        actual_amount: 750000,
        notes: 'Palace Grounds Kalyana Mantapa (2-day rental with 10 guest rooms & power backup)',
      },
      {
        category: 'catering',
        planned_amount: 625000,
        actual_amount: 600000,
        notes: 'Udupi grand feast (3 meals: Reception dinner, Wedding breakfast, Muhurtham feast for 350 pax)',
      },
      {
        category: 'decor',
        planned_amount: 300000,
        actual_amount: 285000,
        notes: 'Jasmine, marigold and tuberose floral mandap + Brass bell installations and fairy lights',
      },
      {
        category: 'photography',
        planned_amount: 250000,
        actual_amount: 250000,
        notes: 'Studio Memory Lane (2 candid photographers, 2 cinematic video leads, drone coverage)',
      },
      {
        category: 'apparel_makeup',
        planned_amount: 200000,
        actual_amount: 195000,
        notes: 'Pure Kanjivaram silk sarees, Mysore silk dhotis, HD airbrush bridal makeup',
      },
      {
        category: 'entertainment',
        planned_amount: 150000,
        actual_amount: 140000,
        notes: 'Nadaswaram Vidwans for Muhurtham + Swarathma-inspired Kannada indie acoustic band',
      },
      {
        category: 'invitations_favors',
        planned_amount: 50000,
        actual_amount: 45000,
        notes: 'Plantable seed-paper invites + Mysore Sandalwood oil and GI Mysore Pak favor boxes',
      },
      {
        category: 'logistics_permits',
        planned_amount: 50000,
        actual_amount: 42000,
        notes: 'Palace grounds parking permits, generator diesel backup, VIP valet coordinators',
      },
      {
        category: 'contingency',
        planned_amount: 125000,
        actual_amount: 30000,
        notes: 'Emergency reserve for guest spillover, unexpected priest dakshina, and extra sweet boxes',
      },
    ],
    timelineTasks: [
      {
        title: 'Lock Palace Grounds Mantapa & Pay Deposit',
        description: 'Verify 100% DG generator backup, AC plant status, and 100+ car parking.',
        owner: 'Father of Bride & Vikram',
        due_date: '2026-05-24',
        status: 'done',
        priority: 'critical',
        is_ai_generated: false,
      },
      {
        title: 'Book Renowned Udupi Caterer & Finalize 24-Dish Menu',
        description: 'Schedule food tasting with elders; ensure live Obbattu and Filter Coffee counters.',
        owner: 'Ananya & Food Committee',
        due_date: '2026-07-23',
        status: 'done',
        priority: 'high',
        is_ai_generated: false,
      },
      {
        title: 'Confirm Candid Photography & Cinematic Drone Team',
        description: 'Sign contract specifying teaser video within 7 days and full 4K film.',
        owner: 'Vikram',
        due_date: '2026-08-22',
        status: 'done',
        priority: 'high',
        is_ai_generated: false,
      },
      {
        title: 'Mandap Floral Architecture & Brass Diya Staging',
        description: 'Approve 3D render of lotus-inspired Mandap and fresh jasmine ceiling drape.',
        owner: 'Decor Lead',
        due_date: '2026-09-21',
        status: 'in_progress',
        priority: 'medium',
        is_ai_generated: false,
      },
      {
        title: 'Send Eco Seed-Paper Invites & Launch WhatsApp RSVP Bot',
        description: 'Coordinate out-of-town guest pickups from Kempegowda International Airport.',
        owner: 'Vikram & Cousin Team',
        due_date: '2026-10-06',
        status: 'todo',
        priority: 'medium',
        is_ai_generated: false,
      },
      {
        title: 'Final Kanjivaram Saree Draping & Sherwani Fittings',
        description: 'Trial with bridal makeup artist and ensure spare matching blouse accessories.',
        owner: 'Ananya',
        due_date: '2026-10-30',
        status: 'todo',
        priority: 'medium',
        is_ai_generated: false,
      },
      {
        title: 'Venue Electrical Load & Sound Curfew Inspection',
        description: 'Walkthrough with sound team to test lapel mics for priest chanting.',
        owner: 'Lead Coordinator',
        due_date: '2026-11-13',
        status: 'todo',
        priority: 'high',
        is_ai_generated: false,
      },
      {
        title: 'Wedding Eve Setup & Fresh Flower Arrival Inspection',
        description: 'Check cool storage for marigold garlands and test golf cart batteries.',
        owner: 'Lead Coordinator',
        due_date: '2026-11-19',
        status: 'todo',
        priority: 'critical',
        is_ai_generated: false,
      },
      {
        title: 'Muhurtham Day Coordination (7:30 AM Muhurtham)',
        description: 'Ensure priest, couple, and elderly relatives are seated on schedule.',
        owner: 'Family Priest & Lead Coordinator',
        due_date: '2026-11-20',
        status: 'todo',
        priority: 'critical',
        is_ai_generated: false,
      },
    ],
    vendors: [
      {
        vendor_type: 'Venue / Kalyana Mantapa',
        name: 'Palace Sheesh Mahal Grounds, Jayamahal Road',
        contact: '+91 98450 12345 (Mr. Ranganath)',
        quote_amount: 750000,
        status: 'booked',
        booking_deadline: '2026-05-24',
        questions: [
          'Is generator diesel backup included for uninterrupted AC and stage lighting?',
          'What are the sound decibel limits after 10 PM for the reception?',
          'Can we arrange an overnight floral installation starting at 10 PM on the eve?',
        ],
        notes: 'Deposit paid ₹2,50,000 on June 1st. Balance due 7 days prior.',
      },
      {
        vendor_type: 'Catering & Beverages',
        name: 'Sri Krishna Grand Udupi Caterers, Malleshwaram',
        contact: '+91 94480 67890 (Chef Vasudev)',
        quote_amount: 600000,
        status: 'booked',
        booking_deadline: '2026-07-23',
        questions: [
          'Do you provide fresh pure-cow ghee and banana leaf dining staff for 350 pax?',
          'Can you separate the Jain food preparation counters completely?',
          'What is the brewing speed for the live brass-filter coffee stall?',
        ],
        notes: 'Agreed on 24 items including Pineapple Kesari Bath and authentic Bisi Bele Bath.',
      },
      {
        vendor_type: 'Photography & Cinematography',
        name: 'The Bengaluru Candid Co.',
        contact: '+91 98860 54321 (Arjun Rao)',
        quote_amount: 250000,
        status: 'booked',
        booking_deadline: '2026-08-22',
        questions: [
          'Will the drone pilot have airport corridor safety clearance for Palace Grounds?',
          'How many unedited RAW photos will be provided on the hard drive?',
        ],
        notes: 'Pre-wedding shoot completed at Nandi Hills sunrise.',
      },
      {
        vendor_type: 'Decor & Florist',
        name: 'Hasiru Floral Artisans, Wilson Garden',
        contact: '+91 99000 87654 (Sowmya M.)',
        quote_amount: 285000,
        status: 'quoted',
        booking_deadline: '2026-09-21',
        questions: [
          'Can you supply GI-tagged Mysore Mallige (jasmine) for the mandap canopy?',
          'What eco-friendly materials do you use instead of thermocol/styrofoam?',
        ],
        notes: 'Quote under final review; sample mandap approved.',
      },
    ],
    ideas: [
      {
        kind: 'theme',
        content: {
          concepts: [
            {
              title: 'Hoysala Royal Brass & Mysore Jasmine',
              tagline: 'Timeless architectural grandeur celebrating Karnataka temple craftsmanship',
              colorPalette: [
                { hex: '#8B1E3F', name: 'Mysore Vermillion' },
                { hex: '#D4AF37', name: 'Antique Temple Gold' },
                { hex: '#2C5E43', name: 'Fresh Plantain Leaf Green' },
                { hex: '#FFFDD0', name: 'Raw Silk Ivory' },
              ],
              decorElements: [
                'Carved stone-finish mandap pillars adorned with cascading fragrant Mysore Mallige',
                'Suspended antique bell clusters ringing gently with acoustic breezes',
                'Solid brass Urli bowls floating fragrant lotus blossoms and flickering camphor lamps',
              ],
              ambianceAndVibe:
                'Sacred, fragrant, dignified with traditional Nadaswaram notes welcoming dawn guests.',
              signatureMoment:
                'Groom and bride entry beneath an archway of woven marigold garlands as temple conches sound.',
            },
            {
              title: 'Lalbagh Botanical Glasshouse Romance',
              tagline: 'Lush colonial greenhouse aesthetic with contemporary emerald lighting',
              colorPalette: [
                { hex: '#1B4D3E', name: 'Brunswick Forest Green' },
                { hex: '#F7CAC9', name: 'Rose Quartz Blossom' },
                { hex: '#C5A059', name: 'Warm Burnished Brass' },
                { hex: '#F5F5DC', name: 'Oatmeal Linen' },
              ],
              decorElements: [
                'Geometric black-iron glass frames draped in English ivy and baby’s breath',
                'Fairytale canopy lights creating an indoor starlit sky for the evening reception',
                'Terracotta pots of native ferns and areca palms lining the aisle',
              ],
              ambianceAndVibe:
                'Whimsical, airy, and romantic; softly glowing fairy lights as night descends.',
              signatureMoment:
                'Couple exchange rings under an enchanted glass gazebo as acoustic violins play.',
            },
            {
              title: 'Channapatna Folk Vibrancy & Modern Silk',
              tagline: 'Joyful celebration of Karnataka wooden lacquer crafts and vivid colors',
              colorPalette: [
                { hex: '#E65100', name: 'Marigold Sunset' },
                { hex: '#00838F', name: 'Peacock Turquoise' },
                { hex: '#FFB300', name: 'Mustard Turmeric' },
                { hex: '#6A1B9A', name: 'Royal Jamun Violet' },
              ],
              decorElements: [
                'Handcrafted Channapatna wooden bead hangings framing the photo corners',
                'Vibrant tie-and-dye and Ilkal silk fabric canopies billowing over outdoor lounges',
                'Brass tea-stall carts serving traditional Bellam (Jaggery) Chai',
              ],
              ambianceAndVibe:
                'High-energy, joyous, artisanal with foot-tapping folk fusion rhythms.',
              signatureMoment:
                'Grand Sangeet flash mob led by cousins holding illuminated floral umbrellas.',
            },
          ],
        },
      },
      {
        kind: 'menu',
        content: {
          cuisineStyle: 'Authentic Dakshina Karnataka & Udupi Heritage Royal Banquet',
          welcomeDrinks: [
            {
              cocktail: 'Spiced Kokum & White Rum Fizz',
              mocktailAlternative: 'Iced Panakam with Cardamom & Jaggery',
              notes: 'Infused with fresh mint and crushed ginger for immediate refreshment',
            },
          ],
          appetizers: [
            {
              dishName: 'Crispy Maddur Vada & Karivepaku Chutney',
              description: 'Authentic heritage crispy onion-semolina patties with tempered curry leaf relish',
              dietaryTags: ['Vegetarian', 'Vegan', 'Nut-Free'],
            },
            {
              dishName: 'Smoked Jackfruit Ghee Roast Canapés',
              description: 'Kundapura spiced tender jackfruit shreds on bite-sized Malabar parotta crisps',
              dietaryTags: ['Vegetarian', 'Can be made Jain'],
            },
          ],
          mains: [
            {
              dishName: 'Authentic Bisi Bele Bath with Ghee Boondi',
              description: 'Fragrant short-grain rice and lentils slow-cooked with 18 freshly ground spices and seasonal vegetables',
              dietaryTags: ['Vegetarian', 'Gluten-Free'],
            },
            {
              dishName: 'Melkote Puliyogare & Curd Rice Trio',
              description: 'Tangy jaggery-tamarind rice paired with pomegranate-tempered creamy curd rice',
              dietaryTags: ['Vegetarian', 'Gluten-Free', 'Nut-Free'],
            },
          ],
          desserts: [
            {
              dishName: 'Warm Bele Obbattu with Saffron Melted Ghee',
              description: 'Hand-stretched sweet lentil flatbread grilled golden on cast-iron tawa',
              dietaryTags: ['Vegetarian'],
            },
            {
              dishName: 'Melt-in-Mouth Mysore Pak & Filter Coffee Shot',
              description: 'Traditional gram-flour fudge made with aromatic churned cow ghee',
              dietaryTags: ['Vegetarian', 'Gluten-Free'],
            },
          ],
          dietaryComplianceNotes:
            'Strictly segregated Jain kitchen counter for 40 guests. Zero onion or garlic used in the sacred Muhurtham feast.',
        },
      },
      {
        kind: 'risk',
        content: {
          risks: [
            {
              category: 'Weather / Rain',
              riskDescription: 'Unseasonal November rain showers over open Palace Grounds courtyard',
              severity: 'high',
              probability: 'medium',
              contingencyPlan:
                'All-weather German clear-span waterproof hangars pre-installed over the dining courtyard with raised wooden sub-flooring.',
            },
            {
              category: 'Traffic / Logistics',
              riskDescription: 'Heavy Bellary Road airport corridor traffic delaying elderly VIP guests',
              severity: 'high',
              probability: 'high',
              contingencyPlan:
                'Chartered traveler minibuses departing from central designated pick-up hubs; dedicated traffic wardens at Jayamahal entrance.',
            },
            {
              category: 'Power Backup',
              riskDescription: 'Grid substation trip during Muhurtham priest chanting and mandap lights',
              severity: 'high',
              probability: 'medium',
              contingencyPlan:
                'Dual 125 kVA diesel generators configured with auto-transfer switch (zero-interruption within 3 seconds).',
            },
          ],
        },
      },
      {
        kind: 'run_sheet',
        content: {
          itinerary: [
            {
              timeSlot: '05:30 AM - 06:30 AM',
              activity: 'Priest arrival, Mandap purification & fresh floral garland delivery',
              location: 'Main Mantapa Stage',
              leadPerson: 'Decor Lead & Family Priest',
              notes: 'Verify sacred fire wood (samidha) and fresh tender coconuts',
            },
            {
              timeSlot: '06:30 AM - 07:30 AM',
              activity: 'Bride & Groom preparatory rites (Kashi Yatra & Varapooja)',
              location: 'Courtyard & Stage',
              leadPerson: 'Couple & Parents',
              notes: 'Photographer team on stage; live Nadaswaram begins',
            },
            {
              timeSlot: '07:30 AM - 08:30 AM',
              activity: 'Auspicious Muhurtham & Dhare Heravudu ceremony',
              location: 'Mandap',
              leadPerson: 'Chief Priest & Family',
              notes: 'Critical auspicious window. Hand out sacred akshatha to all guests',
            },
            {
              timeSlot: '08:30 AM - 10:30 AM',
              activity: 'Grand Plantain Leaf Traditional Breakfast Banquet',
              location: 'Dining Hall',
              leadPerson: 'Catering Lead',
              notes: 'Seat elderly guests in first batch with wheelchair assistance',
            },
            {
              timeSlot: '11:00 AM - 01:00 PM',
              activity: 'Stage blessing photos & distribution of Mysore Pak favor boxes',
              location: 'Stage Area',
              leadPerson: 'Coordinator & Ushers',
              notes: 'VIP guest departure escort to car park',
            },
          ],
        },
      },
      {
        kind: 'saving_tip',
        content: {
          tips: [
            {
              category: 'decor',
              practicalTip:
                'Reuse morning mandap brass urlis, fairy lights, and flower garlands for the evening reception photo wall rather than ordering fresh sets.',
              tradeOffToAvoid:
                'Do not compromise on morning fresh jasmine garlands; switch to durable greenery for the evening backdrop.',
            },
            {
              category: 'invitations_favors',
              practicalTip:
                'Distribute 80% digital animated Kannada WhatsApp video invites, printing only 50 high-end seed-paper physical copies for elders.',
              tradeOffToAvoid:
                'Do not skip physical cards for immediate family elders as it is culturally sensitive in Bengaluru.',
            },
            {
              category: 'apparel_makeup',
              practicalTip:
                'Source pure Kanjivaram silks directly from weavers in Doddaballapur or Kanchipuram cooperative stores to save 30% on retail margins.',
              tradeOffToAvoid: 'Do not compromise on bridal hair and saree draping specialists on the morning of Muhurtham.',
            },
          ],
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 2. Birthday: Rohan's 30th Craft Beer & Tech Geek Rooftop Birthday in Indiranagar
  // --------------------------------------------------------------------------
  {
    event: {
      id: '22222222-2222-4222-8222-222222222222',
      event_type: 'birthday',
      title: "Rohan's 30th Cyberpunk Rooftop Bash",
      city: 'Bengaluru',
      event_date: '2026-11-14',
      guest_count: 50,
      total_budget: 150000, // ₹1,50,000 INR
      currency: 'INR',
      style: 'Cyberpunk Neon & Bengaluru Craft Beer Culture',
      dietary_needs: [
        'Wood-fired sourdough pizza (vegan & meat options)',
        'Gluten-free bar bites',
        'Artisanal kombucha & alcohol-free craft mocktails',
      ],
      accessibility_needs: ['Elevator access to 4th-floor terrace', 'Accessible washroom on rooftop level'],
      special_requests:
        'Custom retro arcade cabinet playing Mario Kart & Street Fighter, neon Bengaluru tech meme photobooth, two fresh 30L craft brew kegs (IPA and Belgian Wit).',
      status: 'planning',
      is_demo: true,
    },
    budgetItems: [
      {
        category: 'venue',
        planned_amount: 37500,
        actual_amount: 35000,
        notes: '12th Main Indiranagar boutique rooftop terrace with rain canopy',
      },
      {
        category: 'catering',
        planned_amount: 52500,
        actual_amount: 55000,
        notes: 'Two 30L craft beer kegs, live sourdough pizza oven, truffle fries & sliders',
      },
      {
        category: 'entertainment',
        planned_amount: 22500,
        actual_amount: 20000,
        notes: 'Synthwave DJ set + 2 rented retro arcade gaming consoles',
      },
      {
        category: 'decor',
        planned_amount: 15000,
        actual_amount: 14000,
        notes: 'Custom neon sign ("Rohan 3.0: Level 30 Unlocked"), UV blacklights, holographic banners',
      },
      {
        category: 'photography',
        planned_amount: 7500,
        actual_amount: 7500,
        notes: 'Photographer with Fujifilm Instax instant mini printer booth',
      },
      {
        category: 'invitations_favors',
        planned_amount: 4500,
        actual_amount: 4000,
        notes: 'Custom pixel-art stickers, engraved beer mugs, and Discord party link',
      },
      {
        category: 'logistics_permits',
        planned_amount: 3000,
        actual_amount: 2500,
        notes: 'Late night sound permission until 11:00 PM and valet parking support',
      },
      {
        category: 'contingency',
        planned_amount: 7500,
        actual_amount: 2000,
        notes: 'Extra keg tap rental and emergency beverage backup',
      },
    ],
    timelineTasks: [
      {
        title: 'Lock Indiranagar Rooftop Lounge & Sign Agreement',
        description: 'Verify 4th floor elevator access and 11 PM music guidelines.',
        owner: 'Rohan',
        due_date: '2026-09-15',
        status: 'done',
        priority: 'high',
        is_ai_generated: false,
      },
      {
        title: 'Reserve 2 Craft Beer Kegs from Toit / Arbor Microbrewery',
        description: 'Select Belgian Witbier and Citrus IPA; book CO2 draft dispenser equipment.',
        owner: 'Best Friend / Co-Host',
        due_date: '2026-10-15',
        status: 'done',
        priority: 'high',
        is_ai_generated: false,
      },
      {
        title: 'Rent Retro Arcade Cabinet & Synthwave DJ',
        description: 'Test HDMI splitters and party sound level calibration.',
        owner: 'Tech Lead Friend',
        due_date: '2026-10-25',
        status: 'in_progress',
        priority: 'medium',
        is_ai_generated: false,
      },
      {
        title: 'Order "Level 30" Custom Birthday Cake & Sourdough Pizzas',
        description: 'Confirm Belgian dark chocolate whiskey cake with vegan pizza options.',
        owner: 'Rohan',
        due_date: '2026-11-04',
        status: 'todo',
        priority: 'high',
        is_ai_generated: false,
      },
      {
        title: 'Rooftop Soundcheck & Neon Staging',
        description: 'Set up UV lights, arcade machines, and ice buckets for kegs.',
        owner: 'Rohan & Co-Host',
        due_date: '2026-11-14',
        status: 'todo',
        priority: 'critical',
        is_ai_generated: false,
      },
    ],
    vendors: [
      {
        vendor_type: 'Venue / Rooftop Lounge',
        name: 'The Indiranagar Skydeck, 100 Ft Road',
        contact: '+91 99800 11223 (Karan)',
        quote_amount: 35000,
        status: 'booked',
        booking_deadline: '2026-09-15',
        questions: ['Can outside microbrewery kegs be tapped on-site with our draft system?'],
        notes: 'Full rooftop terrace reserved from 6:30 PM to midnight.',
      },
      {
        vendor_type: 'Microbrewery & Craft Kegs',
        name: 'Bengaluru Brew Works Craft Delivery',
        contact: '+91 98455 33445 (Nikhil)',
        quote_amount: 28000,
        status: 'booked',
        booking_deadline: '2026-10-15',
        questions: ['Is the draft chiller tower and CO2 cylinder included with the delivery?'],
        notes: 'Delivering at 5:00 PM cold-stored.',
      },
    ],
    ideas: [
      {
        kind: 'theme',
        content: {
          concepts: [
            {
              title: 'Neon Silicon Valley of India 3.0',
              tagline: 'Cyberpunk Bengaluru aesthetics merging circuit boards, retro arcade, and neon skylines',
              colorPalette: [
                { hex: '#00F0FF', name: 'Cyber Neon Cyan' },
                { hex: '#FF007F', name: 'Electric Magenta' },
                { hex: '#120E24', name: 'Midnight Deep Carbon' },
                { hex: '#FFE600', name: 'Warning Yellow' },
              ],
              decorElements: [
                'Glowing neon acrylic table runners shaped like Bengaluru tech campus blueprints',
                'Vintage CRT monitors playing looping 8-bit animations and Rohan throwback photos',
                'Dark polycarbonate cups illuminated with glowing LED ice cubes',
              ],
              ambianceAndVibe: 'High-octane, nostalgic tech geek energy with synthwave and Nu-disco basslines.',
              signatureMoment:
                'Countdown to midnight arcade Mario Kart tournament championship projected onto the terrace wall.',
            },
            {
              title: 'Indiranagar Craft Hop Garden',
              tagline: 'Cozy artisanal brewery courtyard with Edison string lights and acoustic chill',
              colorPalette: [
                { hex: '#D97706', name: 'Amber Ale' },
                { hex: '#4D7C0F', name: 'Fresh Hop Green' },
                { hex: '#78350F', name: 'Smoked Oak Wood' },
                { hex: '#FDFBF7', name: 'Foam White' },
              ],
              decorElements: [
                'Repurposed wooden oak barrels used as cocktail poseur tables',
                'Potted fresh hop vines and rosemary plants emitting subtle botanical fragrance',
                'Chalkboard tasting menu board detailing bitterness IBU and hop profiles',
              ],
              ambianceAndVibe: 'Warm, relaxed, conversational; friends clinking glasses under ambient amber glow.',
              signatureMoment: 'Personalized flight tasting paddle competition guessing local secret ingredients.',
            },
            {
              title: 'Vinyl & Retro Game Vault',
              tagline: '70s retro groove party with playable board games and classic records',
              colorPalette: [
                { hex: '#E11D48', name: 'Vintage Cherry' },
                { hex: '#F59E0B', name: 'Retro Orange' },
                { hex: '#0D9488', name: 'Teal Velvet' },
                { hex: '#F3F4F6', name: 'Vintage Paper' },
              ],
              decorElements: [
                'Record player station where guests pick vinyl tracks throughout the evening',
                'Giant Jenga and retro tabletop board game battle stations',
              ],
              ambianceAndVibe: 'Fun, tactile, nostalgic and warm.',
              signatureMoment: 'Thematic cake cutting shaped like an authentic Nintendo 64 game cartridge.',
            },
          ],
        },
      },
      {
        kind: 'menu',
        content: {
          cuisineStyle: 'Indiranagar Gastro-Pub Craft Pairings',
          welcomeDrinks: [
            {
              cocktail: 'Citrus IPA Shandy with Bengaluru Betel Leaf Essence',
              mocktailAlternative: 'Cold-Brew Cascara Tea with Fresh Passionfruit & Sparkling Tonic',
              notes: 'Garnished with dehydrated lime wheels and crushed pink pepper',
            },
          ],
          appetizers: [
            {
              dishName: 'Smoked Podi Truffle French Fries',
              description: 'Crispy hand-cut potatoes dusted with Gunpowder Podi spice and truffle oil',
              dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
            },
            {
              dishName: 'Wood-Fired Guntur Chilli Chicken & Paneer Skewers',
              description: 'Charred skewers marinated in stone-ground Guntur chilies and lemon zest',
              dietaryTags: ['Gluten-Free', 'High-Protein'],
            },
          ],
          mains: [
            {
              dishName: 'Neapolitan Sourdough Pizza Trio',
              description: 'Three varieties: Classic Margherita, Wild Forest Mushroom with Gorgonzola, and Spicy Salami Pepperoni',
              dietaryTags: ['Vegetarian Option', 'Vegan Cheese Option'],
            },
            {
              dishName: 'Pulled Jackfruit & Pork Bao Sliders',
              description: 'Steamed lotus bao buns with spicy pickled cucumber and scallion kimchi',
              dietaryTags: ['Vegan Option Available'],
            },
          ],
          desserts: [
            {
              dishName: 'Dark Chocolate Stout Beer Brownie with Salted Caramel Gelato',
              description: 'Warm fudge brownie made with local roasted imperial stout and sea salt',
              dietaryTags: ['Vegetarian'],
            },
          ],
          dietaryComplianceNotes:
            'Dedicated vegan pizza oven stone and separate fryer for gluten-free fries.',
        },
      },
      {
        kind: 'risk',
        content: {
          risks: [
            {
              category: 'Sound Regulations',
              riskDescription: 'Residential noise complaint in Indiranagar after 10:00 PM',
              severity: 'high',
              probability: 'medium',
              contingencyPlan:
                'Transition rooftop speakers to a "Silent Disco" wireless headphone party system at exactly 10:00 PM.',
            },
            {
              category: 'Weather / Wind',
              riskDescription: 'Strong evening winds blowing away rooftop party decorations and paper props',
              severity: 'medium',
              probability: 'high',
              contingencyPlan:
                'All decor securely tethered with industrial cable ties; acrylic and brass table weights on all food stations.',
            },
          ],
        },
      },
      {
        kind: 'run_sheet',
        content: {
          itinerary: [
            {
              timeSlot: '06:00 PM - 07:00 PM',
              activity: 'Vendor setup: Keg tapping, arcade machine power check, playlist warm-up',
              location: 'Rooftop Terrace',
              leadPerson: 'Co-Host & DJ',
              notes: 'Verify neon sign wiring and sound levels',
            },
            {
              timeSlot: '07:00 PM - 08:30 PM',
              activity: 'Guest arrival, craft beer pours, photobooth instant polaroids',
              location: 'Bar & Lounge',
              leadPerson: 'Rohan',
              notes: 'Hand out custom pixel stickers and pint glasses',
            },
            {
              timeSlot: '08:30 PM - 09:30 PM',
              activity: 'Mario Kart tournament knockout rounds on projector screen',
              location: 'Arcade Zone',
              leadPerson: 'Tech Lead Friend',
              notes: 'Crowd cheers and prizes for top 3 fastest lap times',
            },
            {
              timeSlot: '09:30 PM - 10:00 PM',
              activity: 'Level 30 Cake Cutting ceremony & birthday toast',
              location: 'Center Terrace',
              leadPerson: 'Rohan & Friends',
              notes: 'Champagne / Imperial stout toast',
            },
            {
              timeSlot: '10:00 PM - 11:30 PM',
              activity: 'Silent Disco synthwave session & wood-fired pizza buffet',
              location: 'Terrace Dance Floor',
              leadPerson: 'DJ',
              notes: 'Switch off external PA system; distribute wireless headphones',
            },
          ],
        },
      },
      {
        kind: 'saving_tip',
        content: {
          tips: [
            {
              category: 'catering',
              practicalTip:
                'Ordering two 30L commercial kegs directly from local microbreweries saves 45% compared to purchasing individual craft beer pints at venue bar rates.',
              tradeOffToAvoid: 'Ensure an experienced friend or bartender operates the tap to prevent foam spillage.',
            },
            {
              category: 'decor',
              practicalTip:
                'Rent neon signs and blacklight fixtures instead of custom fabrication; buy only the central personalized name sign as a lifetime keepsake.',
              tradeOffToAvoid: 'Do not buy cheap disposable plastic props that end up in landfills.',
            },
          ],
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 3. Community Event: HSR Layout Sustainability & Green Habitat Fair
  // --------------------------------------------------------------------------
  {
    event: {
      id: '33333333-3333-4333-8333-333333333333',
      event_type: 'community_event',
      title: 'HSR Layout Sustainability & Green Fair',
      city: 'Bengaluru',
      event_date: '2026-12-05',
      guest_count: 600,
      total_budget: 350000, // ₹3,50,000 INR
      currency: 'INR',
      style: 'Zero-Waste Eco Carnival & Local Artisan Fair',
      dietary_needs: [
        'Millet-based snacks & organic local fare',
        'Strict zero single-use plastic policy',
        'Hydration stations with copper dispensers',
      ],
      accessibility_needs: [
        'Tactile paved walking loops for visually impaired visitors',
        'Accessible portable eco-toilets',
        'Sign language interpreter for main stage opening remarks',
      ],
      special_requests:
        'BBMP composting masterclass, rooftop solar exhibit, terrace gardening plant exchange, street theater (Nukkad Natak) on e-waste segregation.',
      status: 'planning',
      is_demo: true,
    },
    budgetItems: [
      {
        category: 'logistics_permits',
        planned_amount: 70000,
        actual_amount: 68000,
        notes: 'BBMP park permission, police sound permit, fire safety clearance, bio-waste collection vans',
      },
      {
        category: 'venue',
        planned_amount: 70000,
        actual_amount: 70000,
        notes: 'HSR Layout Sector 2 BBMP Neighborhood Park & Amphitheater',
      },
      {
        category: 'catering',
        planned_amount: 70000,
        actual_amount: 65000,
        notes: 'Free filter drinking water stations, millet idli/dosa stalls, fresh tender coconut partner',
      },
      {
        category: 'entertainment',
        planned_amount: 52500,
        actual_amount: 50000,
        notes: 'Amphitheater PA audio system, solar street-play actors, local student acoustic choir',
      },
      {
        category: 'decor',
        planned_amount: 35000,
        actual_amount: 32000,
        notes: 'Bamboo and unbleached cotton canopies, jute banners, chalk-drawn floor maps',
      },
      {
        category: 'invitations_favors',
        planned_amount: 17500,
        actual_amount: 15000,
        notes: '600 native medicinal saplings (Tulsi & Neem) in coir pots as free resident takeaways',
      },
      {
        category: 'contingency',
        planned_amount: 35000,
        actual_amount: 10000,
        notes: 'Rainproof tarps, spare battery backup for audio, first-aid medical kit supplies',
      },
    ],
    timelineTasks: [
      {
        title: 'Submit BBMP & Police Sound Permission Forms',
        description: 'Obtain written clearance for park amphitheater and 10 AM to 6 PM schedule.',
        owner: 'Resident Welfare Association President',
        due_date: '2026-09-06',
        status: 'done',
        priority: 'critical',
        is_ai_generated: false,
      },
      {
        title: 'Confirm Park Booking & Coordinate Hasiru Dala Waste Management',
        description: 'Arrange 4 colored segregation stations (dry, wet, sanitary, e-waste).',
        owner: 'Green Committee Head',
        due_date: '2026-10-06',
        status: 'done',
        priority: 'high',
        is_ai_generated: false,
      },
      {
        title: 'Recruit 30 College Student Volunteers & Assign Zone Captains',
        description: 'Conduct training on crowd safety, lost-child protocol, and zero-plastic compliance.',
        owner: 'Youth Volunteer Lead',
        due_date: '2026-10-21',
        status: 'in_progress',
        priority: 'high',
        is_ai_generated: false,
      },
      {
        title: 'Distribute Digital WhatsApp Flyers across 15 RWA Resident Groups',
        description: 'Highlight solar demos, free sapling giveaways, and child composting workshops.',
        owner: 'Community PR Lead',
        due_date: '2026-11-05',
        status: 'todo',
        priority: 'medium',
        is_ai_generated: false,
      },
      {
        title: 'Erect Bamboo Stalls & Setup Solar Sound PA System',
        description: 'Check wheelchair access ramps to amphitheater stage and test wireless mics.',
        owner: 'Technical & Infrastructure Lead',
        due_date: '2026-12-04',
        status: 'todo',
        priority: 'critical',
        is_ai_generated: false,
      },
      {
        title: 'Fair Execution Day (09:00 AM - 06:00 PM)',
        description: 'Manage exhibitor stalls, stage talks, workshop rotations, and evening clean-up.',
        owner: 'Organizing Committee',
        due_date: '2026-12-05',
        status: 'todo',
        priority: 'critical',
        is_ai_generated: false,
      },
    ],
    vendors: [
      {
        vendor_type: 'Tents, Bamboo Stalls & Canopy Logistics',
        name: 'EcoStructure Events Bengaluru',
        contact: '+91 98452 77889 (Manjunath)',
        quote_amount: 32000,
        status: 'booked',
        booking_deadline: '2026-11-15',
        questions: ['Are all canopy fabrics untreated unbleached cotton with zero PVC vinyl?'],
        notes: '20 artisan stalls setup on Friday evening.',
      },
      {
        vendor_type: 'Solar Sound & Public Address',
        name: 'GreenAcoustics Sound Labs',
        contact: '+91 97400 55667 (Pradeep)',
        quote_amount: 50000,
        status: 'booked',
        booking_deadline: '2026-11-05',
        questions: ['Can the entire PA system run 8 hours on the lithium solar battery bank?'],
        notes: 'Includes 4 wireless mics and backup generator.',
      },
    ],
    ideas: [
      {
        kind: 'theme',
        content: {
          concepts: [
            {
              title: 'Hasiru Habba (Green Festival) of Bengaluru',
              tagline: 'Rooted community celebration honoring the Garden City’s natural biodiversity',
              colorPalette: [
                { hex: '#15803D', name: 'Canopy Forest Green' },
                { hex: '#A16207', name: 'Terracotta Earth' },
                { hex: '#FACC15', name: 'Bengaluru Sunburst' },
                { hex: '#ECFDF5', name: 'Mint Eco White' },
              ],
              decorElements: [
                'Woven bamboo archways decorated with potted flowering hibiscus and marigolds',
                'Recycled wooden pallet seating with cushions stitched from discarded upcycled denim',
                'Chalk art hopscotch and native biodiversity diagrams drawn on walking trails',
              ],
              ambianceAndVibe: 'Uplifting, family-friendly, educational, bustling with eco-enthusiasm.',
              signatureMoment:
                'Mass sapling planting pledge by 200 neighborhood children along the park perimeter.',
            },
          ],
        },
      },
      {
        kind: 'menu',
        content: {
          cuisineStyle: 'Wholesome Millet & Organic Heritage Street Food',
          welcomeDrinks: [
            {
              cocktail: 'N/A (Alcohol-Free Community Event)',
              mocktailAlternative: 'Fresh Tender Coconut Water with Chia & Mint',
              notes: 'Served in natural coconut shells with zero plastic straws',
            },
          ],
          appetizers: [
            {
              dishName: 'Crispy Ragi & Foxtail Millet Pakoras',
              description: 'Crispy fritters tossed with shallots and curry leaves served with coconut-mint chutney',
              dietaryTags: ['Vegan', 'Gluten-Free', 'Nut-Free'],
            },
            {
              dishName: 'Sprouted Moong & Raw Mango Chaat Cones',
              description: 'Zesty street chaat served in edible baked whole-wheat cones',
              dietaryTags: ['Vegan', 'Nut-Free'],
            },
          ],
          mains: [
            {
              dishName: 'Jowar Roti with Ennegai (Stuffed Brinjal) & Shenga Chutney',
              description: 'North Karnataka artisanal sorghum flatbread served with sesame-stuffed eggplant curry',
              dietaryTags: ['Vegan', 'Gluten-Free'],
            },
          ],
          desserts: [
            {
              dishName: 'Kodo Millet & Jaggery Payasa',
              description: 'Creamy coconut milk pudding sweetened with organic organic palm jaggery',
              dietaryTags: ['Vegan', 'Gluten-Free'],
            },
          ],
          dietaryComplianceNotes:
            '100% vegetarian event. Zero plastic disposable cutlery allowed; steel plates rented from Bengaluru Plate Bank.',
        },
      },
      {
        kind: 'risk',
        content: {
          risks: [
            {
              category: 'Waste Contamination',
              riskDescription: 'Visitors dumping mixed plastic waste into organic composting bins',
              severity: 'high',
              probability: 'medium',
              contingencyPlan:
                'Two trained student volunteers stationed permanently at each of the 4 recycling hubs to guide segregation.',
            },
            {
              category: 'Crowd Congestion',
              riskDescription: 'Overcrowding at popular workshop pavilions during peak hours (11 AM to 1 PM)',
              severity: 'medium',
              probability: 'high',
              contingencyPlan:
                'Staggered repeat sessions scheduled every 45 minutes; tokens issued at entry to prevent bottlenecks.',
            },
          ],
        },
      },
      {
        kind: 'run_sheet',
        content: {
          itinerary: [
            {
              timeSlot: '08:00 AM - 09:00 AM',
              activity: 'Exhibitor stall setup & registration desk opening',
              location: 'Park Perimeter Walkway',
              leadPerson: 'Volunteer Captains',
              notes: 'Distribute cloth badges and stall number cards',
            },
            {
              timeSlot: '09:00 AM - 10:00 AM',
              activity: 'Opening Ceremony & Tree Plantation Walk with Resident Elders',
              location: 'Amphitheater Stage',
              leadPerson: 'RWA President',
              notes: 'Sign language interpreter on stage',
            },
            {
              timeSlot: '10:30 AM - 12:30 PM',
              activity: 'Live Composting & Terrace Gardening Masterclasses',
              location: 'Workshop Zone A & B',
              leadPerson: 'Green Committee Lead',
              notes: 'Interactive potting mix demonstrations',
            },
            {
              timeSlot: '01:00 PM - 02:30 PM',
              activity: 'Millet Food Court Feast & Steel Plate Wash Rotations',
              location: 'Dining Grove',
              leadPerson: 'Catering Lead',
              notes: 'Plate bank return station operating continuously',
            },
            {
              timeSlot: '03:00 PM - 04:30 PM',
              activity: 'Street Play on E-Waste & Local School Choir Performance',
              location: 'Amphitheater',
              leadPerson: 'Cultural Lead',
              notes: 'Sound levels checked; keep under 65 dB',
            },
            {
              timeSlot: '05:00 PM - 06:00 PM',
              activity: 'Native Sapling Distribution (600 plants) & Closing Remarks',
              location: 'Main Gate Exit Pavilion',
              leadPerson: 'All Volunteers',
              notes: 'Hasiru Dala final waste audit and park cleanup',
            },
          ],
        },
      },
      {
        kind: 'saving_tip',
        content: {
          tips: [
            {
              category: 'catering',
              practicalTip:
                'Partnering with the community "Adamya Chetana" plate bank and renting reusable stainless steel thali sets saves ₹25,000 on disposable compostable paper plates.',
              tradeOffToAvoid: 'Set up an organized 3-tier dish-washing station with graywater recycling.',
            },
            {
              category: 'invitations_favors',
              practicalTip:
                'Acquire native medicinal saplings in bulk from the Karnataka Forest Department nursery at subsidized institutional rates (₹12 per sapling).',
              tradeOffToAvoid: 'Do not distribute invasive species like eucalyptus; insist on native neem, honge, or tulsi.',
            },
          ],
        },
      },
    ],
  },
];
