import { supabase } from '$lib/supabase/supabaseClient';
import { type Assignment } from '$lib/supabase/types/assignment';

export async function isOverlapping(home: any, dateRange: any) {
	const { data: assignmentData } = await supabase
		.from('assignments')
		.select(`*`)
		.eq('home_id', home.id)
		.overrideTypes<Assignment[]>();

    const hasOverlappingAssignments = assignmentData?.some((assignment) => 
		new Date(assignment.date_range[0]).getTime() <= new Date(dateRange[1]).getTime() &&
		new Date(assignment.date_range[1]).getTime() >= new Date(dateRange[0]).getTime());

    if (hasOverlappingAssignments) {
        return true;
    }

	// check for blackout dates
	const { data: homeData } = await supabase
		.from('homes')
		.select(`*`)
		.eq('id', home.id)
		.single();

	if (homeData.blackout_dates !== null) {
		const hasBlackoutOnDateRange =
			new Date(homeData.blackout_dates[0]).getTime() <= new Date(dateRange[1]).getTime() &&
			new Date(homeData.blackout_dates[1]).getTime() >= new Date(dateRange[0]).getTime());
	
	    if (hasBlackoutOnDateRange) {
	        return true;
	    }
	}

    return false;
}
