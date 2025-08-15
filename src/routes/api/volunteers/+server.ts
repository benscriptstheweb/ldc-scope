import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

type DBAssignment = {
    home_id: {
        address1: string;
    } | null;
    project: number;
};

type DBVolunteer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    date_start: string | null;
    date_end: string | null;
    assignments: DBAssignment[];
};

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
            assignments (
                home_id ( address1 ),
                project
            )
        `)
        .overrideTypes<DBVolunteer[]>();

    if (error) {
        console.error('Error fetching volunteers with assignments:', error);
    }

    const volunteers = data?.map((v) => {
        // supabase always returns array, mitigate by getting just the [0] index
        const singleAssignment = v.assignments[0];

        return {
            ...v,
            assignedHome: singleAssignment.home_id?.address1 ?? null,
            assignedProject: singleAssignment.project ?? null
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
