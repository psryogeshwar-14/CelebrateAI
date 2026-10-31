import { Json } from '../../types/database.types';

export const COMMUNITY_IDEAS: Array<{
  kind: 'theme' | 'menu' | 'risk' | 'run_sheet' | 'saving_tip';
  content: Json;
}> = [
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
    ]
;
