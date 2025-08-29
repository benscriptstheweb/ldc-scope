import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

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
