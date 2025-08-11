import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

export async function GET() {
    const { data, error } = await supabase
        .from('volunteers')
        .select(`
            id,
            name,
            email,
            phone,
            date_start,
            date_end,
            project,
            assignments (
            home:homes (
                city
            )
            )
        `);

    if (error) {
        console.error('Error fetching volunteers with assignments:', error);
    }

    const volunteers = data?.map((v) => {
        return {
            ...v,

            // ts will complain that a.home.city is not valid because it thinks that a.home is an array.
            // in the map below, check for 'city' in a.home then map a.home.city, removing the runtime
            // complaint.
            assignedCity: v.assignments.length > 0
                ? v.assignments
                    .map(a => ('city' in a.home ? a.home.city : null))
                : null
        }
    });

    return json(volunteers);
}

export async function POST({ locals, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const body = await request.json();

    if (!body.project || !body.name || !body.phone) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.from('volunteers').insert([body]);

    if (error) {
        console.error('Failed to add volunteer:', error);
        return json({ error: 'Failed to add volunteer' }, { status: 500 });
    }

    return json({ success: true }, { status: 201 });
}
