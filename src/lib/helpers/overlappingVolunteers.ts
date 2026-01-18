import { supabase } from "$lib/supabase/supabaseClient";
import { type Assignment } from "$lib/supabase/types/assignment";

export async function isOverlapping(volunteerId: string, homeId: string) {
    // 1. get volunteers
    const { data } = await supabase
        .from('volunteers')
        .select('date_start, date_end')
        .eq('id', volunteerId)
        .single();

    // 2. get assignments
    const { data: preAssignedVolunteers } = await supabase
        .from('assignments')
        .select(`volunteer_id ( date_start, date_end )`)
        .eq('home_id', homeId)
        .overrideTypes<Assignment[]>();

    // 3. get all start and end dates of the volunteers
    const arrStartDates = preAssignedVolunteers?.map(assignment => new Date(assignment.volunteer_id.date_start).getTime());
    const arrEndDates = preAssignedVolunteers?.map(assignment => new Date(assignment.volunteer_id.date_end).getTime());

    // 4. if any start date before another volunteer's end date and...
    // 5. ...if any end date is after another volunteer's start date...
    // ...then it is overlapping.
    if (data && arrStartDates?.some(s => s <= new Date(data.date_end).getTime())
        && arrEndDates?.some(e => e >= new Date(data.date_start).getTime())) {
        return true;
    }

    return false;
}