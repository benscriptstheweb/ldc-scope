import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

export async function GET({ url }) {
    const agentEmail = url.searchParams.get('email');

    if (agentEmail) {
        const { data: agentData, error } = await supabase
            .from('agents')
            .select(`*`)
            .eq('email', agentEmail)

        if (error) {
            console.error('Error fetching agent:', error);
        }

        return json(agentData);
    }

    const { data, error } = await supabase
        .from('agents')
        .select(`*`);

    if (error) {
        console.error('Error fetching volunteers with assignments:', error);
    }

    const agents = data?.map((v) => {
        return {
            full_name: v.full_name,
            email: v.email
        };
    });

    return json(agents);
}

export async function POST({ request }) {
    const body = await request.json();

    if (!body.full_name || !body.email) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.from('agents').insert([body]);

    if (error) {
        console.error('Failed to add agent:', error);
        return json({ error: 'Failed to add agent' }, { status: 500 });
    }

    return json({ success: true }, { status: 201 });
}