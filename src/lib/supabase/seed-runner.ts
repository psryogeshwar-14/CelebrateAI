/* eslint-disable no-console */
import { createAdminSupabaseClient } from './admin';
import { BENGALURU_DEMO_EVENTS } from '../data/seeds';

export async function seedDatabase(forceClean = true) {
  console.log('Starting CelebrateAI Bengaluru Demo Data Seed...');
  const supabase = createAdminSupabaseClient();

  if (forceClean) {
    console.log('Cleaning existing demo events...');
    const { error: deleteError } = await supabase.from('events').delete().eq('is_demo', true);
    if (deleteError) {
      console.warn('Notice while cleaning demo events:', deleteError.message);
    }
  }

  const seededIds: string[] = [];

  for (const bundle of BENGALURU_DEMO_EVENTS) {
    console.log(`Seeding demo event: "${bundle.event.title}" (${bundle.event.event_type})...`);

    // 1. Insert Event
    const { data: eventRow, error: eventError } = await supabase
      .from('events')
      .upsert(
        {
          id: bundle.event.id,
          user_id: null,
          event_type: bundle.event.event_type,
          title: bundle.event.title,
          city: bundle.event.city,
          event_date: bundle.event.event_date,
          guest_count: bundle.event.guest_count,
          total_budget: bundle.event.total_budget,
          currency: bundle.event.currency,
          style: bundle.event.style,
          dietary_needs: bundle.event.dietary_needs,
          accessibility_needs: bundle.event.accessibility_needs,
          special_requests: bundle.event.special_requests,
          status: bundle.event.status,
          is_demo: bundle.event.is_demo,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (eventError || !eventRow) {
      throw new Error(`Failed to upsert event ${bundle.event.title}: ${eventError?.message}`);
    }

    const eventId = eventRow.id;
    seededIds.push(eventId);

    // 2. Insert Budget Items
    const budgetInserts = bundle.budgetItems.map((b) => ({
      event_id: eventId,
      category: b.category,
      planned_amount: b.planned_amount,
      actual_amount: b.actual_amount,
      notes: b.notes,
    }));

    // Clean existing items for this event
    await supabase.from('budget_items').delete().eq('event_id', eventId);
    const { error: budgetError } = await supabase.from('budget_items').insert(budgetInserts);
    if (budgetError) {
      console.error(`Budget seed error for ${eventId}:`, budgetError.message);
    }

    // 3. Insert Timeline Tasks
    const taskInserts = bundle.timelineTasks.map((t) => ({
      event_id: eventId,
      title: t.title,
      description: t.description,
      owner: t.owner,
      due_date: t.due_date,
      status: t.status,
      priority: t.priority,
      is_ai_generated: t.is_ai_generated,
    }));

    await supabase.from('timeline_tasks').delete().eq('event_id', eventId);
    const { error: taskError } = await supabase.from('timeline_tasks').insert(taskInserts);
    if (taskError) {
      console.error(`Timeline task seed error for ${eventId}:`, taskError.message);
    }

    // 4. Insert Vendors
    const vendorInserts = bundle.vendors.map((v) => ({
      event_id: eventId,
      vendor_type: v.vendor_type,
      name: v.name,
      contact: v.contact,
      quote_amount: v.quote_amount,
      status: v.status,
      booking_deadline: v.booking_deadline,
      questions: v.questions,
      notes: v.notes,
    }));

    await supabase.from('vendors').delete().eq('event_id', eventId);
    const { error: vendorError } = await supabase.from('vendors').insert(vendorInserts);
    if (vendorError) {
      console.error(`Vendor seed error for ${eventId}:`, vendorError.message);
    }

    // 5. Insert Ideas
    const ideaInserts = bundle.ideas.map((i) => ({
      event_id: eventId,
      kind: i.kind,
      content: i.content,
    }));

    await supabase.from('ideas').delete().eq('event_id', eventId);
    const { error: ideaError } = await supabase.from('ideas').insert(ideaInserts);
    if (ideaError) {
      console.error(`Idea seed error for ${eventId}:`, ideaError.message);
    }
  }

  console.log(`Successfully seeded ${seededIds.length} demo events!`);
  return seededIds;
}

// Allow direct CLI invocation: tsx src/lib/supabase/seed-runner.ts
if (require.main === module) {
  seedDatabase()
    .then((ids) => {
      console.log('Seeded event IDs:', ids);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed execution failed:', err);
      process.exit(1);
    });
}
