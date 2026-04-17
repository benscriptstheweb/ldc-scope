import { supabase } from '$lib/supabase/supabaseClient';
import { type Assignment } from '$lib/supabase/types/assignment';

export async function isOverlapping(home: any, dateRange: any) {
	const { data: assignmentData } = await supabase
		.from('assignments')
		.select(`*`)
		.eq('home_id', home.id)
		.overrideTypes<Assignment[]>();

	// if (data && data.length > 0) {
	// 	return true;
	// }

	// has blackout dates
	const { data: homesData } = await supabase
		.from('homes')
		.select(`*`)
		.eq('id', home.id)

    const hasOverlappingAssignments = assignmentData?.some((assignment) => 
		new Date(assignment.date_start).getTime() <= new Date(dateRange[1]).getTime() &&
		new Date(assignment.end_date).getTime() >= new Date(dateRange[0]).getTime())

	console.log(assignmentData);

    if (hasOverlappingAssignments) {
        return true;
    }

    return false;
}
