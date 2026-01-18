import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';
import type { Volunteer } from '$lib/supabase/types/volunteer.js';

export async function GET({ locals }) {
    const { data, error } = await supabase
        .from('volunteers')
        .select(`
            *,
            project!inner ( * ),
            assignments ( home_id ( * ))
        `)
        .eq('project.region', locals.user?.assignedRegion)
        .overrideTypes<Volunteer[]>();

    if (error) {
        console.error('Error fetching volunteers with assignments:', error);
    }

    const volunteers = data?.map((v) => {
        // supabase always returns array, mitigate by getting just the [0] index
        // return 1 or 0 for isAssigned to sort them later in the frontend
        return {
            ...v,
            assignedHome: v.assignments.length > 0 ? v.assignments[0].home_id ?? null : null,
            isAssigned: v.assignments.length > 0 ? 1 : 0,
            assignedProject: v.project
        }
    });

    return json(volunteers);
}

export async function POST({ request }) {
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
