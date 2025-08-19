import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabase/supabaseClient";

// export async function PATCH({ locals, params, request }) {
//     if (!locals.user?.isAdmin) {
//         return new Response('Forbidden', { status: 403 });
//     }

//     const { volunteerId } = params;
//     const body = await request.json();

//     if (!body.address1 || !body.city || !body.state || !body.zip) {
//         return json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const { error } = await supabase
//         .from('homes')
//         .update({
//             address1: body.address1,
//             address2: body.address2,
//             city: body.city,
//             state: body.state,
//             zip: body.zip
//         })
//         .eq('id', volunteerId);

//     if (error) {
//         console.error(error);
//         return json({ error: 'Failed to update home' }, { status: 500 });
//     }

//     return json({ success: true }, { status: 200 });
// }

export async function GET({ params }) {
    const { volunteerId } = params;
    const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('id', volunteerId)
        .single();

    if (error) {
        console.error('Error fetching volunteer details:', error);
        return json({ error: error.message }, { status: 500 });
    }

    const result = {
        ...data
    };

    console.log(result);

    return json(result);
}