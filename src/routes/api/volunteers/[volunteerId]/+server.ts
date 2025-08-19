import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabase/supabaseClient";

export async function PATCH({ locals, params, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const { volunteerId } = params;
    const body = await request.json();

    console.log(body)

    if (!body.name || !body.phone || !body.project || !body.date_start || !body.date_end) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase
        .from('volunteers')
        .update({
            name: body.name,
            phone: body.phone,
            email: body.email,
            project: body.project.id,
            date_start: body.date_start,
            date_end: body.date_end
        })
        .eq('id', volunteerId)
        .single();

    if (error) {
        console.error(error);
        return json({ error: 'Failed to update volunteer' }, { status: 500 });
    }

    return json({ success: true }, { status: 200 });
}

export async function GET({ params }) {
    const { volunteerId } = params;
    const { data, error } = await supabase
        .from('volunteers')
        .select(`
            *,
            assignments (
                home_id (
                    address1,
                    address2,
                    city,
                    state,
                    zip
                )
            ),
            project ( id, friendly_name )
        `)
        .eq('id', volunteerId)
        .single();

    if (error) {
        console.error('Error fetching volunteer details:', error);
        return json({ error: error.message }, { status: 500 });
    }

    const result = {
        ...data,
        assignedHome: data.assignments.length > 0 ? data.assignments[0].home_id ?? null : null,
    };

    return json(result);
}