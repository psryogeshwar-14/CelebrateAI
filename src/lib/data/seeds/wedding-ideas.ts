import type { Json } from '../../types/database.types';

export const WEDDING_IDEAS: Array<{
  kind: 'theme' | 'menu' | 'risk' | 'run_sheet' | 'saving_tip';
  content: Json;
}> = [
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
    ]
;
