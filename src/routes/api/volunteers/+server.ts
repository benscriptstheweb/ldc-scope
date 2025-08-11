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
            homes (
                city
            )
            )
        `);

    if (error) {
        console.error('Error fetching volunteers with assignments:', error);
    }

    const volunteers = data?.map((volunteer) => {
        return {
            ...volunteer,
            // TODO: fix this.
            assignedCity: volunteer.assignments.flatMap((assignment) => assignment.homes.city)
        }
    });

    console.log(volunteers);
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
