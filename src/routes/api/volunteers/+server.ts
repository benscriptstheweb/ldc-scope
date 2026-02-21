import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';
import type { Volunteer } from '$lib/supabase/types/volunteer.js';

export async function GET({ locals, url }) {
	const volunteerId = url.searchParams.get('id');

	if (volunteerId) {
		const { data, error } = await supabase
			.from('volunteers')
			.select(
				`
                *,
                project!inner ( * ),
                assignments ( id, home_id ( * ), date_range)
            `
			)
			.eq('project.region', locals.user?.assignedRegion)
			.eq('id', volunteerId)
			.single();

		if (error) {
			console.error('Error fetching individual volunteer:', error);
		}

		// TODO: save all assignments (bookings) as an array and output to frontend
		// console.log(data.assignments);

		const individualVolunteer = {
			...data,
			assignedHome: data.assignments.length > 0 ? (data.assignments[0].home_id ?? null) : null,
			daysAssigned:
				(new Date(data.date_end).getTime() - new Date(data.date_start).getTime()) /
				(1000 * 60 * 60 * 24)
		};

		return json(individualVolunteer);
	}

	const { data, error } = await supabase
		.from('volunteers')
		.select(
			`
            *,
            project!inner ( * ),
            assignments ( home_id ( * ))
        `
		)
		.eq('project.region', locals.user?.assignedRegion)
		.overrideTypes<Volunteer[]>();

	if (error) {
		console.error('Error fetching volunteers with assignments:', error);
	}

	const volunteers = data?.map((v) => {
		// supabase always returns array, mitigate by getting just the [0] index
		// return 1 or 0 for isAssigned to sort them later in the frontend
		return {
			...v,
			assignedHome: v.assignments.length > 0 ? (v.assignments[0].home_id ?? null) : null,
			isAssigned: v.assignments.length > 0 ? 1 : 0,
			assignedProject: v.project,
			daysAssigned:
				(new Date(v.date_end).getTime() - new Date(v.date_start).getTime()) / (1000 * 60 * 60 * 24)
		};
	});

	return json(volunteers);
}

export async function POST({ request }) {
	const body = await request.json();

	if (!body.project || !body.name || !body.phone) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const { error } = await supabase.from('volunteers').insert([body]);

	if (error) {
		console.error('Failed to add volunteer:', error);
		return json({ error: 'Failed to add volunteer' }, { status: 500 });
	}

	return json({ success: true }, { status: 201 });
}

export async function DELETE({ request, url }) {
	// single delete from detail page
	const volunteerId = url.searchParams.get('id');

	if (volunteerId) {
		const { error } = await supabase.from('volunteers').delete().eq('id', [volunteerId]);

		if (error) {
			console.error('Error deleting volunteer:', error);
			throw error;
		}

		return json({ status: 'deleted individual' });
	}

	// batch delete
	const body = await request.json();

	const { error } = await supabase.from('volunteers').delete().in('id', body);

	if (error) {
		console.error('Error deleting multiple volunteers:', error);
		throw error;
	}

	return json({ status: 'deleted multiple' });
}

export async function PATCH({ locals, url, request }) {
	if (!locals.user?.isAdmin) {
		return new Response('Forbidden', { status: 403 });
	}

	const volunteerId = url.searchParams.get('id');
	const body = await request.json();

	if (!body.name || !body.phone || !body.project || !body.date_start || !body.date_end) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const { error } = await supabase
		.from('volunteers')
		.update({
			name: body.name,
			phone: body.phone,
			email: body.email,
			project: body.project,
			date_start: body.date_start,
			date_end: body.date_end
		})
		.eq('id', volunteerId)
		.single();

	if (error) {
		console.error(error);
		return json({ error: 'Failed to update volunteer' }, { status: 500 });
	}

	return json({ success: true }, { status: 200 });
}
