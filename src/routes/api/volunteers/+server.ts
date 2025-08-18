import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

type DBAssignment = {
    home_id: {
        address1: string;
    } | null;
};

type DBVolunteer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    date_start: string | null;
    date_end: string | null;
    project: {
        id: number;
        friendly_name: string;
    }
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
            project ( friendly_name ),
            assignments (
                home_id ( address1 )
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
            assignedHome: v.assignments.length > 0 ? singleAssignment.home_id?.address1 ?? null : null,
            assignedProject: v.project
        }
    });
    return json(volunteers);
}

export async function POST({ locals, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const body = await request.json();

    if (!body.volunteerProject || !body.volunteerName || !body.volunteerPhone) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    let supabaseBody = {
        name: body.volunteerName,
        email: body.volunteerEmail ?? null,
        phone: body.volunteerPhone,
        project: body.volunteerProject
    }


    const { error } = await supabase.from('volunteers').insert([supabaseBody]);

    if (error) {
        console.error('Failed to add volunteer:', error);
        return json({ error: 'Failed to add volunteer' }, { status: 500 });
    }

    return json({ success: true }, { status: 201 });
}
