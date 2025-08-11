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

    try {
        const { error: insertError } = await supabase
            .from('assignments')
            .insert([{ home_id: body.homeId, volunteer_id: body.volunteerId }]);

        if (insertError) {
            console.error('Failed to add assignment:', insertError);
            return json({ error: 'Failed to assign' }, { status: 500 });
        }

        const { error: updateError } = await supabase
            .from('homes')
            .update({ isAssigned: true })
            .eq('id', body.homeId);

        if (updateError) {
            console.error('Failed to update home:', updateError);
            return json({ error: 'Failed to update home assignment status' }, { status: 500 });
        }

        return json({ success: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return json({ error: 'Failed to assign' }, { status: 500 });
    }
}
