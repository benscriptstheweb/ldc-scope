import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

export async function PATCH({ locals, request, url }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const homeId = url.searchParams.get('homeId');
    const body = await request.json();

    const { error } = await supabase
        .from('homes')
        .update({ hosts: body })
        .eq('id', homeId);

    if (error) {
        console.error('Failed to update contact:', error);
        return json({ message: 'Failed to update contact' }, { status: 500 });
    }

    return json({ message: 'Successfully edited contact' }, { status: 200 });
}
