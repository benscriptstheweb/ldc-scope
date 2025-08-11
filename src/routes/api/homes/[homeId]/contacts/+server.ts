import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

export async function POST({ locals, params, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const { homeId } = params;
    const body = await request.json();

    if (!body.name || !body.phone || !body.email) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.from('contacts').insert([{
        home_id: homeId,
        name: body.name,
        phone: body.phone,
        email: body.email,
        isPrimary: body.isPrimary ?? false,
    }]);

    if (error) {
        console.error('Failed to add contact:', error);
        return json({ error: 'Failed to add contact' }, { status: 500 });
    }

    return json({ success: true }, { status: 201 });
}
