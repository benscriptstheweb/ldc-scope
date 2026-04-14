import { json } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { supabase } from '$lib/supabase/supabaseClient.js';

export const POST = async () => {
    const token = randomBytes(24).toString('hex');

    const { error } = await supabase.from('invites').insert({
        token,
        used: false
    });

    if (error) {
        return json({ error: 'Failed to create invite' }, { status: 500 });
    }

    return json({ token });
};
