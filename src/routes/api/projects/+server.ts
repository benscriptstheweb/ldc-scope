import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

export async function GET() {
    const { data, error } = await supabase
        .from('projects')
        .select(`
            id,
            friendly_name,
            full_address
        `);

    if (error) {
        console.error('Error fetching homes:', error);
        return json({ error: error.message }, { status: 500 });
    }

    // Filter only primary contacts for each home
    const projects = data.map(project => {
        return {
            ...project
        };
    });

    return json(projects);
}
