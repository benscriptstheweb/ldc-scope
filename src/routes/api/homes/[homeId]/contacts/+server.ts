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
        email: body.email
    }]);

    if (error) {
        console.error('Failed to add contact:', error);
        return json({ error: 'Failed to add contact' }, { status: 500 });
    }

    return json({ success: true }, { status: 201 });
}

export async function DELETE({ locals, url }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
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
