import { supabase } from '$lib/supabase/supabaseClient';

export async function getProjects() {
    const { data, error } = await supabase.from('projects').select('*');

    if (error) {
        console.error('Error fetching assignable homes:', error);
        return [];
    }

    return data;
}

export async function getProjectsByRegion(region: number) {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('region', region);

    if (error) {
        console.error('Error fetching assignable homes:', error);
        return [];
    }

    return data;
}
