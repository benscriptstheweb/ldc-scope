import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

type Volunteer = {
    volunteer_id: {
        date_start: string;
        date_end: string;
    }
}

export async function GET() {
    const { data: assignments, error } = await supabase
        .from('assignments')
        .select('id, home_id, volunteer_id');

    if (error) {
        console.error('Error fetching assignments:', error);
        return json({ error: error.message }, { status: 500 });
    }

    return json(assignments);
}

export async function POST({ locals, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const body = await request.json();

    // STEP 1: get the dates of the volunteer
    const { data, error: noVolunteer } = await supabase
        .from('volunteers')
        .select('date_start, date_end')
        .eq('id', body.volunteerId)
        .single();

    if (noVolunteer) {
        return json({ error: noVolunteer.message }, { status: 500 });
    };

    const { date_start, date_end } = data;

    const { data: preAssignedVolunteers } = await supabase
        .from('assignments')
        .select(`volunteer_id ( date_start, date_end )`)
        .eq('home_id', body.homeId)
        .overrideTypes<Volunteer[]>();

    const arrStartDates = preAssignedVolunteers?.map(e => new Date(e.volunteer_id.date_start).getTime())
    const arrEndDates = preAssignedVolunteers?.map(e => new Date(e.volunteer_id.date_end).getTime())

    if (arrStartDates?.some(s => s <= new Date(date_end).getTime())
        && arrEndDates?.some(e => e >= new Date(date_start).getTime())) {
        return json({ error: 'Overlapping dates' }, { status: 500 });
    }

    const { error } = await supabase
        .from('assignments')
        .insert([{ home_id: body.homeId, volunteer_id: body.volunteerId }]);

    if (error) {
        console.error('Failed to add assignment:', error);
        return json({ error: 'Failed to assign' }, { status: 500 });
    }

    return json({ success: true }, { status: 201 });
}

export async function DELETE({ request }) {
    const assignmentId = await request.json();

    const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', [assignmentId]);

    if (error) {
        console.error('Error deleting assignment:', error);
        throw error;
    }

    return json({ status: 'deleted' });
}
