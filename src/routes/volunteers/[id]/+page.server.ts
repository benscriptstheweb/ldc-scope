import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const volunteersResponse = await fetch(`/api/volunteers?id=${params.id}`);
    const volunteerById = await volunteersResponse.json();

    let volunteer = {
        id: volunteerById.id,
        ...volunteerById,
    }

    // this gets the display name of the users from fb, since the db only has email of the agent
    const res = await fetch(`/api/users?email=${encodeURIComponent(volunteer.agent)}`);
    const assignedUserAgent = await res.json();

    return { ...volunteer, assignedUserAgent };
}
