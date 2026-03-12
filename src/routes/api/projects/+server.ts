import { supabase } from '$lib/supabase/supabaseClient';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const regionNumber = url.searchParams.get('regionNumber');

    if (regionNumber) {
        const { data: projectsByRegion, error } = await supabase
            .from('projects')
            .select('*')
            .eq('region', regionNumber);

        if (error) {
            return json({ error: 'Error retrieving single home' }, { status: 400 });
        }

        return json(projectsByRegion);
    }

    const { data: projects, error } = await supabase
        .from('projects')
        .select('*');

    if (error) {
        return json({ error: 'Error retrieving single home' }, { status: 400 });
    }

    return json(projects);
}