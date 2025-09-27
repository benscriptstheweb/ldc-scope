import { supabase } from "$lib/supabase/supabaseClient";
import { json } from "@sveltejs/kit";

type Volunteer = {
    volunteer_id: {
        date_start: string;
        date_end: string;
    }
}

export async function isOverlapping(volunteerId: string, homeId: string) {
    const { data } = await supabase
        .from('volunteers')
        .select('date_start, date_end')
        .eq('id', volunteerId)
        .single();

    const { data: preAssignedVolunteers } = await supabase
        .from('assignments')
        .select(`volunteer_id ( date_start, date_end )`)
        .eq('home_id', homeId)
        .overrideTypes<Volunteer[]>();

    const arrStartDates = preAssignedVolunteers?.map(e => new Date(e.volunteer_id.date_start).getTime())
    const arrEndDates = preAssignedVolunteers?.map(e => new Date(e.volunteer_id.date_end).getTime())

    if (data && arrStartDates?.some(s => s <= new Date(data.date_end).getTime())
        && arrEndDates?.some(e => e >= new Date(data.date_start).getTime())) {
        return true;
    }

    return false;
}