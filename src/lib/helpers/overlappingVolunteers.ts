import { supabase } from '$lib/supabase/supabaseClient';
import { type Assignment } from '$lib/supabase/types/assignment';

export async function isOverlapping(home: any, dateRange: any) {
	const { data } = await supabase
		.from('assignments')
		.select(`*`)
		.eq('home_id', home.id)
		.overlaps('date_range', dateRange)
		.overrideTypes<Assignment[]>();

	if (data && data.length > 0) {
		return true;
	}

	// has blackout dates
	const { data: homesData } = await supabase
		.from('homes')
		.select(`*`)
		.eq('id', home.id)
		.overlaps('blackout_dates', dateRange)

	if (homesData && homesData.length > 0) {
		return true;
	}

	return false;
}
