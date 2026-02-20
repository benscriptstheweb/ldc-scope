import { supabase } from "$lib/supabase/supabaseClient";
import { type Assignment } from "$lib/supabase/types/assignment";

export async function isOverlapping(volunteer: any, home: any) {
    const { data } = await supabase
        .from('assignments')
        .select(`*`)
        .eq('home_id', home.id)
        .overlaps('date_range', [volunteer.date_start, volunteer.date_end])
        .overrideTypes<Assignment[]>();

    if (data && data.length > 0) {
        return true;
    }

    return false;
}
