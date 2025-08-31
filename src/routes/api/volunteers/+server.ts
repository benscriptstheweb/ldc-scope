import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

type DBAssignment = {
    home_id: {
        address1: string;
        address2: string | null;
        city: string;
        state: string;
        zip: string;
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
    type: string;
};

export async function GET({ locals }) {
    const { data, error } = await supabase
        .from('volunteers')
        .select(`
            id,
            name,
            email,
            phone,
            date_start,
            date_end,
            project!inner ( id, friendly_name, full_address ),
            assignments (
                home_id ( address1, address2, city, state, zip )
            ),
            type
        `)
        .eq('project.region', locals.user?.assignedRegion)
        .overrideTypes<DBVolunteer[]>();

    if (error) {
        console.error('Error fetching volunteers with assignments:', error);
    }

    const volunteers = data?.map((v) => {
        // supabase always returns array, mitigate by getting just the [0] index
        const singleHomeAssignment = v.assignments[0];

        return {
            ...v,
            assignedHome: v.assignments.length > 0 ? singleHomeAssignment.home_id ?? null : null,
            isAssigned: v.assignments.length > 0 ? 1 : 0,
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
        project: body.volunteerProject,
        date_start: body.volunteerStartDate,
        date_end: body.volunteerEndDate
    }


    const { error } = await supabase.from('volunteers').insert([supabaseBody]);

    if (error) {
        console.error('Failed to add volunteer:', error);
        return json({ error: 'Failed to add volunteer' }, { status: 500 });
    }

    return json({ success: true }, { status: 201 });
}

export async function DELETE({ request }) {
    const body = await request.json();

    const { error } = await supabase
        .from('volunteers')
        .delete()
        .in('id', body);

    if (error) {
        console.error('Error deleting multiple volunteers:', error);
        throw error;
    }

    return json({ status: 'deleted' });
}
