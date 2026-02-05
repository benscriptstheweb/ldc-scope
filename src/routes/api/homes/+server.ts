import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';
import { type Home } from '$lib/supabase/types/home.js';
import type { Assignment } from '$lib/supabase/types/assignment.js';

export async function GET({ locals, url }) {
    const homeId = url.searchParams.get('id');

    if (homeId) {
        const { data, error } = await supabase
            .from('homes')
            .select(`
            *,
            contacts ( * ),
            project!inner ( * ),
            assignments ( volunteer_id ( * ))
        `)
            .eq('project.region', locals.user?.assignedRegion)
            .eq('id', homeId)
            .single();

        if (error) {
            return json({ error: 'Error retrieving single home' }, { status: 400 });
        };

        const singleHome = {
            ...data,
            id: data.id,
            assignments: data.assignments.map((a: Assignment) => a.volunteer_id),
            distanceToProject: data.distance_to_project,
            hasPets: data.has_pets,
            parkingType: data.parking_type
        };

        return json(singleHome);
    }

    const { data, error } = await supabase
        .from('homes')
        .select(`
            *,
            contacts ( * ),
            project!inner ( * ),
            assignments (
                volunteers ( * )
            )
        `)
        .eq('project.region', locals.user?.assignedRegion)
        .overrideTypes<Home[]>();

    if (error) {
        console.error('Error fetching homes:', error);
        return json({ error: error.message }, { status: 500 });
    }

    const homes = data.map(home => {
        let sortedAssignments = home.assignments.length
            ? home.assignments.sort((a: any, b: any) => {
                const dateA = new Date(a.date_end);
                const dateB = new Date(b.date_end);
                return dateB.getTime() - dateA.getTime();
            })
            : []

        const today = new Date();

        let hasAssignmentNow = sortedAssignments[0]
            ? today >= new Date(sortedAssignments[0].volunteers.date_start) && today <= new Date(sortedAssignments[0].volunteers.date_end)
            : false

        // what gets returned to frontend
        return {
            ...home,
            hasAssignmentNow,
            project: home.project.friendly_name,
            distanceToProject: home.distance_to_project,
            hasPets: home.has_pets,
        };
    });

    return json(homes);
}

export async function DELETE({ request }) {
    const homeId = await request.json();
    const { error } = await supabase
        .from('homes')
        .delete()
        .eq('id', homeId);

    if (error) {
        console.error('Error deleting home: ', error);
        throw error;
    }

    return json({ status: 'deleted' });
}

export async function POST({ request }) {
    const body = await request.json();

    if (!body) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('homes')
        .insert([body.home])
        .select('id')
        .single();

    if (error) {
        return json({ error: 'Failed to add home' }, { status: 500 });
    }

    const { error: contactsError } = await supabase.from('contacts').insert([{
        home_id: data.id,
        name: body.contact.name,
        phone: body.contact.phone,
        email: body.contact.email,
        isPrimary: true
    }]);

    if (contactsError) {
        return json({ error: 'Failed to add contact to new home' }, { status: 500 });
    }

    return json({ success: true, createdHomeId: data.id }, { status: 201 });
}

export async function PATCH({ locals, url, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const id = url.searchParams.get('id');
    const body = await request.json();

    if (!body.address1 || !body.city || !body.state || !body.zip) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase
        .from('homes')
        .update({
            address1: body.address1,
            address2: body.address2,
            city: body.city,
            state: body.state,
            zip: body.zip,
            distance_to_project: body.distanceToProject,
            amenities: body.amenities,
            occupant_type: body.occupantType,
            has_pets: body.hasPets,
            max_days_stay: body.maxDaysStay,
            date_available: body.dateAvailable
        })
        .eq('id', id);

    if (error) {
        console.error(error);
        return json({ error: 'Failed to update home' }, { status: 500 });
    }

    return json({ success: true }, { status: 200 });
}