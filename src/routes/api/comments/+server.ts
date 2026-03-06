import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

export async function POST({ request, url }) {
    const body = await request.json();
    const homeId = url.searchParams.get('homeId');

    if (!body) {
        return json({ error: 'No comments' }, { status: 400 });
    }

    const { error } = await supabase
        .from('comments')
        .insert({ home_id: homeId, comment: body.text, user: body.user, created_at: new Date().toISOString() });

    if (error) {
        return json({ error: 'Failed to add comment' }, { status: 500 });
    }

    return json({ message: 'Successfully added comment' }, { status: 200 });
}

export async function DELETE({ url }) {
    const commentId = url.searchParams.get('commentId');

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

    if (error) {
        return json({ error: 'Failed to delete comment' }, { status: 500 });
    }

    return json({ message: 'Successfully deleted comment' }, { status: 200 });
}