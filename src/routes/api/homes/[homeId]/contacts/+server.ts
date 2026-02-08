import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

export async function DELETE({ locals, url }) {
    if (!locals.user?.isAdmin) {
        return json({ message: 'Forbidden' }, { status: 403 });
    }

    const contactId = url.searchParams.get('contact');
    const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId)

    if (error) {
        console.error('Failed to delete contact:', error);
        return json({ error: 'Failed to delete contact' }, { status: 500 });
    }

    return json({ status: 'deleted' });
}

export async function PATCH({ locals, request, url }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const contactId = url.searchParams.get('contact');
    const body = await request.json();

    const { error } = await supabase
        .from('contacts')
        .update(body)
        .eq('id', contactId);

    if (error) {
        console.error('Failed to update contact:', error);
        return json({ error: 'Failed to update contact' }, { status: 500 });
    }

    return json({ status: 'updated' });
}
