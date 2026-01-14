import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabase/supabaseClient";

export async function PATCH({ locals, params, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const { homeId } = params;
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
            has_pets: body.hasPets
        })
        .eq('id', homeId);

    if (error) {
        console.error(error);
        return json({ error: 'Failed to update home' }, { status: 500 });
    }

    return json({ success: true }, { status: 200 });
}

export async function GET({ params }) {
    const { homeId } = params;
    const { data: home, error } = await supabase
        .from('homes')
        .select(`
            *,
            project ( id, friendly_name ),
            contacts ( id, name, phone, email, isPrimary ),
            assignments (
                volunteers (
                    id,
                    name,
                    date_start,
                    date_end
                )
            )
        `)
        .eq('id', homeId)
        .single();

    if (error) {
        console.error('Error fetching home details:', error);
        return json({ error: error.message }, { status: 500 });
    }

    const result = {
        id: home.id,
        address1: home.address1,
        address2: home.address2,
        city: home.city,
        state: home.state,
        zip: home.zip,
        amenities: home.amenities,
        contacts: home.contacts,
        assignments: home.assignments.map(a => a.volunteers),
        congregation: home.congregation,
        project: home.project,
        maxDays: home.max_days_stay,
        occupantType: home.occupant_type,
        allergies: home.allergies,
        distanceToProject: home.distance_to_project,
        hasPets: home.has_pets,
        parkingType: home.parking_type,
        dateAvailable: home.date_available
    };

    return json(result);
}