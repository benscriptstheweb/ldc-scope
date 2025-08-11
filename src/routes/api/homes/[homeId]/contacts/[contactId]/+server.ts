import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

export async function DELETE({ locals, params }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const { homeId, contactId } = params;

    const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId)
        .eq('home_id', homeId);

    if (error) {
        console.error('Failed to delete contact:', error);
        return json({ error: 'Failed to delete contact' }, { status: 500 });
    }

    return json({ status: 'deleted' });
}

export async function PATCH({ locals, params, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const { homeId, contactId } = params;
    const body = await request.json();

    const { error } = await supabase
        .from('contacts')
        .update(body)
        .eq('id', contactId)
        .eq('home_id', homeId);

    if (error) {
        console.error('Failed to update contact:', error);
        return json({ error: 'Failed to update contact' }, { status: 500 });
    }

    return json({ status: 'updated' });
}
