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
            zip: body.zip
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
      id,
      address1,
      address2,
      city,
      state,
      zip,
      amenities,
      contacts (
        id,
        name
      ),
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
        assignments: home.assignments.map(a => a.volunteers)
    };

    return json(result);
}