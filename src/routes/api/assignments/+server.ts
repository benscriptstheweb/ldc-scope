import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';
import { isOverlapping } from '$lib/helpers/overlappingVolunteers.js';

export async function GET() {
	const { data: assignments, error } = await supabase
		.from('assignments')
		.select('id, home_id, volunteer_id, date_range');

	if (error) {
		return json({ message: 'Error fetching assignments' }, { status: 500 });
	}

	return json(assignments);
}

export async function POST({ locals, request }) {
	if (!locals.user?.isAdmin) {
		return new Response('Forbidden', { status: 403 });
	}

	const body = await request.json();

	const hasOverlap = await isOverlapping(body.home, body.dateRange);

	if (hasOverlap) {
		return json({ message: 'Home is already booked' }, { status: 409 });
	}

	const { error } = await supabase
		.from('assignments')
		.insert([
			{ home_id: body.home.id, volunteer_id: body.volunteer.id, date_range: body.dateRange }
		]);

	if (error) {
		return json({ message: 'Failed to assign' }, { status: 500 });
	}

	return json({ success: true }, { status: 201 });
}

export async function DELETE({ request }) {
	const assignmentId = await request.json();

	const { error } = await supabase.from('assignments').delete().eq('id', [assignmentId]);

	if (error) {
		console.error('Error deleting assignment:', error);
		throw error;
	}

	return json({ status: 'deleted' });
}
