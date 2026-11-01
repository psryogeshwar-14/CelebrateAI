import type { Json } from '../../types/database.types';

export const BIRTHDAY_IDEAS: Array<{
  kind: 'theme' | 'menu' | 'risk' | 'run_sheet' | 'saving_tip';
  content: Json;
}> = [
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
    ]
;
