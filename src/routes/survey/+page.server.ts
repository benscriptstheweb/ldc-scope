import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase/supabaseClient';

export const load: PageServerLoad = async ({ url }) => {
    const token = url.searchParams.get('token');

    if (!token) {
        throw redirect(303, '/survey/invalid');
    }

    const { data: invite, error } = await supabase
        .from('invites')
        .select('*')
        .eq('token', token)
        .single();

    if (error || !invite) {
        throw redirect(303, '/survey/invalid');
    }

    if (invite.used) {
        throw redirect(303, '/survey/used');
    }

    return {
        token, // pass to form for submission
        formData: { example: 'Server-preloaded data' }
    };
};