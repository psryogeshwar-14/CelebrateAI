import { BudgetCategoryEnum, EventTypeEnum, TaskPriorityEnum } from '@/lib/types/database.types';

export interface CategoryAllocationRule {
  category: BudgetCategoryEnum;
  percentage: number;
  defaultNote: string;
}

export const BUDGET_ALLOCATION_RULES: Record<EventTypeEnum, CategoryAllocationRule[]> = {
  wedding: [
    { category: 'venue', percentage: 30, defaultNote: 'Hall / Kalyana Mantapa / Resort rental' },
    { category: 'catering', percentage: 25, defaultNote: 'Traditional feast / Grand buffet & beverages' },
    { category: 'decor', percentage: 12, defaultNote: 'Floral mandap, stage backdrop, ambient lights' },
    { category: 'photography', percentage: 10, defaultNote: 'Candid photo & cinematic wedding film' },
    { category: 'apparel_makeup', percentage: 8, defaultNote: 'Bridal silk sarees, sherwani, bridal makeup' },
    { category: 'entertainment', percentage: 6, defaultNote: 'Live Nadaswaram, DJ, Sangeet sound & emcee' },
    { category: 'invitations_favors', percentage: 2, defaultNote: 'Digital & physical invites, Mysore pak favors' },
    { category: 'logistics_permits', percentage: 2, defaultNote: 'Valet parking, generator backup, permissions' },
    { category: 'contingency', percentage: 5, defaultNote: 'Emergency reserve for guest spillover & tips' },
  ],
  birthday: [
    { category: 'venue', percentage: 25, defaultNote: 'Rooftop lounge, private cafe, or banquet hall' },
    { category: 'catering', percentage: 35, defaultNote: 'Live food counters, craft drinks & artisanal cake' },
    { category: 'entertainment', percentage: 15, defaultNote: 'DJ, live acoustic set, party games & host' },
    { category: 'decor', percentage: 10, defaultNote: 'Thematic balloon arches, neon signage, photo-booth' },
    { category: 'photography', percentage: 5, defaultNote: 'Event highlights & instant party prints' },
    { category: 'invitations_favors', percentage: 3, defaultNote: 'Custom return gifts & e-invites' },
    { category: 'logistics_permits', percentage: 2, defaultNote: 'Sound license & local venue coordination' },
    { category: 'contingency', percentage: 5, defaultNote: 'Backup buffer for unexpected guests' },
  ],
  community_event: [
    { category: 'logistics_permits', percentage: 20, defaultNote: 'BBMP/Police permits, sound clearance, security' },
    { category: 'venue', percentage: 20, defaultNote: 'Open grounds, community park, amphitheater' },
    { category: 'catering', percentage: 20, defaultNote: 'Community snacks, tea/coffee stall, drinking water' },
    { category: 'entertainment', percentage: 15, defaultNote: 'Stage sound system, local artists & cultural troupe' },
    { category: 'decor', percentage: 10, defaultNote: 'Eco-friendly signage, canopies, banners' },
    { category: 'invitations_favors', percentage: 5, defaultNote: 'Resident flyers, posters, eco-giveaways' },
    { category: 'contingency', percentage: 10, defaultNote: 'Weather protection & emergency reserves' },
  ],
};

export interface TimelineRule {
  daysBeforeEvent: number;
  title: string;
  description: string;
  owner: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const TIMELINE_RULES: Record<EventTypeEnum, TimelineRule[]> = {
  wedding: [
    { daysBeforeEvent: 180, title: 'Finalize & Lock Kalyana Mantapa / Venue', description: 'Inspect venue power backup, air conditioning, and guest capacity.', owner: 'Couple / Family', priority: 'critical' },
    { daysBeforeEvent: 120, title: 'Book Traditional Caterer & Finalize Menu', description: 'Schedule menu tasting with focus on regional authentic cuisines.', owner: 'Food Lead', priority: 'high' },
    { daysBeforeEvent: 90, title: 'Confirm Candid Photography & Cinematic Video Team', description: 'Discuss pre-wedding shoot and event-day deliverables.', owner: 'Couple', priority: 'high' },
    { daysBeforeEvent: 60, title: 'Finalize Mandap Floral Theme & Stage Decor', description: 'Review sample 3D mockups of mandap flowers and lighting.', owner: 'Decor Lead', priority: 'medium' },
    { daysBeforeEvent: 45, title: 'Send Wedding Invitations & Launch RSVP Portal', description: 'Track out-of-town guests and accommodation requests.', owner: 'Coordinator', priority: 'medium' },
    { daysBeforeEvent: 21, title: 'Finalize Bridal Attire & Jewelry Fitting', description: 'Perform complete outfit trials with accessories.', owner: 'Bride / Groom', priority: 'medium' },
    { daysBeforeEvent: 7, title: 'Conduct Detailed Vendor Alignment Walkthrough', description: 'Review arrival slots, power requirements, and sound clearance.', owner: 'Lead Coordinator', priority: 'high' },
    { daysBeforeEvent: 1, title: 'Mandap Setup Inspection & Soundcheck', description: 'Ensure generator fuel is ready and stage flowers are delivered fresh.', owner: 'Decor & Logistics Lead', priority: 'critical' },
    { daysBeforeEvent: 0, title: 'Wedding Day Coordination & Muhurtham Schedule', description: 'Execute wedding day run sheet and assist elderly guests.', owner: 'Lead Coordinator', priority: 'critical' },
  ],
  birthday: [
    { daysBeforeEvent: 60, title: 'Reserve Venue / Rooftop Terrace', description: 'Lock in deposit and sound curfew terms.', owner: 'Host', priority: 'high' },
    { daysBeforeEvent: 40, title: 'Book DJ / Live Performer & Sound Setup', description: 'Share custom playlist and party vibe preferences.', owner: 'Music Lead', priority: 'medium' },
    { daysBeforeEvent: 30, title: 'Order Custom Thematic Birthday Cake & Catering', description: 'Confirm dietary preferences and custom flavor profile.', owner: 'Host', priority: 'high' },
    { daysBeforeEvent: 20, title: 'Dispatch Digital Party Invites & Collect RSVPs', description: 'Confirm guest headcounts for food estimation.', owner: 'Host', priority: 'medium' },
    { daysBeforeEvent: 7, title: 'Procure Party Decor, Props & Return Gifts', description: 'Arrange neon lighting, photobooth props, and party favors.', owner: 'Host', priority: 'medium' },
    { daysBeforeEvent: 1, title: 'Confirm Venue Access Time & Playlist Run', description: 'Finalize timing with cake delivery and audio setup.', owner: 'Host', priority: 'high' },
    { daysBeforeEvent: 0, title: 'Party Kickoff & Host Coordination', description: 'Welcome guests, manage cake cutting, and keep energy high.', owner: 'Host', priority: 'critical' },
  ],
  community_event: [
    { daysBeforeEvent: 90, title: 'Submit BBMP / Police & Sound Permissions', description: 'File official paperwork for sound permits and public gathering.', owner: 'Committee Head', priority: 'critical' },
    { daysBeforeEvent: 60, title: 'Confirm Community Park / Amphitheater Booking', description: 'Arrange waste management bins and drinking water station.', owner: 'Logistics Lead', priority: 'high' },
    { daysBeforeEvent: 45, title: 'Onboard Volunteer Teams & Assign Zones', description: 'Brief volunteers on safety, crowd control, and emergency exits.', owner: 'Volunteer Head', priority: 'high' },
    { daysBeforeEvent: 30, title: 'Launch Resident Awareness Posters & WhatsApp Campaign', description: 'Distribute event schedule across resident associations.', owner: 'PR Lead', priority: 'medium' },
    { daysBeforeEvent: 14, title: 'Confirm Stage, Sound, and Lighting Vendors', description: 'Check PA system capability for speeches and performances.', owner: 'Technical Lead', priority: 'high' },
    { daysBeforeEvent: 3, title: 'Set Up Shade Canopies, Chairs & First-Aid Booth', description: 'Conduct site walkthrough and verify wheelchair ramp access.', owner: 'Logistics Lead', priority: 'high' },
    { daysBeforeEvent: 0, title: 'Community Fair Execution & Crowd Safety', description: 'Manage stage announcements, stall logistics, and clean-up.', owner: 'Committee Head', priority: 'critical' },
  ],
};

export interface VendorRule {
  vendorType: string;
  leadDaysBeforeEvent: number;
  standardQuestions: string[];
}

export const VENDOR_RULES: Record<EventTypeEnum, VendorRule[]> = {
  wedding: [
    {
      vendorType: 'Venue / Kalyana Mantapa',
      leadDaysBeforeEvent: 180,
      standardQuestions: [
        'Does the rental fee include electricity backup and generator fuel?',
        'What are the hard curfew times for outdoor music and processions?',
        'How many guest rooms and bridal green rooms are included?',
        'Is there dedicated parking and valet space for 50+ vehicles?',
      ],
    },
    {
      vendorType: 'Catering & Beverages',
      leadDaysBeforeEvent: 120,
      standardQuestions: [
        'Do you provide live counter service (e.g. Dosa/Chaat counters)?',
        'How do you manage cross-contamination for strict vegetarian / Jain guests?',
        'What is your staff-to-guest ratio during peak dining hours?',
        'Do you supply banana leaves, crockery, and clean drinking water dispensers?',
      ],
    },
    {
      vendorType: 'Photography & Cinematography',
      leadDaysBeforeEvent: 90,
      standardQuestions: [
        'How many candid vs traditional photographers will be on-site?',
        'Do you operate drone cameras and are you licensed for outdoor shoots?',
        'What is the turnaround time for the teaser clip and full album?',
      ],
    },
    {
      vendorType: 'Decor & Florist',
      leadDaysBeforeEvent: 60,
      standardQuestions: [
        'Are fresh jasmine and marigold flowers sourced on the wedding morning?',
        'Can you build custom structures that match our color palette?',
        'Does the quote cover complete tear-down and cleanup after Muhurtham?',
      ],
    },
    {
      vendorType: 'Music, Sound & Emcee',
      leadDaysBeforeEvent: 45,
      standardQuestions: [
        'Do you bring your own wireless microphones and backup amplifiers?',
        'Can you coordinate Nadaswaram cues with the family priest?',
        'Do you have bilingual emcees fluent in Kannada and English?',
      ],
    },
  ],
  birthday: [
    {
      vendorType: 'Venue / Private Lounge',
      leadDaysBeforeEvent: 60,
      standardQuestions: [
        'What is the minimum spend or rental deposit?',
        'Can outside thematic cake and specialized desserts be brought in?',
        'Are outside sound setups or DJs permitted until 11 PM?',
      ],
    },
    {
      vendorType: 'Artisanal Bakery & Catering',
      leadDaysBeforeEvent: 30,
      standardQuestions: [
        'Can you create custom tiered designs according to our theme?',
        'Do you deliver directly to the venue in refrigerated transport?',
        'Are gluten-free or eggless options available?',
      ],
    },
    {
      vendorType: 'DJ & Sound System',
      leadDaysBeforeEvent: 25,
      standardQuestions: [
        'Do you provide club lighting and haze machines?',
        'Can we share a Spotify playlist of favorite genres?',
      ],
    },
  ],
  community_event: [
    {
      vendorType: 'PA Sound & Public Address System',
      leadDaysBeforeEvent: 30,
      standardQuestions: [
        'Does the setup provide clear acoustic coverage for a 500+ audience?',
        'Do you supply battery/UPS backup in case of grid power cuts?',
        'Are lapel and handheld wireless mics included for speakers?',
      ],
    },
    {
      vendorType: 'Tents, Canopies & Seating',
      leadDaysBeforeEvent: 20,
      standardQuestions: [
        'Are the canopies weather-proof and UV-resistant for daytime heat?',
        'How quickly can your team erect 20 exhibition stalls?',
        'Do you offer accessible ramp ramps for senior citizen seating?',
      ],
    },
  ],
};

