import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const volunteersResponse = await fetch(`/api/volunteers?id=${params.id}`);
    const volunteerById = await volunteersResponse.json();

    let volunteer = {
        id: volunteerById.id,
        ...volunteerById,
    }

    if (volunteer.agent) {
        const agentResponse = await fetch(`/api/users?email=${volunteer.agent}`);
        const assignedAgent = await agentResponse.json();
        return { ...volunteer, assignedAgent }
    }

    return { ...volunteer };
}
